<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = getIdFromRequest();

switch ($method) {
    case 'GET':
        if ($id !== null) {
            $stmt = $pdo->prepare("SELECT * FROM vizsgazo WHERE azon = ?");
            $stmt->execute([$id]);
            sendJson(['success' => true, 'data' => fetchOneOr404($stmt)]);
        }

        $search = trim($_GET['search'] ?? '');
        if ($search !== '') {
            $stmt = $pdo->prepare("SELECT * FROM vizsgazo WHERE nev LIKE ? OR osztaly LIKE ? ORDER BY azon");
            $like = "%$search%";
            $stmt->execute([$like, $like]);
            sendJson(['success' => true, 'data' => $stmt->fetchAll()]);
        }

        $stmt = $pdo->query("SELECT * FROM vizsgazo ORDER BY azon");
        sendJson(['success' => true, 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $data = getJsonInput();
        requireFields($data, ['azon', 'nev', 'osztaly']);

        $azon = validateIntRange($data['azon'], 'azon', 1, 1000000);
        $nev = trim((string)$data['nev']);
        $osztaly = trim((string)$data['osztaly']);

        $stmt = $pdo->prepare("INSERT INTO vizsgazo (azon, nev, osztaly) VALUES (?, ?, ?)");
        $stmt->execute([$azon, $nev, $osztaly]);

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
        if (array_key_exists('osztaly', $data)) {
            $updates[] = "osztaly = ?";
            $values[] = trim((string)$data['osztaly']);
        }

        if (!$updates) {
            sendJson(['success' => false, 'error' => 'Nincs módosítandó mező'], 400);
        }

        $values[] = $id;
        $stmt = $pdo->prepare("UPDATE vizsgazo SET " . implode(', ', $updates) . " WHERE azon = ?");
        $stmt->execute($values);

        successMessage('Sikeres módosítás');
        break;

    case 'DELETE':
        if ($id === null) {
            sendJson(['success' => false, 'error' => 'Hiányzó id paraméter'], 400);
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM vizsgazo WHERE azon = ?");
            $stmt->execute([$id]);
            if ($stmt->rowCount() === 0) {
                sendJson(['success' => false, 'error' => 'Nincs ilyen rekord'], 404);
            }
            successMessage('Sikeres törlés');
        } catch (PDOException $e) {
            sendJson([
                'success' => false,
                'error' => 'A vizsgázó nem törölhető, mert kapcsolódó vizsga rekordok vannak hozzá.'
            ], 409);
        }
        break;

    default:
        sendJson(['success' => false, 'error' => 'Nem támogatott HTTP metódus'], 405);
}
