const seedRandom = require('seed-random');

const originalGame = require('./origin/game.js');
const refactoredGame = require('../src/game.js');

const gameRunner = require('./game-runner.js');
const inputData = require('./io/input/input.json');
const length = inputData.length;

const index = ( process.argv[2] % length ) || 0;
const input = inputData[index];

const useOriginal = !!process.argv[3];
const Game = useOriginal ? originalGame : refactoredGame;

seedRandom( input.seed, { global: true } );
gameRunner( Game, input.players );
