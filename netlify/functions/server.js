const { Server } = require('socket.io');

let io;
let globalCount = 0;
let connectedUsers = 0;

exports.handler = async (event, context) => {
  // Prevenir timeout de la función
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    if (!io) {
      console.log('Inicializando Socket.IO server');
      
      io = new Server({
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
          credentials: true
        },
        transports: ['polling'],
        pingTimeout: 10000,
        pingInterval: 5000
      });

      io.on('connection', (socket) => {
        console.log('Nueva conexión:', socket.id);
        
        try {
          connectedUsers++;
          io.emit('updateOnlineUsers', connectedUsers);
          socket.emit('updateCounter', globalCount);

          socket.on('increment', () => {
            globalCount++;
            io.emit('updateCounter', globalCount);
          });

          socket.on('disconnect', () => {
            connectedUsers = Math.max(0, connectedUsers - 1);
            io.emit('updateOnlineUsers', connectedUsers);
          });

        } catch (error) {
          console.error('Error en manejo de socket:', error);
        }
      });
    }

    // Responder a la solicitud HTTP
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'ok',
        count: globalCount,
        users: connectedUsers
      })
    };

  } catch (error) {
    console.error('Error en handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 