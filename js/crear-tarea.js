import { categories, incrementaTasquesID } from './database.js';
import { tasques } from './database.js';
import { tasquesID } from './database.js';
import { task } from './task.js';

let tareasLocal = localStorage.getItem("tareas");
if(tareasLocal){
    JSON.parse(tareasLocal).forEach(tar => {
        tasques.push(new task(tar.id, tar.titol, tar.descripcio, tar.data, tar.categoria, tar.prioritat, tar.realitzada))
        incrementaTasquesID();
    });
    console.log("tareas cargadas");
    console.log(tasques);
}

function crearTarea(){
    let id = tasquesID;
    let titol = document.getElementById("titol").value;
    let descripcio = document.getElementById("descripcio").value;
    let data = document.getElementById("data").value;
    let categoria = document.getElementById("categoria").value;
    let prioritat = document.getElementById("prioritat").value;
    let realitzada = false;

    let tascaDuplicada = false;

    tasques.forEach(tar => {
        if (tar.tiol == titol){
            tascaDuplicada = true;
            console.log("categoria duplicada");
        }
    });

    if(!tascaDuplicada){
        tasques.push(new task(id, titol, descripcio, data, categoria, prioritat, realitzada));
        document.getElementById("titol").value = "";
        document.getElementById("descripcio").value = "";
        document.getElementById("data").value = "";
        document.getElementById("categoria").value = "";
        document.getElementById("prioritat").value = "";
        incrementaTasquesID();
        console.log("tarea creada");
    }
    else {
        console.error("error al crear la tarea");
        alert("revisa los datos introducidos, no puede haber 2 tareas con el mismo nombre");
    }

    //cargarTareas();
}

window.crearTarea = crearTarea;

console.log("helo")