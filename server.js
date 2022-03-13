const express = require('express');
const socket = require('socket.io');

const app = express();

const tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running...');
});


app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
    io.to(socket.id).emit("updateData", tasks);
    console.log('New user:', socket.id );

    socket.on('addTask', (newTask) => {
        tasks.push(newTask);
        socket.broadcast.emit('addTask', tasks);
        console.log('Actually tasks:', tasks);
    });

    socket.on('removeTask', (indexOfRemoveElement) => {
        tasks.splice(indexOfRemoveElement, 1);
        socket.broadcast.emit('removeTask', tasks);
        console.log('Actually tasks:', tasks);
    })
});