const express = require('express')
const socketio = require('socket.io')
const path = require('path')

const app = express()
const server = require('http').Server(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'public')))

const users = {}

io.on('connection', socket => {
    socket.on('user-join', (msg, username, room) => {
        socket.join(room)
        users[socket.id] = {username : username, room : room}
        socket.broadcast.to(room).emit('new-user', {sender: msg.sender, message: msg.message, time: msg.time})
    })
    socket.on('sent-message', (msg, room) => {
        socket.broadcast.to(room).emit('message', msg)
    })
    socket.on('disconnect', () => {
        socket.broadcast.to(users[socket.id].room).emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})

const port = process.env.PORT || 3000
server.listen(port)