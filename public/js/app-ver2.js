const API = "http://slim-php.test";

/* ========================
   ESTADO GLOBAL
======================== */
let state = {
  clienteEditId: null,
  productoEditId: null,
  productosPedido: [],
};

/* ========================
   UTILIDADES
======================== */
function getClienteForm() {
  return {
    nombre: $("#c_nombre").val(),
    email: $("#c_email").val(),
    dni: $("#c_dni").val(),
    sexo: $("#c_sexo").val(),
  };
}

function limpiarCliente() {
  $("#c_nombre").val("");
  $("#c_email").val("");
  $("#c_dni").val("");
  $("#c_sexo").val("");
  state.clienteEditId = null;
}

function validarCliente(data) {
  if (!data.nombre) return "Nombre obligatorio";
  if (!data.email) return "Email obligatorio";
  if (data.dni.length !== 8) return "DNI debe tener 8 dígitos";
  if (!data.sexo) return "Selecciona sexo";
  return null;
}

/* ========================
   NAVEGACIÓN
======================== */
$(document).on("click", ".nav-btn", function () {
  $(".seccion").addClass("d-none");
  $("#" + $(this).data("target")).removeClass("d-none");
});

/* ========================
   CLIENTES
======================== */

// GUARDAR / EDITAR
$("#guardarCliente").click(function () {
  let data = getClienteForm();

  let error = validarCliente(data);
  if (error) return alert(error);

  if (state.clienteEditId) {
    editarCliente(state.clienteEditId, data);
  } else {
    crearCliente(data);
  }
});

function crearCliente(data) {
  $.post(API + "/clientes", data, function () {
    listarClientes();
    limpiarCliente();
  });
}

function editarCliente(id, data) {
  $.ajax({
    url: API + "/clientes/" + id,
    method: "PUT",
    data: data,
    success: function () {
      listarClientes();
      limpiarCliente();
    },
  });
}

function eliminarCliente(id) {
  if (!confirm("¿Eliminar cliente?")) return;

  $.ajax({
    url: API + "/clientes/" + id,
    method: "DELETE",
    success: listarClientes,
  });
}

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
            <button class="editar-cliente" data-id="${c.id}">Editar</button>
            <button onclick="eliminarCliente(${c.id})">Eliminar</button>
          </td>
        </tr>
      `;
    });

    $("#tablaClientes").html(html);
  });
}

// EDITAR CLIENTE
$(document).on("click", ".editar-cliente", function () {
  let id = $(this).data("id");

  $.get(API + "/clientes", function (data) {
    let c = data.find((x) => x.id == id);

    state.clienteEditId = c.id;

    $("#c_nombre").val(c.nombre);
    $("#c_email").val(c.email);
    $("#c_dni").val(c.dni);
    $("#c_sexo").val(c.sexo);
  });
});

/* ========================
   PRODUCTOS
======================== */

$("#guardarProducto").click(function () {
  let data = {
    nombre: $("#p_nombre").val(),
    precio: $("#p_precio").val(),
  };

  if (state.productoEditId) {
    editarProducto(state.productoEditId, data);
  } else {
    crearProducto(data);
  }
});

function crearProducto(data) {
  $.post(API + "/productos", data, function () {
    listarProductos();
  });
}

function editarProducto(id, data) {
  $.ajax({
    url: API + "/productos/" + id,
    method: "PUT",
    data: data,
    success: function () {
      listarProductos();
      state.productoEditId = null;
    },
  });
}

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
            <button class="editar-producto" data-id="${p.id}">Editar</button>
          </td>
        </tr>
      `;
    });

    $("#tablaProductos").html(html);
  });
}

// EDITAR PRODUCTO
$(document).on("click", ".editar-producto", function () {
  let id = $(this).data("id");

  $.get(API + "/productos", function (data) {
    let p = data.find((x) => x.id == id);

    state.productoEditId = p.id;

    $("#p_nombre").val(p.nombre);
    $("#p_precio").val(p.precio);
  });
});

/* ========================
   PEDIDOS
======================== */

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

// AGREGAR PRODUCTO AL PEDIDO
$("#agregar").click(function () {
  let option = $("#productoSelect option:selected");

  let item = {
    producto_id: option.val(),
    nombre: option.text(),
    precio: option.data("precio"),
    cantidad: $("#cantidad").val(),
  };

  state.productosPedido.push(item);

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
      productos: state.productosPedido,
    }),
    success: function () {
      alert("Pedido guardado");

      state.productosPedido = [];
      $("#detalle").html("");
    },
  });
});

// LISTAR PEDIDOS
$("#listarPedidos").click(function () {
  listarPedidos();
});

function listarPedidos() {
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
}

// DETALLE
function verDetalle(id) {
  $.get(API + "/pedido/" + id, function (data) {
    console.log(data);
    alert("Ver consola");
  });
}

/* ========================
   INICIO
======================== */

$(document).ready(function () {
  cargarClientes();
  cargarProductos();
});

$(document).ready(function () {
  $(document).on("click", "#listarClientes", listarClientes);
  $(document).on("click", "#listarProductos", listarProductos);
  $(document).on("click", "#listarPedidos", listarPedidos);

});
