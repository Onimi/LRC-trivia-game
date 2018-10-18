const promisify = require('util').promisify;
const exec = require('child_process').exec;
const execPromise = promisify( exec );

const commands = [];

const quantity = 1000;
for( let i = 0; i < quantity; i++ ) {
    const cmd = `node cli-runner.js ${i} 1 > io/output/output-${i}`;
    commands.push( execPromise( cmd ) );
}

Promise.all(commands)
    .then( () => {
        console.log( 'data collected' );
    } )
    .catch( e => {
        console.log( 'ERROR OCCURED' );
        console.log( e );
    } );
