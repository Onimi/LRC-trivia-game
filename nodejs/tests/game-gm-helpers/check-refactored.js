const promisify = require('util').promisify;
const exec = require('child_process').exec;
const execPromise = promisify( exec );

const quantity = 10//1000;

let chain = Promise.resolve();
for ( let i = 0; i < quantity; i++ ) {
    chain = chain.then( () => execPromise( `node cli-runner.js ${i} > io/tmp/output-${i}` ) );
    chain = chain.then( () => execPromise( `diff io/output/output-${i} io/tmp/output-${i}` ) );
}

chain
    .then( () => {
        console.log( 'difference not found' );
    } )
    .then( () => execPromise( `rm io/tmp/*` ) )
    .catch( e => {
        console.log( 'ERROR OCCURED' );
        console.log( e );
    } );
