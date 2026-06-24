<?php

require __DIR__ . '/db.php';

$tables = pdo()->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
ok([
    'message' => 'PHP, MySQL, PDO and ims_db are connected.',
    'tables' => $tables
]);
