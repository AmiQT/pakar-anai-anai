# 🔧 Backend Developer Guide - KME Pest Control

**Complete technical guide for backend development pada KME Pest Control WordPress headless system**

---

## 📋 Project Overview

### **Architecture Summary**
- **CMS**: WordPress 5.9+ (Headless Configuration)
- **Database**: MySQL 5.7+ / MariaDB 10.3+
- **API**: WordPress REST API + Custom Endpoints
- **Frontend**: Decoupled Vanilla JavaScript (Vercel)
- **Server**: Traditional PHP hosting + MySQL
- **Integration**: CORS-enabled API untuk cross-origin requests

### **Business Context**
- **Company**: KME Pest Control (15+ years experience)
- **Services**: Pest control dengan booking system
- **Target**: Professional B2C service website
- **Scale**: ~20,000 customers, moderate traffic

---

## 🏗️ System Architecture

### **Headless WordPress Setup**
```
Frontend (Vercel)          Backend (WordPress Host)
┌─────────────────────┐    ┌──────────────────────────┐
│ Static HTML/CSS/JS  │◄──►│ WordPress Headless CMS   │
│ ┌─────────────────┐ │    │ ┌──────────────────────┐ │
│ │ User Interface  │ │    │ │ Content Management   │ │
│ │ Forms           │ │    │ │ Custom Post Types    │ │
│ │ Interactions    │ │    │ │ REST API Endpoints   │ │
│ └─────────────────┘ │    │ │ Media Library        │ │
└─────────────────────┘    │ └──────────────────────┘ │
                           └──────────────────────────┘
                                       │
                              ┌─────────────────┐
                              │ MySQL Database  │
                              │ - wp_posts      │
                              │ - wp_postmeta   │
                              │ - wp_users      │
                              │ - custom_tables │
                              └─────────────────┘
```

### **API Communication Flow**
```
Frontend Request → CORS Headers → WordPress API → Database → Response → Frontend
```

---

## 🗄️ Database Structure

### **Core WordPress Tables** 
```sql
-- Content Management
wp_posts          # Pages, posts, custom post types
wp_postmeta       # Custom fields, ACF data
wp_terms          # Categories, tags, taxonomies
wp_term_taxonomy  # Term relationships

-- User Management
wp_users          # Admin users (customer data via forms)
wp_usermeta       # User metadata

-- Configuration
wp_options        # Site settings, theme options
```

### **Custom Business Tables** (Recommendations)
```sql
-- Booking System
CREATE TABLE wp_kme_bookings (
    id int(11) NOT NULL AUTO_INCREMENT,
    first_name varchar(100) NOT NULL,
    last_name varchar(100) NOT NULL,
    email varchar(200) NOT NULL,
    phone varchar(20) NOT NULL,
    service_type varchar(100) NOT NULL,
    preferred_date date NULL,
    preferred_time varchar(50) NULL,
    address text NOT NULL,
    notes text NULL,
    status enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Contact Forms
CREATE TABLE wp_kme_contacts (
    id int(11) NOT NULL AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    email varchar(200) NOT NULL,
    phone varchar(20) NULL,
    subject varchar(200) NOT NULL,
    message text NOT NULL,
    status enum('new','read','replied') DEFAULT 'new',
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Service Analytics
CREATE TABLE wp_kme_analytics (
    id int(11) NOT NULL AUTO_INCREMENT,
    event_type varchar(50) NOT NULL,
    event_data json NULL,
    ip_address varchar(45) NULL,
    user_agent text NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
```

### **Database Configuration**
```php
// wp-config.php database settings
define('DB_NAME', 'database_name');
define('DB_USER', 'username');
define('DB_PASSWORD', 'password');
define('DB_HOST', 'localhost');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

// Performance optimizations
define('WP_MEMORY_LIMIT', '256M');
define('ENABLE_CACHE', true);
define('WP_DEBUG', false); // true untuk development
define('WP_DEBUG_LOG', true);
```

