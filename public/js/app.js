const API = "http://slim-php.test"; //variable global

let productos = []; //para guardar los productos del detalle
let clienteEditId = null; //indicar si se esta editando un cliente
let productoEditId = null; // indicar si se esta editando un producto
let clientes = [];
//LIMPIAR CAMPOS
function limpiarCliente() {
  //funcionar para limpiar el formulario de clientes
  $("#c_nombre").val(""); //limpiar los inputs
  $("#c_email").val("");
  $("#c_dni").val("");
  $("#c_sexo").val("");
  clienteEditId = null;
}

function limpiarProducto() {
  $("#p_nombre").val("");
  $("#p_precio").val("");
  productoEditId = null;
}

function limpiarPedido() {
  productos = [];
  $("#detalle").html("");
}
//  NAVEGACION
$(".nav-btn").click(function () {
  //cuando hago click en el boton menu
  $(".seccion").addClass("d-none"); //agrega la clase d-none a los .seccion para ocultarla
  $("#" + $(this).data("target")).removeClass("d-none"); //la seccion del click actual no tendra el d-none
});

// ================= CLIENTES =================

// GUARDAR / EDITAR
$("#guardarCliente").click(function () {
  let data = {
    nombre: $("#c_nombre").val(),
    email: $("#c_email").val(),
    dni: $("#c_dni").val(),
    sexo: $("#c_sexo").val(),
  };

  // VALIDACIONES BÁSICAS
  if (data.nombre === "") return alert("El nombre es obligatorio");
  if (data.email === "") return alert("El email es obligatorio");
  if (data.dni.length !== 8) return alert("El DNI debe tener 8 dígitos");
  if (data.sexo === "") return alert("Selecciona el sexo");

  // 🔥 VALIDACIÓN DE DUPLICADOS
  let dniExiste = clientes.find(
    (c) => c.dni === data.dni && c.id != clienteEditId,
  );
  let emailExiste = clientes.find(
    (c) => c.email === data.email && c.id != clienteEditId,
  );
  if (dniExiste) return alert("El DNI ya está registrado");
  if (emailExiste) return alert("El email ya está registrado");

  // 🔥 EDITAR
  if (clienteEditId) {
    $.ajax({
      url: API + "/clientes/" + clienteEditId,
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function () {
        listarClientes();
        cargarClientes();
        limpiarCliente();
        clienteEditId = null;
      },
    });
  } else {
    // 🔥 CREAR
    $.ajax({
      url: API + "/clientes",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function () {
        listarClientes();
        cargarClientes();
        limpiarCliente();
      },
    });
  }
});

// LISTAR
function listarClientes() {
  //funcion de listar clientes
  $.get(API + "/clientes", function (data) {
    //function(data) es el callback que se ejecuta cuando esta todo bien
    //Declaro la variable html que tiene el contenido que se va a añadir
    let html = `
      <tr>
        <th>ID</th><th>Nombre</th><th>Email</th><th>DNI</th><th>Acciones</th>
      </tr>
    `;

    data.forEach((c) => {
      //una iteracion para añadir a la variable html contenido(datos de la tabla)
      // (c) proviene de cliente
      html += `
        <tr>
          <td>${c.id}</td>
          <td>${c.nombre}</td>
          <td>${c.email}</td>
          <td>${c.dni}</td>
          <td>
            <button onclick="editarCliente(${c.id})">Editar</button>
            <button onclick="eliminarCliente(${c.id})">Eliminar</button>
          </td>
        </tr>
      `;
    });

    $("#tablaClientes").html(html); //se añade a la tabla todo lo establecido arriba
  });
}

// BOTÓN LISTAR
$("#listarClientes").click(listarClientes); //cuando doy click al boton listar, llama a la funcion listarClientes

// EDITAR
function editarCliente(id) {
  //creo la funcion editarCliente con el parametro id
  $.get(API + "/clientes", function (data) {
    let c = data.find((x) => x.id == id);

    clienteEditId = c.id;
    $("#c_nombre").val(c.nombre);
    $("#c_email").val(c.email);
    $("#c_dni").val(c.dni);
    $("#c_sexo").val(c.sexo);
  });
}

// ELIMINAR
function eliminarCliente(id) {
  if (!confirm("¿Eliminar cliente?")) return;

  $.ajax({
    url: API + "/clientes/" + id,
    method: "DELETE",
    success: function () {
      listarClientes();
    },
  });
}

// ================= PRODUCTOS =================

