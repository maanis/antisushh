var express = require('express');
var http = require('http');
var { Server } = require('socket.io');
var app = express();
var server = http.createServer(app);
var io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const socketIoMap = {};

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
        socketIoMap[userId] = socket.id;
        console.log(`user connected, socketId: ${socket.id}, userID: ${userId}`);

        socket.emit('getOnlineUsers', Object.keys(socketIoMap));

    } else {
        console.error('User ID not provided in handshake query');
    }

    socket.on('disconnect', () => {
        console.log(`user disconnected, socketId: ${socket.id}, userID: ${userId}`);

        if (userId) {
            delete socketIoMap[userId];
            io.emit('getOnlineUsers', Object.keys(socketIoMap));
        }
    });
});

module.exports = { io, server, app };
