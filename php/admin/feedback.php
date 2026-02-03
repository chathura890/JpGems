<?php
require_once '../../config/database.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? 'list';

try {
    switch ($action) {
        case 'list':
            $stmt = $pdo->query("
                SELECT * FROM feedback 
                ORDER BY created_at DESC
            ");
            $feedback = $stmt->fetchAll();
            echo json_encode(['success' => true, 'data' => $feedback]);
            break;

        case 'get':
            $id = $_GET['id'] ?? 0;
            $stmt = $pdo->prepare("SELECT * FROM feedback WHERE id = ?");
            $stmt->execute([$id]);
            $feedback = $stmt->fetch();
            echo json_encode(['success' => true, 'data' => $feedback]);
            break;

        case 'approve':
            $id = $_GET['id'] ?? 0;
            $stmt = $pdo->prepare("UPDATE feedback SET status = 'approved' WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'Feedback approved successfully']);
            break;

        case 'reject':
            $id = $_GET['id'] ?? 0;
            $stmt = $pdo->prepare("UPDATE feedback SET status = 'rejected' WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'Feedback rejected successfully']);
            break;

        case 'delete':
            $id = $_GET['id'] ?? 0;
            $stmt = $pdo->prepare("DELETE FROM feedback WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'Feedback deleted successfully']);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }

} catch (PDOException $e) {
    error_log("Feedback admin error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
