/**1-----------------------------------------------------------------------------------------
 * declares the websocket as a var that can hold websocket or null.
 * this allows us to track the websocket connection for the app and
 *  ensures only one connect is active at a time.
 */

let socket: WebSocket | null = null;

/*2------------------------------------------------------------------------------------------
* This creates a WS connection to our url and then logs messages for connection events. 
First we check if the socket is closed or null, if it is then we make a connection. 
This returns the socket object to be used else where.
*/

export const connectWebSocket = (url: string):WebSocket => {
    if (!socket || socket.readyState === WebSocket.CLOSED){
        socket = new WebSocket(url);
        
        socket.onopen = () => console.log('connected to WebSocket server');
        socket.onerror = () => console.log('websocket error');
        socket.onclose = () => console.log('websocket connection close');}
    
    return socket;
};

export const sendWebSocketMessage = (data: any) => {
    if (socket && socket.readyState === WebSocket.OPEN){
        socket.send(JSON.stringify(data));
    }
};

export const listenWebSocket = (callback: (data: any) => void)=>{
    if (socket){
        socket.onmessage =(event)=>{
            const message = JSON.parse(event.data);
            callback(message);
        };
    }
};