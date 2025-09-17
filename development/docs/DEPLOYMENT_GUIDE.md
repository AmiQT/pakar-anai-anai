# 🚀 KME Pest Control - Deployment Guide

**Complete deployment guide for WordPress headless + Vanilla frontend setup**

---

## 📋 **Pre-Deployment Checklist**

### ✅ **Requirements**
- [ ] WordPress hosting with PHP 7.4+ and MySQL 5.7+
- [ ] SSL certificate installed
- [ ] Domain pointing to hosting
- [ ] Vercel account created
- [ ] Git repository setup

### ✅ **Files Ready**
- [ ] Frontend files (HTML, CSS, JS)
- [ ] WordPress configuration files
- [ ] Database backup (if migrating)
- [ ] Images and media assets

---

## 🔧 **Phase 1: WordPress Headless Setup**

### **Step 1: WordPress Installation**

1. **Fresh WordPress Installation**
   ```bash
   # If installing fresh WordPress
   wget https://wordpress.org/latest.tar.gz
   tar -xzf latest.tar.gz
   # Upload to your hosting via FTP/cPanel
   ```

2. **Or Migrate Existing WordPress**
   ```bash
   # Upload existing files
   # Import database backup
   # Update wp-config.php with new database details
   ```

### **Step 2: Configure WordPress for Headless**

1. **Update wp-config.php**
   ```php
   // Add these lines to wp-config.php
   require_once('wp-config-additions.php');
   ```

2. **Upload Configuration Files**
   - Copy `wordpress-config/functions.php` to your active theme
   - Copy `wordpress-config/wp-config-additions.php` to WordPress root
   - Update `.htaccess` with rules from `wordpress-config/htaccess-rules.txt`

3. **Update Domain Settings**
   - Go to WordPress Admin → Settings → General
   - Update WordPress Address (URL) and Site Address (URL)
   - Update allowed origins in `functions.php`:
   ```php
   $allowed_origins = [
       'https://your-domain.vercel.app',
       'https://your-custom-domain.com',
       'http://localhost:3000'
   ];
   ```

### **Step 3: Install Required Plugins**

1. **Essential Plugins**
   ```
   - Advanced Custom Fields (ACF) - for custom fields
   - WP REST API Controller - for enhanced API control
   - JWT Authentication for WP-API - for secure API access (optional)
   - Yoast SEO - for SEO management
   - Wordfence Security - for security
   ```

2. **Plugin Configuration**
   - Configure ACF for custom fields
   - Setup Yoast SEO with proper meta tags
   - Configure security plugins

### **Step 4: Test WordPress API**

1. **Test Basic Endpoints**
   ```bash
   # Test pages endpoint
   curl https://your-wordpress-site.com/wp-json/wp/v2/pages
   
   # Test custom endpoints
   curl https://your-wordpress-site.com/wp-json/kme/v1/site-settings
   ```

2. **Test CORS Headers**
   ```javascript
   fetch('https://your-wordpress-site.com/wp-json/wp/v2/pages')
     .then(response => response.json())
     .then(data => console.log(data));
   ```

---

## 🌐 **Phase 2: Frontend Deployment on Vercel**

### **Step 1: Prepare Frontend Code**

1. **Update API Configuration**
   ```javascript
   // In assets/js/api.js, update:
   const API_CONFIG = {
       BASE_URL: 'https://your-wordpress-site.com/wp-json/wp/v2/',
       // ... other config
   };
   ```

2. **Update Domain References**
   - Search and replace any localhost references
   - Update social media links
   - Update contact information

### **Step 2: Deploy to Vercel**

