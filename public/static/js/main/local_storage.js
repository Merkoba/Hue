// Centralized function to get localStorage objects
Hue.get_local_storage = function(ls_name)
{
    let obj

    if(localStorage[ls_name])
    {
        try
        {
            obj = JSON.parse(localStorage.getItem(ls_name))
        }

        catch(err)
        {
            localStorage.removeItem(ls_name)
            obj = null
        }
    }

    else
    {
        obj = null
    }

    return obj
}

// Centralized function to save localStorage objects
Hue.save_local_storage = function(ls_name, obj, force=false)
{
    Hue.local_storage_to_save[ls_name] = obj

    if(force)
    {
        Hue.do_save_local_storage()
    }

    else
    {
        Hue.save_local_storage_timer()
    }
}

// Do the actual localStorage save
Hue.do_save_local_storage = function()
{
    for(let ls_name in Hue.local_storage_to_save)
    {
        let obj = Hue.local_storage_to_save[ls_name]

        if(typeof obj !== "string")
        {
            obj = JSON.stringify(obj)
        }

        localStorage.setItem(ls_name, obj)
    }

    Hue.local_storage_to_save = {}
}

// Remove a localStorage object
Hue.remove_local_storage = function(ls_name)
{
    localStorage.removeItem(ls_name)
}

// Setups localStorage events
Hue.setup_local_storage = function()
{
    window.addEventListener("storage", function(e)
    {
        if(e.key !== Hue.ls_global_settings && e.key !== Hue.ls_room_settings)
        {
            return false
        }

        let obj

        try
        {
            obj = JSON.parse(e.newValue)
        }

        catch(err)
        {
            return false
        }

        if(Hue.utilz.is_empty_object(obj))
        {
            return false
        }

        if(e.key === Hue.ls_global_settings)
        {
            Hue.reset_settings("global_settings", false)
        }

        else if(e.key === Hue.ls_room_settings)
        {
            if(e.url === document.location.href)
            {
                Hue.reset_settings("room_settings", false)
            }
        }
    }, false)
}