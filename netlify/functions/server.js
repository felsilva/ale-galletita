const { Server } = require('socket.io');

let io;
let globalCount = 0;
let connectedUsers = 0;

exports.handler = async (event, context) => {
  if (!io) {
    io = new Server({
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      transports: ['polling']
    });

    io.on('connection', (socket) => {
      connectedUsers++;
      io.emit('updateOnlineUsers', connectedUsers);
      socket.emit('updateCounter', globalCount);

      socket.on('increment', () => {
        globalCount++;
        console.log('Incrementando contador:', globalCount);
        io.emit('updateCounter', globalCount);
      });

      socket.on('disconnect', () => {
        connectedUsers--;
        io.emit('updateOnlineUsers', connectedUsers);
      });
    });
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ count: globalCount, users: connectedUsers })
  };
}; 