---

## 🚀 WordPress Headless Configuration

### **Core Configuration Files**

#### **wp-config-additions.php**
```php
<?php
// KME Pest Control - WordPress Headless Configuration

// API Configuration
define('HEADLESS_MODE', true);
define('FRONTEND_URL', 'https://pakaranaianai.vercel.app');

// CORS Configuration
add_action('rest_api_init', function() {
    $allowed_origins = [
        'https://pakaranaianai.vercel.app',
        'https://pakaranaianai.com', 
        'http://localhost:3000'
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowed_origins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Allow-Credentials: true');
    }
});

// Handle preflight requests
add_action('rest_api_init', function() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit();
    }
});

// Security enhancements
define('DISALLOW_FILE_EDIT', true);
define('FORCE_SSL_ADMIN', true);
define('WP_POST_REVISIONS', 3);
```

#### **functions.php** (Theme/Plugin)
```php
<?php
// KME Pest Control - Custom Functions

// Remove unnecessary WordPress features for headless
add_action('wp_enqueue_scripts', function() {
    if (defined('HEADLESS_MODE') && HEADLESS_MODE) {
        // Remove theme styles/scripts
        wp_dequeue_style('wp-block-library');
        wp_dequeue_style('wp-block-library-theme');
        wp_dequeue_style('classic-theme-styles');
    }
});

// Custom REST API endpoints
add_action('rest_api_init', function() {
    // Site settings endpoint
    register_rest_route('kme/v1', '/site-settings', array(
        'methods' => 'GET',
        'callback' => 'kme_get_site_settings',
        'permission_callback' => '__return_true'
    ));
    
    // Booking form endpoint
    register_rest_route('kme/v1', '/booking-form', array(
        'methods' => 'POST',
        'callback' => 'kme_handle_booking',
        'permission_callback' => '__return_true'
    ));
    
    // Contact form endpoint  
    register_rest_route('kme/v1', '/contact-form', array(
        'methods' => 'POST',
        'callback' => 'kme_handle_contact',
        'permission_callback' => '__return_true'
    ));
});

// Site settings API
function kme_get_site_settings() {
    return array(
        'company_name' => 'KME Pest Control',
        'tagline' => 'Expert In Pest Control',
        'phone' => '+6011 2962 3741',
        'email' => 'kmepc.official@gmail.com',
        'address' => 'A13, Ground Floor Lorong IM2, 94, Taman Medan Mansyur, Bandar Indera Mahkota, 25200 Kuantan, Pahang',
        'business_hours' => array(
            'monday_friday' => '8:30am - 5:30pm',
            'saturday' => '8:30am - 1:00pm', 
            'sunday' => 'Closed'
        ),
        'social_media' => array(
            'whatsapp' => 'https://wsap.to/kmepestcontrol',
            'facebook' => 'https://facebook.com/kmepestcontrol',
            'instagram' => 'https://instagram.com/kmepestcontrol'
        )
    );
}

// Booking form handler
function kme_handle_booking($request) {
    $params = $request->get_json_params();
    
    // Sanitize input
    $first_name = sanitize_text_field($params['first_name'] ?? '');
    $last_name = sanitize_text_field($params['last_name'] ?? '');
    $email = sanitize_email($params['email'] ?? '');
    $phone = sanitize_text_field($params['phone'] ?? '');
    $details = sanitize_textarea_field($params['details'] ?? '');
    $date = sanitize_text_field($params['date'] ?? '');
    
    // Validate required fields
    if (empty($first_name) || empty($email) || empty($phone)) {
        return new WP_Error('missing_fields', 'Required fields missing', array('status' => 400));
    }
    
    // Validate email format
    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email format', array('status' => 400));
    }
    
    // Insert booking
    global $wpdb;
    $result = $wpdb->insert(
        $wpdb->prefix . 'kme_bookings',
        array(
            'first_name' => $first_name,
            'last_name' => $last_name,
            'email' => $email,
            'phone' => $phone,
            'details' => $details,
            'preferred_date' => $date,
            'status' => 'pending'
        )
    );
    
    if ($result === false) {
        return new WP_Error('db_error', 'Database error', array('status' => 500));
    }
    
    // Send notification email
    $subject = 'New Booking Request - KME Pest Control';
    $message = "New booking request received:\n\n";
    $message .= "Name: {$first_name} {$last_name}\n";
    $message .= "Email: {$email}\n";
    $message .= "Phone: {$phone}\n";
    $message .= "Date: {$date}\n";
    $message .= "Details: {$details}\n";
    
    wp_mail('kmepc.official@gmail.com', $subject, $message);
    
    return array(
        'success' => true,
        'message' => 'Booking request submitted successfully',
        'booking_id' => $wpdb->insert_id
    );
}

// Contact form handler
function kme_handle_contact($request) {
    $params = $request->get_json_params();
    
    // Sanitize and validate
    $name = sanitize_text_field($params['name'] ?? '');
    $email = sanitize_email($params['email'] ?? '');
    $phone = sanitize_text_field($params['phone'] ?? '');
    $subject = sanitize_text_field($params['subject'] ?? '');
    $message = sanitize_textarea_field($params['message'] ?? '');
    
    if (empty($name) || empty($email) || empty($message)) {
        return new WP_Error('missing_fields', 'Required fields missing', array('status' => 400));
    }
    
    // Insert contact
    global $wpdb;
    $result = $wpdb->insert(
        $wpdb->prefix . 'kme_contacts',
        array(
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'subject' => $subject,
            'message' => $message,
            'status' => 'new'
        )
    );
    
    if ($result === false) {
        return new WP_Error('db_error', 'Database error', array('status' => 500));
    }
    
    // Send notification
    wp_mail('kmepc.official@gmail.com', "Contact Form: {$subject}", 
            "From: {$name} <{$email}>\nPhone: {$phone}\n\n{$message}");
    
    return array(
        'success' => true,
        'message' => 'Message sent successfully'
    );
}

// Add custom fields to pages
function kme_add_custom_fields_to_api() {
    register_rest_field('page', 'custom_fields', array(
        'get_callback' => function($object) {
            return get_fields($object['id']); // ACF function
        }
    ));
}
add_action('rest_api_init', 'kme_add_custom_fields_to_api');
```

