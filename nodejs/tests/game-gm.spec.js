const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const promisify = require('util').promisify;

const should = require('should');
// const sinon = require('sinon');

const MAX_TIMEOUT = 20000;

describe('The test environment', function () {
    it('should pass', function () {
        (true).should.equal(true);
    });
});

describe('Gold-master testing', function () {
    this.timeout(MAX_TIMEOUT);

    const ioDir = path.join( __dirname, 'game-gm-helpers', 'io' );
    const inputPath = path.join( ioDir, 'input.json' );
    const outputDir = path.join( ioDir, 'output' );

    before(function (done) {
        
        promisify( fs.readdir )( ioDir )
            .catch( e => {
                if (e.errno === -2) {
                    return promisify( fs.mkdir )( ioDir )
                }
                throw e;
            } )
            .then ( r => {
                return promisify( fs.readFile )( inputPath );
            } )
            .catch( e =>  {
                if (e.errno === -2) {
                    const inputGeneratorPath = path.join(__dirname, 'game-gm-helpers', 'input-generator.js');
                    return promisify( exec )( `node ${inputGeneratorPath} ${inputPath}` );
                }
                throw e;
            } )
            .then( r => {
                return promisify( fs.readdir )( outputDir );
            } )
            .then( r => {
                if ( !r.length) {
                    const outputGeneratorPath = path.join(__dirname, 'game-gm-helpers', 'output-generator.js');
                    return promisify( exec )( `node ${outputGeneratorPath} ${outputDir}` );
                }
            } )
            .catch( e => {
                if (e.errno === -2) {
                    const outputGeneratorPath = path.join(__dirname, 'game-gm-helpers', 'output-generator.js');
                    return promisify( exec )( `node ${outputGeneratorPath} ${outputDir}` );
                }
                throw e;
            } )
            .then( r => {
                return null;
            } )
            .catch( e => e )
            .then( done );
    });

    it('Check for difference between original and refactored behavior', function (done) {
        const checkerPath = path.join(__dirname, 'game-gm-helpers', 'check-refactored.js');
        promisify( exec )( `node ${checkerPath} ${outputDir}` )
            .then( r => {
               should(r.stdout).match(/^difference not found\s*$/);
            } )
            .then(done);
    });
});