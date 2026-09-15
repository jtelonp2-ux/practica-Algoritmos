// =============================================
// HOJACLARA
// Primera versión de la hoja de cálculo
// =============================================


// =============================================
// CONFIGURACIÓN
// =============================================

const NUMERO_FILAS = 30;
const NUMERO_COLUMNAS = 15;


// =============================================
// ELEMENTOS DEL HTML
// =============================================

const encabezados = document.getElementById("encabezados");
const cuerpoHoja = document.getElementById("cuerpoHoja");

const barraFormula = document.getElementById("barraFormula");

const celdaSeleccionadaTexto =
    document.getElementById("celdaSeleccionada");

const botonAceptar =
    document.getElementById("btnAceptar");

const botonNuevo =
    document.getElementById("btnNuevo");

const botonLimpiar =
    document.getElementById("btnLimpiar");

const estado =
    document.getElementById("estado");


// =============================================
// ESTADO DE LA APLICACIÓN
// =============================================

// Aquí se guardará la información de cada celda.
//
// Ejemplo:
//
// datos["A1"] = "100";
// datos["B1"] = "200";

const datos = {};


// Celda actualmente seleccionada

let celdaActual = null;


// =============================================
// CONVERTIR NÚMERO A LETRA DE COLUMNA
// =============================================

function obtenerNombreColumna(numero) {

    let nombre = "";

    while (numero > 0) {

        const residuo = (numero - 1) % 26;

        nombre =
            String.fromCharCode(65 + residuo) + nombre;

        numero =
            Math.floor((numero - 1) / 26);
    }

    return nombre;
}


// =============================================
// GENERAR ENCABEZADOS
// =============================================

function generarEncabezados() {

    encabezados.innerHTML = "";

    const fila = document.createElement("tr");


    // Esquina superior izquierda

    const esquina = document.createElement("th");

    esquina.textContent = "";

    fila.appendChild(esquina);


    // Columnas

    for (
        let columna = 1;
        columna <= NUMERO_COLUMNAS;
        columna++
    ) {

        const th = document.createElement("th");

        th.textContent =
            obtenerNombreColumna(columna);

        th.dataset.columna = columna;

        fila.appendChild(th);
    }


    encabezados.appendChild(fila);
}


// =============================================
// GENERAR CUADRÍCULA
// =============================================

function generarCuadricula() {

    cuerpoHoja.innerHTML = "";


    // Recorrer filas

    for (
        let fila = 1;
        fila <= NUMERO_FILAS;
        fila++
    ) {

        const nuevaFila =
            document.createElement("tr");


        // Número de fila

        const numeroFila =
            document.createElement("th");

        numeroFila.textContent = fila;

        numeroFila.dataset.fila = fila;

        nuevaFila.appendChild(numeroFila);


        // Recorrer columnas

        for (
            let columna = 1;
            columna <= NUMERO_COLUMNAS;
            columna++
        ) {

            const celda =
                document.createElement("td");


            // Crear nombre de celda

            const nombreColumna =
                obtenerNombreColumna(columna);

            const nombreCelda =
                nombreColumna + fila;


            // Guardar identificación

            celda.dataset.celda =
                nombreCelda;


            // Mostrar contenido existente

            if (datos[nombreCelda] !== undefined) {

                celda.textContent =
                    datos[nombreCelda];
            }


            // Evento de clic

            celda.addEventListener(
                "click",
                seleccionarCelda
            );


            // Doble clic para editar

            celda.addEventListener(
                "dblclick",
                comenzarEdicion
            );


            nuevaFila.appendChild(celda);
        }


        cuerpoHoja.appendChild(nuevaFila);
    }
}


// =============================================
// SELECCIONAR CELDA
// =============================================

function seleccionarCelda(evento) {

    const celda = evento.currentTarget;


    // Quitar selección anterior

    document
        .querySelectorAll(".seleccionada")
        .forEach(elemento => {

            elemento.classList.remove(
                "seleccionada"
            );
        });


    // Seleccionar nueva celda

    celda.classList.add("seleccionada");


    // Guardar celda actual

    celdaActual = celda;


    // Obtener nombre

    const nombre =
        celda.dataset.celda;


    // Mostrar nombre

    celdaSeleccionadaTexto.textContent =
        nombre;


    // Mostrar contenido en barra de fórmula

    if (datos[nombre] !== undefined) {

        barraFormula.value =
            datos[nombre];

    } else {

        barraFormula.value = "";
    }


    // Actualizar estado

    estado.textContent =
        `Celda ${nombre} seleccionada`;
}


