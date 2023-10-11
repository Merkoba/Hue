// Setup reactions
App.setup_reactions = () => {
  let c = DOM.el(`#reactions_container`)
  let reactions = DOM.els(`.reaction`, c)

  for (let reaction of reactions) {
    DOM.ev(reaction, `click`, (e) => {
      let name = e.target.dataset.name
      App.send_reaction(name)
    })
  }
}

// Send reaction
App.send_reaction = (name) => {
  App.msg_reactions.close()

  App.process_input({
    message: `reaction: ${name}`,
  })
}

// Show reactions
App.show_reactions = () => {
  App.msg_reactions.show()
}