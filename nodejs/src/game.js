const Player = function ( name ) {
  this.name = name;
  this.place = 0;
  this.purse = 0;
  this.inPenaltyBox = false;
}

const Game = function () {
  const PLACES_NUMBER = 12;
  const MIN_PLAYERS_NUMBER = 2;
  const VICTORY_POINT_NUMBER = 6;
  const CATEGORY_QUESTIONS_NUMBER = 50;

  const players = [];
  let currentPlayer;
  let currentPlayerIndex;

  const questionCategories = ['Pop', 'Science', 'Sports', 'Rock'];
  const questions = {
    'Pop': [],
    'Science': [],
    'Sports': [],
    'Rock': []
  };

  let isGettingOutOfPenaltyBox = false;

  const didPlayerWin = function () {
    return currentPlayer.purse === VICTORY_POINT_NUMBER;
  };

  const currentCategory = function () {
    const categoyIndex = currentPlayer.place % questionCategories.length;
    return questionCategories[categoyIndex];
  };

  this.isPlayable = function () {
    return players.length >= MIN_PLAYERS_NUMBER;
  };

  this.add = function ( playerName ) {
    const player = new Player( playerName );
    players.push( player );

    console.log( `${playerName} was added` );
    console.log( `They are player number ${players.length}` );

    return true;
  };

  this.init = function () {
    if ( players.length ) {
      currentPlayerIndex = 0;
      currentPlayer = players[currentPlayerIndex];

      for ( let i = 0; i < CATEGORY_QUESTIONS_NUMBER; i++ ) {
        questionCategories.forEach( function ( category ) {
          questions[category].push( `${category} Question ${i}` );
        } );
      };

      return true;
    }
    return false
  };

  this.howManyPlayers = function () {
    return players.length;
  };

  const askQuestion = function () {
    const questionCollection = questions[currentCategory()];
    console.log( questionCollection.shift() );
  };

  const movePlayer = function ( player, steps ) {
    player.place = ( player.place + steps ) % PLACES_NUMBER;
  }

  const nextPlayer = function () {
    currentPlayerIndex = ( currentPlayerIndex + 1 ) % players.length;
    currentPlayer = players[currentPlayerIndex];
  };

  const getOutOfPenaltyBox = function ( roll ) {
    isGettingOutOfPenaltyBox = true;
    if ( !currentPlayer.inPenaltyBox ) {
      return;
    }
    if ( roll % 2 === 0 ) {
      console.log( `${currentPlayer.name} is not getting out of the penalty box` );
      isGettingOutOfPenaltyBox = false;
    } else {
      console.log( `${currentPlayer.name} is getting out of the penalty box` );
    }
  };

  this.roll = function ( roll ) {
    console.log( `${currentPlayer.name} is the current player` );
    console.log( `They have rolled a ${roll}` );

    getOutOfPenaltyBox( roll );

    if ( isGettingOutOfPenaltyBox ) {
      movePlayer( currentPlayer, roll );
      console.log( `${currentPlayer.name}'s new location is ${currentPlayer.place}` );
      console.log( `The category is ${currentCategory()}` );
      askQuestion();
    }
  };

  this.wasCorrectlyAnswered = function () {
    let notAWinner = true;
    if ( isGettingOutOfPenaltyBox ) {
      console.log( 'Answer was correct!!!!' );
      currentPlayer.purse++;
      console.log( `${currentPlayer.name} now has ${currentPlayer.purse} Gold Coins.` );

      notAWinner = !didPlayerWin();
    }

    nextPlayer();
    return notAWinner;
  };

  this.wrongAnswer = function () {
    console.log( 'Question was incorrectly answered' );
    console.log( `${currentPlayer.name} was sent to the penalty box` );
    currentPlayer.inPenaltyBox = true;

    nextPlayer();
    return true;
  };
};

module.exports = Game;