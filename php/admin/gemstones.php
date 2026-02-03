<?php
require_once '../../config/database.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? 'list';

try {
    switch ($action) {
        case 'list':
            $stmt = $pdo->query("
                SELECT * FROM gemstones 
                ORDER BY created_at DESC
            ");
            $gemstones = $stmt->fetchAll();
            echo json_encode(['success' => true, 'data' => $gemstones]);
            break;

        case 'get':
            $id = $_GET['id'] ?? 0;
            $stmt = $pdo->prepare("SELECT * FROM gemstones WHERE id = ?");
            $stmt->execute([$id]);
            $gemstone = $stmt->fetch();
            echo json_encode(['success' => true, 'data' => $gemstone]);
            break;

        case 'create':
            $input = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $pdo->prepare("
                INSERT INTO gemstones (
                    name, category, price, sale_price, image_url, description,
                    weight, origin, clarity, is_featured, is_new, stock_quantity, is_active
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
            ");
            
            $stmt->execute([
                $input['name'],
                $input['category'],
                $input['price'],
                $input['sale_price'] ?: null,
                $input['image_url'],
                $input['description'],
                $input['weight'] ?: null,
                $input['origin'] ?: null,
                $input['clarity'] ?: null,
                $input['is_featured'],
                $input['is_new'],
                $input['stock_quantity']
            ]);
            
            echo json_encode(['success' => true, 'message' => 'Gemstone created successfully']);
            break;

        case 'update':
            $input = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $pdo->prepare("
                UPDATE gemstones SET
                    name = ?, category = ?, price = ?, sale_price = ?,
                    image_url = ?, description = ?, weight = ?, origin = ?,
                    clarity = ?, is_featured = ?, is_new = ?, stock_quantity = ?
                WHERE id = ?
            ");
            
            $stmt->execute([
                $input['name'],
                $input['category'],
                $input['price'],
                $input['sale_price'] ?: null,
                $input['image_url'],
                $input['description'],
                $input['weight'] ?: null,
                $input['origin'] ?: null,
                $input['clarity'] ?: null,
                $input['is_featured'],
                $input['is_new'],
                $input['stock_quantity'],
                $input['id']
            ]);
            
            echo json_encode(['success' => true, 'message' => 'Gemstone updated successfully']);
            break;

        case 'delete':
            $id = $_GET['id'] ?? 0;
            $stmt = $pdo->prepare("UPDATE gemstones SET is_active = 0 WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'Gemstone deleted successfully']);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }

} catch (PDOException $e) {
    error_log("Gemstones admin error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
