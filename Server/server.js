const WebSocket = require('ws');
const express = require('express');
/** 1 ----------------------------------------------------------------------------------------
 *  This makes an express app that starts a http server on port 3001, 
 * this allows the websocket server to built on top of the http server,
 * the websocket server needs another server to handle client connections */
const app = express();
const PORT = 3001;
//added for peace of mind
app.get('/', (req, res) => {
    res.send('Websocket server is running!')
})
//added for peace of mind
const server = app.listen(PORT, () =>{
    console.log(`Server running on http://localhost:${PORT}`);
});

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
        if (client.readyState === WebSocket.OPEN){
            client.send(message);
        }
        
    });
}