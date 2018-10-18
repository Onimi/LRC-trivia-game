const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const promisify = require('util').promisify;

const should = require('should');
// const sinon = require('sinon');

const MAX_TIMEOUT = 10000;

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
        // const ioDir = path.join( __dirname, 'game-gm-helpers', 'io2' );
        // const inputPath = path.join( ioDir, 'input.json' );
        // const outputDir = path.join( ioDir, 'output' );

        promisify( fs.readdir )( ioDir )
            // .then( r => console.log( r, 'OK - IO FOLDER EXISTS' ) )
            .catch( e => {
                // console.log( e, 'ERROR' );
                if (e.errno === -2) {
                    return promisify( fs.mkdir )( ioDir )
                }
                throw e;
            } )
            .then ( r => {
                // console.log( r, 'FOLDER EXISTS/CREATED' );
                return promisify( fs.readFile )( inputPath );
            } )
            // .then( r => console.log( r, 'OK - FILE EXISTS' ) )
            .catch( e =>  {
                // console.log( e, 'ERROR' );
                if (e.errno === -2) {
                    const inputGeneratorPath = path.join(__dirname, 'game-gm-helpers', 'input-generator.js');
                    return promisify( exec )( `node ${inputGeneratorPath} ${inputPath}` );
                }
                throw e;
            } )
            .then( r => {
                // console.log( r, 'INPUT_DATA EXISTS/CREATED' );
                return promisify( fs.readdir )( outputDir );
            } )
            .then( r => {
                // console.log( r, 'OK - OUTPUT FOLDER EXISTS');
                if ( !r.length) {
                    const outputGeneratorPath = path.join(__dirname, 'game-gm-helpers', 'output-generator.js');
                    // console.log(`node ${outputGeneratorPath} ${outputDir}`, '!!!!!!!!');
                    return promisify( exec )( `node ${outputGeneratorPath} ${outputDir}` );
                }
            } )
            .catch( e => {
                // console.log( e, 'ERROR' );
                if (e.errno === -2) {
                    const outputGeneratorPath = path.join(__dirname, 'game-gm-helpers', 'output-generator.js');
                    // console.log(`node ${outputGeneratorPath} ${outputDir}`, '!!!!!!!!');
                    return promisify( exec )( `node ${outputGeneratorPath} ${outputDir}` );
                }
                throw e;
            } )
            .then( r => {
                // console.log( r, 'OUTPUT_DATA EXISTS/CREATED' );
                return null;
            } )
            .catch( e => e )
            .then( done );
    });

    it('Check for difference between original and refactored behavior', function (done) {
        // (true).should.equal(true);
        const checkerPath = path.join(__dirname, 'game-gm-helpers', 'check-refactored.js');
        // const outputDir = path.join( ioDir, 'output' );
        // console.log( `node ${checkerPath} ${outputDir}` );
        promisify( exec )( `node ${checkerPath} ${outputDir}` )
            .then( r => {
                // console.log(r);
                // console.log(r.stdout, 'CHECK');
                should(r.stdout).match(/^difference not found\s*$/);
            } )
            .then(done);
    });
});