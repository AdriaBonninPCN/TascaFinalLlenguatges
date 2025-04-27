import { categories } from './database.js';
import {categoria} from './categoria.js';

function crearCategoria(){
    let nom = document.getElementById("nom").value;
    let color = document.getElementById("color").value;

    if((nom != null || nom != "") && (color != null || color != "")){
        categories.push(new categoria(nom, color));
        console.log(categories);
        document.getElementById("nom").value = "";
        document.getElementById("color").value = "";
        console.log(categories)
    }
    else{
        console.log("error")
    }
}

window.crearCategoria = crearCategoria;