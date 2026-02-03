# JP Gems E-Commerce Website

A complete e-commerce website for selling gemstones online with a comprehensive admin panel.

## Features

### Customer Features
- 🏠 **Home Page** - Hero slider, featured gemstones, categories
- 💎 **Gemstone Catalog** - Browse all gemstones by category
- 📱 **Product Details** - Detailed product pages with image galleries
- 👤 **User Authentication** - Login, signup, and profile management
- 🌙 **Dark Mode** - Theme toggle for better user experience
- 📧 **Contact Form** - Get in touch with the store
- ⭐ **Feedback System** - Share your experience

### Admin Features
- 📊 **Dashboard** - Overview of sales, orders, users
- 💎 **Gemstone Management** - Add, edit, delete gemstones
- 🏷️ **Category Management** - Manage product categories
- 📦 **Order Management** - View and update orders
- 👥 **User Management** - View and manage customers
- 💬 **Message Management** - View contact messages
- ⭐ **Feedback Management** - Approve/reject customer feedback
- ⚙️ **Settings** - Store settings and configurations

## Installation

### Prerequisites
- XAMPP (Apache + MySQL + PHP)
- Web browser

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/chathura890/JpGems.git
   ```

2. **Move to XAMPP htdocs**
   ```
   Copy the JpGems folder to C:\xampp\htdocs\
   ```

3. **Start XAMPP**
   - Open XAMPP Control Panel
   - Start Apache
   - Start MySQL

4. **Create Database**
   - Open phpMyAdmin: http://localhost/phpmyadmin
   - Create a new database named `jpgems_db`
   - Import the SQL files:
     - First import: `database/jpgems_complete.sql`
     - Then import: `database/sample-data.sql` (for sample data)

5. **Access the Website**
   - Customer Site: http://localhost/JpGems/index.html
   - Admin Panel: http://localhost/JpGems/admin/login.html

## Admin Login Credentials

```
Email: admin@jpgems.com
Password: admin123
```

## Project Structure

```
JpGems/
├── admin/                  # Admin panel
│   ├── css/               # Admin styles
│   ├── js/                # Admin JavaScript
│   ├── index.html         # Admin dashboard
│   └── login.html         # Admin login
├── css/                    # Customer site styles
├── database/              # SQL files
├── html/                  # Product category pages
├── images/                # Images
├── js/                    # JavaScript files
├── php/                   # Backend PHP files
│   ├── admin/            # Admin API endpoints
│   ├── api/              # Customer API endpoints
│   ├── auth/             # Authentication
│   ├── config/           # Database configuration
│   ├── contact/          # Contact form handler
│   ├── feedback/         # Feedback handler
│   └── user/             # User management
├── index.html             # Home page
├── about.html             # About page
├── contact.html           # Contact page
├── feedback.html          # Feedback page
├── login.html             # Customer login
└── signup.html            # Customer signup
```

## Database Tables

- `users` - Customer accounts
- `gemstones` - Product information
- `categories` - Product categories
- `orders` - Customer orders
- `order_items` - Order details
- `contact_messages` - Contact form submissions
- `feedback` - Customer feedback

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: PHP 7+
- **Database**: MySQL
- **Server**: Apache
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Poppins)

## Features in Detail

### Admin Panel
- **Dashboard**: Real-time statistics and recent orders
- **CRUD Operations**: Complete create, read, update, delete for all entities
- **Search & Filter**: Find data quickly
- **Responsive Design**: Works on all devices
- **Modal Forms**: User-friendly popups for data entry

### Customer Site
- **Responsive Design**: Mobile-first approach
- **Product Gallery**: Interactive image viewer
- **Cart System**: Add to cart functionality
- **User Profiles**: Personal account management
- **Theme Toggle**: Light/dark mode

## Future Enhancements

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Advanced search and filters
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Order tracking
- [ ] Multi-language support
- [ ] Admin role management

## Support

For support, email admin@jpgems.com or create an issue in the repository.

## License

This project is for educational purposes.

## Author

Chathura - [GitHub](https://github.com/chathura890)