#### **Option A: Deploy via Vercel CLI**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Project**
   ```bash
   # From project root directory
   vercel
   
   # Follow prompts:
   # - Set up and deploy? Yes
   # - Which scope? Select your account
   # - Link to existing project? No
   # - Project name? kme-pest-control
   # - Directory? ./
   # - Override settings? No
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

#### **Option B: Deploy via Git Integration**

1. **Connect GitHub Repository**
   - Go to Vercel Dashboard
   - Click "New Project"
   - Import from Git repository

2. **Configure Build Settings**
   ```
   Framework Preset: Other
   Build Command: npm run build (if using build process)
   Output Directory: ./ (for static files)
   Install Command: npm install
   ```

3. **Set Environment Variables** (if needed)
   ```
   WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2/
   ```

### **Step 3: Configure Custom Domain** (Optional)

1. **Add Custom Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update DNS Records**
   ```
   Type: CNAME
   Name: @ (or www)
   Value: cname.vercel-dns.com
   ```

---

## 🔒 **Phase 3: Security & Performance**

### **WordPress Security**

1. **SSL Certificate**
   ```php
   // Force HTTPS in wp-config.php
   define('FORCE_SSL_ADMIN', true);
   ```

2. **Security Headers**
   - Ensure .htaccess rules are applied
   - Test headers at securityheaders.com

3. **File Permissions**
   ```bash
   # Set correct file permissions
   find /path/to/wordpress/ -type d -exec chmod 755 {} \;
   find /path/to/wordpress/ -type f -exec chmod 644 {} \;
   chmod 600 wp-config.php
   ```

### **Performance Optimization**

1. **Enable Caching**
   - Install caching plugin (WP Rocket, W3 Total Cache)
   - Configure object caching if available

2. **Image Optimization**
   ```bash
   # Optimize images before upload
   npm run optimize-images
   ```

3. **CDN Setup** (Optional)
   - Configure Cloudflare or similar CDN
   - Update image URLs in WordPress

---

## 🧪 **Phase 4: Testing & Validation**

### **Functionality Testing**

1. **Test All Pages**
   ```bash
   # Homepage
   curl -I https://your-domain.vercel.app/
   
   # About page
   curl -I https://your-domain.vercel.app/about
   
   # Services page
   curl -I https://your-domain.vercel.app/services
   ```

2. **Test Forms**
   - Submit contact form
   - Submit booking form
   - Check email delivery

3. **Test API Integration**
   ```javascript
   // Test in browser console
   fetch('https://your-wordpress-site.com/wp-json/kme/v1/site-settings')
     .then(r => r.json())
     .then(console.log);
   ```

### **Performance Testing**

1. **Lighthouse Audit**
   ```bash
   npm run lighthouse
   ```

2. **GTmetrix/PageSpeed Insights**
   - Test website speed
   - Optimize based on recommendations

3. **Mobile Testing**
   - Test on various devices
   - Check responsive design

### **SEO Testing**

1. **Meta Tags**
   - Check all pages have proper titles and descriptions
   - Verify Open Graph tags

2. **Structured Data**
   - Test with Google's Rich Results Test
   - Implement business schema markup

---

## 📊 **Phase 5: Monitoring & Maintenance**

### **Setup Monitoring**

1. **Vercel Analytics**
   - Enable Vercel Analytics in dashboard
   - Monitor performance metrics

2. **WordPress Monitoring**
   - Setup uptime monitoring (UptimeRobot, Pingdom)
   - Monitor API response times

3. **Error Tracking**
   - Setup error logging in WordPress
   - Monitor JavaScript errors in browser

### **Regular Maintenance**

1. **WordPress Updates**
   ```bash
   # Regular maintenance tasks
   - Update WordPress core
   - Update plugins and themes
   - Backup database weekly
   - Monitor security logs
   ```

2. **Frontend Updates**
   ```bash
   # Update dependencies
   npm audit
   npm update
   
   # Redeploy if needed
   vercel --prod
   ```

---

## 🚨 **Troubleshooting Guide**

### **Common Issues**

#### **CORS Errors**
```javascript
// Check browser console for CORS errors
// Verify allowed origins in functions.php
// Test API endpoints directly
```

#### **API Not Responding**
```bash
# Check WordPress error logs
tail -f /path/to/wordpress/wp-content/debug.log

# Test API directly
curl -v https://your-wordpress-site.com/wp-json/wp/v2/pages
```

#### **Form Submissions Not Working**
```php
// Check WordPress email configuration
// Verify SMTP settings
// Test email delivery
wp_mail('test@example.com', 'Test Subject', 'Test message');
```

#### **Images Not Loading**
```javascript
// Check image URLs in API responses
// Verify CORS headers for images
// Check file permissions
```

### **Performance Issues**

#### **Slow API Responses**
- Enable WordPress caching
- Optimize database queries
- Use CDN for images

#### **Slow Frontend Loading**
- Optimize images
- Minify CSS/JS
- Enable compression

---

## 📞 **Support & Resources**

### **Documentation Links**
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [Vercel Documentation](https://vercel.com/docs)
- [Web Performance Best Practices](https://web.dev/performance/)

### **Emergency Contacts**
- **Hosting Support**: [Your hosting provider support]
- **Domain Registrar**: [Your domain provider support]
- **Developer**: [Your contact information]

### **Backup & Recovery**
- **Database Backup Location**: [Specify location]
- **File Backup Location**: [Specify location]
- **Recovery Procedure**: [Document recovery steps]

---

## ✅ **Post-Deployment Checklist**

- [ ] All pages loading correctly
- [ ] Forms working and emails being sent
- [ ] API endpoints responding
- [ ] SSL certificate active
- [ ] Performance scores acceptable (90+)
- [ ] Mobile responsiveness working
- [ ] SEO meta tags in place
- [ ] Analytics tracking setup
- [ ] Backup system configured
- [ ] Monitoring alerts setup
- [ ] Documentation updated

---

**🎉 Deployment Complete!**

Your KME Pest Control website is now live with:
- ⚡ Lightning-fast Vercel frontend
- 🔧 Flexible WordPress headless CMS
- 🔒 Enterprise-grade security
- 📱 Perfect mobile experience
- 🚀 Optimized for performance and SEO

**Next Steps**: Monitor performance, gather user feedback, and iterate based on analytics data.
