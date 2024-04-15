$(document).ready(function() {
  // Función para obtener y mostrar las comidas desde la API
  function getComidas() {
    $.ajax({
      url: 'https://www.themealdb.com/api/json/v1/1/random.php',
      method: 'GET',
      success: function(response) {
        mostrarComida(response.meals[0]);
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  // Función para mostrar una comida en la página
  function mostrarComida(comida) {
    var comidasDiv = $('#comidas');
    var html = `
      <div class="col-sm-4">
        <h2>${comida.strMeal}</h2>
        <img src="${comida.strMealThumb}" class="img-responsive" style="width:100%" alt="Comida">
        <p>${comida.strInstructions}</p>
        <button onclick="agregarAlCarrito('${comida.strMeal}', '${comida.strIngredient1}', '${comida.strIngredient2}', '${comida.strIngredient3}')" class="btn btn-success">Agregar al Carrito</button>
      </div>
    `;
    comidasDiv.append(html);
  }

  // Función para agregar una comida al carrito
  function agregarAlCarrito(nombre, ingrediente1, ingrediente2, ingrediente3) {
    var carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    var nuevaComida = {
      nombre: nombre,
      ingredientes: [ingrediente1, ingrediente2, ingrediente3].filter(Boolean) // Filtrar ingredientes nulos
    };
    carrito.push(nuevaComida);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert('Comida agregada al carrito');
  }

  // Cargar una comida al cargar la página
  getComidas();
});

// scripts.js

$(document).ready(function() {
  // Función para mostrar las comidas agregadas al carrito
  function mostrarComidasCarrito() {
    var carrito = JSON.parse(localStorage.getItem('carrito'));
    var listaCarritoDiv = $('#lista-carrito');

    // Verificar si hay comidas en el carrito
    if (carrito && carrito.length > 0) {
      // Limpiar el contenido anterior del carrito
      listaCarritoDiv.empty();

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

  // Mostrar las comidas agregadas al carrito al cargar la página
  mostrarComidasCarrito();
});
