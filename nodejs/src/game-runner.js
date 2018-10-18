function runGame(Game, players) {
  var notAWinner = false;

  var game = new Game();

  players.forEach( function (player) {
    game.add(player);
  } );

  if (game.init) {
    game.init();
  }
  
  do {

    game.roll(Math.floor(Math.random() * 6) + 1);

    if (Math.floor(Math.random() * 10) == 7) {
      notAWinner = game.wrongAnswer();
    } else {
      notAWinner = game.correctAnswer();
    }

  } while (notAWinner);
}

module.exports = runGame;
