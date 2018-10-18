const fs = require('fs');
const path = require('path');

// const DEFAULT_PATH = path.join(__dirname, 'io', 'input','input.json');
const destinationRaw = process.argv[2] || './input.json';
const chunks = destinationRaw.split('/');
if ( destinationRaw.startsWith('/') ) {
    chunks[0] = '/' + chunks[0];
}
const destination = path.join( ...chunks );

// console.log(destinationRaw, 'DEST_RAW');
// console.log(destination, 'DEST');

const names = [
    'Chet', 'Pat', 'Sue', 'Kattie', 'Lisabeth', 'Noriko', 'Ginette', 'Lasandra',
    'Michelle', 'Collen', 'Chanell', 'Marcellus', 'Manie', 'Madelene', 'Houston', 'Colby',
    'Marsha', 'Julie', 'Candi', 'Kacie', 'Luigi', 'Caroline', 'Brianna', 'Paulita',
    'Nelda', 'Nicolle', 'Chauncey', 'Larita', 'Shae', 'Stasia', 'Bernadine', 'Marylou',
    'Shan', 'Wei', 'Hilary', 'Johanna', 'Jule', 'Herta', 'Marianne', 'Eladia',
    'Tayna', 'Jaye', 'Arianna', 'Anthony', 'Denna', 'Obdulia', 'Renato', 'Elvina',
    'Chanelle', 'Zenaida', 'Ardella', 'Scottie', 'Heidi'
];

const INPUT_NUMBER = 1000;
const MAX_PLAYERS_NUMBER = 10;
const MAX_OFFSET = names.length - 1;

const length = names.length;

const data = [];

function generateInput() {
    const number = Math.floor( Math.random() * MAX_PLAYERS_NUMBER ) + 1;
    const offset = Math.floor( Math.random() * MAX_OFFSET ) + 1;

    const players = [];
    let current = 0;

    for (let i = 0; i < number; i++) {
        current = ( current + offset ) % length;
        players.push( names[current] );
    }
    
    return {
        players,
        seed: generateSeed()
    };
}

function generateSeed() {
    return ( new Buffer( Math.random().toString() ) ).toString('base64');
}

for (let i = 0; i < INPUT_NUMBER; i++) {
    data.push( generateInput() );
}

fs.writeFile( destination, JSON.stringify(data), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
} );