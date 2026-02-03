<?php
require_once '../config/database.php';

header('Content-Type: application/json');

try {
    // Get featured gemstones for homepage
    $stmt = $pdo->prepare("
        SELECT id, name, category, price, sale_price, image_url, description, is_new
        FROM gemstones 
        WHERE is_featured = 1 AND is_active = 1 AND in_stock = 1
        ORDER BY created_at DESC
        LIMIT 6
    ");
    $stmt->execute();
    $featured = $stmt->fetchAll();

    // Get special offers
    $stmt = $pdo->prepare("
        SELECT id, name, category, price, sale_price, image_url, description
        FROM gemstones 
        WHERE sale_price IS NOT NULL AND sale_price > 0 AND is_active = 1 AND in_stock = 1
        ORDER BY ((price - sale_price) / price) DESC
        LIMIT 6
    ");
    $stmt->execute();
    $offers = $stmt->fetchAll();

    // Get new arrivals
    $stmt = $pdo->prepare("
        SELECT id, name, category, price, sale_price, image_url, description
        FROM gemstones 
        WHERE is_new = 1 AND is_active = 1 AND in_stock = 1
        ORDER BY created_at DESC
        LIMIT 6
    ");
    $stmt->execute();
    $newArrivals = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => [
            'featured' => $featured,
            'offers' => $offers,
            'newArrivals' => $newArrivals
        ]
    ]);

} catch (PDOException $e) {
    error_log("Homepage data error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to load homepage data']);
}
?>