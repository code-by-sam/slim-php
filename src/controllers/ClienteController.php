<?php
require_once __DIR__ . '/../models/Cliente.php';

class ClienteController
{

    public function listar($req, $res)
    {
        return $res->withJson(Cliente::listar());
    }

    public function insertar($req, $res)
    {
        $data = $req->getParsedBody();

        // VALIDACIONES 🔥
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return $res->withJson(["error" => "Email inválido"]);
        }

        if (!preg_match('/^[0-9]{8}$/', $data['dni'])) {
            return $res->withJson(["error" => "DNI inválido"]);
        }

        // 🔥 VALIDAR DUPLICADOS
        if (Cliente::existeEmail($data['email'])) {
            return $res->withJson(["error" => "El email ya existe"]);
        }

        if (Cliente::existeDni($data['dni'])) {
            return $res->withJson(["error" => "El DNI ya existe"]);
        }

        Cliente::insertar($data);
        return $res->withJson(["msg" => "Cliente creado"]);
    }

    public function actualizar($req, $res, $args)
    {
        Cliente::actualizar($args['id'], $req->getParsedBody());
        return $res->withJson(["msg" => "Actualizado"]);
    }

    public function eliminar($req, $res, $args)
    {
        Cliente::eliminar($args['id']);
        return $res->withJson(["msg" => "Eliminado (estado=0)"]);
    }
}