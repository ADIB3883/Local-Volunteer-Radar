import io from 'socket.io-client';

let socket = null;

export const getSocket = () => {
    if (!socket) {
        socket = io('https://local-volunteer-radar.onrender.com', {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5
        });
    }
    return socket;
};