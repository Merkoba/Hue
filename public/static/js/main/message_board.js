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

    $("#message_board_container").on("click", ".message_board_delete", function()
    {
        if(Hue.role !== "admin")
        {
            return false
        }

        if(confirm('Are you sure?'))
        {
            let item = $(this).closest(".message_board_item")
            let id = item.data("id")

            if(id)
            {
                Hue.socket_emit("delete_message_board_post", {id:id})
            }
        }
    })

    $("#message_board_post_textarea").on("focus", function()
    {
        Hue.writing_message_board_post = true
    })

    $("#message_board_post_textarea").on("blur", function()
    {
        Hue.writing_message_board_post = false
    })

    let minutes = Math.round(Hue.config.message_board_post_delay / 60 / 1000)
    let mins = minutes === 1 ? "minute" : "minutes"
    let placeholder = `You can post once every ${minutes} ${mins}`

    $("#message_board_post_textarea").attr("placeholder", placeholder)

    Hue.get_last_message_board_post_checked()
}

// Creates and adds an item to the message board
Hue.add_post_to_message_board = function(post)
{
    let item = $(`
    <div class='message_board_item modal_item'>
        <div class='message_board_text dynamic_title'></div>
        <div><div class='message_board_delete action pointer inline'>Delete</div></div>
    </div>`)
    
    item.data("id", post.id)
    item.data("date", post.date)

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

// Shows the message board
Hue.show_message_board = function()
{
    Hue.msg_message_board.show(function()
    {
        Hue.update_last_message_post_checked()
        Hue.check_last_message_board_post()
        $("#message_board_post_textarea").focus()
    })
}

// Submits a message board post
Hue.submit_message_board_post = function()
{
    let message = Hue.utilz.clean_string2($("#message_board_post_textarea").val())

    if(!message || message.length > Hue.config.max_message_board_post_length)
    {
        return false
    }

    $("#message_board_post_textarea").val("")

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
    if(Hue.role === "admin")
    {
        $("#message_board_post_textarea").css("display", "block")
        Hue.message_board_posting_enabled = true
        return false
    }
    
    let date_diff = Date.now() - Hue.last_message_board_post_date

    clearTimeout(Hue.message_board_post_delay_timeout)

    if(date_diff < Hue.config.message_board_post_delay)
    {
        $("#message_board_post_textarea").css("display", "none")

        Hue.message_board_post_delay_timeout = setTimeout(function()
        {
            Hue.check_message_board_delay()
        }, date_diff + 1000)

        Hue.message_board_posting_enabled = false
    }
    
    else
    {
        $("#message_board_post_textarea").css("display", "block")
        Hue.message_board_posting_enabled = true
    }
}

// Checks if there are new message board posts
Hue.check_last_message_board_post = function()
{
    let items = $("#message_board_container").find(".message_board_item")

    if(items.length === 0)
    {
        $("#activity_left_message_board_label").text("")
        return false
    }

    let date = Hue.last_message_board_post_checked[Hue.room_id]

    if(items.first().data("date") > date)
    {
        if(!Hue.msg_message_board.is_open())
        {
            let count = 0

            $("#message_board_container").find(".message_board_item").each(function()
            {
                if($(this).data("date") <= date)
                {
                    return false
                }

                count += 1
            })

            let s = count === 1 ? "New Post" : "New Posts"

            $("#activity_left_message_board_label").text(s)
        }

        else
        {
            Hue.update_last_message_post_checked()
        }
    }
    
    else
    {
        $("#activity_left_message_board_label").text("")
    }
}

// Updates the message board date local storage
Hue.update_last_message_post_checked = function()
{
    let item = $("#message_board_container").find(".message_board_item").first()
    let date = item.data("date")

    if(date !== Hue.last_message_board_post_checked[Hue.room_id])
    {
        Hue.save_last_message_board_post_checked(date)
    }
}

// Saves the last message board post check local storage
Hue.save_last_message_board_post_checked = function(date)
{
    Hue.last_message_board_post_checked[Hue.room_id] = date
    Hue.save_local_storage(Hue.ls_last_message_board_post_checked, Hue.last_message_board_post_checked)
}

// Checks if the user is an admin and can delete posts in the message board
Hue.check_message_board_permissions = function()
{
    if(Hue.role === "admin")
    {
        $("#message_board_container").addClass("message_board_container_admin")
    }
    
    else
    {
        $("#message_board_container").removeClass("message_board_container_admin")
    }
}

// Remove a post from the message board window
Hue.remove_message_board_post = function(data)
{
    $("#message_board_container").find(".message_board_item").each(function()
    {
        if($(this).data("id") === data.id)
        {
            $(this).remove()
            return false
        }
    })
}

// Gets the last message board checked local storage
Hue.get_last_message_board_post_checked = function()
{
    Hue.last_message_board_post_checked = Hue.get_local_storage(Hue.ls_last_message_board_post_checked)

    let changed = false

    if(!Hue.last_message_board_post_checked)
    {
        Hue.last_message_board_post_checked = {}
        changed = true
    }

    if(!Hue.last_message_board_post_checked[Hue.room_id])
    {
        Hue.last_message_board_post_checked[Hue.room_id] = 0
        changed = true
    }

    if(changed)
    {
        Hue.save_last_message_board_post_checked(Hue.last_message_board_post_checked[Hue.room_id])
    }
}