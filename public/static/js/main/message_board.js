// Setups the message board
Hue.setup_message_board = function()
{
    $("#message_board_post_icon").click(function()
    {
        Hue.create_message_board_post()
    })

    $("#message_board_post_button").click(function()
    {
        Hue.submit_message_board_post()
    })

    $("#message_board_post_textarea").on("input blur", function()
    {
        let val = $(this).val().substring(0, Hue.config.max_message_board_post_length)
        $(this).val(val)
    })
}

// Creates and adds an item to the message board
Hue.add_post_to_message_board = function(post)
{
    let item = $(`
    <div class='message_board_item modal_item'>
        <div class='message_board_text dynamic_title'></div>
    </div>`)

    let text = item.find(".message_board_text").eq(0)
    text.text(post.message).urlize()

    let title = Hue.utilz.nice_date(post.date)
    text.attr("title", title)
    text.data("date", post.date)
    text.data("otitle", title)

    let items = $("#message_board_container .message_board_item")
    let num_items = items.length

    if(num_items === 0)
    {
        $("#message_board_container").html(item)
    }

    else
    {
        $("#message_board_container").prepend(item)
    }

    if($("#message_board_container").find(".message_board_item").length > Hue.config.max_message_board_posts)
    {
        $("#message_board_container").find(".message_board_item").last().remove()
    }
}

// Fills the message board with init data
Hue.init_message_board = function(data)
{
    for(let post of data.message_board_posts)
    {
        Hue.add_post_to_message_board(post)
    }

    Hue.last_message_board_post_date = data.last_message_board_post_date
    Hue.check_message_board_delay()
    Hue.check_last_message_board_post()
}

// Opens a window to create a message board post
Hue.create_message_board_post = function()
{
    if(!Hue.message_board_posting_enabled)
    {
        let minutes = Math.round(Hue.config.message_board_post_delay / 60 / 1000)
        let mins = minutes === 1 ? "minute" : "minutes"

        Hue.msg_info.show(`You can post in the message board once every ${minutes} ${mins}`)
        return false
    }

    Hue.msg_message_board_post.show(function()
    {
        $("#message_board_post_textarea").focus()
    })
}

// Shows the message board
Hue.show_message_board = function()
{
    Hue.msg_message_board.show()
    Hue.check_last_message_board_post()
}

// Submits a message board post
Hue.submit_message_board_post = function()
{
    let message = Hue.utilz.clean_string2($("#message_board_post_textarea").val())

    if(!message || message.length > Hue.config.max_message_board_post_length)
    {
        return false
    }

    Hue.msg_message_board_post.close()

    Hue.socket_emit("message_board_post", {message:message})
}

// When a new message board message arrives
Hue.on_message_board_received = function(data)
{
    Hue.add_post_to_message_board(data)
    Hue.check_last_message_board_post()
}

// Updates last message board post date
Hue.last_message_board_post_date_update = function(data)
{
    Hue.last_message_board_post_date = data.date
    Hue.check_message_board_delay()
}

// Checks the message board last post date
// Changes the post icon accordingly
Hue.check_message_board_delay = function()
{
    let date_diff = Date.now() - Hue.last_message_board_post_date

    clearTimeout(Hue.message_board_post_delay_timeout)

    if(date_diff < Hue.config.message_board_post_delay)
    {
        $("#message_board_post_icon").css("opacity", 0.5)

        Hue.message_board_post_delay_timeout = setTimeout(function()
        {
            Hue.check_message_board_delay()
        }, date_diff + 1000)

        Hue.message_board_posting_enabled = false
    }
    
    else
    {
        $("#message_board_post_icon").css("opacity", 1)
        Hue.message_board_posting_enabled = true
    }
}

// Checks if there are new message board posts
Hue.check_last_message_board_post = function()
{
    let date = Hue.get_local_storage(Hue.ls_last_message_board_post_checked)

    if(!date)
    {
        date = Date.now()
        Hue.save_local_storage(Hue.ls_last_message_board_post_checked, date)
    }

    let item = $("#message_board_container").find(".message_board_item").first().find(".message_board_text").eq(0)

    if(item.data("date") > date)
    {
        if(!Hue.msg_message_board.is_open())
        {
            $("#activity_left_message_board_label").text("New Messages")
        }

        Hue.save_local_storage(Hue.ls_last_message_board_post_checked, item.data("date"))
    }
    
    else
    {
        $("#activity_left_message_board_label").text("")
    }
}