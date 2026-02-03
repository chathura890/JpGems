<?php
require_once '../config/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$category = $_GET['category'] ?? 'all';
$limit = intval($_GET['limit'] ?? 12);
$offset = intval($_GET['offset'] ?? 0);

try {
    $whereClause = "";
    $params = [];
    
    if ($category !== 'all') {
        $whereClause = "WHERE category = ?";
        $params[] = $category;
    }
    
    // Get gemstones
    $stmt = $pdo->prepare("
        SELECT id, name, category, price, sale_price, image_url, description, is_featured, is_new, in_stock
        FROM gemstones 
        $whereClause
        ORDER BY is_featured DESC, created_at DESC
        LIMIT ? OFFSET ?
    ");
    
    $params[] = $limit;
    $params[] = $offset;
    $stmt->execute($params);
    $gemstones = $stmt->fetchAll();

    // Get total count
    $countStmt = $pdo->prepare("SELECT COUNT(*) as total FROM gemstones $whereClause");
    if ($category !== 'all') {
        $countStmt->execute([$category]);
    } else {
        $countStmt->execute();
    }
    $total = $countStmt->fetch()['total'];

    echo json_encode([
        'success' => true,
        'data' => $gemstones,
        'total' => $total,
        'category' => $category
    ]);

} catch (PDOException $e) {
    error_log("Gemstones error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to load gemstones']);
}
?>