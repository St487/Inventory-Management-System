<?php

$host = 'localhost';
$user = 'root';
$pass = '';
$schemaFile = __DIR__ . '/schema.sql';

header('Content-Type: text/html; charset=utf-8');

try {
    if (!file_exists($schemaFile)) {
        throw new Exception('schema.sql was not found.');
    }

    $pdo = new PDO('mysql:host=' . $host . ';charset=utf8mb4', $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $sql = file_get_contents($schemaFile);
    $statements = array_filter(array_map('trim', explode(';', $sql)));

    foreach ($statements as $statement) {
        if ($statement !== '') {
            $pdo->exec($statement);
        }
    }

    echo '<h2>Database setup completed successfully.</h2>';
    echo '<p>Database <strong>ims_db</strong> is ready.</p>';
    echo '<p><a href="../frontend/index.html">Open Inventory Management System</a></p>';
} catch (Exception $e) {
    echo '<h2>Database setup failed.</h2>';
    echo '<p>' . htmlspecialchars($e->getMessage()) . '</p>';
    echo '<p>Make sure MySQL is running in XAMPP and the username/password in setup.php are correct.</p>';
}
