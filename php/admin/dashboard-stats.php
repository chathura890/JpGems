<?php
require_once '../../config/database.php';

header('Content-Type: application/json');

// Get dashboard statistics
try {
    // Total gemstones
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM gemstones WHERE is_active = 1");
    $total_gemstones = $stmt->fetch()['total'];

    // Total orders
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM orders");
    $total_orders = $stmt->fetch()['total'];

    // Total users
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM users WHERE is_active = 1");
    $total_users = $stmt->fetch()['total'];

    // Total revenue
    $stmt = $pdo->query("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = 'completed'");
    $total_revenue = $stmt->fetch()['total'];

    // Recent orders
    $stmt = $pdo->query("
        SELECT o.*, CONCAT(u.first_name, ' ', u.last_name) as customer_name
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 5
    ");
    $recent_orders = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'stats' => [
            'total_gemstones' => $total_gemstones,
            'total_orders' => $total_orders,
            'total_users' => $total_users,
            'total_revenue' => $total_revenue
        ],
        'recent_orders' => $recent_orders
    ]);

} catch (PDOException $e) {
    error_log("Dashboard stats error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to load dashboard statistics']);
}
?>
