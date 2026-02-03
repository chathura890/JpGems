<?php
require_once '../config/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$firstName = trim($input['firstName'] ?? '');
$lastName = trim($input['lastName'] ?? '');
$phone = trim($input['phone'] ?? '');
$newsletter = $input['newsletter'] ?? false;

// Validation
$errors = [];

if (empty($firstName)) {
    $errors[] = 'First name is required';
}

if (empty($lastName)) {
    $errors[] = 'Last name is required';
}

if (empty($phone)) {
    $errors[] = 'Phone number is required';
}

if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

try {
    // Update user profile
    $stmt = $pdo->prepare("
        UPDATE users 
        SET first_name = ?, last_name = ?, phone = ?, newsletter_subscribed = ?, updated_at = NOW()
        WHERE id = ? AND is_active = 1
    ");
    
    $stmt->execute([$firstName, $lastName, $phone, $newsletter ? 1 : 0, $_SESSION['user_id']]);

    // Update session data
    $_SESSION['user_name'] = $firstName . ' ' . $lastName;

    echo json_encode([
        'success' => true,
        'message' => 'Profile updated successfully',
        'user' => [
            'firstName' => $firstName,
            'lastName' => $lastName,
            'phone' => $phone,
            'newsletterSubscribed' => $newsletter
        ]
    ]);

} catch (PDOException $e) {
    error_log("Update profile error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to update profile']);
}
?>