### **.htaccess Configuration**
```apache
# KME Pest Control - Server Configuration

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # CORS headers for API
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
</IfModule>

# WordPress rewrite rules
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.php$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.php [L]
</IfModule>

# Disable file execution in uploads
<Files *.php>
    Require all denied
</Files>
```

---

## 📡 API Endpoints & Documentation

### **Core WordPress REST API**

#### **Pages & Content**
```http
# Get all pages
GET /wp-json/wp/v2/pages
Response: Array of page objects

# Get specific page
GET /wp-json/wp/v2/pages/{id}
Response: Single page object

# Get page by slug
GET /wp-json/wp/v2/pages?slug=about
Response: Array with single page object
```

#### **Media & Assets**
```http
# Get media library
GET /wp-json/wp/v2/media
Response: Array of media objects

# Get specific media
GET /wp-json/wp/v2/media/{id}
Response: Single media object with URLs
```

### **Custom KME API Endpoints**

#### **Site Settings**
```http
GET /wp-json/kme/v1/site-settings

Response:
{
    "company_name": "KME Pest Control",
    "tagline": "Expert In Pest Control",
    "phone": "+6011 2962 3741",
    "email": "kmepc.official@gmail.com",
    "address": "A13, Ground Floor...",
    "business_hours": {
        "monday_friday": "8:30am - 5:30pm",
        "saturday": "8:30am - 1:00pm",
        "sunday": "Closed"
    },
    "social_media": {
        "whatsapp": "https://wsap.to/kmepestcontrol",
        "facebook": "https://facebook.com/kmepestcontrol"
    }
}
```

