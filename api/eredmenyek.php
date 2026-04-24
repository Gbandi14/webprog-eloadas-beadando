<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers.php';

$sql = "SELECT * FROM eredmenyek ORDER BY vizsgazo_azon, targy_azon";
$stmt = $pdo->query($sql);
sendJson(['success' => true, 'data' => $stmt->fetchAll()]);
