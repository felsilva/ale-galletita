document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente cargado y parseado.");

    // Configuración del socket
    const socketUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:8888/.netlify/functions/server' 
        : 'https://galletita-ale.netlify.app/.netlify/functions/server';

    const socket = io(socketUrl, {
        transports: ['websocket'],
        path: '/socket.io',
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnection: true
    });

    // Inicializar partículas
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 30,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ["#ff6b6b", "#ff8e8e", "#ff4757"]
            },
            shape: {
                type: "char",
                character: "❤"
            },
            opacity: {
                value: 0.8,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.4,
                    sync: false
                }
            },
            size: {
                value: 12,
                random: true,
                anim: {
                    enable: true,
                    speed: 4,
                    size_min: 6,
                    sync: false
                }
            },
            line_linked: {
                enable: false
            },
            move: {
                enable: true,
                speed: 3,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "bubble"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                bubble: {
                    distance: 150,
                    size: 15,
                    duration: 2,
                    opacity: 0.8,
                    speed: 3
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });

    const kissButton = document.getElementById("kissButton");
    const counterSuma = document.getElementById("counter-suma");
    const onlineUsers = document.getElementById("online-users");

    // Obtener el contador del localStorage
    let localCount = parseInt(localStorage.getItem('contador')) || 0;

    // Actualizar contador inicial con el valor local
    counterSuma.textContent = localCount;

    // Manejo de errores de conexión
    socket.on('connect_error', (error) => {
        console.error('Error de conexión:', error);
    });

    socket.on('connect', () => {
        console.log('Conectado al servidor');
        // Emitir el contador local al conectarse
        socket.emit('syncCount', localCount);
    });

    socket.on('updateCounter', (newCount) => {
        // Actualizar solo si el nuevo contador es mayor
        if (newCount > localCount) {
            localCount = newCount;
            counterSuma.textContent = localCount;
            localStorage.setItem('contador', localCount);
            
            // Añadir animación al actualizar
            counterSuma.classList.add('pulse');
            setTimeout(() => counterSuma.classList.remove('pulse'), 500);
        }
    });

    socket.on('updateOnlineUsers', (count) => {
        onlineUsers.textContent = `Usuarios conectados: ${count}`;
    });

    // Evento del botón
    kissButton.addEventListener("click", () => {
        // Incrementar contador local
        localCount++;
        counterSuma.textContent = localCount;
        localStorage.setItem('contador', localCount);

        // Intentar sincronizar con otros usuarios
        try {
            socket.emit('increment', localCount);
        } catch (error) {
            console.log('Error al sincronizar, continuando en modo local');
        }
        
        // Efecto de explosión de partículas
        for(let i = 0; i < 4; i++) {
            setTimeout(() => {
                pJSDom[0].pJS.particles.move.speed = 8;
                pJSDom[0].pJS.fn.particles.push();
                setTimeout(() => {
                    pJSDom[0].pJS.particles.move.speed = 3;
                }, 200);
            }, i * 50);
        }
    });
});
