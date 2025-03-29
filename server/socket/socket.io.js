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
        socket.on('getOnlineUsers', Object.keys(socketIoMap));
    }

    socket.on('disconnect', () => {
        console.log(`user disconnected, socketId: ${socket.id}, userID: ${userId}`);
        delete socketIoMap[userId];
        socket.on('getOnlineUsers', Object.keys(socketIoMap));
    })
})

module.exports = { io, server, app };