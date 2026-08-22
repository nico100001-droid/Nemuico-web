// ============================================================
// NEMUICO
// app.js
// ============================================================


// ------------------------------------------------------------
// Variables
// ------------------------------------------------------------

let emulador = null;

let juegoActual = null;


// ------------------------------------------------------------
// Elementos HTML
// ------------------------------------------------------------

const biblioteca =
    document.getElementById("biblioteca");

const pantallaEmulador =
    document.getElementById("pantalla-emulador");

const contenedorEmulador =
    document.getElementById("contenedor-emulador");

const botonCerrar =
    document.getElementById("boton-cerrar");

const cargando =
    document.getElementById("cargando");


// ------------------------------------------------------------
// Iniciar aplicación
// ------------------------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    () => {

        crearBiblioteca();

    }
);


// ------------------------------------------------------------
// Crear biblioteca
// ------------------------------------------------------------

function crearBiblioteca() {

    crearLista(
        juegos.nes,
        "lista-nes"
    );

    crearLista(
        juegos.snes,
        "lista-snes"
    );

    crearLista(
        juegos.sega,
        "lista-sega"
    );

}


// ------------------------------------------------------------
// Crear lista de juegos
// ------------------------------------------------------------

function crearLista(lista, elementoID) {

    const contenedor =
        document.getElementById(elementoID);


    // Limpiar
    contenedor.innerHTML = "";


    // Recorrer juegos
    lista.forEach(
        (juego) => {

            const boton =
                document.createElement("button");


            boton.className =
                "juego";


            boton.type =
                "button";


            boton.title =
                juego.nombre;


            // Imagen
            const imagen =
                document.createElement("img");


            imagen.src =
                juego.imagen;


            imagen.alt =
                juego.nombre;


            imagen.loading =
                "lazy";


            // Nombre
            const nombre =
                document.createElement("span");


            nombre.className =
                "nombre-juego";


            nombre.textContent =
                juego.nombre;


            // Construir tarjeta
            boton.appendChild(imagen);

            boton.appendChild(nombre);


            // Click / OK del control
            boton.addEventListener(
                "click",
                () => {

                    iniciarJuego(juego);

                }
            );


            contenedor.appendChild(boton);

        }
    );

}


// ------------------------------------------------------------
// Iniciar juego
// ------------------------------------------------------------

async function iniciarJuego(juego) {

    // Evitar doble lanzamiento
    if (emulador) {

        return;

    }


    juegoActual =
        juego;


    console.log(
        "Iniciando:",
        juego.nombre
    );

    console.log(
        "Core:",
        juego.core
    );

    console.log(
        "ROM:",
        juego.rom
    );


    // Mostrar pantalla emulador
    biblioteca.style.display =
        "none";

    pantallaEmulador.style.display =
        "flex";


    // Mostrar cargando
    cargando.style.display =
        "flex";


    try {

        // Lanzar Nostalgist
        emulador =
            await Nostalgist.Nostalgist.launch({

                core:
                    juego.core,

                rom:
                    juego.rom,

                /*
                 * Usamos el contenedor para que
                 * Nostalgist cree el canvas.
                 */
                element:
                    contenedorEmulador,

                /*
                 * Configuración básica.
                 *
                 * No vamos a forzar resolución
                 * todavía porque queremos mantener
                 * el comportamiento que comprobamos
                 * que funciona en Firefox TV.
                 */
                retroarchConfig: {

                    video_smooth: false,

                    video_aspect_ratio_auto: true,

                    audio_enable: true,

                    input_autodetect_enable: true

                }

            });


        console.log(
            "Emulador iniciado correctamente."
        );


        // Ocultar carga
        cargando.style.display =
            "none";


        /*
         * Asegurarnos de que el canvas
         * ocupe la pantalla.
         */
        ajustarCanvas();


    }
    catch (error) {

        console.error(
            "Error iniciando emulador:",
            error
        );


        alert(
            "No se pudo iniciar el juego.\n\n" +
            error
        );


        cerrarEmulador();

    }

}


// ------------------------------------------------------------
// Ajustar canvas
// ------------------------------------------------------------

function ajustarCanvas() {

    const canvas =
        contenedorEmulador.querySelector("canvas");


    if (!canvas) {

        return;

    }


    canvas.style.width =
        "100vw";


    canvas.style.height =
        "100vh";


    canvas.style.maxWidth =
        "100vw";


    canvas.style.maxHeight =
        "100vh";


    canvas.style.objectFit =
        "contain";


    canvas.style.imageRendering =
        "pixelated";

}


// ------------------------------------------------------------
// Cerrar emulador
// ------------------------------------------------------------

async function cerrarEmulador() {

    console.log(
        "Cerrando emulador..."
    );


    // Ocultar pantalla
    pantallaEmulador.style.display =
        "none";


    // Mostrar biblioteca
    biblioteca.style.display =
        "block";


    // Ocultar cargando
    cargando.style.display =
        "none";


    try {

        if (emulador) {

            /*
             * Nostalgist dispone de exit()
             * para detener RetroArch y eliminar
             * el canvas.
             */
            emulador.exit();

        }

    }
    catch (error) {

        console.error(
            "Error cerrando emulador:",
            error
        );

    }


    // Limpiar
    emulador =
        null;


    juegoActual =
        null;


    contenedorEmulador.innerHTML =
        "";

}


// ------------------------------------------------------------
// Botón X
// ------------------------------------------------------------

botonCerrar.addEventListener(
    "click",
    () => {

        cerrarEmulador();

    }
);


// ------------------------------------------------------------
// ESC en PC
// ------------------------------------------------------------

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            emulador
        ) {

            cerrarEmulador();

        }

    }
);


// ------------------------------------------------------------
// Reajustar pantalla
// ------------------------------------------------------------

window.addEventListener(
    "resize",
    () => {

        if (emulador) {

            ajustarCanvas();

        }

    }
);
