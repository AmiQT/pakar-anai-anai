<?php
/**
 * KME Pest Control - WordPress Headless Configuration
 * Custom functions for headless WordPress setup
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// ========================================
// HEADLESS WORDPRESS SETUP
// ========================================

/**
 * Enable CORS for REST API
 */
function kme_enable_cors() {
    // Allow specific origins (update with your domain)
    $allowed_origins = [
        'https://pakaranaianai.vercel.app',
        'https://pakaranaianai.com',
        'http://localhost:3000',
        'http://localhost:8080'
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
    header('Access-Control-Allow-Credentials: true');
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        exit(0);
    }
}
add_action('init', 'kme_enable_cors');
add_action('rest_api_init', 'kme_enable_cors');

/**
 * Remove WordPress admin bar for headless setup
 */
function kme_remove_admin_bar() {
    if (!current_user_can('administrator')) {
        show_admin_bar(false);
    }
}
add_action('after_setup_theme', 'kme_remove_admin_bar');

/**
 * Disable WordPress frontend (optional - for pure headless)
 */
function kme_disable_frontend() {
    // Uncomment if you want pure headless (no frontend access)
    /*
    if (!is_admin() && !wp_doing_ajax() && !wp_doing_cron()) {
        wp_redirect(admin_url());
        exit;
    }
    */
}
add_action('template_redirect', 'kme_disable_frontend');

// ========================================
// REST API ENHANCEMENTS
// ========================================

/**
 * Add custom fields to REST API response
 */
function kme_add_custom_fields_to_api() {
    // Add featured image URL to posts/pages
    register_rest_field(['post', 'page'], 'featured_image_url', [
        'get_callback' => function($object) {
            $image_id = get_post_thumbnail_id($object['id']);
            if ($image_id) {
                return [
                    'full' => wp_get_attachment_image_url($image_id, 'full'),
                    'large' => wp_get_attachment_image_url($image_id, 'large'),
                    'medium' => wp_get_attachment_image_url($image_id, 'medium'),
                    'thumbnail' => wp_get_attachment_image_url($image_id, 'thumbnail')
                ];
            }
            return null;
        }
    ]);
    
    // Add custom fields (ACF support)
    register_rest_field(['post', 'page'], 'custom_fields', [
        'get_callback' => function($object) {
            if (function_exists('get_fields')) {
                return get_fields($object['id']);
            }
            return get_post_meta($object['id']);
        }
    ]);
    
    // Add page template
    register_rest_field('page', 'template', [
        'get_callback' => function($object) {
            return get_page_template_slug($object['id']);
        }
    ]);
}
add_action('rest_api_init', 'kme_add_custom_fields_to_api');

/**
 * Register custom REST API endpoints
 */
function kme_register_custom_endpoints() {
    // Contact form endpoint
    register_rest_route('kme/v1', '/contact-form', [
        'methods' => 'POST',
        'callback' => 'kme_handle_contact_form',
        'permission_callback' => '__return_true',
        'args' => [
            'name' => [
                'required' => true,
                'sanitize_callback' => 'sanitize_text_field'
            ],
            'email' => [
                'required' => true,
                'sanitize_callback' => 'sanitize_email'
            ],
            'phone' => [
                'sanitize_callback' => 'sanitize_text_field'
            ],
            'message' => [
                'required' => true,
                'sanitize_callback' => 'sanitize_textarea_field'
            ]
        ]
    ]);
    
    // Booking form endpoint
    register_rest_route('kme/v1', '/booking-form', [
        'methods' => 'POST',
        'callback' => 'kme_handle_booking_form',
        'permission_callback' => '__return_true',
        'args' => [
            'first_name' => [
                'required' => true,
                'sanitize_callback' => 'sanitize_text_field'
            ],
            'last_name' => [
                'required' => true,
                'sanitize_callback' => 'sanitize_text_field'
            ],
            'email' => [
                'required' => true,
                'sanitize_callback' => 'sanitize_email'
            ],
            'phone' => [
                'sanitize_callback' => 'sanitize_text_field'
            ],
            'details' => [
                'sanitize_callback' => 'sanitize_textarea_field'
            ],
            'date' => [
                'sanitize_callback' => 'sanitize_text_field'
            ]
        ]
    ]);
    
    // Site settings endpoint
    register_rest_route('kme/v1', '/site-settings', [
        'methods' => 'GET',
        'callback' => 'kme_get_site_settings',
        'permission_callback' => '__return_true'
    ]);
    
    // Menu endpoint
    register_rest_route('kme/v1', '/menus/(?P<location>[a-zA-Z0-9_-]+)', [
        'methods' => 'GET',
        'callback' => 'kme_get_menu_by_location',
        'permission_callback' => '__return_true'
    ]);
}
add_action('rest_api_init', 'kme_register_custom_endpoints');

