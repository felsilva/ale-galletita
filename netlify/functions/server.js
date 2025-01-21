const { Server } = require('socket.io');

let io;
let globalCount = 0;
let connectedUsers = 0;

exports.handler = async (event, context) => {
  if (!io) {
    io = new Server({
      cors: {
        origin: process.env.NODE_ENV === 'development' 
          ? "*" 
          : ["galletita-ale.netlify.app"]
      }
    });

    io.on('connection', (socket) => {
      connectedUsers++;
      io.emit('updateOnlineUsers', connectedUsers);
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
  }

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      body: JSON.stringify({ count: globalCount, users: connectedUsers })
    };
  }

  return {
    statusCode: 405,
    body: 'Method not allowed'
  };
}; 