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

    $("#usercount").on("auxclick", function(e)
    {
        if(e.which === 2)
        {
            let user = Hue.userlist[Hue.utilz.get_random_int(0, Hue.userlist.length - 1)]
            Hue.show_profile(user.username)
        }
    })

    $("#header_radio_volume_area").on("auxclick", function(e)
    {
        if(e.which === 2)
        {
            if(Hue.room_state.radio_volume !== 0)
            {
                Hue.set_radio_volume(0)
            }
            
            else
            {
                Hue.set_radio_volume(1)
            }
        }
    })
}