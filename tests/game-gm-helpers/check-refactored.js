const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const exec = require('child_process').exec;
const execPromise = promisify( exec );


const sourceRaw = process.argv[2] || './output';
const chunks = sourceRaw.split('/');
if ( sourceRaw.startsWith('/') ) {
    chunks[0] = '/' + chunks[0];
}
const source = path.join( ...chunks );
const destination = path.join( source, '..', 'tmp' );

promisify( fs.readdir )( destination )
    .catch( e => {
        if (e.errno === -2) {
            return promisify( fs.mkdir )( destination )
        }
        throw e;
    } )
    .then ( r => {
        return promisify( fs.readdir )( source );
    } )
    .then( files => {
        const cliRunnerPath = path.join( __dirname, 'cli-runner.js' );
    
        return files.reduce( (chain, file) => {
            const i = file.match(/-(\d+)$/)[1];
            
            const sourcePath = path.join( source, file );
            const tempPath = path.join( destination, file );

            chain = chain.then( () => execPromise( `node ${cliRunnerPath} ${i} > ${tempPath}` ) );
            chain = chain.then( () => execPromise( `diff ${sourcePath} ${tempPath}` ) );

            return chain;
        }, Promise.resolve() );
    } )
    .then( () => {
        console.log( 'difference not found' );
    } )

    .then( () => promisify( fs.readdir )( destination ) )
    .then( files => files.reduce( (chain, file) => {
        const tempPath = path.join( destination, file );
        chain = chain.then( () => promisify( fs.unlink )( tempPath ) );
        return chain;
    }, Promise.resolve() ) )

    .catch( e => {
        console.log( 'ERROR OCCURED' );
        console.log( e );
    } );