// ========================================
// CUSTOM ENDPOINT HANDLERS
// ========================================

/**
 * Handle contact form submission
 */
function kme_handle_contact_form($request) {
    $name = $request->get_param('name');
    $email = $request->get_param('email');
    $phone = $request->get_param('phone');
    $message = $request->get_param('message');
    
    // Validate email
    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email address', ['status' => 400]);
    }
    
    // Prepare email content
    $subject = 'New Contact Form Submission - KME Pest Control';
    $body = "
        New contact form submission received:
        
        Name: $name
        Email: $email
        Phone: $phone
        
        Message:
        $message
        
        ---
        Submitted from: " . home_url() . "
        Date: " . current_time('mysql') . "
    ";
    
    $headers = [
        'Content-Type: text/plain; charset=UTF-8',
        'From: ' . get_option('blogname') . ' <' . get_option('admin_email') . '>',
        'Reply-To: ' . $name . ' <' . $email . '>'
    ];
    
    // Send email
    $sent = wp_mail(get_option('admin_email'), $subject, $body, $headers);
    
    if ($sent) {
        // Log submission (optional)
        kme_log_form_submission('contact', [
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'message' => substr($message, 0, 100) . '...'
        ]);
        
        return [
            'success' => true,
            'message' => 'Your message has been sent successfully!'
        ];
    } else {
        return new WP_Error('email_failed', 'Failed to send email', ['status' => 500]);
    }
}

/**
 * Handle booking form submission
 */
function kme_handle_booking_form($request) {
    $first_name = $request->get_param('first_name');
    $last_name = $request->get_param('last_name');
    $email = $request->get_param('email');
    $phone = $request->get_param('phone');
    $details = $request->get_param('details');
    $date = $request->get_param('date');
    
    // Validate email
    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email address', ['status' => 400]);
    }
    
    // Create booking post
    $booking_id = wp_insert_post([
        'post_title' => "Booking - $first_name $last_name",
        'post_content' => $details,
        'post_status' => 'private',
        'post_type' => 'booking',
        'meta_input' => [
            'first_name' => $first_name,
            'last_name' => $last_name,
            'email' => $email,
            'phone' => $phone,
            'booking_date' => $date,
            'submission_date' => current_time('mysql')
        ]
    ]);
    
    if ($booking_id) {
        // Send confirmation email
        $subject = 'Booking Confirmation - KME Pest Control';
        $body = "
            Dear $first_name $last_name,
            
            Thank you for your booking request. We have received your information:
            
            Name: $first_name $last_name
            Email: $email
            Phone: $phone
            Preferred Date: $date
            
            Details: $details
            
            We will contact you soon to confirm your appointment.
            
            Best regards,
            KME Pest Control Team
            Phone: +609 573 2525
            Email: support@kmepest.com
        ";
        
        wp_mail($email, $subject, $body);
        
        // Log submission
        kme_log_form_submission('booking', [
            'name' => "$first_name $last_name",
            'email' => $email,
            'phone' => $phone,
            'date' => $date
        ]);
        
        return [
            'success' => true,
            'message' => 'Your booking request has been submitted successfully!',
            'booking_id' => $booking_id
        ];
    } else {
        return new WP_Error('booking_failed', 'Failed to create booking', ['status' => 500]);
    }
}

/**
 * Get site settings
 */
function kme_get_site_settings($request) {
    return [
        'name' => get_option('blogname'),
        'description' => get_option('blogdescription'),
        'url' => home_url(),
        'admin_email' => get_option('admin_email'),
        'timezone' => get_option('timezone_string'),
        'date_format' => get_option('date_format'),
        'time_format' => get_option('time_format'),
        'custom_settings' => [
            'phone' => '+609 573 2525',
            'email' => 'support@kmepest.com',
            'address' => 'A13, Ground Floor Lorong IM2, 94, Taman Medan Mansyur, Bandar Indera Mahkota, 25200 Kuantan, Pahang',
            'business_hours' => [
                'weekday' => '8:30 am - 5:30 pm (Monday-Friday)',
                'saturday' => '8:30 am - 1:00 pm (Saturday)',
                'sunday' => 'Closed'
            ],
            'social_media' => [
                'facebook' => 'https://www.facebook.com/KMEpestcontrol',
                'instagram' => 'https://www.instagram.com/kmepest/',
                'tiktok' => 'https://www.tiktok.com/@kmepestcontrol',
                'youtube' => 'https://www.youtube.com/@kmepestcontrol8065'
            ]
        ]
    ];
}

/**
 * Get menu by location
 */
