<?php
/**
 * KME Pest Control - WordPress Configuration Additions
 * Add these configurations to your wp-config.php file
 */

// ========================================
// HEADLESS WORDPRESS CONFIGURATION
// ========================================

// Enable REST API (should be enabled by default)
define('REST_API_ENABLED', true);

// Disable XML-RPC (security enhancement)
define('XMLRPC_ENABLED', false);

// Increase memory limit for API operations
define('WP_MEMORY_LIMIT', '256M');

// Enable debug mode (disable in production)
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', false);
define('WP_DEBUG_DISPLAY', false);

// ========================================
// SECURITY CONFIGURATIONS
// ========================================

// Disable file editing from admin
define('DISALLOW_FILE_EDIT', true);

// Disable plugin/theme installation from admin
define('DISALLOW_FILE_MODS', false); // Set to true for maximum security

// Force SSL for admin and login
define('FORCE_SSL_ADMIN', true);

// Security keys (generate new ones at https://api.wordpress.org/secret-key/1.1/salt/)
define('AUTH_KEY',         'put your unique phrase here');
define('SECURE_AUTH_KEY',  'put your unique phrase here');
define('LOGGED_IN_KEY',    'put your unique phrase here');
define('NONCE_KEY',        'put your unique phrase here');
define('AUTH_SALT',        'put your unique phrase here');
define('SECURE_AUTH_SALT', 'put your unique phrase here');
define('LOGGED_IN_SALT',   'put your unique phrase here');
define('NONCE_SALT',       'put your unique phrase here');

// ========================================
// PERFORMANCE CONFIGURATIONS
// ========================================

// Enable caching
define('WP_CACHE', true);

// Increase autosave interval (in seconds)
define('AUTOSAVE_INTERVAL', 300); // 5 minutes

// Limit post revisions
define('WP_POST_REVISIONS', 3);

// Increase max execution time for API operations
define('WP_MAX_EXECUTION_TIME', 300);

// ========================================
// API-SPECIFIC CONFIGURATIONS
// ========================================

// Custom API configurations
define('KME_API_VERSION', '1.0.0');
define('KME_API_CACHE_DURATION', 300); // 5 minutes
define('KME_RATE_LIMIT_REQUESTS', 100); // per hour
define('KME_MAX_UPLOAD_SIZE', '10M');

// Email configuration
define('KME_CONTACT_EMAIL', 'support@kmepest.com');
define('KME_ADMIN_EMAIL', 'admin@kmepest.com');
define('KME_FROM_EMAIL', 'noreply@kmepest.com');

// Business information
define('KME_BUSINESS_NAME', 'KME Pest Control');
define('KME_BUSINESS_PHONE', '+609 573 2525');
define('KME_BUSINESS_ADDRESS', 'A13, Ground Floor Lorong IM2, 94, Taman Medan Mansyur, Bandar Indera Mahkota, 25200 Kuantan, Pahang');

// ========================================
// CORS CONFIGURATION
// ========================================

// Allowed origins for CORS (update with your domains)
define('KME_ALLOWED_ORIGINS', serialize([
    'https://pakaranaianai.vercel.app',
    'https://pakaranaianai.com',
    'https://www.pakaranaianai.com',
    'http://localhost:3000',
    'http://localhost:8080'
]));

// ========================================
// DATABASE OPTIMIZATION
// ========================================

// Optimize database queries
define('WP_USE_EXT_MYSQL', false);

// Enable MySQL query cache
define('WP_ALLOW_REPAIR', false); // Set to true only when needed

// ========================================
// MULTISITE CONFIGURATION (if needed)
// ========================================

// Uncomment if using WordPress Multisite
/*
define('WP_ALLOW_MULTISITE', true);
define('MULTISITE', true);
define('SUBDOMAIN_INSTALL', false);
define('DOMAIN_CURRENT_SITE', 'yourdomain.com');
define('PATH_CURRENT_SITE', '/');
define('SITE_ID_CURRENT_SITE', 1);
define('BLOG_ID_CURRENT_SITE', 1);
*/

// ========================================
// CUSTOM PATHS (if needed)
// ========================================

// Custom content directory
// define('WP_CONTENT_DIR', dirname(__FILE__) . '/wp-content');
// define('WP_CONTENT_URL', 'http://example.com/wp-content');

// Custom uploads directory
// define('UPLOADS', 'wp-content/uploads');

// ========================================
// LOGGING CONFIGURATION
// ========================================

// Custom log file for API requests
define('KME_LOG_API_REQUESTS', true);
define('KME_LOG_FILE', WP_CONTENT_DIR . '/kme-api.log');

// Error logging
ini_set('log_errors', 1);
ini_set('error_log', WP_CONTENT_DIR . '/debug.log');

// ========================================
// MAINTENANCE MODE
// ========================================

// Enable maintenance mode (uncomment when needed)
// define('WP_MAINTENANCE_MODE', true);

?>