#### **Booking Form Submission**
```http
POST /wp-json/kme/v1/booking-form
Content-Type: application/json

Request Body:
{
    "first_name": "Ahmad",
    "last_name": "Abdullah", 
    "email": "ahmad@gmail.com",
    "phone": "012-3456789",
    "details": "Service details here",
    "date": "2024-01-15"
}

Success Response (200):
{
    "success": true,
    "message": "Booking request submitted successfully",
    "booking_id": 123
}

Error Response (400):
{
    "code": "missing_fields",
    "message": "Required fields missing",
    "data": {
        "status": 400
    }
}
```

#### **Contact Form Submission**
```http
POST /wp-json/kme/v1/contact-form
Content-Type: application/json

Request Body:
{
    "name": "Ahmad Abdullah",
    "email": "ahmad@gmail.com", 
    "phone": "012-3456789",
    "subject": "Inquiry about services",
    "message": "Message content here"
}

Response:
{
    "success": true,
    "message": "Message sent successfully"
}
```

### **API Error Handling**
```php
// Standard error response format
function kme_api_error($code, $message, $status = 400) {
    return new WP_Error($code, $message, array('status' => $status));
}

// Common error responses:
// 400 - Bad Request (missing/invalid data)
// 401 - Unauthorized (authentication required)
// 403 - Forbidden (permission denied)  
// 404 - Not Found (endpoint/resource not found)
// 500 - Internal Server Error (database/system error)
```

---

## 🛡️ Security Implementation

### **Input Validation & Sanitization**
```php
// Input sanitization functions
function kme_sanitize_booking_data($data) {
    return array(
        'first_name' => sanitize_text_field($data['first_name'] ?? ''),
        'last_name' => sanitize_text_field($data['last_name'] ?? ''),
        'email' => sanitize_email($data['email'] ?? ''),
        'phone' => sanitize_text_field($data['phone'] ?? ''),
        'details' => sanitize_textarea_field($data['details'] ?? ''),
        'date' => sanitize_text_field($data['date'] ?? '')
    );
}

// Validation functions
function kme_validate_booking_data($data) {
    $errors = array();
    
    if (empty($data['first_name'])) {
        $errors[] = 'First name is required';
    }
    
    if (empty($data['email']) || !is_email($data['email'])) {
        $errors[] = 'Valid email is required';
    }
    
    if (empty($data['phone'])) {
        $errors[] = 'Phone number is required';
    }
    
    // Malaysian phone validation
    if (!preg_match('/^(\+?6?01)[0-46-9]-?[0-9]{7,8}$/', $data['phone'])) {
        $errors[] = 'Invalid Malaysian phone number format';
    }
    
    return $errors;
}
```

### **Authentication & Permissions**
```php
// API key authentication (optional enhancement)
function kme_verify_api_key($request) {
    $api_key = $request->get_header('X-API-Key');
    $valid_key = get_option('kme_api_key', '');
    
    if (empty($api_key) || $api_key !== $valid_key) {
        return new WP_Error('invalid_api_key', 'Invalid API key', array('status' => 401));
    }
    
    return true;
}

// Rate limiting
function kme_rate_limit_check($ip_address) {
    $cache_key = 'kme_rate_limit_' . md5($ip_address);
    $requests = wp_cache_get($cache_key);
    
    if ($requests === false) {
        wp_cache_set($cache_key, 1, '', 3600); // 1 hour
        return true;
    }
    
    if ($requests >= 60) { // 60 requests per hour
        return false;
    }
    
    wp_cache_set($cache_key, $requests + 1, '', 3600);
    return true;
}
```

