// scripts.js
const API_URL = 'https://www.themealdb.com/api/json/v1/1/';

async function getComidas() {
  const response = await fetch(API_URL + 'random.php');
  const data = await response.json();
  return data.meals[0];
}

// scripts.js

function agregarAlCarrito(ingredientes) {
  // Obtener el nombre de la comida
  const nombreComida = document.getElementById('comidas').querySelector('h2').textContent;
  
  // Obtener el carrito del localStorage o inicializar un arreglo vacío si no existe
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
  // Agregar la comida actual al carrito
  carrito.push({ nombre: nombreComida, ingredientes: ingredientes });
  
  // Guardar el carrito actualizado en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));

  // Actualizar la lista de compras en la página
  const listaCompras = document.getElementById('lista-compras');
  const item = document.createElement('li');
  item.textContent = ingredientes.join(', ');
  listaCompras.appendChild(item);
}


async function cargarComidas() {
  const comidasDiv = document.getElementById('comidas');
  const comida = await getComidas();
  const boton = document.createElement('button');
  boton.textContent = 'Agregar al Carrito';
  boton.onclick = () => agregarAlCarrito(Object.values(comida).filter(val => val && typeof val === 'string'));
  comidasDiv.innerHTML = `<h2>${comida.strMeal}</h2>
                         <img src="${comida.strMealThumb}" alt="${comida.strMeal}">
                         <p>Ingredientes: ${Object.values(comida).filter(val => val && typeof val === 'string').join(', ')}</p>`;
  comidasDiv.appendChild(boton);
}

function exportar() {
  const listaCompras = document.getElementById('lista-compras').innerText;
  // Aquí puedes implementar la lógica para exportar la lista de compras
  console.log(listaCompras);
}

$(document).ready(function() {
  // Función para mostrar las comidas agregadas al carrito
  function mostrarComidasCarrito() {
    // Obtener las comidas del localStorage
    var carrito = JSON.parse(localStorage.getItem('carrito'));
    var listaCarritoDiv = $('#lista-carrito');

    // Verificar si hay comidas en el carrito
    if (carrito && carrito.length > 0) {
      // Recorrer todas las comidas en el carrito y mostrarlas en la página
      carrito.forEach(function(comida) {
        var html = `
          <div class="col-sm-4">
            <h2>${comida.nombre}</h2>
            <p>Ingredientes: ${comida.ingredientes.join(', ')}</p>
          </div>
        `;
        listaCarritoDiv.append(html);
      });
    } else {
      // Si no hay comidas en el carrito, mostrar un mensaje indicando que está vacío
      listaCarritoDiv.html('<p>El carrito está vacío</p>');
    }
  }

  // Manejar el evento del botón "Borrar Carrito"
  $('#borrar-carrito').click(function() {
    // Limpiar el localStorage
    localStorage.removeItem('carrito');

    // Mostrar un mensaje indicando que el carrito ha sido borrado
    alert('El carrito ha sido borrado');

    // Actualizar la página para reflejar los cambios
    location.reload();
  });

  // Manejar el evento del botón "Exportar Recetas"
  $('#exportar-recetas').click(function() {
    // Obtener las comidas del localStorage
    var carrito = JSON.parse(localStorage.getItem('carrito'));

    // Verificar si hay comidas en el carrito
    if (carrito && carrito.length > 0) {
      // Crear el contenido del archivo de texto
      var contenido = 'Recetas del Carrito:\n\n';
      carrito.forEach(function(comida) {
        contenido += 'Nombre: ' + comida.nombre + '\n';
        contenido += 'Ingredientes: ' + comida.ingredientes.join(', ') + '\n\n';
      });

      // Crear un enlace para descargar el archivo de texto
      var enlace = document.createElement('a');
      enlace.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(contenido);
      enlace.download = 'recetas.txt';
      enlace.style.display = 'none';
      document.body.appendChild(enlace);

      // Simular clic en el enlace para iniciar la descarga
      enlace.click();

      // Limpiar el enlace después de la descarga
      document.body.removeChild(enlace);
    } else {
      // Si no hay comidas en el carrito, mostrar un mensaje indicando que está vacío
      alert('El carrito está vacío');
    }
  });

  // Mostrar las comidas agregadas al carrito al cargar la página
  mostrarComidasCarrito();

   // Función para cargar imágenes en el carrusel desde la API
   function cargarImagenesCarrusel() {
    $.ajax({
      url: 'https://www.themealdb.com/api/json/v1/1/random.php',
      method: 'GET',
      success: function(response) {
        var carruselInner = $('.carousel-inner');
        carruselInner.empty();

        response.meals.forEach(function(comida, index) {
          var activeClass = index === 0 ? 'active' : '';
          var html = `
            <div class="item ${activeClass}">
              <img src="${comida.strMealThumb}" alt="${comida.strMeal}">
              <div class="carousel-caption">
                <h3>${comida.strMeal}</h3>
              </div>
            </div>
          `;
          carruselInner.append(html);
        });

        // Iniciar el carrusel después de agregar todas las imágenes
        $('.carousel').carousel();
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  // Cargar imágenes en el carrusel al cargar la página
  cargarImagenesCarrusel();
});


document.addEventListener('DOMContentLoaded', cargarComidas);