document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente cargado y parseado.");

    const counterElement = document.getElementById('counter-suma');
    const onlineUsersElement = document.getElementById('online-users');
    const kissButton = document.getElementById('kissButton');
    
    let count = 0;
    let users = 0;

    // Función para actualizar el contador
    async function updateCounter() {
        try {
            const response = await fetch('/.netlify/functions/server');
            const data = await response.json();
            
            if (data.count !== undefined) {
                count = data.count;
                users = data.users;
                counterElement.textContent = count;
                onlineUsersElement.textContent = `Usuarios conectados: ${users}`;
            }
        } catch (error) {
            console.error('Error al actualizar:', error);
        }
    }

    // Función para incrementar el contador
    async function increment() {
        try {
            const response = await fetch('/.netlify/functions/server', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'increment' })
            });
            
            const data = await response.json();
            if (data.count !== undefined) {
                count = data.count;
                counterElement.textContent = count;
            }
        } catch (error) {
            console.error('Error al incrementar:', error);
        }
    }

    // Actualizar cada segundo
    setInterval(updateCounter, 1000);

    // Actualizar inmediatamente al cargar
    updateCounter();

    // Manejar clics del botón
    kissButton.addEventListener('click', () => {
        increment();
        // Efecto visual del botón
        kissButton.classList.add('clicked');
        setTimeout(() => {
            kissButton.classList.remove('clicked');
        }, 200);
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
