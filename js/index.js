import { cargarTareas, eliminarTarea, marcarRealizada } from './crear-tarea.js';
import { tasques, tasquesID, incrementaTasquesID, setTasquesID} from './database.js'

document.addEventListener("DOMContentLoaded", () => {
    cargarTareas();
    generarGrafico();
});

window.eliminarTarea = (id) => {
    eliminarTarea(id);
    generarGrafico();
};

window.marcarRealizada = (id) => {
    marcarRealizada(id);
    generarGrafico();
};

let graficoChartJS;

function generarGrafico() {
    let tareasLocal = localStorage.getItem("tareas");
    if (!tareasLocal) {
        return;
    }

    let tareas = JSON.parse(tareasLocal);
    //li he demanat a la ia una idea per fer el troç (no que el faci)
    let realizadasPorMes = {};
    let now = new Date();
    let year = now.getFullYear();
    let etiquetas = [];
    for (let i = 1; i <= 12; i++) {
        //aquest push li he demanat a la ia com fer-lo
        etiquetas.push(`${year}-${String(i).padStart(2, '0')}`);
    }
    etiquetas.forEach(mes => realizadasPorMes[mes] = 0);

    tareas.forEach(tar => {
        if (tar.realitzada) {
            let fecha = new Date(tar.data);
            if (!isNaN(fecha) && fecha.getFullYear() === year) {
                // aquesta linea també li he demanat a la ia
                let mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
                realizadasPorMes[mes]++;
            }
        }
    });

    let valores = etiquetas.map(mes => realizadasPorMes[mes]);

    let data = {
        labels: etiquetas.map(m => {
            let date = new Date(m + "-01");
            return date.toLocaleString("default", { month: "long" });
        }),
        datasets: [
            {
                label: 'Tareas realizadas por mes',
                data: valores,
                borderColor: '#025A6A',
                backgroundColor: 'white',
                fill: true,
                stepped: true,
                tension: 0.4,
                pointBackgroundColor: '#025A6A',
            }
        ],
    };

    let config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            interaction: {
                intersect: false,
                axis: 'x'
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Tareas realizadas por mes',
                    color: 'black',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: false,
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#393939'
                    },
                    grid: {
                        color: 'rgba(57, 57, 57, 0.314)'
                    }
                },
                y: {
                    ticks: {
                        color: '#393939'
                    },
                    grid: {
                        color: 'rgba(57, 57, 57, 0.314)'
                    },
                    beginAtZero: true
                }
            }
        }
    };

    let canvas = document.getElementById("chartjsGrafico");
    if (canvas) {
        if (graficoChartJS) {
            graficoChartJS.destroy();
        }
        graficoChartJS = new Chart(canvas.getContext("2d"), config);
    }

    function cargarArchivoJSON() {
        let nombreArchivo = document.getElementById("archivoACargar").value;
        
        // Get the list of loaded files from localStorage, or initialize an empty array
        let loadedFiles = JSON.parse(localStorage.getItem("loadedFiles")) || [];
        
        // Check if the file has already been loaded
        if (loadedFiles.includes(nombreArchivo)) {
            console.log(`El archivo ${nombreArchivo} ya ha sido cargado.`);
            return; // Skip loading the file
        }
    
        fetch('dades/' + nombreArchivo)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al cargar el archivo ${nombreArchivo}`);
                }
                return response.json();
            })
            .then(tareas => {
                let maxAttempts = 1000;
                tareas.forEach(tarea => {
                    let attempts = 0;
                    while (tasques.some(t => t.id === tarea.id) && attempts < maxAttempts) {
                        tarea.id = generarNuevoID();
                        attempts++;
                    }
                    if (attempts >= maxAttempts) {
                        console.error("No se pudo generar un ID único para la tarea", tarea);
                        return;
                    }
                    tasques.push(tarea);
                });
    
                // Add the file name to the list of loaded files
                loadedFiles.push(nombreArchivo);
                localStorage.setItem("loadedFiles", JSON.stringify(loadedFiles));
    
                // Update tasks and ID in localStorage
                cargarTareas();
                localStorage.setItem("tareas", JSON.stringify(tasques));
                localStorage.setItem("tasquesID", tasquesID);
                generarGrafico();
            })
            .catch(error => {
                console.error("Error al cargar el archivo:", error);
            });
    }
    
    function generarNuevoID() {
        const nuevoID = `task-${tasquesID.toString().padStart(3, '0')}`;
        incrementaTasquesID(); // This updates tasquesID and localStorage
        return nuevoID;
    }

    window.cargarArchivoJSON = cargarArchivoJSON;
}
