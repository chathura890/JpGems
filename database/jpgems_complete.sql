-- Create database
CREATE DATABASE IF NOT EXISTS jpgems_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE jpgems_db;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(255) NULL,
    newsletter_subscribed BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Gemstones table
CREATE TABLE gemstones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    sale_price DECIMAL(10, 2) NULL,
    image_url VARCHAR(255) NOT NULL,
    gallery_images JSON NULL,
    description TEXT NOT NULL,
    specifications JSON NULL,
    weight DECIMAL(8, 3) NULL,
    dimensions VARCHAR(50) NULL,
    origin VARCHAR(50) NULL,
    treatment VARCHAR(100) NULL,
    clarity VARCHAR(20) NULL,
    cut_grade VARCHAR(20) NULL,
    color_grade VARCHAR(20) NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    in_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback table
CREATE TABLE feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    message TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address JSON NOT NULL,
    billing_address JSON NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order items table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    gemstone_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (gemstone_id) REFERENCES gemstones(id) ON DELETE CASCADE
);

-- Wishlist table
CREATE TABLE wishlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    gemstone_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (gemstone_id) REFERENCES gemstones(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist (user_id, gemstone_id)
);

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Blue Sapphires', 'blue-sapphires', 'Premium Ceylon blue sapphires'),
('Ruby', 'ruby', 'Finest quality ruby gemstones'),
('Emerald', 'emerald', 'Natural emerald gemstones'),
('Diamonds', 'diamonds', 'Brilliant cut diamonds'),
('Yellow Sapphire', 'yellow-sapphire', 'Golden yellow sapphires'),
('Pink Sapphire', 'pink-sapphire', 'Beautiful pink sapphires'),
('White Sapphires', 'white-sapphires', 'Clear white sapphires'),
('Garnet', 'garnet', 'Deep red garnet stones'),
('Opals', 'opals', 'Colorful opal gemstones'),
('Zircons', 'zircon', 'Brilliant zircon stones'),
('Star Sapphires', 'star-sapphire', 'Unique star sapphires'),
('Citrines', 'citrine', 'Sunny citrine gemstones');

-- Insert sample gemstones
INSERT INTO gemstones (name, category, price, sale_price, image_url, description, weight, origin, is_featured, is_new, in_stock, stock_quantity) VALUES
('Premium Blue Sapphire', 'blue-sapphires', 299.00, NULL, 'images/blue-sapphires.jpg', 'Stunning Ceylon blue sapphire with exceptional clarity and color.', 2.15, 'Sri Lanka', TRUE, FALSE, TRUE, 5),
('Premium Ruby', 'ruby', 459.00, NULL, 'images/rb0.jpg', 'Magnificent ruby with deep red color and excellent transparency.', 1.85, 'Myanmar', TRUE, FALSE, TRUE, 3),
('Natural Emerald', 'emerald', 399.00, NULL, 'images/img2.jpg', 'Beautiful natural emerald with vibrant green color.', 2.50, 'Colombia', TRUE, FALSE, TRUE, 4),
('Yellow Sapphire', 'yellow-sapphire', 350.00, 245.00, 'images/ys0.jpg', 'Brilliant yellow sapphire with golden hue.', 3.20, 'Sri Lanka', FALSE, FALSE, TRUE, 6),
('Pink Sapphire', 'pink-sapphire', 420.00, 294.00, 'images/pis0.jpg', 'Elegant pink sapphire with romantic appeal.', 2.80, 'Madagascar', FALSE, FALSE, TRUE, 4),
('White Sapphire', 'white-sapphires', 280.00, 196.00, 'images/ws0.jpg', 'Clear white sapphire with diamond-like brilliance.', 3.10, 'Sri Lanka', FALSE, FALSE, TRUE, 8),
('Premium Diamond', 'diamonds', 899.00, NULL, 'images/pd0.jpg', 'Exceptional diamond with perfect cut and clarity.', 1.50, 'South Africa', FALSE, TRUE, TRUE, 2),
('Red Garnet', 'garnet', 189.00, NULL, 'images/img5.jpg', 'Deep red garnet with excellent fire and brilliance.', 4.20, 'India', FALSE, TRUE, TRUE, 10),
('Golden Citrine', 'citrine', 159.00, NULL, 'images/img6.jpg', 'Warm golden citrine with sunny disposition.', 5.10, 'Brazil', FALSE, TRUE, TRUE, 12);

-- Insert sample admin user
INSERT INTO users (first_name, last_name, email, phone, password, is_active) VALUES
('Admin', 'User', 'admin@jpgems.lk', '+94771234567', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_gemstones_category ON gemstones(category);
CREATE INDEX idx_gemstones_featured ON gemstones(is_featured);
CREATE INDEX idx_gemstones_active ON gemstones(is_active);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_feedback_status ON feedback(status);