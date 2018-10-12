var Game = function () {
  var PLACES_NUMBER = 12;
  var MAX_PLAYERS_NUMBER = 6;
  var VICTORY_POINT_NUMBER = 6;

  var players = new Array();
  var places = new Array(MAX_PLAYERS_NUMBER);
  var purses = new Array(MAX_PLAYERS_NUMBER);
  var inPenaltyBox = new Array(MAX_PLAYERS_NUMBER);

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
    return !(purses[currentPlayer] == VICTORY_POINT_NUMBER)
  };

  var currentCategory = function () {
    var categoyIndex = places[currentPlayer] % questionCategories.length;
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
    players.push(playerName);
    places[this.howManyPlayers() - 1] = 0;
    purses[this.howManyPlayers() - 1] = 0;
    inPenaltyBox[this.howManyPlayers() - 1] = false;

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

  var movePlayer = function (playerIndex, steps) {
    places[playerIndex] = places[playerIndex] + steps;
    if (places[playerIndex] >= PLACES_NUMBER) {
      places[playerIndex] = places[playerIndex] - PLACES_NUMBER;
    }
  }

  this.roll = function (roll) {
    console.log(players[currentPlayer] + " is the current player");
    console.log("They have rolled a " + roll);

    if (inPenaltyBox[currentPlayer]) {
      if (roll % 2 != 0) {
        isGettingOutOfPenaltyBox = true;

        console.log(players[currentPlayer] + " is getting out of the penalty box");
        movePlayer(currentPlayer, roll);

        console.log(players[currentPlayer] + "'s new location is " + places[currentPlayer]);
        console.log("The category is " + currentCategory());
        askQuestion();
      } else {
        console.log(players[currentPlayer] + " is not getting out of the penalty box");
        isGettingOutOfPenaltyBox = false;
      }
    } else {

      movePlayer(currentPlayer, roll);

      console.log(players[currentPlayer] + "'s new location is " + places[currentPlayer]);
      console.log("The category is " + currentCategory());
      askQuestion();
    }
  };

  this.wasCorrectlyAnswered = function () {
    if (inPenaltyBox[currentPlayer]) {
      if (isGettingOutOfPenaltyBox) {
        console.log('Answer was correct!!!!');
        purses[currentPlayer] += 1;
        console.log(players[currentPlayer] + " now has " +
            purses[currentPlayer] + " Gold Coins.");

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

      purses[currentPlayer] += 1;
      console.log(players[currentPlayer] + " now has " +
          purses[currentPlayer] + " Gold Coins.");

      var winner = didPlayerWin();

      currentPlayer += 1;
      if (currentPlayer == players.length)
        currentPlayer = 0;

      return winner;
    }
  };

  this.wrongAnswer = function () {
    console.log('Question was incorrectly answered');
    console.log(players[currentPlayer] + " was sent to the penalty box");
    inPenaltyBox[currentPlayer] = true;

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