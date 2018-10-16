const promisify = require('util').promisify;
const exec = require('child_process').exec;
const execPromise = promisify( exec );

const commands = [];

const quantity = 1000;
for( let i = 0; i < quantity; i++ ) {
    const check = execPromise(`node cli-runner.js ${i} > io/tmp/output-${i}`)
        .then( () => execPromise(`diff io/output/output-${i} io/tmp/output-${i}`) );
    commands.push( check );
}

Promise.all(commands)
    .then( res => {
        // console.log(res);
        console.log('difference not found');
    })
    .then( () => execPromise(`rm io/tmp/*`) )
    .catch(e => {
        console.log('ERROR OCCURED');
        console.log(e);
    });    