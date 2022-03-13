const express = require('express');
const socket = require('socket.io');

const app = express();

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running...');
});

const tasks = [];

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
    io.to(socket.id).emit("updateData", tasks);
    console.log('New user:', socket.id );

    socket.on('addTask', (task) => {
        tasks.push(task);
        socket.broadcast.emit('addTask', task);
        console.log('Actually tasks:', tasks);
    });

    socket.on('removeTask', (id) => {
        tasks.splice(tasks.findIndex((task) => task.id === id), 1);
        socket.broadcast.emit('removeTask', id);
        console.log('Actually tasks:', tasks);
    })
});