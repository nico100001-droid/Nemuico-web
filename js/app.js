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
            // ------------------------------------------------
            // Imagen
            // ------------------------------------------------

            const imagen =
                document.createElement("img");
            imagen.src =
                juego.imagen;
            imagen.alt =
                juego.nombre;
            imagen.loading =
                "lazy";

            // ------------------------------------------------
            // Nombre
            // ------------------------------------------------
            const nombre =
                document.createElement("span");
            nombre.className =
                "nombre-juego";
            nombre.textContent =
                juego.nombre;
            // ------------------------------------------------
            // Construir tarjeta
            // ------------------------------------------------
            boton.appendChild(imagen);
            boton.appendChild(nombre);
            // ------------------------------------------------
            // Lanzar juego
            // ------------------------------------------------
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

    // --------------------------------------------------------
    // Mostrar pantalla del emulador
    // --------------------------------------------------------

    biblioteca.style.display =
        "none";
    pantallaEmulador.style.display =
        "flex";

    // Mostrar cargando
    cargando.style.display =
        "flex";
    try {

        // ----------------------------------------------------
        // Lanzar Nostalgist
        // ----------------------------------------------------
        //
        // IMPORTANTE:
        //
        // NO pasamos "element".
        //
        // Nostalgist creará automáticamente
        // el canvas correcto.
        //
        // ----------------------------------------------------

        emulador =
            await Nostalgist.Nostalgist.launch({

                core:
                    juego.core,

                rom:
                    juego.rom,

                /*
                 * Mantener activado el cache.
                 *
                 * Esto es especialmente interesante
                 * para la TV: una vez descargado el core,
                 * los siguientes juegos pueden arrancar
                 * más rápidamente.
                 */
                cache: true,

                /*
                 * Configuración de RetroArch.
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


        // ----------------------------------------------------
        // Ocultar cargando
        // ----------------------------------------------------

        cargando.style.display =
            "none";


        // ----------------------------------------------------
        // Ajustar canvas
        // ----------------------------------------------------

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

    /*
     * Nostalgist crea el canvas automáticamente
     * y lo agrega al body.
     *
     * Por eso NO buscamos el canvas dentro de
     * #contenedor-emulador.
     */

    const canvas =
        document.querySelector(
            "#pantalla-emulador canvas"
        );


    if (!canvas) {

        console.warn(
            "No se encontró el canvas de Nostalgist."
        );

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


    // --------------------------------------------------------
    // Cerrar Nostalgist
    // --------------------------------------------------------

    try {

        if (emulador) {

            /*
             * Nostalgist.exit() elimina el canvas
             * automáticamente.
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


    // --------------------------------------------------------
    // Limpiar referencias
    // --------------------------------------------------------

    emulador =
        null;

    juegoActual =
        null;


    // --------------------------------------------------------
    // Limpiar contenedor
    // --------------------------------------------------------

    contenedorEmulador.innerHTML =
        "";


    // --------------------------------------------------------
    // Volver a biblioteca
    // --------------------------------------------------------

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
