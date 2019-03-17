// Execute javascript locally
Hue.execute_javascript = function(arg, show_result=true)
{
    arg = arg.replace(/\s\/endjs/gi, "")

    let r

    try
    {
        r = eval(arg)

        if(typeof r === "number")
        {
            try
            {
                r = Hue.utilz.round(r, 2)
            }

            catch(err){}
        }

        try
        {
            r = JSON.stringify(r)
        }

        catch(err)
        {
            r = "Done"
        }
    }

    catch(err)
    {
        r = "Error"
    }

    if(show_result)
    {
        let s = Hue.make_safe({text:arg})

        let f = function()
        {
            Hue.msg_info2.show(["Executed Javascript", s])
        }

        Hue.feedback(`js: ${r}`, {onclick:f, save:true})
    }
}