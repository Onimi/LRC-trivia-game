var Player = function (name) {
  this.name = name;
  this.place = 0;
  this.purse = 0;
  this.inPenaltyBox = false;
}

var Game = function () {
  var PLACES_NUMBER = 12;
  var MAX_PLAYERS_NUMBER = 6;
  var VICTORY_POINT_NUMBER = 6;

  var players = [];

  var questionCategories = ['Pop', 'Science', 'Sports', 'Rock'];
  var questions = {
    'Pop': [],
    'Science': [],
    'Sports': [],
    'Rock': []
  };

  var currentPlayer = 0;
  var isGettingOutOfPenaltyBox = false;

  var didPlayerWin = function () {
    var player = players[currentPlayer];
    return !(player.purse == VICTORY_POINT_NUMBER)
  };

  var currentCategory = function () {
    var player = players[currentPlayer]
    var categoyIndex = player.place % questionCategories.length;
    return questionCategories[categoyIndex];
  };

  for (var i = 0; i < 50; i++) {
    questionCategories.forEach(function(category) {
      questions[category].push(category + " Question " + i);
    });
  };

  this.isPlayable = function (howManyPlayers) {
    return howManyPlayers >= 2;
  };

  this.add = function (playerName) {
    var player = new Player(playerName);
    players.push(player);

    console.log(playerName + " was added");
    console.log("They are player number " + players.length);

    return true;
  };

  this.howManyPlayers = function () {
    return players.length;
  };


  var askQuestion = function () {
    var questionCollection = questions[currentCategory()];
    console.log( questionCollection.shift() );
  };

  var movePlayer = function (player, steps) {
    player.place = player.place + steps;
    if (player.place >= PLACES_NUMBER) {
      player.place = player.place - PLACES_NUMBER;
    }
  }

  this.roll = function (roll) {
    var player = players[currentPlayer];
    console.log(player.name + " is the current player");
    console.log("They have rolled a " + roll);

    if (player.inPenaltyBox) {
      if (roll % 2 != 0) {
        isGettingOutOfPenaltyBox = true;

        console.log(player.name + " is getting out of the penalty box");
        movePlayer(player, roll);

        console.log(player.name + "'s new location is " + player.place);
        console.log("The category is " + currentCategory());
        askQuestion();
      } else {
        console.log(player.name + " is not getting out of the penalty box");
        isGettingOutOfPenaltyBox = false;
      }
    } else {

      movePlayer(player, roll);

      console.log(player.name + "'s new location is " + player.place);
      console.log("The category is " + currentCategory());
      askQuestion();
    }
  };

  this.wasCorrectlyAnswered = function () {
    var player = players[currentPlayer];
    if (player.inPenaltyBox) {
      if (isGettingOutOfPenaltyBox) {
        console.log('Answer was correct!!!!');
        player.purse += 1;
        console.log(player.name + " now has " +
            player.purse + " Gold Coins.");

        var winner = didPlayerWin();
        currentPlayer += 1;
        if (currentPlayer == players.length)
          currentPlayer = 0;

        return winner;
      } else {
        currentPlayer += 1;
        if (currentPlayer == players.length)
          currentPlayer = 0;
        return true;
      }


    } else {

      console.log("Answer was correct!!!!");

      player.purse += 1;
      console.log(player.name + " now has " +
          player.purse + " Gold Coins.");

      var winner = didPlayerWin();

      currentPlayer += 1;
      if (currentPlayer == players.length)
        currentPlayer = 0;

      return winner;
    }
  };

  this.wrongAnswer = function () {
    var player = players[currentPlayer];
    console.log('Question was incorrectly answered');
    console.log(player.name + " was sent to the penalty box");
    player.inPenaltyBox = true;

    currentPlayer += 1;
    if (currentPlayer == players.length)
      currentPlayer = 0;
    return true;
  };
};

var notAWinner = false;

var game = new Game();

game.add('Chet');
game.add('Pat');
game.add('Sue');

do {

  game.roll(Math.floor(Math.random() * 6) + 1);

  if (Math.floor(Math.random() * 10) == 7) {
    notAWinner = game.wrongAnswer();
  } else {
    notAWinner = game.wasCorrectlyAnswered();
  }

} while (notAWinner);

module.exports = Game;