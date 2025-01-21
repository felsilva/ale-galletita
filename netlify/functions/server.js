const { Server } = require('socket.io');

let io;
let globalCount = 0;
let connectedUsers = 0;

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  if (!io) {
    io = new Server({
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['polling', 'websocket'],
      allowEIO3: true,
      pingTimeout: 10000,
      pingInterval: 5000
    });

    io.on('connection', (socket) => {
      console.log('Cliente conectado:', socket.id);
      
      connectedUsers++;
      io.emit('updateOnlineUsers', connectedUsers);
      socket.emit('updateCounter', globalCount);

      socket.on('increment', () => {
        globalCount++;
        io.emit('updateCounter', globalCount);
      });

      socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
        connectedUsers--;
        io.emit('updateOnlineUsers', connectedUsers);
      });
    });
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ count: globalCount, users: connectedUsers })
    };
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
}; 