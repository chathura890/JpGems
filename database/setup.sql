-- Create database if not exists
CREATE DATABASE IF NOT EXISTS jpgems_db;
USE jpgems_db;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image VARCHAR(255) NOT NULL,
    link VARCHAR(255) NOT NULL,
    description TEXT,
    is_active TINYINT(1) DEFAULT 1,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, image, link, description, sort_order) VALUES
('Blue Sapphires', 'images/blue-sapphires.jpg', 'html/blue-sapphires.html', 'Stunning blue sapphires with brilliant clarity', 1),
('Rubies', 'images/rb0.jpg', 'html/ruby.html', 'Premium quality rubies with deep red color', 2),
('Emeralds', 'images/img2.jpg', 'html/emerald.html', 'Beautiful emeralds with vibrant green hues', 3),
('Yellow Sapphires', 'images/ys0.jpg', 'html/yellow-sapphire.html', 'Bright yellow sapphires with excellent clarity', 4),
('Pink Sapphires', 'images/ps1.jpg', 'html/pink-sapphire.html', 'Elegant pink sapphires with delicate coloring', 5),
('White Sapphires', 'images/ws0.jpg', 'html/white-sapphires.html', 'Pure white sapphires with diamond-like brilliance', 6),
('Diamonds', 'images/pd0.jpg', 'html/diamonds.html', 'Premium diamonds with exceptional cut and clarity', 7),
('Garnets', 'images/img3.jpg', 'html/garnet.html', 'Rich red garnets with excellent fire', 8),
('Opals', 'images/img4.jpg', 'html/opals.html', 'Beautiful opals with stunning play of color', 9),
('Zircons', 'images/img6.jpg', 'html/zircon.html', 'Brilliant zircons with high refractive index', 10),
('Star Sapphires', 'images/img7.jpg', 'html/star-sapphire.html', 'Rare star sapphires with unique asterism', 11),
('Citrines', 'images/cc.jpg', 'html/citrine.html', 'Golden citrines with warm, sunny colors', 12);

-- Create products table for future use
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);