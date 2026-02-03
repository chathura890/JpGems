<?php
require_once '../../config/database.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? 'list';

try {
    switch ($action) {
        case 'list':
            $stmt = $pdo->query("
                SELECT * FROM users 
                ORDER BY created_at DESC
            ");
            $users = $stmt->fetchAll();
            echo json_encode(['success' => true, 'data' => $users]);
            break;

        case 'get':
            $id = $_GET['id'] ?? 0;
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$id]);
            $user = $stmt->fetch();
            echo json_encode(['success' => true, 'data' => $user]);
            break;

        case 'toggle_status':
            $id = $_GET['id'] ?? 0;
            $stmt = $pdo->prepare("
                UPDATE users SET is_active = NOT is_active WHERE id = ?
            ");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'User status updated successfully']);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }

} catch (PDOException $e) {
    error_log("Users admin error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
