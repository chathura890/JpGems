<?php
require_once '../config/database.php';

header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

try {
    // Get user profile data
    $stmt = $pdo->prepare("
        SELECT id, first_name, last_name, email, phone, newsletter_subscribed, created_at, last_login 
        FROM users 
        WHERE id = ? AND is_active = 1
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'firstName' => $user['first_name'],
            'lastName' => $user['last_name'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'newsletterSubscribed' => (bool)$user['newsletter_subscribed'],
            'memberSince' => $user['created_at'],
            'lastLogin' => $user['last_login']
        ]
    ]);

} catch (PDOException $e) {
    error_log("Profile error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to load profile']);
}
?>