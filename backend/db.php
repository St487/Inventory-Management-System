<?php

session_start();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

const DB_HOST = 'localhost';
const DB_NAME = 'ims_db';
const DB_USER = 'root';
const DB_PASS = '';

function pdo()
{
    static $pdo = null;

    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => true,
            ]);
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'Unknown database') !== false) {
                fail('Database ims_db not found. Open backend/setup.php in your browser once, then reload the system.', 500);
            }
            fail('Cannot connect to MySQL. Start MySQL in XAMPP and check backend/db.php settings. Details: ' . $e->getMessage(), 500);
        }
    }

    return $pdo;
}

function input()
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return $_POST;
    }

    $data = json_decode($raw, true);
    return is_array($data) ? $data : $_POST;
}

function ok($payload = array())
{
    echo json_encode(['success' => true] + $payload);
    exit;
}

function fail($message, $status = 400)
{
    http_response_code($status);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}

function money($amount)
{
    return round($amount, 2);
}