### **SQL Injection Prevention**
```php
// Always use prepared statements
global $wpdb;

// ❌ Bad - SQL injection vulnerable
$user_input = $_POST['email'];
$query = "SELECT * FROM {$wpdb->prefix}kme_bookings WHERE email = '{$user_input}'";
$results = $wpdb->get_results($query);

// ✅ Good - Safe prepared statement
$email = sanitize_email($_POST['email']);
$query = $wpdb->prepare(
    "SELECT * FROM {$wpdb->prefix}kme_bookings WHERE email = %s",
    $email
);
$results = $wpdb->get_results($query);

// ✅ Better - Using wpdb methods
$results = $wpdb->get_results($wpdb->prepare(
    "SELECT * FROM {$wpdb->prefix}kme_bookings WHERE email = %s AND status = %s",
    $email,
    'pending'
));
```

---

## 📧 Email System Configuration

### **WordPress Mail Configuration**
```php
// SMTP Configuration (recommended over default PHP mail)
add_action('phpmailer_init', function($phpmailer) {
    $phpmailer->isSMTP();
    $phpmailer->Host = 'smtp.gmail.com'; // or hosting SMTP
    $phpmailer->SMTPAuth = true;
    $phpmailer->Port = 587;
    $phpmailer->Username = 'kmepc.official@gmail.com';
    $phpmailer->Password = 'app_password_here';
    $phpmailer->SMTPSecure = 'tls';
    $phpmailer->From = 'kmepc.official@gmail.com';
    $phpmailer->FromName = 'KME Pest Control';
});

// Email templates
function kme_send_booking_confirmation($booking_data) {
    $subject = 'Booking Confirmation - KME Pest Control';
    
    $message = "Dear {$booking_data['first_name']},\n\n";
    $message .= "Thank you for your booking request. We have received your inquiry and will contact you within 24 hours to confirm your appointment.\n\n";
    $message .= "Booking Details:\n";
    $message .= "Name: {$booking_data['first_name']} {$booking_data['last_name']}\n";
    $message .= "Phone: {$booking_data['phone']}\n";
    $message .= "Preferred Date: {$booking_data['date']}\n\n";
    $message .= "If you have any urgent questions, please call us at +6011 2962 3741.\n\n";
    $message .= "Best regards,\n";
    $message .= "KME Pest Control Team\n";
    $message .= "Expert In Pest Control";
    
    return wp_mail($booking_data['email'], $subject, $message);
}

function kme_send_admin_notification($booking_data) {
    $subject = 'New Booking Request - KME Pest Control';
    
    $message = "New booking request received:\n\n";
    $message .= "Customer: {$booking_data['first_name']} {$booking_data['last_name']}\n";
    $message .= "Email: {$booking_data['email']}\n";
    $message .= "Phone: {$booking_data['phone']}\n";
    $message .= "Preferred Date: {$booking_data['date']}\n";
    $message .= "Details: {$booking_data['details']}\n\n";
    $message .= "Please follow up within 24 hours.\n";
    $message .= "Admin Panel: " . admin_url('admin.php?page=kme-bookings');
    
    return wp_mail('kmepc.official@gmail.com', $subject, $message);
}
```

---

## 🔧 Development & Maintenance

### **Local Development Setup**

#### **Requirements**
```bash
# Server requirements
PHP 7.4+ (recommended 8.0+)
MySQL 5.7+ or MariaDB 10.3+
Apache 2.4+ or Nginx 1.18+
mod_rewrite enabled
SSL certificate

# Development tools
WordPress CLI (WP-CLI)
Composer
Node.js (for frontend)
Git
```

#### **Local Environment (XAMPP/WAMP/MAMP)**
```bash
# 1. Download WordPress
wget https://wordpress.org/latest.zip

# 2. Create database
mysql -u root -p
CREATE DATABASE kme_pest_control;
CREATE USER 'kme_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON kme_pest_control.* TO 'kme_user'@'localhost';

# 3. Configure wp-config.php
cp wp-config-sample.php wp-config.php
# Edit database credentials

# 4. Install WordPress
# Visit http://localhost/kme-pest-control
# Complete installation wizard

# 5. Apply custom configuration
# Copy functions.php to active theme
# Copy wp-config-additions.php to root
# Update .htaccess rules
```

