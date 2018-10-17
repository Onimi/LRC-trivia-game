const seedRandom = require('seed-random');

const originalGame = require('./origin/game.js');
const originalGameRunner = require('./origin/game-runner.js');

const refactoredGame = require('../src/game.js');
const refactoredGameRunner = require('../src/game-runner.js');

const inputData = require('./io/input/input.json');
const length = inputData.length;

const index = ( process.argv[2] % length ) || 0;
const input = inputData[index];

const useOriginal = !!process.argv[3];
const Game = useOriginal ? originalGame : refactoredGame;
const runner = useOriginal ? originalGameRunner : refactoredGameRunner;

seedRandom( input.seed, { global: true } );
runner( Game, input.players );
