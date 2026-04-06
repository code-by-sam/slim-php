<?php
class Database  //crea clase o plantilla de objetos
{
    public static function connect() //crear metodo accesible desde cualquier lugar
    {
        try {
            $host = "localhost";
            $db = "slim_php";
            $user = "root";
            $pass = "";

            $pdo = new PDO(
                "mysql:host=$host;dbname=$db;charset=utf8",
                $user,
                $pass,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
            echo "Conexión exitosa";
            return $pdo;

        } catch (PDOException $e) {
            echo "Error de conexion: " . $e->getMessage();
        }
    }
}