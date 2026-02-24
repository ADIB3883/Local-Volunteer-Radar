import io from 'socket.io-client';

let socket = null;

export const getSocket = () => {
    if (!socket) {
        socket = io('http://localhost:5000', {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });
    }
    return socket;
};