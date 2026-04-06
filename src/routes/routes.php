<?php

require_once __DIR__ . '/../controllers/ClienteController.php';
require_once __DIR__ . '/../controllers/ProductoController.php';
require_once __DIR__ . '/../controllers/PedidoController.php';

// CLIENTE

$app->get('/test', function ($req, $res) {
    return $res->withJson(["ok" => true]);
});

$app->get('/clientes', 'ClienteController:listar');

$app->post('/clientes', 'ClienteController:insertar');
$app->put('/clientes/{id}', 'ClienteController:actualizar');
$app->delete('/clientes/{id}', 'ClienteController:eliminar');

// PRODUCTO
$app->get('/productos', 'ProductoController:listar');
$app->post('/productos', 'ProductoController:insertar');
$app->put('/productos/{id}', 'ProductoController:actualizar');

// PEDIDO
$app->post('/pedido', 'PedidoController:insertar');
$app->get('/pedido', 'PedidoController:listar');
$app->get('/pedido/{id}', 'PedidoController:detalle');