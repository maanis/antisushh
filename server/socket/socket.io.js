var express = require('express');
var http = require('http');
var { Server } = require('socket.io');
var app = express();
var server = http.createServer(app);
var io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Replace with your frontend URL
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const socketIoMap = {};

// Connection handler
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
        socketIoMap[userId] = socket.id; // Store socket ID with userId
        console.log(`user connected, socketId: ${socket.id}, userID: ${userId}`);

        // Emit current online users to the client
        socket.emit('getOnlineUsers', Object.keys(socketIoMap));

    } else {
        console.error('User ID not provided in handshake query');
    }

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log(`user disconnected, socketId: ${socket.id}, userID: ${userId}`);

        if (userId) {
            delete socketIoMap[userId]; // Remove user from the map
            // Emit the updated list of online users to all clients
            io.emit('getOnlineUsers', Object.keys(socketIoMap));
        }
    });
});

module.exports = { io, server, app };
