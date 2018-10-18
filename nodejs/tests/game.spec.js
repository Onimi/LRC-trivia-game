const should = require('should');
const sinon = require('sinon');

const Game = require('../src/game.js');
const players = ['John', 'Jane', 'Mark', 'Tim', 'Alice', 'Bob', 'Trudy', 'Jim', 'David', 'Ann', 'Brian'];
const steps = [
  {dice: 1, answer: false},
  {dice: 1, answer: false},
  {dice: 1, answer: true},
  {dice: 2, answer: false},
  {dice: 1, answer: true},
  {dice: 3, answer: false},
  {dice: 1, answer: true},
  {dice: 4, answer: false},
  {dice: 1, answer: true},
  {dice: 5, answer: false},
  {dice: 1, answer: true},
  {dice: 6, answer: false}
];

describe('The test environment', function () {
  it('should pass', function () {
    (true).should.equal(true);
  });

  it('should access game', function () {
    should(Game).not.equal(undefined);
  });
});

describe('Test public methods', function () {

  describe('Test `isPlayable` method', function () {

    it('No players', function () {
      const game = prepare( Game );

      should( game.isPlayable() ).be.exactly( false );
    });

    it('1 player', function () {
      const game = prepare( Game, players.slice(0, 1) );

      should( game.isPlayable() ).be.exactly( false );
    });

    it('2 players', function () {
      const game = prepare( Game, players.slice(0, 2) );

      should( game.isPlayable() ).be.exactly( true );
    });

    it('3 players', function () {
      const game = prepare( Game, players.slice(0, 3) );

      should( game.isPlayable() ).be.exactly( true );
    });

    it('10 players', function () {
      const game = prepare( Game, players.slice(0, 10) );

      should( game.isPlayable() ).be.exactly( true );
    });

  });

  describe('Test `howManyPlayers` method', function () {

    it('No players', function () {
      const game = prepare( Game );

      should( game.howManyPlayers() ).be.exactly( 0 );
    });

    it('1 player', function () {
      const game = prepare( Game, players.slice(0, 1) );

      should( game.howManyPlayers() ).be.exactly( 1 );
    });

    it('2 players', function () {
      const game = prepare( Game, players.slice(0, 2) );

      should( game.howManyPlayers() ).be.exactly( 2 );
    });

    it('3 players', function () {
      const game = prepare( Game, players.slice(0, 3) );

      should( game.howManyPlayers() ).be.exactly( 3 );
    });

    it('10 players', function () {
      const game = prepare( Game, players.slice(0, 10) );

      should( game.howManyPlayers() ).be.exactly( 10 );
    });

  });

  describe('Test `add` method', function () {

    it('First player added', function () {
      const game = prepare( Game );

      const stub = sinon.stub(console, 'log');
      game.add( players[0] );
      stub.restore();

      should( game.howManyPlayers() ).be.exactly( 1 );
      should( stub.callCount ).be.exactly( 2 );
      should( stub.firstCall.calledWith(`${players[0]} was added`) ).be.exactly( true );
      should( stub.secondCall.calledWith('They are player number 1') ).be.exactly( true );
    });

    it('Second player added', function () {
      const game = prepare( Game, players.slice(0, 1) );

      const stub = sinon.stub(console, 'log');
      game.add( players[1] );
      stub.restore();

      should( game.howManyPlayers() ).be.exactly( 2 );
      should( stub.callCount ).be.exactly( 2 );
      should( stub.firstCall.calledWith(`${players[1]} was added`) ).be.exactly( true );
      should( stub.secondCall.calledWith('They are player number 2') ).be.exactly( true );
    });

    it('Third player added', function () {
      const game = prepare( Game, players.slice(0, 2) );

      const stub = sinon.stub(console, 'log');
      game.add( players[2] );
      stub.restore();

      should( game.howManyPlayers() ).be.exactly( 3 );
      should( stub.callCount ).be.exactly( 2 );
      should( stub.firstCall.calledWith(`${players[2]} was added`) ).be.exactly( true );
      should( stub.secondCall.calledWith('They are player number 3') ).be.exactly( true );
    });

    it('Fourth player added', function () {
      const game = prepare( Game, players.slice(0, 3) );

      const stub = sinon.stub(console, 'log');
      game.add( players[3] );
      stub.restore();

      should( game.howManyPlayers() ).be.exactly( 4 );
      should( stub.callCount ).be.exactly( 2 );
      should( stub.firstCall.calledWith(`${players[3]} was added`) ).be.exactly( true );
      should( stub.secondCall.calledWith('They are player number 4') ).be.exactly( true );
    });

  });

  describe('Test `roll` method', function () {
    const categories = ['Pop', 'Science', 'Sports', 'Rock'];
    
    it('1st roll', function () {
      const game = prepare( Game, players.slice(0, 2) );

      const stub = sinon.stub(console, 'log');
      const dice = 6;
      game.roll(dice);
      stub.restore();
      const location = dice;

      should( stub.callCount ).be.exactly( 5 );
      should( stub.getCall(0).calledWith( `${players[0]} is the current player` ) ).be.exactly( true );
      should( stub.getCall(1).calledWith( `They have rolled a ${dice}` ) ).be.exactly( true );
      should( stub.getCall(2).calledWith( `${players[0]}'s new location is ${location}` ) ).be.exactly( true );
      should( stub.getCall(3).calledWith( `The category is ${categories[2]}` ) ).be.exactly( true );
      should( stub.getCall(4).calledWith( `${categories[2]} Question ${0}` ) ).be.exactly( true );
    });

    it('roll after wrong answer and staying in penalty box', function () {
      const game = prepare( Game, players.slice( 0, 2 ), steps.slice( 0, 2 ) );

      const stub = sinon.stub(console, 'log');
      const dice = 4; // even number
      game.roll(dice);
      stub.restore();

      should( stub.callCount ).be.exactly( 3 );
      should( stub.getCall(0).calledWith( `${players[0]} is the current player` ) ).be.exactly( true );
      should( stub.getCall(1).calledWith( `They have rolled a ${dice}` ) ).be.exactly( true );
      should( stub.getCall(2).calledWith( `${players[0]} is not getting out of the penalty box` ) ).be.exactly( true );
    });

    it('roll after wrong answer and getting out of penalty box', function () {
      const game = prepare( Game, players.slice( 0, 2 ), steps.slice( 0, 2 ) );

      const stub = sinon.stub(console, 'log');
      const dice = 5; // odd number
      game.roll(dice);
      stub.restore();

      should( stub.callCount ).be.exactly( 6 );
      should( stub.getCall(0).calledWith( `${players[0]} is the current player` ) ).be.exactly( true );
      should( stub.getCall(1).calledWith( `They have rolled a ${dice}` ) ).be.exactly( true );
      should( stub.getCall(2).calledWith( `${players[0]} is getting out of the penalty box` ) ).be.exactly( true );
    });

  });

  describe('Test `wrongAnswer` method', function () {
    it('wrong answer', function () {
      const game = prepare( Game, players.slice(0, 2) );

      const prepareStub = sinon.stub(console, 'log');
      const dice = 3;
      game.roll(dice);
      prepareStub.restore();

      const stub = sinon.stub(console, 'log');
      const nextStep = game.wrongAnswer();
      stub.restore();

      should( stub.callCount ).be.exactly( 2 );
      should( stub.getCall(0).calledWith( 'Question was incorrectly answered' ) ).be.exactly( true );
      should( stub.getCall(1).calledWith( `${players[0]} was sent to the penalty box` ) ).be.exactly( true );
      should( nextStep ).be.exactly( true );
    });
  });

  describe('Test `correctAnswer` method', function () {
    it('correct answer without a winner', function () {
      const game = prepare( Game, players.slice(0, 2) );

      const prepareStub = sinon.stub(console, 'log');
      const dice = 3;
      game.roll(dice);
      prepareStub.restore();

      const stub = sinon.stub(console, 'log');
      const nextStep = game.correctAnswer();
      stub.restore();

      should( stub.callCount ).be.exactly( 2 );
      should( stub.getCall(0).calledWith( 'Answer was correct!!!!' ) ).be.exactly( true );
      
      should( nextStep ).be.exactly( true );
    });

    it('correct answer with a winner', function () {
      const game = prepare( Game, players.slice(0, 2), steps.slice(0, 12) );

      const prepareStub = sinon.stub(console, 'log');
      const dice = 3;
      game.roll(dice);
      prepareStub.restore();

      const stub = sinon.stub(console, 'log');
      const nextStep = game.correctAnswer();
      stub.restore();

      should( stub.callCount ).be.exactly( 2 );
      should( stub.getCall(0).calledWith( 'Answer was correct!!!!' ) ).be.exactly( true );

      should( nextStep ).be.exactly( false );
    });
  });
});

// Game, players = [ 'Name1', 'Name2', ... ], steps = [ { dice: N1, answer: B1 }, ... ]
function craeteGameState ( Game, players=[], steps = [] ) {
  const game = new Game();
  players.forEach( name => game.add(name) );

  if ( players.length ) {
    game.init();
  }

  for( let i = 0; i < steps.length; i++ ) {
    game.roll( steps[i].dice );
    const nextStep = steps[i].answer ? game.correctAnswer() : game.wrongAnswer();
    if ( !nextStep ) {
      break;
    }
  }

  return game;
}

function prepare ( ...args ) {
  const prepareStub = sinon.stub(console, 'log');
  const game = craeteGameState( ...args );
  prepareStub.restore();
  return game;
}
