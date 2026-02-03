<?php
require_once '../config/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$rating = intval($input['rating'] ?? 0);
$message = trim($input['message'] ?? '');

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email is required';
}

if ($rating < 1 || $rating > 5) {
    $errors[] = 'Rating must be between 1 and 5';
}

if (empty($message)) {
    $errors[] = 'Feedback message is required';
}

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

try {
    // Insert feedback
    $stmt = $pdo->prepare("
        INSERT INTO feedback (name, email, rating, message, created_at, status) 
        VALUES (?, ?, ?, ?, NOW(), 'pending')
    ");
    
    $stmt->execute([$name, $email, $rating, $message]);

    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your feedback! It helps us improve our service.'
    ]);

} catch (PDOException $e) {
    error_log("Feedback error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to submit feedback. Please try again.']);
}
?>