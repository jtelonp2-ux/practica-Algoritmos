const NUMERO_FILAS = 30;
const NUMERO_COLUMNAS = 15;

//Elementos de la pagina 

const encabezados = document.getElementById("encabezados");
const cuerpoHoja = document.getElementById("cuerpoHoja");
const barraFormula = document.getElementById("barraFormula");
const celdaSeleccionadaTexto = document.getElementById("celdaSeleccionada");
const botonAceptar = document.getElementById("btnAceptar");
const botonNuevo = document.getElementById("btnNuevo");
const botonLimpiar = document.getElementById("btnLimpiar");
const estado = document.getElementById("estado");




const datos = {};

let celdaActual = null;

let editorActual = null;



function obtenerNombreColumna(numero) {
    let nombre = "";

    while (numero > 0) {

        const residuo = (numero - 1) % 26;

        nombre = String.fromCharCode(65 + residuo) + nombre;

        numero = Math.floor((numero - 1) / 26);
    }

    return nombre;
}


function convertirValor(valor) {
    const texto = valor.trim();

    if (texto === "") { 
        return "";
    }


//comprobamos 
const numero = Number(texto);

if (!Number.isNaN(numero)) {
    return numero;
}

return valor;
}



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

        th.textContent = obtenerNombreColumna(columna);

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

        const nuevaFila = document.createElement("tr");

        // Número de fila

        const numeroFila = document.createElement("th");

        numeroFila.textContent = fila;

        numeroFila.dataset.fila = fila;

        nuevaFila.appendChild(numeroFila);


        for (
            let columna = 1;
            columna <= NUMERO_COLUMNAS;
            columna++
        ) {

            const celda = document.createElement("td");
            const nombreColumna = obtenerNombreColumna(columna);
            const nombreCelda = nombreColumna + fila;

            celda.dataset.celda = nombreCelda;

            if (datos[nombreCelda] !== undefined) {

                celda.textContent =
                    datos[nombreCelda];
            }

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



function seleccionarCelda(evento) {

    const celda = evento.currentTarget;
    seleccionarElementos(celda);
}

function seleccionarElementos(celda) {


    document
        .querySelectorAll(".seleccionada")
        .forEach(elemento => {

            elemento.classList.remove(
                "seleccionada"
            );
        });



    celda.classList.add("seleccionada");


    celdaActual = celda;


    const nombre = celda.dataset.celda;


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
    iniciarEdicion(celda);
}

function iniciarEdicion(celda, valorInicial = null)
{

    if (editorActual) {
        return;
    } 

    const nombre = celda.dataset.celda;

    const valorActual =
        datos[nombre] !== undefined
            ? datos[nombre]
            : "";

    const valor = valorInicial !== null
        ? valorInicial
        : valorActual;


    const input =
        document.createElement("input");

    input.type = "text";

    input.className =
        "editor-celda";

    input.value = valor;


    celda.innerHTML = "";

    celda.classList.add("editando");

    celda.appendChild(input);

    editorActual = input;

    input.focus();
    input.setSelectionRange(
        input.value.length,
        input.value.length
    );

    let finalizado =false; 
    

    function finalizarEdicion(cancelar = false) {

        if (finalizado) {
            return;
        }

        finalizado = true;

        if (cancelar) {

            celda.textContent = valorAnterior;

        } else {
            guardarEdicion(celda, input.value);
        } 

        celda.classList.remove("editando");

        editorActual = null;
    }



    input.addEventListener(
        "keydown",
        function(evento) {

            if (
                evento.key === "Enter" ) {
                evento.preventDefault();
                finalizarEdicion(false);
            }


            if ( evento.key === "Escape" ) {
                evento.preventDefault();
               finalizarEdicion(true);
            }
        }
    );



    input.addEventListener(
        "blur",
        function() {

            finalizarEdicion(false);
        }
    );
}


function guardarEdicion(celda, valorEscrito) {

    const nombre =
        celda.dataset.celda;
         
    const valor = convertirValor(valorEscrito); 
    
    if (valor === "") {
        delete datos[nombre];
        celda.textContent = ""; 
        barraFormula.value = "";
    }else {



    datos[nombre] = valor;

    celda.textContent = valor;

    barraFormula.value = valor;
    }


    celda.classList.add(
        "seleccionada"
    );

    celdaActual = celda; 

    estado.textContent =
        `Dato guardado en ${nombre}`;
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


document.addEventListener(
    "keydown",
    function(evento) {

        if (!celdaActual) {
            return;
        }

        if (editorActual) {
            return;
        }

        if ( evento.ctrlKey ||
             evento.altKey ||
             evento.metaKey ) {
            return;
        }

        if (evento.key.length === 1) {
            evento.preventDefault();
            iniciarEdicion(celdaActual, evento.key);
        } 
    }
);

document.addEventListener(
    "keydown",
    function(evento) {
        if (!celdaActual || editorActual) { 
            return;
        }

        if (evento.key === "Delete" ||
            evento.key === "Backspace") {

            evento.preventDefault();
            const nombre = celdaActual.dataset.celda;

            delete datos[nombre];

            celdaActual.textContent = "";
            barraFormula.value = "";

            estado.textContent =
                `Dato eliminado de ${nombre}`;
        }
    }
);


function guardarDesdeFormula() {

    if (!celdaActual) {

        return;
    }


    const nombre =
        celdaActual.dataset.celda;


    const valor = convertirValor(barraFormula.value);
    if (valor === "") {

        delete datos[nombre];
        celdaActual.textContent = ""; 
    
    } else {


    datos[nombre] = valor;


    celdaActual.textContent = valor;
    }


    estado.textContent =
        `Dato guardado en ${nombre}`;
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