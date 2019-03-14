/* Separator v1.0.0 https://github.com/madprops/Separator */

// This creates separators between items

const Separator = {}

Separator.factory = function(options={})
{
    const instance = {}

    if(options.mode === undefined)
    {
        options.mode = "horizontal"
    }

    if(options.html === undefined)
    {
        if(options.mode === "horizontal")
        {
            options.html =  `
            <div class="separator-horizontal-container">
                <div class="separator-horizontal-line"></div>
            </div>`
        }

        else if(options.mode === "vertical")
        {
            options.html = `
            <div class="separator-vertical-container">
                <div class="separator-vertical-line"></div>
            </div>`
        }
    }

    if(options.class === undefined)
    {
        options.class = ""
    }

    if(options.height === undefined)
    {
        options.height = "1em"
    }

    if(options.width === undefined)
    {
        options.width = "1em"
    }

    if(options.margin_top === undefined)
    {
        options.margin_top = "1em"
    }

    if(options.margin_bottom === undefined)
    {
        options.margin_bottom = "1em"
    }

    if(options.margin_left === undefined)
    {
        options.margin_left = "1em"
    }

    if(options.margin_right === undefined)
    {
        options.margin_right = "1em"
    }

    if(options.font_size === undefined)
    {
        options.font_size = "1em"
    }

    if(options.line_height === undefined)
    {
        options.line_height = "1em"
    }

    instance.remove_separators = function(element)
    {
        let container = Separator.resolve_container(element)
        Separator.remove_separators(container)
    }

    instance.separate = function(element, options2={})
    {
        let container = Separator.resolve_container(element)
        let opts = Object.assign({}, options, options2, {container:container})
        Separator.separate(opts)
    }

    Separator.instances.push(instance)

    return instance	
}

Separator.instances = []

Separator.resolve_container = function(element)
{
    let container

    if(element instanceof Element)
    {
        container = element
    }

    else if(typeof element === "string")
    {
        container = document.getElementById(element)
    }

    return container
}

Separator.remove_separators = function(container)
{
    let children = Array.from(container.children)

    for(let child of children)
    {
        if(child.classList.contains("separator-separator"))
        {
            container.removeChild(child)
        }
    }
}

Separator.separate = function(options={})
{
    Separator.remove_separators(options.container)

    let n = 0

    children = Array.from(options.container.children)

    for(let child of children)
    {
        let style = window.getComputedStyle(child)
            
        if(style.display === "none")
        {
            continue
        }

        n += 1

        if(n === 1)
        {
            continue
        }

        let separator = Separator.create_separator(options)
        options.container.insertBefore(separator, child)
    }
}

Separator.create_separator = function(options)
{
    let separator = document.createElement("div")
    separator.innerHTML = options.html
    separator.dataset["separatorItem"] = 1
    separator.classList.add("separator-separator")

    if(options.class)
    {
        let split = options.class.split(" ")

        for(let cls of split)
        {
            if(cls)
            {
                separator.classList.add(cls)
            }
        }
    }

    separator.style.fontSize = options.font_size
    separator.style.lineHeight = options.line_height
            
    if(options.mode === "horizontal")
    {
        separator.style.height = options.height
        separator.style.marginLeft = options.margin_left
        separator.style.marginRight = options.margin_right
    }
            
    else if(options.mode === "vertical")
    {
        separator.style.width = options.width
        separator.style.marginTop = options.margin_top
        separator.style.marginBottom = options.margin_bottom
    }

    return separator
}

const css = `
.separator-separator
{
    display: flex;
    align-items: center;
    justify-content: center;
}

.separator-vertical-container
{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: relative;
}

.separator-vertical-line
{
    flex-grow: 1;
    background-color: currentColor;
    height: 1px;
}

.separator-horizontal-container
{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: relative;
}

.separator-horizontal-line
{
    flex-grow: 1;
    background-color: currentColor;
    width: 1px;
}`

let style = document.createElement("style")
style.innerHTML = css
document.head.appendChild(style)

try
{
    module.exports = Separator
}

catch(e){}