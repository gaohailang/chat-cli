var socketio = require('socket.io');

// Listen on port 3636
var io = socketio.listen(3636);

var clientDict = {};
io.sockets.on('connection', function (socket) {

    // Broadcast a user's message to everyone else in the room
    socket.on('send', function (data) {
        if(data.type && (data.type === 'identity')) {
            clientDict[data.message] = socket.id;
            return;
        }
        if(data.type && (data.type === 'pm')) {
            if(!clientDict[data.to]) {
                return socket.emit('message', {
                    type: 'notice',
                    message: 'not found'
                });
            }
            io.sockets.sockets.forEach(function(socket) {
                if(socket.id === clientDict[data.to]) {
                    socket.emit('message', data);
                }
            });
            return;
        }
        socket.broadcast.emit('message', data);
    });

});

/*
// lots of socket-io usage

// send to current request socket client
socket.emit('message', "this is a test");

// sending to all clients, include sender
io.sockets.emit('message', "this is a test");

// sending to all clients except sender
socket.broadcast.emit('message', "this is a test");

// sending to all clients in 'game' room(channel) except sender
socket.broadcast.to('game').emit('message', 'nice game');

 // sending to all clients in 'game' room(channel), include sender
io.sockets.in('game').emit('message', 'cool game');

// sending to individual socketid
io.sockets.socket(socketid).emit('message', 'for your eyes only');
*/