### **Database Migration**
```php
// Migration script for custom tables
function kme_create_custom_tables() {
    global $wpdb;
    
    $charset_collate = $wpdb->get_charset_collate();
    
    // Bookings table
    $sql = "CREATE TABLE {$wpdb->prefix}kme_bookings (
        id int(11) NOT NULL AUTO_INCREMENT,
        first_name varchar(100) NOT NULL,
        last_name varchar(100) NOT NULL,
        email varchar(200) NOT NULL,
        phone varchar(20) NOT NULL,
        service_type varchar(100) NULL,
        preferred_date date NULL,
        preferred_time varchar(50) NULL,
        address text NULL,
        notes text NULL,
        status enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_email (email),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
    
    // Contacts table
    $sql = "CREATE TABLE {$wpdb->prefix}kme_contacts (
        id int(11) NOT NULL AUTO_INCREMENT,
        name varchar(100) NOT NULL,
        email varchar(200) NOT NULL,
        phone varchar(20) NULL,
        subject varchar(200) NOT NULL,
        message text NOT NULL,
        status enum('new','read','replied') DEFAULT 'new',
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_email (email),
        INDEX idx_status (status)
    ) $charset_collate;";
    
    dbDelta($sql);
}

// Run migration
add_action('wp_loaded', 'kme_create_custom_tables');
```

### **Performance Optimization**

#### **Database Optimization**
```sql
-- Add indexes for better query performance
ALTER TABLE wp_posts ADD INDEX idx_post_status_type (post_status, post_type);
ALTER TABLE wp_postmeta ADD INDEX idx_meta_key_value (meta_key, meta_value(50));

-- Optimize tables periodically
OPTIMIZE TABLE wp_posts, wp_postmeta, wp_options;

-- Clean up revisions and spam
DELETE FROM wp_posts WHERE post_type = 'revision' AND post_date < DATE_SUB(NOW(), INTERVAL 30 DAY);
DELETE FROM wp_comments WHERE comment_approved = 'spam' AND comment_date < DATE_SUB(NOW(), INTERVAL 7 DAY);
```

#### **Caching Configuration**
```php
// Object caching with Redis/Memcached
define('WP_CACHE', true);

// Database query caching
function kme_cache_api_response($key, $data, $expiration = 300) {
    wp_cache_set($key, $data, 'kme_api', $expiration);
}

function kme_get_cached_api_response($key) {
    return wp_cache_get($key, 'kme_api');
}

// Example usage in API endpoint
function kme_get_site_settings() {
    $cache_key = 'kme_site_settings';
    $settings = kme_get_cached_api_response($cache_key);
    
    if ($settings === false) {
        $settings = array(
            'company_name' => get_option('company_name', 'KME Pest Control'),
            // ... other settings
        );
        kme_cache_api_response($cache_key, $settings, 3600); // 1 hour
    }
    
    return $settings;
}
```

---

## 🧪 Testing & Quality Assurance

### **API Testing**

#### **Manual Testing with cURL**
```bash
# Test site settings endpoint
curl -X GET "https://your-wordpress-site.com/wp-json/kme/v1/site-settings" \
     -H "Content-Type: application/json"

# Test booking form submission
curl -X POST "https://your-wordpress-site.com/wp-json/kme/v1/booking-form" \
     -H "Content-Type: application/json" \
     -d '{
       "first_name": "Test",
       "last_name": "User", 
       "email": "test@example.com",
       "phone": "012-3456789",
       "details": "Test booking",
       "date": "2024-01-15"
     }'

# Test contact form submission
curl -X POST "https://your-wordpress-site.com/wp-json/kme/v1/contact-form" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "subject": "Test inquiry",
       "message": "This is a test message"
     }'
```

