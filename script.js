document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente cargado y parseado.");

    // Conexión directa a la función de Netlify
    const socket = io('/.netlify/functions/server', {
        transports: ['polling'],
        reconnectionAttempts: 3,
        timeout: 10000
    });

    socket.on('connect', () => {
        console.log('Conectado al servidor');
    });

    socket.on('connect_error', (error) => {
        console.error('Error de conexión:', error);
    });

    const counterElement = document.getElementById('counter-suma');
    const onlineUsersElement = document.getElementById('online-users');
    const kissButton = document.getElementById('kissButton');

    socket.on('updateCounter', (count) => {
        counterElement.textContent = count;
    });

    socket.on('updateOnlineUsers', (users) => {
        onlineUsersElement.textContent = `Usuarios conectados: ${users}`;
    });

    kissButton.addEventListener('click', () => {
        socket.emit('increment');
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
});
