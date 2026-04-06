<?php
require_once __DIR__ . '/../config/db.php';

class Pedido
{

    public static function crearPedido($cliente_id, $total)
    {
        $db = Database::connect();

        $stmt = $db->prepare("CALL sp_pedido_insertar(?,?)");
        $stmt->execute([$cliente_id, $total]);

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['pedido_id'];
    }

    public static function insertDetalle($pedido_id, $producto)
    {
        $db = Database::connect();

        $stmt = $db->prepare("CALL sp_detalle_insertar(?,?,?,?)");
        return $stmt->execute([
            $pedido_id,
            $producto['producto_id'],
            $producto['cantidad'],
            $producto['precio']
        ]);
    }

    public static function listar()
    {
        $db = Database::connect();
        $stmt = $db->prepare("CALL sp_pedido_listar()");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function detalle($pedido_id)
    {
        $db = Database::connect();
        $stmt = $db->prepare("CALL sp_pedido_detalle(?)");
        $stmt->execute([$pedido_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}