#### **Automated Testing with PHPUnit**
```php
class KME_API_Test extends WP_UnitTestCase {
    
    public function test_booking_form_valid_submission() {
        $request = new WP_REST_Request('POST', '/kme/v1/booking-form');
        $request->set_body_params(array(
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'phone' => '012-3456789',
            'details' => 'Test booking'
        ));
        
        $response = kme_handle_booking($request);
        
        $this->assertArrayHasKey('success', $response);
        $this->assertTrue($response['success']);
    }
    
    public function test_booking_form_missing_fields() {
        $request = new WP_REST_Request('POST', '/kme/v1/booking-form');
        $request->set_body_params(array(
            'first_name' => 'John'
            // Missing required fields
        ));
        
        $response = kme_handle_booking($request);
        
        $this->assertInstanceOf('WP_Error', $response);
        $this->assertEquals('missing_fields', $response->get_error_code());
    }
}
```

### **Database Testing**
```php
function kme_test_database_operations() {
    global $wpdb;
    
    // Test table existence
    $table_name = $wpdb->prefix . 'kme_bookings';
    $table_exists = $wpdb->get_var("SHOW TABLES LIKE '{$table_name}'") == $table_name;
    
    if (!$table_exists) {
        error_log('KME: Bookings table does not exist');
        return false;
    }
    
    // Test insert operation
    $test_data = array(
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'phone' => '012-3456789',
        'status' => 'pending'
    );
    
    $result = $wpdb->insert($table_name, $test_data);
    
    if ($result === false) {
        error_log('KME: Failed to insert test booking - ' . $wpdb->last_error);
        return false;
    }
    
    // Clean up test data
    $wpdb->delete($table_name, array('email' => 'test@example.com'));
    
    return true;
}
```

---

## 🚀 Deployment & Production

### **Production Deployment Checklist**
```bash
Backend Deployment Checklist:

□ Database Setup:
  - MySQL/MariaDB 5.7+ configured
  - Database user with appropriate permissions
  - Custom tables created
  - Initial data populated

□ WordPress Configuration:
  - WordPress 5.9+ installed
  - wp-config.php configured with production settings
  - wp-config-additions.php applied
  - functions.php updated with custom code
  - .htaccess rules applied

□ Security Configuration:
  - SSL certificate installed and configured
  - Security headers applied
  - File permissions set correctly (755 for directories, 644 for files)
  - wp-config.php set to 600
  - Admin area access restricted
  - Regular security updates scheduled

□ Performance Optimization:
  - Caching plugin installed and configured
  - Database optimized and indexed
  - PHP opcode caching enabled
  - Server compression enabled
  - CDN configured (if applicable)

□ Email Configuration:
  - SMTP settings configured
  - Email deliverability tested
  - Notification emails working

□ API Testing:
  - All endpoints responding correctly
  - CORS headers working
  - Error handling functioning
  - Rate limiting in place (if implemented)

□ Monitoring Setup:
  - Uptime monitoring configured
  - Error logging enabled
  - Database monitoring in place
  - Regular backups scheduled
```

### **Production Environment Variables**
```php
// Production wp-config.php additions
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', false);
define('WP_DEBUG_DISPLAY', false);

// Security settings
define('FORCE_SSL_ADMIN', true);
define('DISALLOW_FILE_EDIT', true);
define('AUTOMATIC_UPDATER_DISABLED', true);

// Performance settings  
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');

// Cache settings
define('WP_CACHE', true);
define('ENABLE_CACHE', true);

// Production API settings
define('FRONTEND_URL', 'https://pakaranaianai.com');
define('API_RATE_LIMIT', 60); // requests per hour
```

### **Backup Strategy**
```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/kme"
DB_NAME="kme_pest_control"
DB_USER="backup_user"
DB_PASS="backup_password"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u$DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Files backup  
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz /path/to/wordpress/

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

# Automate with cron
# 0 2 * * * /path/to/backup_script.sh
```

---

## 📊 Monitoring & Analytics

