import { CardInformation, CharacterInformation, Roles } from "../types/types";
import { formatCharacterInformation,  } from '../utils/utils';
import { Card } from '../components/Card';

const WebSocket = require('ws');
const express = require('express');
/** 1 ----------------------------------------------------------------------------------------
 *  This makes an express app that starts a http server on port 3001, 
 * this allows the websocket server to built on top of the http server,
 * the websocket server needs another server to handle client connections */
const app = express();
const PORT = 3001;
let host = null;
//added for peace of mind
app.get('/', (req, res) => {
    res.send('Websocket server is running!')
})
//added for peace of mind
const server = app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT}`);
});

function createCard(role){
    switch (role){
        case 'Duke':
            return { name: role, action: 'Tax: Take 3 coins from the treasury.'};
        case 'Captain':
            return { name: role, action: 'Steal: Take 2 coins from another player.' };
        case 'Ambassador':
            return { name: role, action: 'Exchange: Swap 2 cards with the court deck.' };
        case 'Assassin':
            return { name: role, action: 'Assassinate: Pay 3 coins to eliminate a player.' };
        case 'Contessa':
            return { name: role, action: 'Block: Prevent an assassination attempt.' };
        default:
            throw new Error('Unknown role');
    }
}

function startGame(){
// building the deck so there are 3 of each card type
const roles = Object.values(Roles);
let deck =  [];

roles.forEach(role =>{
        for( let i = 0; i < 3; i++){
            deck.push(role)
        };
});
//shuffling the deck
for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
}

players.forEach((playerData, username)=>{
    const card1 = deck.pop();
    const card2 = deck.pop();
    const cards = [createCard(card1), createCard(card2)];

    playerData.character.cards = cards;

    const playerSocket = playerData.ws;
    const character = playerData.character;

    playerSocket.send(JSON.stringify({
        type: 'gameStarted',
        character: character
    }));

});
}

/*2 ------------------------------------------------------------------------------------------
 creates a websocket server on the http server (see above), 
this allows comms between server amd client*/
const wss = new WebSocket.Server({ server});

/*3-------------------------------------------------------------------------------------------
Here we store players username(key) and their websocket connection (value)
*/
const players = new Map();

/**4 -----------------------------------------------------------------------------------------
 * creates event listeners that listen for certain events to take place, once they take place 
 * an action takes place as seen with the if & else parts - without this, server would not handle 
 * player messages.
 */
wss.on('connection', (ws) => {
    console.log('New client Connected');
 
    //handling player messages
    ws.on('message', (message)=> {
        try{
            const data = JSON.parse(message);

        switch (data.type) {
            case 'submitUsername':
                const existing = players.get(data.username);
                if (existing && existing.ws.readyState === WebSocket.OPEN){
                    ws.send(JSON.stringify({type: 'error', message: 'Username already taken'}));
                }
                else if (existing && existing.ws.readyState !== WebSocket.OPEN){
                    existing.ws = ws;
                    ws.username = data.username

                    ws.send(JSON.stringify({
                        type: 'success',
                        message: 'Reconnected Successfully',
                        character: existing.character
                    }));
                    broadcast({
                        type: 'updatePlayers',
                        players: Array.from(players.keys()),
                    });
                }
                else{
                    players.set(data.username, {
                        ws: ws,
                        character: {
                            username: data.username,
                            cards: [],
                            coins: 2,
                            influence: 2

                        }
                    });
                if (host === null){
                    host = data.username;
                }
                    ws.username = data.username;
                    console.log('Updated Player List:', Array.from(players.keys()));

                    ws.send(JSON.stringify({type: 'success', message: 'Username accepted'}));
                    broadcast({
                        type: 'updatePlayers',
                        players: Array.from(players.keys()),
                    });
                }
                break;
            case 'startGame':
                if(ws.username !== host){
                    ws.send(JSON.stringify({type: 'error', message: 'Only the host can start the game'}));
                    return;
                }
                if( players.size < 2 || players.size > 6){
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: 'You need between 2 and 6 people.'
                    }));
                    return;
                }
                startGame();
                break;
            default:
                console.log('Unknown Message Type:', data.type );
        }
        } catch(err){
            console.error('failed to process message', err);
        }
        
    });

    //handles plyers disconnecting - this is here to be developed later on when mvp is complete
    ws.on('close', () =>{
        if (ws.username){
            players.delete(ws.username);
            console.log('Updated Player List:', Array.from(players.keys()));
            broadcast({
                type: 'updatePlayers',
                players: Array.from(players.keys()),
            });
        }
    });

});
/**5 -----------------------------------------------------------------------------------------
 *  this is the broadcast function that is used to send messages across all clients, this 
 * keeps all players in sync.
 */
function broadcast(data){
    const message = JSON.stringify(data);
    players.forEach((client) =>{
        if (client.ws.readyState === WebSocket.OPEN){
            client.ws.send(message);
        }
        
    });
}