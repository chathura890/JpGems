<?php
require_once '../config/database.php';
require_once '../utils/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

if (!checkAuth()) {
    sendJsonResponse(['success' => false, 'message' => 'Authentication required'], 401);
}

$userId = $_SESSION['user_id'];

try {
    // Get user's wishlist
    $stmt = $pdo->prepare("
        SELECT w.id as wishlist_id, g.id, g.name, g.category, g.price, g.sale_price, 
               g.image_url, g.in_stock, w.created_at as added_date
        FROM wishlist w
        JOIN gemstones g ON w.gemstone_id = g.id
        WHERE w.user_id = ? AND g.is_active = 1
        ORDER BY w.created_at DESC
    ");
    
    $stmt->execute([$userId]);
    $wishlist = $stmt->fetchAll();

    sendJsonResponse([
        'success' => true,
        'data' => $wishlist,
        'total' => count($wishlist)
    ]);

} catch (PDOException $e) {
    logError("Wishlist error: " . $e->getMessage());
    sendJsonResponse(['success' => false, 'message' => 'Failed to load wishlist'], 500);
}
?>