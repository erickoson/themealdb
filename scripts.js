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
      <button class="btn btn-success agregar-carrito" data-nombre="${comida.strMeal}" data-ingredientes="${[comida.strIngredient1, comida.strIngredient2, comida.strIngredient3].filter(Boolean)}">Agregar al Carrito</button>
    </div>
  `;
  comidasDiv.append(html);
}

// Manejar clic en el botón "Agregar al Carrito"
$('#comidas').on('click', '.agregar-carrito', function() {
  var nombre = $(this).data('nombre');
  var ingredientes = $(this).data('ingredientes').split(','); // Convertir la lista de ingredientes en un array
  agregarAlCarrito(nombre, ingredientes);
});


// Función para agregar una comida al carrito
function agregarAlCarrito(nombre, ingredientes) {
  var carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  var nuevaComida = {
    nombre: nombre,
    ingredientes: ingredientes.filter(Boolean) // Filtrar ingredientes nulos
  };
  carrito.push(nuevaComida);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  alert('Comida agregada al carrito');
}
  
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
            <p>Ingredientes: ${comida.ingredientes ? comida.ingredientes.join(', ') : 'No hay ingredientes'}</p>
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

  // Cargar una comida al cargar la página
  getComidas();

  // Mostrar las comidas agregadas al carrito al cargar la página
  mostrarComidasCarrito();
});