const API = "http://slim-php.test";

let productos = [];
let clienteEditId = null;
let productoEditId = null;

// 🔥 NAVEGACION
$(".nav-btn").click(function () {
  $(".seccion").addClass("d-none");
  $("#" + $(this).data("target")).removeClass("d-none");
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

  if (clienteEditId) {
    $.ajax({
      url: API + "/clientes/" + clienteEditId,
      method: "PUT",
      data: data,
      success: function () {
        listarClientes();
        clienteEditId = null;
      },
    });
  } else {
    $.post(API + "/clientes", data, function () {
      listarClientes();
    });
  }
});

// LISTAR
function listarClientes() {
  $.get(API + "/clientes", function (data) {
    let html = `
      <tr>
        <th>ID</th><th>Nombre</th><th>Email</th><th>DNI</th><th>Acciones</th>
      </tr>
    `;

    data.forEach((c) => {
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

    $("#tablaClientes").html(html);
  });
}

// BOTÓN LISTAR
$("#listarClientes").click(listarClientes);

// EDITAR
function editarCliente(id) {
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
        productoEditId = null;
      },
    });
  } else {
    $.post(API + "/productos", data, function () {
      listarProductos();
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
    let p = data.find((x) => x.id == id);

    productoEditId = p.id;
    $("#p_nombre").val(p.nombre);
    $("#p_precio").val(p.precio);
  });
}

// ================= PEDIDOS =================

// CARGAR SELECTS
function cargarClientes() {
  $.get(API + "/clientes", function (data) {
    let html = "";
    data.forEach((c) => {
      html += `<option value="${c.id}">${c.nombre}</option>`;
    });
    $("#clienteSelect").html(html);
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
  let option = $("#productoSelect option:selected");

  let item = {
    producto_id: option.val(),
    nombre: option.text(),
    precio: option.data("precio"),
    cantidad: $("#cantidad").val(),
  };

  productos.push(item);

  $("#detalle").append(`
    <tr>
      <td>${item.nombre}</td>
      <td>${item.cantidad}</td>
    </tr>
  `);
});

// GUARDAR PEDIDO
$("#guardarPedido").click(function () {
  $.ajax({
    url: API + "/pedido",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      cliente_id: $("#clienteSelect").val(),
      productos: productos,
    }),
    success: function () {
      alert("Pedido guardado");
      productos = [];
      $("#detalle").html("");
    },
  });
});

// LISTAR PEDIDOS
$("#listarPedidos").click(function () {
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
