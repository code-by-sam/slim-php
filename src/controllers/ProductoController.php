<?php
require_once __DIR__ . '/../models/Producto.php';

class ProductoController
{

    public function listar($req, $res)
    {
        return $res->withJson(Producto::listar());
    }

    public function insertar($req, $res)
    {
        $data = $req->getParsedBody();

        if ($data['precio'] <= 0) {
            return $res->withJson(["error" => "Precio inválido"]);
        }

        Producto::insertar($data);
        return $res->withJson(["msg" => "Producto creado"]);
    }

    public function actualizar($req, $res, $args)
    {
        Producto::actualizar($args['id'], $req->getParsedBody());
        return $res->withJson(["msg" => "Producto actualizado"]);
    }
}