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
// Elementos
// ------------------------------------------------------------

const biblioteca =
    document.getElementById("biblioteca");

const pantallaEmulador =
    document.getElementById("pantalla-emulador");

const contenedorEmulador =
    document.getElementById("contenedor-emulador");

const canvasEmulador =
    document.getElementById("canvas-emulador");

const botonCerrar =
    document.getElementById("boton-cerrar");

const cargando =
    document.getElementById("cargando");


// ------------------------------------------------------------
// Inicio
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
// Crear lista
// ------------------------------------------------------------

function crearLista(lista, elementoID) {

    const contenedor =
        document.getElementById(elementoID);

    contenedor.innerHTML = "";


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


            // Click
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


    // --------------------------------------------------------
    // Mostrar emulador
    // --------------------------------------------------------

    biblioteca.style.display =
        "none";

    pantallaEmulador.style.display =
        "flex";

    cargando.style.display =
        "flex";


    try {

        // ----------------------------------------------------
        // Limpiar canvas anterior
        // ----------------------------------------------------

        canvasEmulador.width =
            1;

        canvasEmulador.height =
            1;


        // ----------------------------------------------------
        // Lanzar Nostalgist
        // ----------------------------------------------------

        emulador =
            await Nostalgist.Nostalgist.launch({

                // IMPORTANTE:
                // Ahora sí pasamos un CANVAS.
                element:
                    canvasEmulador,

                core:
                    juego.core,

                rom:
                    juego.rom,

                cache:
                    true,

                retroarchConfig: {

                    video_smooth:
                        false,

                    video_aspect_ratio_auto:
                        true,

                    audio_enable:
                        true,

                    input_autodetect_enable:
                        true

                },

                // ------------------------------------------------
                // Configuración visual
                // ------------------------------------------------

                style: {

                    width:
                        "100vw",

                    height:
                        "100vh",

                    backgroundColor:
                        "black",

                    imageRendering:
                        "pixelated"

                }

            });


        console.log(
            "Emulador iniciado correctamente."
        );


        // ----------------------------------------------------
        // Obtener canvas real
        // ----------------------------------------------------

        const canvas =
            emulador.getCanvas();


        console.log(
            "Canvas:",
            canvas
        );


        console.log(
            "Resolución interna:",
            canvas.width,
            "x",
            canvas.height
        );


        // ----------------------------------------------------
        // Ocultar carga
        // ----------------------------------------------------

        cargando.style.display =
            "none";


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
// Cerrar emulador
// ------------------------------------------------------------

async function cerrarEmulador() {

    console.log(
        "Cerrando emulador..."
    );


    try {

        if (emulador) {

            emulador.exit();

        }

    }
    catch (error) {

        console.error(
            "Error cerrando emulador:",
            error
        );

    }


    emulador =
        null;

    juegoActual =
        null;


    // Limpiar canvas
    canvasEmulador.width =
        1;

    canvasEmulador.height =
        1;


    // Volver biblioteca
    pantallaEmulador.style.display =
        "none";

    biblioteca.style.display =
        "block";

    cargando.style.display =
        "none";

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
// ESC
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
// Resize
// ------------------------------------------------------------

window.addEventListener(
    "resize",
    () => {

        if (!emulador) {

            return;

        }


        const canvas =
            emulador.getCanvas();


        if (!canvas) {

            return;

        }


        canvas.style.width =
            "100vw";

        canvas.style.height =
            "100vh";

    }
);
