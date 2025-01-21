const { Server } = require('socket.io');

let io;
let globalCount = 0;
let connectedUsers = 0;

exports.handler = async (event, context) => {
  if (!io) {
    io = new Server({
      cors: {
        origin: process.env.NODE_ENV === 'development' 
          ? "http://localhost:8888" 
          : ["https://galletita-ale.netlify.app"],
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["my-custom-header"]
      },
      path: '/socket.io',
      transports: ['websocket'],
      allowEIO3: true,
      cookie: {
        name: "io",
        path: "/",
        httpOnly: true,
        sameSite: "strict"
      }
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

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' 
          ? 'http://localhost:8888' 
          : 'https://galletita-ale.netlify.app',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ count: globalCount, users: connectedUsers })
    };
  }

  return {
    statusCode: 405,
    body: 'Method not allowed'
  };
}; 