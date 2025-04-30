import { categories } from './database.js';
import { tasques } from './database.js';
import { tasquesID, incrementaTasquesID } from './database.js';
import { task } from './task.js';
import { categoria } from './categoria.js';

function cargarLocal() {
    let tareasLocal = localStorage.getItem("tareas");
    if (tareasLocal) {
        JSON.parse(tareasLocal).forEach(tar => {
            tasques.push(new task(tar.id, tar.titol, tar.descripcio, tar.data, tar.categoria, tar.prioritat, tar.realitzada))
            incrementaTasquesID();
        });
        console.log("tareas cargadas");
        console.log(tasques);
    }
}

function crearTarea() {

    let id;

    if (tasquesID < 10) {
        id = "task-00" + tasquesID;
    } else if (tasquesID < 100) {
        id = "task-0" + tasquesID;
    } else {
        id = "task-" + tasquesID;
    }

    let titol = document.getElementById("titol").value.trim();
    let descripcio = document.getElementById("descripcio").value.trim();
    let data = document.getElementById("data").value.trim();
    let prioritat = document.getElementById("prioritat").value.trim();
    let realitzada = false;

    let select = document.getElementById("categoria");
    let color = select.value;
    let nom = select.options[select.selectedIndex].text;

    if (!titol || !descripcio || !data || !prioritat) {
        alert("no puedes dejar campos vacios");
        return;
    }

    //aquesta validacio especifica l'ha fet chatgpt perque no sabia com fer per a validar la data
    let rawDate = document.getElementById("data").value;
    if (!rawDate) {
        alert("La fecha no puede estar vacía.");
        return;
    }
    let dataParts = rawDate.split("-"); // [AAAA, MM, DD]
    data = `${dataParts[2]}-${dataParts[1]}-${dataParts[0]}`; // DD-MM-AAAA

    if (color === "placeholder" || nom === "Categoria") {
        alert("la categoria no es valida");
        return;
    }

    let categoria = { nom: nom, color: color };

    let tascaDuplicada = tasques.some(tar => tar.titol === titol);
    if (tascaDuplicada) {
        alert("dos tareas no se pueden llamar igual");
        return;
    }

    tasques.push(new task(id, titol, descripcio, data, categoria, prioritat, realitzada));
    document.getElementById("titol").value = "";
    document.getElementById("descripcio").value = "";
    document.getElementById("data").value = "";
    document.getElementById("categoria").value = "placeholder";
    document.getElementById("prioritat").value = "";
    localStorage.setItem("tareas", JSON.stringify(tasques));
    incrementaTasquesID();
    console.log("tarea creada");

    cargarTareas();
}

function cargarTareas() {
    document.getElementById("tareasCaja").innerHTML = `<h2>Tareas</h2>`;

    tasques.forEach((element) => {
        let realizadaCaja = element.realitzada ? "<div class='realizada-box verde'></div>" : "<div class='realizada-box roja'></div>";

        document.getElementById("tareasCaja").innerHTML +=
            `
            <div class="tarea-box" id="${element.id}" style="background-color: ${element.categoria.color};">
                <div class="separation">
                    <p class="titulo">${element.titol}</p>
                    <p class="id">${element.id}</p>
                </div>
                <p class="descripcion">${element.descripcio}</p>
                <div class = "separation">
                <p class="fecha">Fecha: ${element.data}</p>
                <p class="categoria">Categoria: ${element.categoria.nom}</p>
                </div>
                <div class="separation">
                    <p class="prioridad">Prioridad: ${element.prioritat}</p>
                    <div class="separation-realizada">
                        <p class="realitzada">Realizada:</p>
                        ${realizadaCaja}
                    </div>
                </div>
                <div class = "separation">
                <button class="boton" onclick="eliminarTarea('${element.id}')">Eliminar</button>
                <button class="boton" onclick="marcarRealizada('${element.id}')">Realizada</button>
                </div>
            </div>
            `;
    });
}



function eliminarTarea(id) {
    const index = tasques.findIndex(tarea => tarea.id === id);
    if (index !== -1) {
        tasques.splice(index, 1); // Elimina la tarea del array sin reasignar
        localStorage.setItem("tareas", JSON.stringify(tasques)); // Actualiza localStorage
        cargarTareas(); // Recarga visual
    }
}

function marcarRealizada(id) {
    const tarea = tasques.find(tasca => tasca.id === id);
    if (tarea) {
        tarea.realitzada = !tarea.realitzada;
        localStorage.setItem("tareas", JSON.stringify(tasques));
        cargarTareas();
    }
}


function cargarCategoriasTareas() {
    let categoriesLocal = localStorage.getItem("categories");
    if (categoriesLocal) {
        JSON.parse(categoriesLocal).forEach(cate => {
            categories.push(new categoria(cate.nom, cate.color))
        });
        console.log("categories carregades");
        console.log(categories);
    }
    categories.forEach((element) => {
        document.getElementById("categoria").innerHTML +=
            `
                <option value="${element.color}">${element.nom}</option>
            `
    });
}

window.crearTarea = crearTarea;
window.eliminarTarea = eliminarTarea;
window.marcarRealizada = marcarRealizada;

document.addEventListener("DOMContentLoaded", () => {
    cargarLocal();
    cargarCategoriasTareas();
    cargarTareas();
});

export {cargarLocal, cargarTareas, eliminarTarea, marcarRealizada}