// =============================================
// EDITAR CELDA
// =============================================

function comenzarEdicion(evento) {

    const celda = evento.currentTarget;

    const nombre =
        celda.dataset.celda;


    // Evitar crear dos editores

    if (
        celda.querySelector(".editor-celda")
    ) {
        return;
    }


    // Obtener valor

    const valorActual =
        datos[nombre] !== undefined
            ? datos[nombre]
            : "";


    // Crear input

    const input =
        document.createElement("input");

    input.type = "text";

    input.className =
        "editor-celda";

    input.value =
        valorActual;


    // Limpiar celda

    celda.innerHTML = "";

    celda.classList.add("editando");


    // Agregar input

    celda.appendChild(input);


    // Enfocar

    input.focus();

    input.select();


    // Guardar con Enter

    input.addEventListener(
        "keydown",
        function(eventoTeclado) {

            if (
                eventoTeclado.key === "Enter"
            ) {

                guardarEdicion(
                    celda,
                    input.value
                );
            }


            if (
                eventoTeclado.key === "Escape"
            ) {

                cancelarEdicion(
                    celda
                );
            }
        }
    );


    // Guardar al perder foco

    input.addEventListener(
        "blur",
        function() {

            guardarEdicion(
                celda,
                input.value
            );
        }
    );
}


// =============================================
// GUARDAR EDICIÓN
// =============================================

function guardarEdicion(celda, valor) {

    const nombre =
        celda.dataset.celda;


    // Guardar el valor

    datos[nombre] =
        valor;


    // Mostrar valor

    celda.textContent =
        valor;


    // Quitar modo edición

    celda.classList.remove(
        "editando"
    );


    // Mantener selección

    celda.classList.add(
        "seleccionada"
    );


    // Actualizar barra de fórmula

    barraFormula.value =
        valor;


    // Actualizar estado

    estado.textContent =
        `Valor guardado en ${nombre}`;
}


// =============================================
// CANCELAR EDICIÓN
// =============================================

function cancelarEdicion(celda) {

    const nombre =
        celda.dataset.celda;


    if (datos[nombre] !== undefined) {

        celda.textContent =
            datos[nombre];

    } else {

        celda.textContent = "";
    }


    celda.classList.remove(
        "editando"
    );
}


// =============================================
// GUARDAR DESDE LA BARRA DE FÓRMULA
// =============================================

function guardarDesdeFormula() {

    if (!celdaActual) {

        return;
    }


    const nombre =
        celdaActual.dataset.celda;


    const valor =
        barraFormula.value;


    datos[nombre] =
        valor;


    celdaActual.textContent =
        valor;


    estado.textContent =
        `Valor guardado en ${nombre}`;
}


// =============================================
// BOTÓN ACEPTAR
// =============================================

botonAceptar.addEventListener(
    "click",
    guardarDesdeFormula
);


// =============================================
// ENTER EN LA BARRA DE FÓRMULA
// =============================================

barraFormula.addEventListener(
    "keydown",
    function(evento) {

        if (evento.key === "Enter") {

            guardarDesdeFormula();
        }
    }
);


// =============================================
// LIMPIAR TODA LA HOJA
// =============================================

botonLimpiar.addEventListener(
    "click",
    function() {

        const confirmar =
            confirm(
                "¿Deseas limpiar toda la hoja?"
            );


        if (!confirmar) {
            return;
        }


        // Eliminar datos

        for (const clave in datos) {

            delete datos[clave];
        }


        // Regenerar

        generarCuadricula();


        // Limpiar barra

        barraFormula.value = "";


        celdaSeleccionadaTexto.textContent =
            "A1";


        celdaActual = null;


        estado.textContent =
            "Hoja limpiada";
    }
);


// =============================================
// NUEVA HOJA
// =============================================

botonNuevo.addEventListener(
    "click",
    function() {

        const confirmar =
            confirm(
                "¿Crear una nueva hoja?"
            );


        if (!confirmar) {
            return;
        }


        for (const clave in datos) {

            delete datos[clave];
        }


        generarCuadricula();


        barraFormula.value = "";


        celdaSeleccionadaTexto.textContent =
            "A1";


        celdaActual = null;


        estado.textContent =
            "Nueva hoja creada";
    }
);


// =============================================
// INICIAR APLICACIÓN
// =============================================

generarEncabezados();

generarCuadricula();


// =============================================
// SELECCIONAR A1 AL INICIAR
// =============================================

const primeraCelda =
    document.querySelector(
        'td[data-celda="A1"]'
    );


if (primeraCelda) {

    primeraCelda.click();
}