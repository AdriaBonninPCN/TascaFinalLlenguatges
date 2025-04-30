import { categories } from './database.js';
import { tasques } from './database.js';
import { tasquesID, incrementaTasquesID } from './database.js';
import { task } from './task.js';
import {categoria} from './categoria.js';

let tareasLocal = localStorage.getItem("tareas");
if (tareasLocal) {
    JSON.parse(tareasLocal).forEach(tar => {
        tasques.push(new task(tar.id, tar.titol, tar.descripcio, tar.data, tar.categoria, tar.prioritat, tar.realitzada))
        incrementaTasquesID();
    });
    console.log("tareas cargadas");
    console.log(tasques);
}

function crearTarea() {
    let id = tasquesID;
    let titol = document.getElementById("titol").value;
    let descripcio = document.getElementById("descripcio").value;
    let data = document.getElementById("data").value;
    let categoria = document.getElementById("categoria").value;
    let prioritat = document.getElementById("prioritat").value;
    let realitzada = false;

    let tascaDuplicada = false;

    tasques.forEach(tar => {
        if (tar.tiol == titol) {
            tascaDuplicada = true;
            console.log("tarea duplicada");
        }
    });

    if (!tascaDuplicada) {
        tasques.push(new task(id, titol, descripcio, data, categoria, prioritat, realitzada));
        document.getElementById("titol").value = "";
        document.getElementById("descripcio").value = "";
        document.getElementById("data").value = "";
        document.getElementById("categoria").value = "";
        document.getElementById("prioritat").value = "";
        localStorage.setItem("tareas", JSON.stringify(tasques));
        incrementaTasquesID();
        console.log("tarea creada");
    }
    else {
        console.error("error al crear la tarea");
        alert("revisa los datos introducidos, no puede haber 2 tareas con el mismo nombre");
    }

    cargarTareas();
}

function cargarTareas() {
    document.getElementById("tareasCaja").innerHTML =
        `
        <h2>Tareas</h2>
        `
    tasques.forEach((element, index) => {
        document.getElementById("tareasCaja").innerHTML +=
            `
            <div class="tarea-box">
                <p class = "titulo">${element.titol}</p>
                <p class = "descripcion">${element.descripcio}</p>
                <p class = "fecha">${element.data}</p>
                <p class = "categoria">${element.categoria}</p>
                <p class = "prioridad">${element.prioritat}</p>
                <p class = "realitzada">${element.realitzada}</p>
            </div>
            `
    });

    categories.forEach((element, index) => {
        document.getElementById(index).style.backgroundColor = element.color;
    });
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

console.log("helo")

cargarTareas();

cargarCategoriasTareas();