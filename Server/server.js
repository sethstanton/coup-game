const WebSocket =require('ws');
const express = require('express');

const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
    res.send('Websocket server is running!')
})

const server = app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server});

//Here we store player data
const players = new Map();

wss.on('connection', (ws) => {
    console.log('New client Connected');
 
    //handling player messages
    ws.on('message', (message)=> {
        try{
            const data = JSON.parse(message);

        switch (data.type) {
            case 'submitUsername':
                if (players.has (data.username)){
                    ws.send(JSON.stringify({type: 'error', message: 'Username already taken'}));
                }
                else{
                    players.set(data.username, ws);
                    ws.username = data.username;
                    console.log('Updated Player List:', Array.from(players.keys()));

                    ws.send(JSON.stringify({type: 'success', message: 'Username accepted'}));
                    broadcast({
                        type: 'updatePlayers',
                        players: Array.from(players.keys()),
                    });
                }
                break;
            default:
                console.log('Unknown Message Type:', data.type );
        }
        } catch(err){
            console.error('failed to process message', err);
        }
        
    });

    //handles plyers disconnecting
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

function broadcast(data){
    const message = JSON.stringify(data);
    players.forEach((client) =>{
        if (client.readyState === WebSocket.OPEN){
            client.send(message);
        }
        
    });
}