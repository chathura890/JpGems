<?php
require_once '../../config/database.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? 'list';

try {
    switch ($action) {
        case 'list':
            $stmt = $pdo->query("
                SELECT o.*, CONCAT(u.first_name, ' ', u.last_name) as customer_name,
                       (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
                FROM orders o
                LEFT JOIN users u ON o.user_id = u.id
                ORDER BY o.created_at DESC
            ");
            $orders = $stmt->fetchAll();
            echo json_encode(['success' => true, 'data' => $orders]);
            break;

        case 'get':
            $id = $_GET['id'] ?? 0;
            $stmt = $pdo->prepare("
                SELECT o.*, CONCAT(u.first_name, ' ', u.last_name) as customer_name,
                       u.email, u.phone
                FROM orders o
                LEFT JOIN users u ON o.user_id = u.id
                WHERE o.id = ?
            ");
            $stmt->execute([$id]);
            $order = $stmt->fetch();
            
            // Get order items
            $stmt = $pdo->prepare("
                SELECT oi.*, g.name as gemstone_name, g.image_url
                FROM order_items oi
                LEFT JOIN gemstones g ON oi.gemstone_id = g.id
                WHERE oi.order_id = ?
            ");
            $stmt->execute([$id]);
            $order['items'] = $stmt->fetchAll();
            
            echo json_encode(['success' => true, 'data' => $order]);
            break;

        case 'update_status':
            $input = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $pdo->prepare("
                UPDATE orders SET status = ? WHERE id = ?
            ");
            
            $stmt->execute([$input['status'], $input['id']]);
            
            echo json_encode(['success' => true, 'message' => 'Order status updated successfully']);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }

} catch (PDOException $e) {
    error_log("Orders admin error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
