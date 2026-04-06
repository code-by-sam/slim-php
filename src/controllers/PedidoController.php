<?php
require_once __DIR__ . '/../models/Pedido.php';

class PedidoController
{

    public function insertar($req, $res)
    {
        $data = $req->getParsedBody();

        $cliente_id = $data['cliente_id'];
        $productos = $data['productos'];

        $total = 0;

        foreach ($productos as $p) {
            $total += $p['cantidad'] * $p['precio'];
        }

        $pedido_id = Pedido::crearPedido($cliente_id, $total);

        foreach ($productos as $p) {
            Pedido::insertDetalle($pedido_id, $p);
        }

        return $res->withJson(["msg" => "Pedido creado"]);
    }

    public function listar($req, $res)
    {
        return $res->withJson(Pedido::listar());
    }

    public function detalle($req, $res, $args)
    {
        return $res->withJson(Pedido::detalle($args['id']));
    }
}