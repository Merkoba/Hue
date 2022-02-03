// Setup games
Hue.setup_games = function () {
  Hue.el("#game_picker_container").addEventListener("click", function (e) {
    if (!e.target) {
      return
    }   

    if (e.target.classList.contains("game_picker_item")) {
      let index = e.target.dataset.gameindex
      Hue.start_game(index)
    } 
  })
}

// Show the game picker
Hue.show_game_picker = function () {
  Hue.msg_game_picker.show()
}

// Start a game
Hue.start_game = function (index) {
  let game = Hue.config.games[index]
  let html = "<iframe id='game_frame' frameBorder='0'></iframe>"
  
  Hue.msg_game.show([game.name, html], function () {
    Hue.el("#game_frame").src = game.url
  })
}