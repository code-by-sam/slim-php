<?php
require_once __DIR__ . '/../config/db.php'; //require_one incluye un archivo php una sola vez
//__DIR__ pra devolver la carpeta actual

class Cliente //crear clase cliente
{

    public static function listar()
    {
        $db = Database::connect(); //llamo al metodo de la clase de la conexion a bd
        $stmt = $db->prepare("CALL sp_cliente_listar()"); //llamar al procedimiento almacenado
        $stmt->execute(); //ejecua la consulta
        return $stmt->fetchAll(PDO::FETCH_ASSOC); //devuelve un array asociativo tipo campo : valor con todos los clientes
    }

    public static function insertar($data)
    {
        $db = Database::connect();
        $stmt = $db->prepare("CALL sp_cliente_insertar(?,?,?,?)");
        return $stmt->execute([
            $data['nombre'],
            $data['email'],
            $data['dni'],
            $data['sexo']
        ]);
    }

    public static function actualizar($id, $data)
    {
        $db = Database::connect();
        $stmt = $db->prepare("CALL sp_cliente_actualizar(?,?,?,?,?)");
        return $stmt->execute([
            $id,
            $data['nombre'],
            $data['email'],
            $data['dni'],
            $data['sexo']
        ]);
    }

    public static function eliminar($id)
    {
        $db = Database::connect();
        $stmt = $db->prepare("CALL sp_cliente_eliminar(?)");
        return $stmt->execute([$id]);
    }

    public static function existeEmail($email)
    {
        $db = Database::connect();

        $stmt = $db->prepare("SELECT id FROM cliente WHERE email = ?");
        $stmt->execute([$email]);

        return $stmt->rowCount() > 0;
    }

    public static function existeDni($dni)
    {
        $db = Database::connect();

        $stmt = $db->prepare("SELECT id FROM cliente WHERE dni = ?");
        $stmt->execute([$dni]);

        return $stmt->rowCount() > 0;
    }
}