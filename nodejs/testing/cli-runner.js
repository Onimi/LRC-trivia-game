const seedRandom = require('seed-random');

const originalGame = require('./origin/game.js');
const refactoredGame = require('../src/game.js');

const gameRunner = require('./game-runner.js');
const inputData = require('./io/input/input.json');
const length = inputData.length;

const index = ( process.argv[2] % length ) || 0;
// console.log(`ARGS -> ${process.argv}`);
// console.log(`INDEX -> ${index}`);
const input = inputData[index];

const useOriginal = !!process.argv[3];
const Game = useOriginal ? originalGame : refactoredGame;
// console.log(input.seed);
seedRandom( input.seed, { global: true } );
gameRunner( Game, input.players );
