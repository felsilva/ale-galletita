let globalCount = 0;
let connectedUsers = 0;
let lastAccessTime = {};

// Limpia usuarios inactivos cada minuto
setInterval(() => {
    const now = Date.now();
    for (const [id, time] of Object.entries(lastAccessTime)) {
        if (now - time > 5000) { // 5 segundos de inactividad
            delete lastAccessTime[id];
            if (connectedUsers > 0) connectedUsers--;
        }
    }
}, 60000);

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    try {
        // Manejar preflight OPTIONS
        if (event.httpMethod === 'OPTIONS') {
            return { statusCode: 204, headers };
        }

        const clientId = event.headers['client-id'] || event.headers['x-forwarded-for'] || 'anonymous';
        const now = Date.now();

        // Actualizar tiempo de último acceso
        if (!lastAccessTime[clientId]) {
            connectedUsers++;
        }
        lastAccessTime[clientId] = now;

        // Manejar POST para incremento
        if (event.httpMethod === 'POST') {
            try {
                const body = JSON.parse(event.body);
                if (body && body.action === 'increment') {
                    globalCount++;
                    console.log('Contador incrementado a:', globalCount);
                }
            } catch (error) {
                console.error('Error al procesar POST:', error);
            }
        }

        // Responder con el estado actual
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                count: globalCount,
                users: connectedUsers,
                timestamp: now
            })
        };

    } catch (error) {
        console.error('Error en el handler:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message 
            })
        };
    }
}; 