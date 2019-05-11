// Updates header separators
Hue.update_header_separators = function()
{
    Hue.horizontal_separator.separate("header_items_inner")
}

// More header configurations
Hue.setup_header = function()
{
    Hue.horizontal_separator.separate("header_radio")

    $("#room_menu_icon").on("auxclick", function(e)
    {
        if(e.which === 2)
        {
            let rotated = $("#main_container").data("hue_rotated")
            let degrees = rotated ? 0 : 180
            
            $("#main_container").css("transform", `rotateY(${degrees}deg)`)
            $("#main_container").data("hue_rotated", !Boolean(rotated))
        }
    })
}