// GUARDAR / EDITAR
$("#guardarProducto").click(function () {
  let data = {
    nombre: $("#p_nombre").val(),
    precio: $("#p_precio").val(),
  };

  if (productoEditId) {
    $.ajax({
      url: API + "/productos/" + productoEditId,
      method: "PUT",
      data: data,
      success: function () {
        listarProductos();
        cargarProductos();
        limpiarProducto();
        productoEditId = null;
      },
    });
  } else {
    $.ajax({
      url: API + "/productos",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function () {
        listarProductos();
        cargarProductos();
        limpiarProducto();
      },
    });
  }
});

// LISTAR
function listarProductos() {
  $.get(API + "/productos", function (data) {
    let html = `
      <tr>
        <th>ID</th><th>Nombre</th><th>Precio</th><th>Acciones</th>
      </tr>
    `;

    data.forEach((p) => {
      html += `
        <tr>
          <td>${p.id}</td>
          <td>${p.nombre}</td>
          <td>${p.precio}</td>
          <td>
            <button onclick="editarProducto(${p.id})">Editar</button>
          </td>
        </tr>
      `;
    });

    $("#tablaProductos").html(html);
  });
}

// BOTÓN LISTAR
$("#listarProductos").click(listarProductos);

// EDITAR
function editarProducto(id) {
  $.get(API + "/productos", function (data) {
    let p = data.find((x) => x.id == id); // datafind busca dentro del array, x cada elemento del array
    //luego compara el id seleccionado con el del array de la bd

    productoEditId = p.id; //guardo el id del producto para luego saber si esta en modo editar
    $("#p_nombre").val(p.nombre); //llena el input con los datos traidos de la bd (nombre, precio)
    $("#p_precio").val(p.precio);
  });
}

// ================= PEDIDOS =================

// CARGAR SELECTS
function cargarClientes() {
  //funcion para cargar los clientes en el select
  $.get(API + "/clientes", function (data) {
    //obtiene los clientes
    clientes = data; //  guardas todos los clientes en una variable

    let html = ""; //variable para construir html dinamicamente
    data.forEach((c) => {
      html += `<option value="${c.id}">${c.nombre}</option>`; //trae los datos de clientes al select
    });
    $("#clienteSelect").html(html); //añade al select todo el html creado arriba
  });
}

function cargarProductos() {
  $.get(API + "/productos", function (data) {
    let html = "";
    data.forEach((p) => {
      html += `<option value="${p.id}" data-precio="${p.precio}">${p.nombre}</option>`;
    });
    $("#productoSelect").html(html);
  });
}

// AGREGAR DETALLE
$("#agregar").click(function () {
  //cuando hago click en el elemento con id: agregar (el btn)
  let option = $("#productoSelect option:selected"); //guardar opcion seleccionada dentro del select

  let item = {
    //crear un objeto producto
    producto_id: option.val(), //el valor id del option
    nombre: option.text(), //obtiene el texto del option
    precio: option.data("precio"), //obtiene el valor data-precio del option
    cantidad: $("#cantidad").val(), //obtiene valor del input cantidad
  };

  productos.push(item); //agrega todo lo de item a un array de productos

  $("#detalle").append(` 
    <tr>
      <td>${item.nombre}</td>
      <td>${item.cantidad}</td>
    </tr>
  `); //agrega la fila (tr) y las celdas dentro (td)
});

// GUARDAR PEDIDO
$("#guardarPedido").click(function () {
  //evento click en el boton guardar pedido
  $.ajax({
    url: API + "/pedido",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      //convertir string a json
      cliente_id: $("#clienteSelect").val(), //asignar id del select a una variable
      productos: productos, //enviar array de productos
    }),
    success: function () {
      alert("Pedido guardado");
      productos = []; //limpia el array
      $("#detalle").html(""); //limpia la tabla
      limpiarPedido();
    },
  });
});

// LISTAR PEDIDOS
$("#listarPedidos").click(function () {
  //accion para el boton listar pedidos
  $.get(API + "/pedido", function (data) {
    let html = `
      <tr>
        <th>ID</th><th>Cliente</th><th>Total</th><th>Acciones</th>
      </tr>
    `;

    data.forEach((p) => {
      html += `
        <tr>
          <td>${p.id}</td>
          <td>${p.cliente}</td>
          <td>${p.total}</td>
          <td>
            <button onclick="verDetalle(${p.id})">Detalle</button>
          </td>
        </tr>
      `;
    });

    $("#tablaPedidos").html(html);
  });
});

// DETALLE
function verDetalle(id) {
  $.get(API + "/pedido/" + id, function (data) {
    console.log(data);
    alert("Revisar consola");
  });
}

cargarClientes();
cargarProductos();
