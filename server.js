const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static files
app.use(express.static('.'));

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle room joining
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Handle WebRTC offer
    socket.on('offer', (data) => {
        console.log('Offer received from:', socket.id);
        socket.to(data.roomId).emit('offer', data);
    });

    // Handle WebRTC answer
    socket.on('answer', (data) => {
        console.log('Answer received from:', socket.id);
        socket.to(data.roomId).emit('answer', data);
    });

    // Handle ICE candidates
    socket.on('ice-candidate', (data) => {
        console.log('ICE candidate received from:', socket.id);
        socket.to(data.roomId).emit('ice-candidate', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT}/standalone-app.html`);
});
