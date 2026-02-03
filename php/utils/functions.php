<?php
require_once '../config/database.php';

// Check authentication function
function checkAuth() {
    if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
        return false;
    }
    return true;
}

// Check admin authentication
function checkAdminAuth() {
    if (!checkAuth()) {
        return false;
    }
    
    // Check if user is admin (you can modify this logic)
    if ($_SESSION['user_email'] !== 'admin@jpgems.lk') {
        return false;
    }
    
    return true;
}

// Sanitize input
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

// Validate email
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Generate random string
function generateRandomString($length = 32) {
    return bin2hex(random_bytes($length / 2));
}

// Format price
function formatPrice($price) {
    return '$' . number_format($price, 2);
}

// Upload image function
function uploadImage($file, $directory = 'uploads/') {
    $targetDir = "../images/" . $directory;
    
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0755, true);
    }
    
    $imageFileType = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
    $fileName = generateRandomString(16) . '.' . $imageFileType;
    $targetFile = $targetDir . $fileName;
    
    // Check if image file is actual image
    $check = getimagesize($file["tmp_name"]);
    if($check === false) {
        return ['success' => false, 'message' => 'File is not an image.'];
    }
    
    // Check file size (5MB max)
    if ($file["size"] > 5000000) {
        return ['success' => false, 'message' => 'File is too large.'];
    }
    
    // Allow certain file formats
    $allowedTypes = array("jpg", "jpeg", "png", "gif", "webp");
    if(!in_array($imageFileType, $allowedTypes)) {
        return ['success' => false, 'message' => 'Only JPG, JPEG, PNG, GIF & WEBP files are allowed.'];
    }
    
    if (move_uploaded_file($file["tmp_name"], $targetFile)) {
        return [
            'success' => true, 
            'filename' => $fileName,
            'path' => 'images/' . $directory . $fileName
        ];
    } else {
        return ['success' => false, 'message' => 'Error uploading file.'];
    }
}

// Send JSON response
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Log error
function logError($message, $file = null, $line = null) {
    $logMessage = date('Y-m-d H:i:s') . " - " . $message;
    if ($file && $line) {
        $logMessage .= " in " . $file . " on line " . $line;
    }
    error_log($logMessage);
}
?>