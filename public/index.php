<?php

error_reporting(E_ALL & ~E_DEPRECATED & ~E_WARNING);
ini_set('display_errors', 1);

require '../vendor/autoload.php';
require '../src/config/db.php';

// 👇 PRIMERO container
$container = new \Slim\Container([
    'settings' => [
        'displayErrorDetails' => true
    ]
]);



// 👇 LUEGO app
$app = new \Slim\App($container);

// 👇 DESPUÉS rutas
require '../src/routes/routes.php';

$app->run();