function kme_get_menu_by_location($request) {
    $location = $request->get_param('location');
    $menu_items = wp_get_nav_menu_items($location);
    
    if (!$menu_items) {
        return new WP_Error('menu_not_found', 'Menu not found', ['status' => 404]);
    }
    
    // Format menu items
    $formatted_items = [];
    foreach ($menu_items as $item) {
        $formatted_items[] = [
            'id' => $item->ID,
            'title' => $item->title,
            'url' => $item->url,
            'parent' => $item->menu_item_parent,
            'order' => $item->menu_order,
            'classes' => $item->classes
        ];
    }
    
    return $formatted_items;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Log form submissions
 */
function kme_log_form_submission($type, $data) {
    $log_entry = [
        'type' => $type,
        'data' => $data,
        'ip' => $_SERVER['REMOTE_ADDR'],
        'user_agent' => $_SERVER['HTTP_USER_AGENT'],
        'timestamp' => current_time('mysql')
    ];
    
    // Store in options table (or create custom table for better performance)
    $logs = get_option('kme_form_submissions', []);
    $logs[] = $log_entry;
    
    // Keep only last 100 submissions
    if (count($logs) > 100) {
        $logs = array_slice($logs, -100);
    }
    
    update_option('kme_form_submissions', $logs);
}

/**
 * Create custom post types
 */
function kme_create_post_types() {
    // Booking post type
    register_post_type('booking', [
        'labels' => [
            'name' => 'Bookings',
            'singular_name' => 'Booking'
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'capability_type' => 'post',
        'supports' => ['title', 'editor', 'custom-fields'],
        'menu_icon' => 'dashicons-calendar-alt'
    ]);
    
    // Service post type (for future use)
    register_post_type('service', [
        'labels' => [
            'name' => 'Services',
            'singular_name' => 'Service'
        ],
        'public' => true,
        'show_in_rest' => true,
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
        'menu_icon' => 'dashicons-admin-tools'
    ]);
    
    // Testimonial post type
    register_post_type('testimonial', [
        'labels' => [
            'name' => 'Testimonials',
            'singular_name' => 'Testimonial'
        ],
        'public' => true,
        'show_in_rest' => true,
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'menu_icon' => 'dashicons-format-quote'
    ]);
}
add_action('init', 'kme_create_post_types');

/**
 * Add theme support for headless features
 */
function kme_theme_setup() {
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
    add_theme_support('custom-logo');
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption']);
}
add_action('after_setup_theme', 'kme_theme_setup');

/**
 * Enqueue admin scripts (for better admin experience)
 */
function kme_admin_scripts() {
    wp_enqueue_style('kme-admin-style', get_template_directory_uri() . '/admin-style.css');
}
add_action('admin_enqueue_scripts', 'kme_admin_scripts');

// ========================================
// SECURITY ENHANCEMENTS
// ========================================

/**
 * Rate limiting for form submissions
 */
function kme_rate_limit_check($type = 'general') {
    $ip = $_SERVER['REMOTE_ADDR'];
    $key = "rate_limit_{$type}_{$ip}";
    $limit = 5; // 5 submissions per hour
    $window = 3600; // 1 hour
    
    $submissions = get_transient($key) ?: 0;
    
    if ($submissions >= $limit) {
        return false;
    }
    
    set_transient($key, $submissions + 1, $window);
    return true;
}

/**
 * Add rate limiting to form endpoints
 */
function kme_check_rate_limit_before_form($request) {
    $endpoint = $request->get_route();
    $type = 'general';
    
    if (strpos($endpoint, 'contact-form') !== false) {
        $type = 'contact';
    } elseif (strpos($endpoint, 'booking-form') !== false) {
        $type = 'booking';
    }
    
    if (!kme_rate_limit_check($type)) {
        return new WP_Error('rate_limit_exceeded', 'Too many requests. Please try again later.', ['status' => 429]);
    }
    
    return true;
}
add_filter('rest_pre_dispatch', function($result, $server, $request) {
    if (strpos($request->get_route(), '/kme/v1/') === 0 && $request->get_method() === 'POST') {
        $rate_check = kme_check_rate_limit_before_form($request);
        if (is_wp_error($rate_check)) {
            return $rate_check;
        }
    }
    return $result;
}, 10, 3);

/**
 * Sanitize and validate REST API responses
 */
function kme_sanitize_api_response($response, $object, $request) {
    // Remove sensitive data from responses
    if (isset($response->data['password'])) {
        unset($response->data['password']);
    }
    
    return $response;
}
add_filter('rest_prepare_post', 'kme_sanitize_api_response', 10, 3);
add_filter('rest_prepare_page', 'kme_sanitize_api_response', 10, 3);

?>
