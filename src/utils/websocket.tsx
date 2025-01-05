let socket: WebSocket;

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