<?php
require_once __DIR__ . '/../config/db.php';

class Producto
{

    public static function listar()
    {
        $db = Database::connect();
        $stmt = $db->prepare("CALL sp_producto_listar()");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function insertar($data)
    {
        $db = Database::connect();
        $stmt = $db->prepare("CALL sp_producto_insertar(?,?)");
        return $stmt->execute([
            $data['nombre'],
            $data['precio']
        ]);
    }

    public static function actualizar($id, $data)
    {
        $db = Database::connect();
        $stmt = $db->prepare("CALL sp_producto_actualizar(?,?,?)");
        return $stmt->execute([
            $id,
            $data['nombre'],
            $data['precio']
        ]);
    }
}