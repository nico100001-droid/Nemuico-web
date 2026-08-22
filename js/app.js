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

    cargando.style.display =
        "flex";


    try {

        // ----------------------------------------------------
        // Limpiar restos anteriores
        // ----------------------------------------------------

        contenedorEmulador.innerHTML =
            "";


        // ----------------------------------------------------
        // Crear CANVAS NUEVO
        // ----------------------------------------------------

        const canvas =
            document.createElement("canvas");


        canvas.id =
            "canvas-emulador";


        canvas.style.display =
            "block";


        canvas.style.width =
            "100vw";


        canvas.style.height =
            "100vh";


        canvas.style.backgroundColor =
            "black";


        canvas.style.imageRendering =
            "pixelated";


        contenedorEmulador.appendChild(
            canvas
        );


        // ----------------------------------------------------
        // Lanzar Nostalgist
        // ----------------------------------------------------

        emulador =
            await Nostalgist.Nostalgist.launch({

                element:
                    canvas,

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

                }

            });


        console.log(
            "Emulador iniciado correctamente."
        );


        // ----------------------------------------------------
        // Obtener canvas real
        // ----------------------------------------------------

        const canvasReal =
            emulador.getCanvas();


        if (canvasReal) {

            console.log(
                "Canvas:",
                canvasReal
            );

            console.log(
                "Resolución interna:",
                canvasReal.width,
                "x",
                canvasReal.height
            );

        }


        // ----------------------------------------------------
        // Ocultar mensaje de carga
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


        await cerrarEmulador();

    }

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
    // Esperar a que termine la limpieza
    // --------------------------------------------------------

    await new Promise(
        resolve =>
            setTimeout(resolve, 100)
    );


    // --------------------------------------------------------
    // Limpiar referencias
    // --------------------------------------------------------

    emulador =
        null;

    juegoActual =
        null;


    // --------------------------------------------------------
    // Limpiar el contenedor
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
// Tecla ESC en PC
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
// Ajustar tamaño al cambiar ventana
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
