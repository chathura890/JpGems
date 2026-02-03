<?php
require_once '../../config/database.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? 'list';

try {
    switch ($action) {
        case 'list':
            $stmt = $pdo->query("
                SELECT * FROM categories 
                ORDER BY name ASC
            ");
            $categories = $stmt->fetchAll();
            echo json_encode(['success' => true, 'data' => $categories]);
            break;

        case 'get':
            $id = $_GET['id'] ?? 0;
            $stmt = $pdo->prepare("SELECT * FROM categories WHERE id = ?");
            $stmt->execute([$id]);
            $category = $stmt->fetch();
            echo json_encode(['success' => true, 'data' => $category]);
            break;

        case 'create':
            $input = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $pdo->prepare("
                INSERT INTO categories (name, slug, description, is_active)
                VALUES (?, ?, ?, 1)
            ");
            
            $stmt->execute([
                $input['name'],
                $input['slug'],
                $input['description'] ?: null
            ]);
            
            echo json_encode(['success' => true, 'message' => 'Category created successfully']);
            break;

        case 'update':
            $input = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $pdo->prepare("
                UPDATE categories SET
                    name = ?, slug = ?, description = ?
                WHERE id = ?
            ");
            
            $stmt->execute([
                $input['name'],
                $input['slug'],
                $input['description'] ?: null,
                $input['id']
            ]);
            
            echo json_encode(['success' => true, 'message' => 'Category updated successfully']);
            break;

        case 'delete':
            $id = $_GET['id'] ?? 0;
            $stmt = $pdo->prepare("UPDATE categories SET is_active = 0 WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'Category deleted successfully']);
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
    }

} catch (PDOException $e) {
    error_log("Categories admin error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
