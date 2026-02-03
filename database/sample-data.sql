-- Insert sample categories
INSERT INTO categories (name, slug, description, is_active) VALUES
('Blue Sapphire', 'blue-sapphire', 'Premium blue sapphires from Sri Lanka', 1),
('Yellow Sapphire', 'yellow-sapphire', 'Beautiful yellow sapphires', 1),
('Pink Sapphire', 'pink-sapphire', 'Elegant pink sapphires', 1),
('Star Sapphire', 'star-sapphire', 'Rare star sapphires with asterism', 1),
('White Sapphire', 'white-sapphire', 'Pure white sapphires', 1),
('Ruby', 'ruby', 'Precious rubies', 1),
('Emerald', 'emerald', 'Green emeralds', 1),
('Diamond', 'diamond', 'Brilliant diamonds', 1),
('Garnet', 'garnet', 'Red garnets', 1),
('Opal', 'opal', 'Multi-color opals', 1),
('Zircon', 'zircon', 'Colorful zircons', 1);

-- Insert sample gemstones
INSERT INTO gemstones (name, category, price, sale_price, image_url, description, weight, dimensions, origin, treatment, clarity, cut_grade, color_grade, is_featured, is_new, is_active, in_stock, stock_quantity) VALUES
('Ceylon Blue Sapphire Premium', 'blue-sapphire', 2500.00, 2250.00, 'images/blue-sapphires.jpg', 'Exceptional quality Ceylon blue sapphire with vivid color and excellent clarity. This premium gemstone features the classic cornflower blue hue that Sri Lankan sapphires are famous for.', 3.45, '9x7mm', 'Sri Lanka', 'Heated', 'VVS', 'Excellent', 'AAA', 1, 1, 1, 1, 5),
('Royal Blue Sapphire', 'blue-sapphire', 1850.00, NULL, 'images/bs1.jpg', 'Beautiful royal blue sapphire with deep saturation and excellent brilliance. Perfect for engagement rings or fine jewelry.', 2.80, '8x6mm', 'Sri Lanka', 'Heated', 'VS', 'Very Good', 'AA+', 1, 0, 1, 1, 8),
('Golden Yellow Sapphire', 'yellow-sapphire', 1200.00, 1080.00, 'images/ys0.jpg', 'Vibrant yellow sapphire with warm golden tones. Known for bringing prosperity and success according to Vedic astrology.', 4.20, '10x8mm', 'Sri Lanka', 'Unheated', 'VVS', 'Excellent', 'AAA', 1, 1, 1, 1, 6),
('Canary Yellow Sapphire', 'yellow-sapphire', 980.00, NULL, 'images/ys2.jpg', 'Bright canary yellow sapphire with exceptional clarity and color intensity.', 3.15, '8.5x7mm', 'Sri Lanka', 'Heated', 'VS', 'Very Good', 'AA', 0, 0, 1, 1, 10),
('Pink Sapphire Heart', 'pink-sapphire', 1450.00, NULL, 'images/pis0.jpg', 'Romantic pink sapphire with delicate pastel color. Perfect for creating stunning romantic jewelry.', 2.95, '8x8mm', 'Madagascar', 'Heated', 'VVS', 'Excellent', 'AAA', 1, 1, 1, 1, 4),
('Hot Pink Sapphire', 'pink-sapphire', 1680.00, 1512.00, 'images/pis1.jpg', 'Vivid hot pink sapphire with intense color saturation. Rare and highly sought after.', 3.50, '9x7mm', 'Sri Lanka', 'Heated', 'VS', 'Very Good', 'AA+', 0, 1, 1, 1, 3),
('Star Sapphire Blue', 'star-sapphire', 3200.00, NULL, 'images/img1.jpg', 'Magnificent blue star sapphire displaying perfect 6-ray asterism. Extremely rare natural phenomenon.', 5.80, '12x10mm', 'Sri Lanka', 'Unheated', 'SI', 'Good', 'AA', 1, 1, 1, 1, 2),
('White Sapphire Brilliant', 'white-sapphire', 650.00, 585.00, 'images/ws0.jpg', 'Brilliant white sapphire, diamond alternative with excellent sparkle and durability.', 2.40, '7x7mm', 'Sri Lanka', 'Unheated', 'VVS', 'Excellent', 'AAA', 0, 0, 1, 1, 15),
('Premium Ruby Gemstone', 'ruby', 3500.00, NULL, 'images/rb0.jpg', 'Stunning natural ruby with pigeon blood red color. Exceptional quality and brilliance.', 3.20, '8.5x7mm', 'Myanmar', 'Heated', 'VVS', 'Excellent', 'AAA', 1, 1, 1, 1, 3),
('Burmese Ruby', 'ruby', 2800.00, 2520.00, 'images/rb2.jpg', 'Classic Burmese ruby with rich red color and excellent clarity.', 2.75, '8x6mm', 'Myanmar', 'Heated', 'VS', 'Very Good', 'AA+', 1, 0, 1, 1, 5),
('Colombian Emerald', 'emerald', 2200.00, NULL, 'images/img2.jpg', 'Premium Colombian emerald with vivid green color and good clarity. Highly prized gemstone.', 3.10, '9x7mm', 'Colombia', 'Oiled', 'VS', 'Very Good', 'AAA', 1, 1, 1, 1, 4),
('Brilliant Cut Diamond', 'diamond', 4500.00, NULL, 'images/pd0.jpg', 'Certified brilliant cut diamond with exceptional fire and brilliance. GIA certified.', 1.25, '6.5mm', 'South Africa', 'None', 'VVS1', 'Excellent', 'D', 1, 1, 1, 1, 2),
('Mozambique Garnet', 'garnet', 350.00, 315.00, 'images/img3.jpg', 'Deep red Mozambique garnet with excellent clarity and color.', 4.50, '10x8mm', 'Mozambique', 'None', 'VS', 'Good', 'AA', 0, 0, 1, 1, 20),
('Ethiopian Opal', 'opal', 780.00, NULL, 'images/img4.jpg', 'Stunning Ethiopian opal with rainbow play of colors. Natural hydrophane opal.', 2.20, '12x10mm', 'Ethiopia', 'None', 'Translucent', 'Good', 'AAA', 0, 1, 1, 1, 7),
('Blue Zircon', 'zircon', 420.00, NULL, 'images/img5.jpg', 'Brilliant blue zircon with diamond-like sparkle. Natural gemstone with exceptional fire.', 3.80, '9x7mm', 'Cambodia', 'Heated', 'VVS', 'Very Good', 'AA', 0, 0, 1, 1, 12);
