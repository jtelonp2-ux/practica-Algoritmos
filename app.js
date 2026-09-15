const NUMERO_FILAS = 30;
const NUMERO_COLUMNAS = 15;

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



const datos = {};

let celdaActual = null;

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


function generarEncabezados() {

    encabezados.innerHTML = "";

    const fila = document.createElement("tr");



    const esquina = document.createElement("th");

    esquina.textContent = "";

    fila.appendChild(esquina);

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

function generarCuadricula() {

    cuerpoHoja.innerHTML = "";



    for (
        let fila = 1;
        fila <= NUMERO_FILAS;
        fila++
    ) {

        const nuevaFila =
            document.createElement("tr");


        const numeroFila =
            document.createElement("th");

        numeroFila.textContent = fila;

        numeroFila.dataset.fila = fila;

        nuevaFila.appendChild(numeroFila);


        for (
            let columna = 1;
            columna <= NUMERO_COLUMNAS;
            columna++
        ) {

            const celda =
                document.createElement("td");


            const nombreColumna =
                obtenerNombreColumna(columna);

            const nombreCelda =
                nombreColumna + fila;


            celda.dataset.celda =
                nombreCelda;


            if (datos[nombreCelda] !== undefined) {

                celda.textContent =
                    datos[nombreCelda];
            }



            celda.addEventListener(
                "click",
                seleccionarCelda
            );


            celda.addEventListener(
                "dblclick",
                comenzarEdicion
            );


            nuevaFila.appendChild(celda);
        }


        cuerpoHoja.appendChild(nuevaFila);
    }
}


function seleccionarCelda(evento) {

    const celda = evento.currentTarget;


    document
        .querySelectorAll(".seleccionada")
        .forEach(elemento => {

            elemento.classList.remove(
                "seleccionada"
            );
        });


    celda.classList.add("seleccionada");


    celdaActual = celda;



    const nombre =
        celda.dataset.celda;



    celdaSeleccionadaTexto.textContent =
        nombre;


    if (datos[nombre] !== undefined) {

        barraFormula.value =
            datos[nombre];

    } else {

        barraFormula.value = "";
    }


    estado.textContent =
        `Celda ${nombre} seleccionada`;
}


function comenzarEdicion(evento) {

    const celda = evento.currentTarget;

    const nombre =
        celda.dataset.celda;


    if (
        celda.querySelector(".editor-celda")
    ) {
        return;
    }


    const valorActual =
        datos[nombre] !== undefined
            ? datos[nombre]
            : "";



    const input =
        document.createElement("input");

    input.type = "text";

    input.className =
        "editor-celda";

    input.value =
        valorActual;




    celda.innerHTML = "";

    celda.classList.add("editando");


    celda.appendChild(input);


    input.focus();

    input.select();


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


function guardarEdicion(celda, valor) {

    const nombre =
        celda.dataset.celda;

    datos[nombre] =
        valor;

    celda.textContent =
        valor;



    celda.classList.remove(
        "editando"
    );


    celda.classList.add(
        "seleccionada"
    );


    barraFormula.value =
        valor;



    estado.textContent =
        `Valor guardado en ${nombre}`;
}


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

botonAceptar.addEventListener(
    "click",
    guardarDesdeFormula
);


barraFormula.addEventListener(
    "keydown",
    function(evento) {

        if (evento.key === "Enter") {

            guardarDesdeFormula();
        }
    }
);


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



        for (const clave in datos) {

            delete datos[clave];
        }


        generarCuadricula();



        barraFormula.value = "";


        celdaSeleccionadaTexto.textContent =
            "A1";


        celdaActual = null;


        estado.textContent =
            "Hoja limpiada";
    }
);



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


generarEncabezados();

generarCuadricula();


const primeraCelda =
    document.querySelector(
        'td[data-celda="A1"]'
    );


if (primeraCelda) {

    primeraCelda.click();
}
