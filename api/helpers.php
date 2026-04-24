<?php
function getJsonInput(): array {
    $input = file_get_contents('php://input');
    if (!$input) return [];
    $data = json_decode($input, true);
    return is_array($data) ? $data : [];
}

function sendJson($data, int $statusCode = 200): void {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function getIdFromRequest(): ?int {
    if (isset($_GET['id']) && is_numeric($_GET['id'])) {
        return (int)$_GET['id'];
    }
    return null;
}

function requireFields(array $data, array $fields): void {
    foreach ($fields as $field) {
        if (!array_key_exists($field, $data) || $data[$field] === '') {
            sendJson(['success' => false, 'error' => "Hiányzó mező: $field"], 400);
        }
    }
}

function validateIntRange($value, string $field, int $min, int $max): int {
    if (!is_numeric($value)) {
        sendJson(['success' => false, 'error' => "$field csak szám lehet"], 400);
    }
    $intValue = (int)$value;
    if ($intValue < $min || $intValue > $max) {
        sendJson(['success' => false, 'error' => "$field értéke $min és $max között lehet"], 400);
    }
    return $intValue;
}

function fetchOneOr404(PDOStatement $stmt) {
    $row = $stmt->fetch();
    if (!$row) {
        sendJson(['success' => false, 'error' => 'Nincs ilyen rekord'], 404);
    }
    return $row;
}

function successMessage(string $message, array $extra = [], int $statusCode = 200): void {
    sendJson(array_merge(['success' => true, 'message' => $message], $extra), $statusCode);
}
