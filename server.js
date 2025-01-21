const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


let globalCount = 0;
let connectedUsers = 0;

io.on('connection', (socket) => {
    connectedUsers++;
    io.emit('updateOnlineUsers', connectedUsers);
    
    // Enviar contador actual al nuevo usuario
    socket.emit('updateCounter', globalCount);

    socket.on('increment', () => {
        globalCount++;
        io.emit('updateCounter', globalCount);
    });

    socket.on('disconnect', () => {
        connectedUsers--;
        io.emit('updateOnlineUsers', connectedUsers);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
