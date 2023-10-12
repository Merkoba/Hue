// Setup reactions
App.setup_reactions = () => {
  let c = DOM.el(`#reactions_container`)

  for (let reaction of App.config.reactions) {
    let el = DOM.create(`div`)
    let name = App.get_reaction_name(reaction)
    let cmd = `:${name}:`
    let text = DOM.create(`div`, `reaction_text`)
    text.textContent = cmd
    let img = DOM.create(`img`, `reaction_image actionbox`)
    img.loading = `lazy`
    img.src = App.get_reaction_url(name)
    img.title = cmd

    DOM.ev(img, `click`, (e) => {
      App.send_reaction(name)
    })

    el.append(text)
    el.append(img)
    c.append(el)
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