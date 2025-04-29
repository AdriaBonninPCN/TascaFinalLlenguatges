import { categories } from './database.js';
import { categoria } from './categoria.js';

let categoriesLocal = localStorage.getItem("categories");
if (categoriesLocal) {
    JSON.parse(categoriesLocal).forEach(cate => {
        categories.push(new categoria(cate.nom, cate.color))
    });
    console.log("categories carregades")
    console.log(categories)
}

function crearCategoria() {
    let nom = document.getElementById("nom").value;
    let color = document.querySelector('input[name="color"]:checked').value;

    let categoriaDuplicada = false;

    //no se van a poder añadir 2 categorias con el mismo nombre :)
    categories.forEach(cate => {
        if (cate.nom == nom) {
            categoriaDuplicada = true;
            console.log("categoria duplicada")
        }
    })

    if (!categoriaDuplicada) {
        if ((nom != null && nom != "") && (color != null && color != "")) {
            categories.push(new categoria(nom, color));
            document.getElementById("nom").value = "";
            document.getElementsByName("color").value = "";
            localStorage.setItem('categories', JSON.stringify(categories));
            console.log(categories);
        }
        else {
            console.log("error al crear categoria");
            alert("revisa el nombre y el color");
        }
    }
    else {
        alert("no puede haber 2 categorias con el mismo nombre");
    }

    cargarCategorias();
}

function eliminarCategoria(index){
    categories.splice(index, 1);
    localStorage.setItem('categories', JSON.stringify(categories));
    cargarCategorias();
    console.log("categoria eliminada");
}

function cargarCategorias() {
    document.getElementById("categoriasCaja").innerHTML =
        `
        <h2>Categorias</h2>
        `
    categories.forEach((element, index) => {
        document.getElementById("categoriasCaja").innerHTML +=
            `
            <div class="categoria-box ${element.color}">
            <p class = "nombre">${element.nom}</p>
            <button class = "boton eliminar" onclick="eliminarCategoria(${index})">Eliminar</button>
            </div>
            `
    });
}

window.crearCategoria = crearCategoria;
window.eliminarCategoria = eliminarCategoria;

document.addEventListener("DOMContentLoaded", cargarCategorias);