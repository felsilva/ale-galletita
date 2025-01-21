const { Server } = require('socket.io');

let io;
let globalCount = 0;
let connectedUsers = 0;

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  if (!io) {
    io = new Server({
      cors: {
        origin: "*", // Más permisivo para pruebas
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true
      },
      path: '/socket.io',
      transports: ['polling', 'websocket'],
      allowEIO3: true,
      pingTimeout: 10000,
      pingInterval: 5000,
      upgradeTimeout: 30000,
      maxHttpBufferSize: 1e8,
      allowUpgrades: true
    });

    io.on('connection', (socket) => {
      console.log('Nuevo cliente conectado:', socket.id);
      
      connectedUsers++;
      io.emit('updateOnlineUsers', connectedUsers);
      socket.emit('updateCounter', globalCount);

      socket.on('increment', () => {
        globalCount++;
        io.emit('updateCounter', globalCount);
      });

      socket.on('disconnect', (reason) => {
        console.log('Cliente desconectado:', socket.id, 'Razón:', reason);
        connectedUsers--;
        io.emit('updateOnlineUsers', connectedUsers);
      });

      socket.on('error', (error) => {
        console.error('Error en socket:', error);
      });
    });
  }

  // Manejo de CORS para las solicitudes HTTP
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': true,
  };

  // Manejar preflight OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ count: globalCount, users: connectedUsers })
    };
  }

  return {
    statusCode: 405,
    headers,
    body: 'Method not allowed'
  };
}; 