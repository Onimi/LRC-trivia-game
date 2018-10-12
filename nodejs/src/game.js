var Player = function (name) {
  this.name = name;
  this.place = 0;
  this.purse = 0;
  this.inPenaltyBox = false;
}

var Game = function () {
  var PLACES_NUMBER = 12;
  var MIN_PLAYERS_NUMBER = 2;
  var MAX_PLAYERS_NUMBER = 6;
  var VICTORY_POINT_NUMBER = 6;

  var players = [];
  var currentPlayer;
  var currentPlayerIndex;

  var questionCategories = ['Pop', 'Science', 'Sports', 'Rock'];
  var questions = {
    'Pop': [],
    'Science': [],
    'Sports': [],
    'Rock': []
  };

  var isGettingOutOfPenaltyBox = false;

  var didPlayerWin = function () {
    return !(currentPlayer.purse == VICTORY_POINT_NUMBER)
  };

  var currentCategory = function () {
    var categoyIndex = currentPlayer.place % questionCategories.length;
    return questionCategories[categoyIndex];
  };

  this.isPlayable = function () {
    return players.length >= MIN_PLAYERS_NUMBER && players.length <= MAX_PLAYERS_NUMBER;
  };

  this.add = function (playerName) {
    var player = new Player(playerName);
    players.push(player);

    console.log(playerName + " was added");
    console.log("They are player number " + players.length);

    return true;
  };

  this.init = function () {
    if (this.isPlayable()) {
      currentPlayerIndex = 0;
      currentPlayer = players[currentPlayerIndex];

      for (var i = 0; i < 50; i++) {
        questionCategories.forEach(function(category) {
          questions[category].push(category + " Question " + i);
        });
      };

      return true;
    }
    return false
  }

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

  var nextPlayer = function () {
    currentPlayerIndex += 1;
    if (currentPlayerIndex == players.length)
      currentPlayerIndex = 0;

    currentPlayer = players[currentPlayerIndex];
  }

  this.roll = function (roll) {
    console.log(currentPlayer.name + " is the current player");
    console.log("They have rolled a " + roll);

    if (currentPlayer.inPenaltyBox) {
      if (roll % 2 != 0) {
        isGettingOutOfPenaltyBox = true;

        console.log(currentPlayer.name + " is getting out of the penalty box");
        movePlayer(currentPlayer, roll);

        console.log(currentPlayer.name + "'s new location is " + currentPlayer.place);
        console.log("The category is " + currentCategory());
        askQuestion();
      } else {
        console.log(currentPlayer.name + " is not getting out of the penalty box");
        isGettingOutOfPenaltyBox = false;
      }
    } else {

      movePlayer(currentPlayer, roll);

      console.log(currentPlayer.name + "'s new location is " + currentPlayer.place);
      console.log("The category is " + currentCategory());
      askQuestion();
    }
  };

  this.wasCorrectlyAnswered = function () {
    if (currentPlayer.inPenaltyBox) {
      if (isGettingOutOfPenaltyBox) {
        console.log('Answer was correct!!!!');
        currentPlayer.purse += 1;
        console.log(currentPlayer.name + " now has " +
          currentPlayer.purse + " Gold Coins.");

        var winner = didPlayerWin();
        nextPlayer();
        return winner;
      } else {
        nextPlayer();
        return true;
      }
    } else {

      console.log("Answer was correct!!!!");

      currentPlayer.purse += 1;
      console.log(currentPlayer.name + " now has " +
        currentPlayer.purse + " Gold Coins.");

      var winner = didPlayerWin();

      nextPlayer();

      return winner;
    }
  };

  this.wrongAnswer = function () {
    console.log('Question was incorrectly answered');
    console.log(currentPlayer.name + " was sent to the penalty box");
    currentPlayer.inPenaltyBox = true;

    nextPlayer();
    return true;
  };
};

module.exports = Game;