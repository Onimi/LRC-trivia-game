const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const exec = require('child_process').exec;
const execPromise = promisify( exec );


// const DEFAULT_PATH = path.join(__dirname, 'io', 'input','input.json');
const destinationRaw = process.argv[2] || './output';
const chunks = destinationRaw.split('/');
if ( destinationRaw.startsWith('/') ) {
    chunks[0] = '/' + chunks[0];
}
const destination = path.join( ...chunks );

console.log(destinationRaw, 'DEST_RAW');
console.log(destination, 'DEST');

const commands = [];

const quantity = 100;//1000;

promisify( fs.readdir )( destination )
    .then( r => console.log( r, 'OK - OUTPUT FOLDER EXISTS' ) )
    .catch( e => {
        console.log( e, 'ERROR' );
        if (e.errno === -2) {
            return promisify( fs.mkdir )( destination )
        }
        throw e;
    } )
    .then( r => {
        for( let i = 0; i < quantity; i++ ) {
            const outputPath = path.join( destination, `output-${i}` );
            const cliRunnerPath = path.join( __dirname, 'cli-runner.js' );
        
            const cmd = `node ${cliRunnerPath} ${i} 1 > ${outputPath}`;
            commands.push( execPromise( cmd ) );
        }
        
        return Promise.all(commands);
    } )
    .then( () => {
        console.log( 'data collected' );
    } )
    .catch( e => {
        console.log( 'ERROR OCCURED' );
        console.log( e );
    } );
