// Starts body events
Hue.start_body_events = function()
{
    $("body").on("click", ".spoiler", function()
    {
        $(this).removeClass("spoiler")
        $(this).removeAttr("title")
    })

    $("body").on("mouseenter", ".dynamic_title", function()
    {
        let new_title = `${$(this).data("otitle")} (${Hue.get_timeago($(this).data("date"))})`
        $(this).attr("title", new_title)
    })

    $("body").on("auxclick", ".Msg-window-inner-x", function(e)
    {
        if(e.which === 2)
        {
            Hue.process_msg_close_button(this)
        }
    })

    $("body").mousedown(function()
    {
        Hue.mouse_is_down = true
    })

    $("body").mouseup(function(e)
    {
        Hue.mouse_is_down = false
    })

    $("body").mouseleave(function()
    {
        Hue.mouse_is_down = false
    })
}