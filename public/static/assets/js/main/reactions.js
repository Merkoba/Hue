// Show reactions
App.show_reactions = () => {
  let c = DOM.el(`#reactions_container`)
  let reactions = App.config.reactions.slice(0)
  c.innerHTML = ``

  if (!reactions.length) {
    App.show_info(`No reactions available`)
    return
  }

  App.utilz.shuffle_array(reactions)

  for (let reaction of reactions) {
    let el = DOM.create(`div`)
    let name = App.get_reaction_name(reaction)
    let img = DOM.create(`img`, `reaction_image actionbox`)
    img.title = `:${name}:`
    img.loading = `lazy`
    img.src = App.get_reaction_url(name)

    DOM.ev(img, `click`, (e) => {
      App.send_reaction(name)
    })

    el.append(img)
    c.append(el)
  }

  App.msg_reactions.show()
}

// Send reaction
App.send_reaction = (name) => {
  App.msg_reactions.close()

  App.process_input({
    message: `:${name}:`,
  })
}

// Get reaction url
App.get_reaction_url = (name) => {
  for (let reaction of App.config.reactions) {
    if (App.get_reaction_name(reaction) === name) {
      return App.config.reactions_directory + `/` + reaction
    }
  }
}

// Get reaction name
App.get_reaction_name = (reaction) => {
  return reaction.split(`.`)[0]
}

// Show a random reaction
App.random_reaction = () => {
  let reactions = App.config.reactions
  let num = App.utilz.random_int(0, reactions.length - 1)
  let name = App.get_reaction_name(reactions[num])
  App.send_reaction(name)
}

// Check if text is a reaction
App.is_reaction = (text) => {
  return text.startsWith(`:`) && text.endsWith(`:`)
}