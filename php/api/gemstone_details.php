<?php
require_once '../config/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$id = intval($_GET['id'] ?? 0);

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid gemstone ID']);
    exit;
}

try {
    // Get gemstone details
    $stmt = $pdo->prepare("
        SELECT id, name, category, price, sale_price, image_url, gallery_images, 
               description, specifications, weight, dimensions, origin, 
               treatment, clarity, cut_grade, color_grade, is_featured, 
               is_new, in_stock, stock_quantity, created_at
        FROM gemstones 
        WHERE id = ? AND is_active = 1
    ");
    
    $stmt->execute([$id]);
    $gemstone = $stmt->fetch();

    if (!$gemstone) {
        echo json_encode(['success' => false, 'message' => 'Gemstone not found']);
        exit;
    }

    // Parse gallery images
    if ($gemstone['gallery_images']) {
        $gemstone['gallery_images'] = json_decode($gemstone['gallery_images'], true);
    } else {
        $gemstone['gallery_images'] = [];
    }

    // Parse specifications
    if ($gemstone['specifications']) {
        $gemstone['specifications'] = json_decode($gemstone['specifications'], true);
    } else {
        $gemstone['specifications'] = [];
    }

    echo json_encode([
        'success' => true,
        'data' => $gemstone
    ]);

} catch (PDOException $e) {
    error_log("Gemstone details error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to load gemstone details']);
}
?>