<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = getIdFromRequest();

switch ($method) {
    case 'GET':
        if ($id !== null) {
            $stmt = $pdo->prepare("
                SELECT v.*, vz.nev AS vizsgazo_nev, vz.osztaly, t.nev AS targy_nev, t.szomax, t.irmax
                FROM vizsga v
                JOIN vizsgazo vz ON vz.azon = v.vizsgazoaz
                JOIN vizsgatargy t ON t.azon = v.vizsgatargyaz
                WHERE v.id = ?
            ");
            $stmt->execute([$id]);
            sendJson(['success' => true, 'data' => fetchOneOr404($stmt)]);
        }

        $stmt = $pdo->query("
            SELECT v.*, vz.nev AS vizsgazo_nev, vz.osztaly, t.nev AS targy_nev, t.szomax, t.irmax
            FROM vizsga v
            JOIN vizsgazo vz ON vz.azon = v.vizsgazoaz
            JOIN vizsgatargy t ON t.azon = v.vizsgatargyaz
            ORDER BY v.id
        ");
        sendJson(['success' => true, 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $data = getJsonInput();
        requireFields($data, ['vizsgazoaz', 'vizsgatargyaz', 'szobeli', 'irasbeli']);

        $vizsgazoaz = validateIntRange($data['vizsgazoaz'], 'vizsgazoaz', 1, 1000000);
        $vizsgatargyaz = validateIntRange($data['vizsgatargyaz'], 'vizsgatargyaz', 1, 1000000);

        $stmt = $pdo->prepare("SELECT * FROM vizsgatargy WHERE azon = ?");
        $stmt->execute([$vizsgatargyaz]);
        $targy = fetchOneOr404($stmt);

        $szobeli = validateIntRange($data['szobeli'], 'szobeli', 0, (int)$targy['szomax']);
        $irasbeli = validateIntRange($data['irasbeli'], 'irasbeli', 0, (int)$targy['irmax']);

        $stmt = $pdo->prepare("SELECT azon FROM vizsgazo WHERE azon = ?");
        $stmt->execute([$vizsgazoaz]);
        fetchOneOr404($stmt);

        $stmt = $pdo->prepare("INSERT INTO vizsga (vizsgazoaz, vizsgatargyaz, szobeli, irasbeli) VALUES (?, ?, ?, ?)");
        $stmt->execute([$vizsgazoaz, $vizsgatargyaz, $szobeli, $irasbeli]);

        successMessage('Sikeres létrehozás', ['id' => (int)$pdo->lastInsertId()], 201);
        break;

    case 'PUT':
        if ($id === null) {
            sendJson(['success' => false, 'error' => 'Hiányzó id paraméter'], 400);
        }

        $stmt = $pdo->prepare("SELECT * FROM vizsga WHERE id = ?");
        $stmt->execute([$id]);
        $existing = fetchOneOr404($stmt);

        $data = getJsonInput();

        $vizsgazoaz = array_key_exists('vizsgazoaz', $data)
            ? validateIntRange($data['vizsgazoaz'], 'vizsgazoaz', 1, 1000000)
            : (int)$existing['vizsgazoaz'];

        $vizsgatargyaz = array_key_exists('vizsgatargyaz', $data)
            ? validateIntRange($data['vizsgatargyaz'], 'vizsgatargyaz', 1, 1000000)
            : (int)$existing['vizsgatargyaz'];

        $stmt = $pdo->prepare("SELECT * FROM vizsgatargy WHERE azon = ?");
        $stmt->execute([$vizsgatargyaz]);
        $targy = fetchOneOr404($stmt);

        $szobeli = array_key_exists('szobeli', $data)
            ? validateIntRange($data['szobeli'], 'szobeli', 0, (int)$targy['szomax'])
            : (int)$existing['szobeli'];

        $irasbeli = array_key_exists('irasbeli', $data)
            ? validateIntRange($data['irasbeli'], 'irasbeli', 0, (int)$targy['irmax'])
            : (int)$existing['irasbeli'];

        $stmt = $pdo->prepare("SELECT azon FROM vizsgazo WHERE azon = ?");
        $stmt->execute([$vizsgazoaz]);
        fetchOneOr404($stmt);

        $stmt = $pdo->prepare("
            UPDATE vizsga
            SET vizsgazoaz = ?, vizsgatargyaz = ?, szobeli = ?, irasbeli = ?
            WHERE id = ?
        ");
        $stmt->execute([$vizsgazoaz, $vizsgatargyaz, $szobeli, $irasbeli, $id]);

        successMessage('Sikeres módosítás');
        break;

    case 'DELETE':
        if ($id === null) {
            sendJson(['success' => false, 'error' => 'Hiányzó id paraméter'], 400);
        }

        $stmt = $pdo->prepare("DELETE FROM vizsga WHERE id = ?");
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            sendJson(['success' => false, 'error' => 'Nincs ilyen rekord'], 404);
        }

        successMessage('Sikeres törlés');
        break;

    default:
        sendJson(['success' => false, 'error' => 'Nem támogatott HTTP metódus'], 405);
}
