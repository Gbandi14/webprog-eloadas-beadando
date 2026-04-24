<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = getIdFromRequest();

switch ($method) {
    case 'GET':
        if ($id !== null) {
            $stmt = $pdo->prepare("SELECT * FROM vizsgatargy WHERE azon = ?");
            $stmt->execute([$id]);
            sendJson(['success' => true, 'data' => fetchOneOr404($stmt)]);
        }

        $stmt = $pdo->query("SELECT * FROM vizsgatargy ORDER BY azon");
        sendJson(['success' => true, 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $data = getJsonInput();
        requireFields($data, ['azon', 'nev', 'szomax', 'irmax']);

        $azon = validateIntRange($data['azon'], 'azon', 1, 1000000);
        $nev = trim((string)$data['nev']);
        $szomax = validateIntRange($data['szomax'], 'szomax', 0, 500);
        $irmax = validateIntRange($data['irmax'], 'irmax', 0, 500);

        $stmt = $pdo->prepare("INSERT INTO vizsgatargy (azon, nev, szomax, irmax) VALUES (?, ?, ?, ?)");
        $stmt->execute([$azon, $nev, $szomax, $irmax]);

        successMessage('Sikeres létrehozás', ['id' => $azon], 201);
        break;

    case 'PUT':
        if ($id === null) {
            sendJson(['success' => false, 'error' => 'Hiányzó id paraméter'], 400);
        }

        $data = getJsonInput();
        $updates = [];
        $values = [];

        if (array_key_exists('nev', $data)) {
            $updates[] = "nev = ?";
            $values[] = trim((string)$data['nev']);
        }
        if (array_key_exists('szomax', $data)) {
            $updates[] = "szomax = ?";
            $values[] = validateIntRange($data['szomax'], 'szomax', 0, 500);
        }
        if (array_key_exists('irmax', $data)) {
            $updates[] = "irmax = ?";
            $values[] = validateIntRange($data['irmax'], 'irmax', 0, 500);
        }

        if (!$updates) {
            sendJson(['success' => false, 'error' => 'Nincs módosítandó mező'], 400);
        }

        $values[] = $id;
        $stmt = $pdo->prepare("UPDATE vizsgatargy SET " . implode(', ', $updates) . " WHERE azon = ?");
        $stmt->execute($values);

        successMessage('Sikeres módosítás');
        break;

    case 'DELETE':
        if ($id === null) {
            sendJson(['success' => false, 'error' => 'Hiányzó id paraméter'], 400);
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM vizsgatargy WHERE azon = ?");
            $stmt->execute([$id]);
            if ($stmt->rowCount() === 0) {
                sendJson(['success' => false, 'error' => 'Nincs ilyen rekord'], 404);
            }
            successMessage('Sikeres törlés');
        } catch (PDOException $e) {
            sendJson([
                'success' => false,
                'error' => 'A vizsgatárgy nem törölhető, mert kapcsolódó vizsga rekordok vannak hozzá.'
            ], 409);
        }
        break;

    default:
        sendJson(['success' => false, 'error' => 'Nem támogatott HTTP metódus'], 405);
}
