<?php
class Database  //crea clase o plantilla de objetos
{
    public static function connect() //crear metodo accesible desde cualquier lugar
    {
        $host = "localhost";
        $db = "slim_php";
        $user = "root";
        $pass = "";

        return new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION //define de que modo lanzar errores
        ]);
    }
}