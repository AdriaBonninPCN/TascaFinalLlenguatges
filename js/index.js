import {cargarTareas, eliminarTarea, marcarRealizada} from './crear-tarea.js'

document.addEventListener("DOMContentLoaded", () => {
    cargarTareas();
});

window.eliminarTarea = eliminarTarea;
window.marcarRealizada = marcarRealizada;