### **Error Logging**
```php
// Custom error logging
function kme_log_error($message, $data = null) {
    if (WP_DEBUG_LOG) {
        $log_entry = date('[Y-m-d H:i:s] ') . 'KME Error: ' . $message;
        if ($data) {
            $log_entry .= ' Data: ' . print_r($data, true);
        }
        error_log($log_entry);
    }
}

// Usage in API endpoints
function kme_handle_booking($request) {
    try {
        // Booking logic here
    } catch (Exception $e) {
        kme_log_error('Booking submission failed', array(
            'error' => $e->getMessage(),
            'request_data' => $request->get_json_params()
        ));
        return new WP_Error('booking_error', 'Booking submission failed');
    }
}
```

### **Performance Monitoring**
```php
// API response time tracking
function kme_track_api_performance($endpoint, $start_time) {
    $end_time = microtime(true);
    $duration = round(($end_time - $start_time) * 1000, 2); // milliseconds
    
    // Log slow queries (> 500ms)
    if ($duration > 500) {
        error_log("KME Performance: Slow API response - {$endpoint}: {$duration}ms");
    }
    
    // Store in custom analytics table (optional)
    global $wpdb;
    $wpdb->insert(
        $wpdb->prefix . 'kme_analytics',
        array(
            'event_type' => 'api_performance',
            'event_data' => json_encode(array(
                'endpoint' => $endpoint,
                'response_time' => $duration
            ))
        )
    );
}

// Usage
function kme_get_site_settings() {
    $start_time = microtime(true);
    
    // API logic here
    $response = array(/* response data */);
    
    kme_track_api_performance('site-settings', $start_time);
    return $response;
}
```

---

## 📚 Resources & Documentation

### **WordPress Resources**
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [WordPress Plugin Development](https://developer.wordpress.org/plugins/)
- [WordPress Database Structure](https://codex.wordpress.org/Database_Description)
- [WordPress Security Guide](https://wordpress.org/support/article/hardening-wordpress/)

### **PHP & MySQL Resources**  
- [PHP Manual](https://www.php.net/manual/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [PHPUnit Testing Framework](https://phpunit.de/)

### **Internal Documentation**
- `development/docs/DEPLOYMENT_GUIDE.md` - Detailed deployment steps
- `development/wordpress-config/` - Configuration files
- `development/database/` - Database schema and samples

---

## ✅ Backend Development Best Practices

### **Code Quality Standards**
1. **Follow WordPress Coding Standards** - Use official PHP and WordPress conventions
2. **Sanitize All Inputs** - Never trust user input, always sanitize and validate
3. **Use Prepared Statements** - Prevent SQL injection attacks
4. **Implement Proper Error Handling** - Graceful error responses with logging
5. **Cache API Responses** - Improve performance with smart caching
6. **Version Control** - Track all configuration and custom code changes
7. **Documentation** - Document all custom endpoints and functions

### **Security Best Practices**
1. **Regular Updates** - Keep WordPress, PHP, and MySQL updated
2. **Strong Authentication** - Use strong passwords and 2FA where possible
3. **File Permissions** - Set appropriate file and directory permissions
4. **Input Validation** - Validate and sanitize all API inputs
5. **Rate Limiting** - Implement API rate limiting to prevent abuse
6. **SSL/HTTPS** - Enforce SSL for all admin and API communications
7. **Regular Backups** - Automated daily backups with offsite storage

### **Performance Best Practices**
1. **Database Optimization** - Use indexes, optimize queries, clean up regularly
2. **Caching Strategy** - Implement multi-level caching (object, page, CDN)
3. **Monitor Performance** - Track API response times and database performance
4. **Optimize Images** - Compress and serve images efficiently
5. **Server Configuration** - Optimize PHP, MySQL, and web server settings
6. **Code Profiling** - Identify and fix performance bottlenecks

---

*Master the backend, power the frontend! Build robust APIs for KME Pest Control! 🔧*
