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
// console.log(source, 'SRC');
// console.log(destination, 'DEST');

promisify( fs.readdir )( destination )
    // .then( r => console.log( r, 'OK - IO FOLDER EXISTS' ) )
    .catch( e => {
        // console.log( e, 'ERROR' );
        if (e.errno === -2) {
            return promisify( fs.mkdir )( destination )
        }
        throw e;
    } )
    .then ( r => {
        // console.log( r, 'DESTINATION FOLDER EXISTS/CREATED' );
        return promisify( fs.readdir )( source );
    } )
    .then( files => {
        // console.log(files);
        const cliRunnerPath = path.join( __dirname, 'cli-runner.js' );
    
        // commands.push( execPromise( cmd ) );
        return files.reduce( (chain, file) => {
            const i = file.match(/-(\d+)$/)[1];
            // console.log(i)

            const sourcePath = path.join( source, file );
            const tempPath = path.join( destination, file );
            const cmd1 = `node ${cliRunnerPath} ${i} > ${tempPath}`;
            const cmd2 = `diff ${sourcePath} ${tempPath}`;

            // console.log(cmd1);
            // console.log(cmd2);

            chain = chain.then( (r) => {
                // console.log(r, i);
                return execPromise( cmd1 );
            } );
            chain = chain.then( (r) => {
                // console.log(r, i);
                return execPromise( cmd2 );
            } );
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

// const quantity = 10//1000;

// let chain = Promise.resolve();
// for ( let i = 0; i < quantity; i++ ) {
//     chain = chain.then( () => execPromise( `node cli-runner.js ${i} > io/tmp/output-${i}` ) );
//     chain = chain.then( () => execPromise( `diff io/output/output-${i} io/tmp/output-${i}` ) );
// }

// chain
//     .then( () => {
//         console.log( 'difference not found' );
//     } )
//     .then( () => execPromise( `rm io/tmp/*` ) )
//     .catch( e => {
//         console.log( 'ERROR OCCURED' );
//         console.log( e );
//     } );
