const formulario = document.getElementById("formulario");
const lista = document.getElementById("listaTareas");
const contador = document.getElementById("contadorPendientes");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
let editando = null;

mostrarTareas();

formulario.addEventListener("submit", function(event){
    event.preventDefault();

    let valido = true;

    const titulo = document.getElementById("titulo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const fecha = document.getElementById("fecha").value;
    const prioridad = document.getElementById("prioridad").value;

    const errorTitulo = document.getElementById("errorTitulo");
    const errorDescripcion = document.getElementById("errorDescripcion");
    const errorFecha = document.getElementById("errorFecha");
    const errorPrioridad = document.getElementById("errorPrioridad");

    const mensaje = document.getElementById("mensajeExito");

    if (titulo === "") {
        errorTitulo.textContent = "El título es obligatorio.";
        valido = false;
    } else {
        errorTitulo.textContent = "";
    }

    if (descripcion === "") {
        errorDescripcion.textContent = "La descripción es obligatoria.";
        valido = false;
    } else {
        errorDescripcion.textContent = "";
    }

    if (fecha === "") {
        errorFecha.textContent = "La fecha es obligatoria.";
        valido = false;
    } else {
        const hoy = new Date().toISOString().split("T")[0];
        if (fecha < hoy) {
            errorFecha.textContent = "Fecha inválida.";
            valido = false;
        } else {
            errorFecha.textContent = "";
        }
    }

    if (prioridad === "") {
        errorPrioridad.textContent = "Selecciona una prioridad.";
        valido = false;
    } else {
        errorPrioridad.textContent = "";
    }

    if (valido) {

        if (editando !== null) {
            for (let i = 0; i < tareas.length; i++) {
                if (tareas[i].id === editando) {
                    tareas[i].titulo = titulo;
                    tareas[i].descripcion = descripcion;
                    tareas[i].fecha = fecha;
                    tareas[i].prioridad = prioridad;
                }
            }
            editando = null;
        } else {
            let nueva = {
                id: Date.now(),
                titulo: titulo,
                descripcion: descripcion,
                fecha: fecha,
                prioridad: prioridad,
                completado: false
            };
            tareas.push(nueva);
        }

        localStorage.setItem("tareas", JSON.stringify(tareas));

        mostrarTareas();
        formulario.reset();

        mensaje.textContent = "Guardado correctamente";
    } else {
        mensaje.textContent = "";
    }
});

function mostrarTareas(){
    lista.innerHTML = "";

    for (let i = 0; i < tareas.length; i++) {

        let li = document.createElement("li");

        if (tareas[i].completado) {
            li.classList.add("completada");
        }

        li.classList.add(tareas[i].prioridad);

        li.innerHTML = `
            <strong>${tareas[i].titulo}</strong> - ${tareas[i].fecha} (${tareas[i].prioridad})<br>
            ${tareas[i].descripcion}<br><br>

            <button onclick="completar(${tareas[i].id})">Completada</button>
            <button onclick="editar(${tareas[i].id})">Editar tarea</button>
            <button onclick="eliminar(${tareas[i].id})">Borrar tarea</button>
        `;

        lista.appendChild(li);
    }

    let pendientes = 0;

    for (let i = 0; i < tareas.length; i++) {
        if (!tareas[i].completado) {
            pendientes++;
        }
    }

    contador.textContent = "Tareas pendientes: " + pendientes;
}

function completar(id){
    for (let i = 0; i < tareas.length; i++) {
        if (tareas[i].id === id) {
            tareas[i].completado = !tareas[i].completado;
        }
    }

    localStorage.setItem("tareas", JSON.stringify(tareas));
    mostrarTareas();
}

function eliminar(id){
    if (confirm("¿Eliminar tarea?")) {
        let nuevas = [];

        for (let i = 0; i < tareas.length; i++) {
            if (tareas[i].id !== id) {
                nuevas.push(tareas[i]);
            }
        }

        tareas = nuevas;

        localStorage.setItem("tareas", JSON.stringify(tareas));
        mostrarTareas();
    }
}

function editar(id){
    if (!confirm("¿Editar tarea?")) return;

    for (let i = 0; i < tareas.length; i++) {
        if (tareas[i].id === id) {
            document.getElementById("titulo").value = tareas[i].titulo;
            document.getElementById("descripcion").value = tareas[i].descripcion;
            document.getElementById("fecha").value = tareas[i].fecha;
            document.getElementById("prioridad").value = tareas[i].prioridad;

            editando = id;
        }
    }
}