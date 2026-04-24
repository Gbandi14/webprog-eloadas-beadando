<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers.php';

$sql = "SELECT targy_nev, COUNT(*) AS vizsgak_szama, ROUND(AVG(osszpont),2) AS atlag_osszpont, ROUND(AVG(teljesitmeny_szazalek),2) AS atlag_szazalek FROM eredmenyek GROUP BY targy_nev ORDER BY targy_nev";
$stmt = $pdo->query($sql);
sendJson(['success' => true, 'data' => $stmt->fetchAll()]);
