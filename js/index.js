import { cargarTareas, eliminarTarea, marcarRealizada } from './crear-tarea.js';
import { tasques } from './database.js'

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

    function cargarArchivoJSON(nombreArchivo) {
        fetch('dades/' + nombreArchivo)
            .then(response => response.json())
            .then(tareas => {
                tareas.forEach(tarea => {
                    let tareaExiste = false;

                    if (tasques.some(t => t.id == tarea.id)) {
                        tareaExiste = true;
                    }

                    if (!tareaExiste) {
                        tasques.push(tarea);
                    }
                });
                cargarTareas();
            })
            .catch(error => {
                console.error(error);
            });
    }


    window.cargarArchivoJSON = cargarArchivoJSON;
}
