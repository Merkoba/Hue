// Setup reactions
App.setup_reactions = () => {
  let c = DOM.el(`#reactions_container`)

  for (let reaction of App.config.reactions) {
    let img = DOM.create(`img`, `reaction`)
    let name = App.get_reaction_name(reaction)
    img.src = App.get_reaction_url(name)
    img.title = `:${name}:`

    DOM.ev(img, `click`, (e) => {
      App.send_reaction(name)
    })

    c.append(img)
  }
}

// Send reaction
App.send_reaction = (name) => {
  App.msg_reactions.close()

  App.process_input({
    message: `:${name}:`,
  })
}

// Show reactions
App.show_reactions = () => {
  App.msg_reactions.show()
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