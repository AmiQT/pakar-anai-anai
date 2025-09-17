# 🧪 Tester/QA Guide - KME Pest Control

**Comprehensive testing strategy and quality assurance guide untuk KME Pest Control website**

---

## 📋 Project Testing Overview

### **Application Under Test (AUT)**
- **System**: KME Pest Control Website
- **Architecture**: Vanilla JavaScript Frontend + WordPress Headless CMS
- **Deployment**: Vercel (Frontend) + Traditional Hosting (WordPress)
- **Target Users**: Malaysian homeowners (Pahang & Terengganu)
- **Business Type**: Service-based pest control company
- **Critical Functions**: Contact forms, booking system, information display

### **Testing Objectives**
- **Functionality**: All features work as specified
- **Performance**: Fast loading times (< 2s) across all devices
- **Security**: Forms and data handling are secure
- **Usability**: Malaysian users can easily navigate and convert
- **Compatibility**: Works across all major browsers and devices
- **Accessibility**: WCAG 2.1 AA compliance for inclusive access

---

## 🎯 Testing Strategy & Approach

### **Testing Pyramid**
```
                    E2E Tests (10%)
                ←→ User Journey Testing ←→
                
            Integration Tests (20%)  
        ←→ API + Frontend Integration ←→
        
        Unit Tests (70%)
    ←→ Individual Components ←→
```

### **Testing Types Coverage**

#### **1. Functional Testing (40%)**
- User interface testing
- Form validation and submission
- Navigation and links
- Content display and accuracy
- Business logic validation

#### **2. Non-Functional Testing (30%)**
- Performance testing
- Load and stress testing
- Security testing
- Compatibility testing
- Accessibility testing

#### **3. User Experience Testing (20%)**
- Usability testing
- User acceptance testing
- Mobile experience testing
- Malaysian user behavior testing

#### **4. Maintenance Testing (10%)**
- Regression testing
- Smoke testing
- Health checks
- Monitoring and alerts

---

## 🔧 Test Environment Setup

### **Test Environment Configuration**

#### **Local Testing Environment**
```bash
# Prerequisites
Node.js 16+
npm 8+
Chrome/Firefox browsers
Mobile device/emulator
Internet connection for API testing

# Setup commands
git clone [repository]
cd kme-pest-control-website
npm install
npm run dev

# Test server runs at http://localhost:3000
```

#### **Testing Tools Stack**
```javascript
// Automated Testing Tools
{
  "unit_testing": "Jest",
  "integration_testing": "Jest + Testing Library", 
  "e2e_testing": "Playwright/Cypress",
  "performance": "Lighthouse CLI",
  "accessibility": "axe-core",
  "visual_testing": "Percy/Chromatic",
  "api_testing": "Postman/Insomnia",
  "mobile_testing": "BrowserStack/LambdaTest"
}
```

#### **Browser Testing Matrix**
```
Desktop Browsers (Malaysian Market Share):
□ Chrome 85+ (65%)
□ Edge 88+ (15%) 
□ Firefox 78+ (10%)
□ Safari 14+ (8%)
□ Opera 70+ (2%)

Mobile Browsers:
□ Chrome Mobile (70%)
□ Safari iOS (20%)
□ Samsung Internet (5%)
□ UC Browser (3%)
□ Other (2%)

Device Testing:
□ iPhone 12/13/14 (iOS 15+)
□ Samsung Galaxy S20/S21/S22
□ Samsung Galaxy A Series
□ Huawei/Honor devices
□ Xiaomi/OnePlus devices
```

---

## 📝 Functional Testing Specifications

### **1. Navigation Testing**

#### **Desktop Navigation**
```javascript
// Test Cases: Desktop Navigation
describe('Desktop Navigation', () => {
  
  test('Main menu items are visible and clickable', async () => {
    const menuItems = ['HOME', 'ABOUT US', 'SERVICES', 'PRODUCTS', 'CONTACT'];
    
    for (const item of menuItems) {
      const menuLink = await page.locator(`nav a:text("${item}")`);
      await expect(menuLink).toBeVisible();
      await expect(menuLink).toBeEnabled();
    }
  });
  
  test('Dropdown menus expand on hover', async () => {
    await page.hover('nav a:text("ABOUT US")');
    
    const dropdown = page.locator('.dropdown-submenu');
    await expect(dropdown).toBeVisible();
    
    const dropdownItems = ['Company Info', 'Testimonials', 'Gallery'];
    for (const item of dropdownItems) {
      await expect(page.locator(`text="${item}"`)).toBeVisible();
    }
  });
  
  test('Booking CTA button is prominent and functional', async () => {
    const bookingBtn = page.locator('.booking-cta-btn');
    await expect(bookingBtn).toBeVisible();
    await expect(bookingBtn).toContainText('Booking');
    
    await bookingBtn.click();
    await expect(page).toHaveURL(/booking/);
  });
});
```

#### **Mobile Navigation**
```javascript
describe('Mobile Navigation', () => {
  
  beforeEach(async () => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
  });
  
  test('Hamburger menu toggles correctly', async () => {
    const toggle = page.locator('#mobile-toggle');
    const menu = page.locator('#nav-menu');
    
    // Initially closed
    await expect(menu).not.toHaveClass(/mobile-active/);
    
    // Click to open
    await toggle.click();
    await expect(menu).toHaveClass(/mobile-active/);
    
    // Click to close
    await toggle.click(); 
    await expect(menu).not.toHaveClass(/mobile-active/);
  });
  
  test('Mobile menu is touch-friendly', async () => {
    await page.locator('#mobile-toggle').click();
    
    const menuLinks = page.locator('#nav-menu a');
    const count = await menuLinks.count();
    
    for (let i = 0; i < count; i++) {
      const link = menuLinks.nth(i);
      const box = await link.boundingBox();
      
      // Touch target should be at least 44px
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });
});
```

### **2. Form Testing**

#### **Booking Form Testing**
```javascript
describe('Booking Form', () => {
  
  beforeEach(async () => {
    await page.goto('/booking');
  });
  
  test('Form validation works for required fields', async () => {
    const submitBtn = page.locator('button[type="submit"]');
    
    // Submit empty form
    await submitBtn.click();
    
    // Check validation messages appear
    const errorMessages = page.locator('.field-error');
    await expect(errorMessages.first()).toBeVisible();
  });
  
  test('Malaysian phone number validation', async () => {
    const phoneField = page.locator('#phone');
    
    // Test valid Malaysian numbers
    const validNumbers = [
      '012-3456789',
      '011-2962 3741', 
      '+6012-3456789',
      '60123456789'
    ];
    
    for (const number of validNumbers) {
      await phoneField.fill(number);
      await phoneField.blur();
      await expect(phoneField).not.toHaveClass('error');
    }
    
    // Test invalid numbers
    const invalidNumbers = [
      '123456789',
      '012345',
      '999-8888777'
    ];
    
    for (const number of invalidNumbers) {
      await phoneField.fill(number);
      await phoneField.blur();
      await expect(phoneField).toHaveClass('error');
    }
  });
  
  test('Date picker restricts past dates and Sundays', async () => {
    const dateField = page.locator('#preferredDate');
    
    // Should not allow past dates
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    await dateField.fill(yesterdayStr);
    // Form should show validation error or prevent submission
    
    // Test Sunday restriction (assuming Sunday is closed)
    const nextSunday = getNextSunday();
    const sundayStr = nextSunday.toISOString().split('T')[0];
    
    await dateField.fill(sundayStr);
    const timeField = page.locator('#preferredTime');
    
    // Time slots should be disabled for Sundays
    const options = timeField.locator('option');
    const optionsCount = await options.count();
    
    for (let i = 1; i < optionsCount; i++) { // Skip first empty option
      const option = options.nth(i);
      await expect(option).toBeDisabled();
    }
  });
  
  test('Successful form submission', async () => {
    // Fill all required fields
    await page.fill('#fullName', 'Ahmad Test');
    await page.fill('#phone', '012-3456789');
    await page.fill('#email', 'test@example.com');
    await page.selectOption('#serviceType', 'Pemeriksaan Anai-Anai');
    await page.fill('#address', 'Test Address, Kuantan, Pahang');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check for success message
    const successMessage = page.locator('.form-status.success');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText('berjaya');
  });
});
```

#### **Contact Form Testing**
```javascript
describe('Contact Form', () => {
  
  beforeEach(async () => {
    await page.goto('/contact');
  });
  
  test('Contact form submission with all validations', async () => {
    // Test required field validation
    await page.click('button[type="submit"]');
    
    const requiredFields = ['#name', '#email', '#message'];
    for (const field of requiredFields) {
      const errorMsg = page.locator(`${field} ~ .field-error`);
      await expect(errorMsg).toBeVisible();
    }
    
    // Fill form with valid data
    await page.fill('#name', 'Test User');
    await page.fill('#email', 'test@example.com');
    await page.fill('#phone', '012-3456789');
    await page.selectOption('#subject', 'Sebut Harga Anai-Anai');
    await page.fill('#message', 'This is a test inquiry message.');
    
    // Submit and verify success
    await page.click('button[type="submit"]');
    
    const successStatus = page.locator('.form-status.success');
    await expect(successStatus).toBeVisible();
  });
});
```

### **3. Content & Information Testing**

#### **Service Pages Testing**
```javascript
describe('Service Pages Content', () => {
  
  const servicePages = [
    { url: '/services', title: 'Services' },
    { url: '/services/soil-treatment', title: 'Soil Treatment' },
    { url: '/services/bat-prevention', title: 'Bat Prevention' },
    { url: '/services/corrective-treatment', title: 'Corrective Treatment' }
  ];
  
  test.each(servicePages)('$title page loads with correct content', async ({ url, title }) => {
    await page.goto(url);
    
    // Check page title
    await expect(page).toHaveTitle(new RegExp(title, 'i'));
    
    // Check main heading exists
    const mainHeading = page.locator('h1, h2').first();
    await expect(mainHeading).toBeVisible();
    
    // Check CTA buttons exist
    const ctaButtons = page.locator('.btn, .cta-btn, [href*="whatsapp"], [href^="tel:"]');
    await expect(ctaButtons.first()).toBeVisible();
  });
  
  test('Service pricing information is displayed', async () => {
    await page.goto('/services');
    
    // Check for pricing mentions
    const pricingElements = page.locator(':text("RM"), :text("ringgit"), :text("cost"), :text("price")');
    await expect(pricingElements.first()).toBeVisible();
  });
});
```

#### **Contact Information Testing**
```javascript
describe('Contact Information Consistency', () => {
  
  const contactInfo = {
    phone: '+6011 2962 3741',
    email: 'kmepc.official@gmail.com',
    whatsapp: 'https://wsap.to/kmepestcontrol'
  };
  
  const pagesWithContact = ['/', '/about', '/contact', '/booking'];
  
  test.each(pagesWithContact)('Contact info consistent on %s', async (url) => {
    await page.goto(url);
    
    // Check phone number (may have different formatting)
    const phonePattern = /(\+6011|011)[\s-]?2962[\s-]?3741/;
    const phoneElement = page.locator('[href*="tel:"], :text-matches("' + phonePattern.source + '")');
    await expect(phoneElement.first()).toBeVisible();
    
    // Check WhatsApp link if present
    const whatsappLink = page.locator('[href*="wsap.to"], [href*="wa.me"]');
    if (await whatsappLink.count() > 0) {
      await expect(whatsappLink.first()).toBeVisible();
    }
  });
});
```

---

## ⚡ Performance Testing

### **1. Core Web Vitals Testing**
```javascript
describe('Performance Metrics', () => {
  
  test('Lighthouse performance audit', async () => {
    const { lhr } = await lighthouse(page.url(), {
      port: 9222,
      chromeFlags: ['--headless']
    });
    
    // Core Web Vitals thresholds
    expect(lhr.audits['first-contentful-paint'].numericValue).toBeLessThan(1500);
    expect(lhr.audits['largest-contentful-paint'].numericValue).toBeLessThan(2500);
    expect(lhr.audits['cumulative-layout-shift'].numericValue).toBeLessThan(0.1);
    expect(lhr.audits['total-blocking-time'].numericValue).toBeLessThan(300);
    
    // Overall performance score
    expect(lhr.categories.performance.score).toBeGreaterThan(0.9);
  });
  
  test('Page load times under different conditions', async () => {
    // Simulate slow 3G (common in rural Malaysia)
    await page.emulateNetworkConditions({
      offline: false,
      downloadThroughput: 500 * 1024 / 8, // 500kb/s
      uploadThroughput: 500 * 1024 / 8,
      latency: 400
    });
    
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds on slow connection
    expect(loadTime).toBeLessThan(5000);
  });
});
```

### **2. Mobile Performance Testing**
```javascript
describe('Mobile Performance', () => {
  
  beforeEach(async () => {
    // Simulate mobile device
    await page.emulate(devices['iPhone 12']);
  });
  
  test('Mobile page speed meets targets', async () => {
    const startTime = performance.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const endTime = performance.now();
    
    const loadTime = endTime - startTime;
    expect(loadTime).toBeLessThan(3000); // 3 seconds max on mobile
  });
  
  test('Images load efficiently on mobile', async () => {
    await page.goto('/');
    
    // Check for lazy loading implementation
    const images = page.locator('img[loading="lazy"]');
    const lazyImagesCount = await images.count();
    
    expect(lazyImagesCount).toBeGreaterThan(0);
    
    // Check image formats (WebP preferred)
    const webpImages = page.locator('img[src*=".webp"], source[srcset*=".webp"]');
    const webpCount = await webpImages.count();
    
    expect(webpCount).toBeGreaterThan(0);
  });
});
```

### **3. Load Testing**
```javascript
describe('Load Testing', () => {
  
  test('Multiple concurrent form submissions', async () => {
    const promises = [];
    
    // Simulate 10 concurrent booking submissions
    for (let i = 0; i < 10; i++) {
      const promise = (async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        await page.goto('/booking');
        
        await page.fill('#fullName', `Test User ${i}`);
        await page.fill('#phone', '012-3456789');
        await page.fill('#email', `test${i}@example.com`);
        await page.selectOption('#serviceType', 'Pemeriksaan Anai-Anai');
        await page.fill('#address', 'Test Address');
        
        const response = await page.click('button[type="submit"]');
        
        // Should handle concurrent submissions gracefully
        const statusElement = page.locator('.form-status');
        await expect(statusElement).toBeVisible();
        
        await context.close();
      })();
      
      promises.push(promise);
    }
    
    // All submissions should complete within reasonable time
    await Promise.all(promises);
  });
});
```

---

## 🔒 Security Testing

### **1. Input Validation Security**
```javascript
describe('Security Testing', () => {
  
  test('XSS prevention in form inputs', async () => {
    await page.goto('/contact');
    
    const xssPayloads = [
      '<script>alert("xss")</script>',
      'javascript:alert("xss")',
      '"><script>alert("xss")</script>',
      "'; alert('xss');//"
    ];
    
    for (const payload of xssPayloads) {
      await page.fill('#message', payload);
      await page.click('button[type="submit"]');
      
      // Should not execute script or show unescaped content
      const messageField = page.locator('#message');
      const value = await messageField.inputValue();
      
      // Content should be sanitized or escaped
      expect(value).not.toContain('<script>');
      
      // No JavaScript execution should occur
      const alerts = await page.evaluate(() => window.alert.toString());
      expect(alerts).toBe('function alert() { [native code] }');
    }
  });
  
  test('SQL injection prevention', async () => {
    const sqlPayloads = [
      "'; DROP TABLE bookings; --",
      "1' OR '1'='1",
      "admin'; --",
      "1' UNION SELECT * FROM users --"
    ];
    
    for (const payload of sqlPayloads) {
      await page.goto('/booking');
      await page.fill('#email', payload);
      await page.click('button[type="submit"]');
      
      // Should handle safely without breaking
      await page.waitForTimeout(1000);
      
      // Form should still be functional
      const emailField = page.locator('#email');
      await expect(emailField).toBeVisible();
    }
  });
  
  test('HTTPS enforcement', async () => {
    // Test HTTP to HTTPS redirect (if configured)
    const httpUrl = page.url().replace('https://', 'http://');
    
    const response = await page.goto(httpUrl);
    const finalUrl = page.url();
    
    // Should redirect to HTTPS
    expect(finalUrl).toMatch(/^https:/);
  });
});
```

### **2. Data Privacy Testing**
```javascript
describe('Data Privacy & GDPR Compliance', () => {
  
  test('No sensitive data in client-side storage', async () => {
    await page.goto('/booking');
    
    // Fill and submit form
    await page.fill('#fullName', 'Sensitive User');
    await page.fill('#phone', '012-3456789');
    await page.fill('#email', 'sensitive@example.com');
    await page.click('button[type="submit"]');
    
    // Check localStorage
    const localStorage = await page.evaluate(() => JSON.stringify(window.localStorage));
    expect(localStorage).not.toContain('sensitive@example.com');
    expect(localStorage).not.toContain('012-3456789');
    
    // Check sessionStorage
    const sessionStorage = await page.evaluate(() => JSON.stringify(window.sessionStorage));
    expect(sessionStorage).not.toContain('sensitive@example.com');
    
    // Check cookies (non-essential)
    const cookies = await page.context().cookies();
    const hasSensitiveData = cookies.some(cookie => 
      cookie.value.includes('sensitive@example.com') || 
      cookie.value.includes('012-3456789')
    );
    expect(hasSensitiveData).toBeFalsy();
  });
});
```

---

## ♿ Accessibility Testing

### **1. WCAG 2.1 AA Compliance**
```javascript
describe('Accessibility Testing', () => {
  
  test('Automated accessibility scan', async () => {
    await page.goto('/');
    
    // Run axe accessibility tests
    const results = await page.evaluate(() => {
      return new Promise((resolve) => {
        axe.run().then(results => {
          resolve(results);
        });
      });
    });
    
    // Should have no violations
    expect(results.violations).toHaveLength(0);
    
    // Log any violations for debugging
    if (results.violations.length > 0) {
      console.log('Accessibility violations:', results.violations);
    }
  });
  
  test('Keyboard navigation functionality', async () => {
    await page.goto('/');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    const firstFocusable = await page.locator(':focus');
    await expect(firstFocusable).toBeVisible();
    
    // Navigate through all focusable elements
    const focusableElements = await page.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').count();
    
    for (let i = 0; i < Math.min(focusableElements, 20); i++) {
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Focus indicator should be visible
      const outline = await focusedElement.evaluate(el => 
        window.getComputedStyle(el).outline
      );
      expect(outline).not.toBe('none');
    }
  });
  
  test('Screen reader compatibility', async () => {
    await page.goto('/booking');
    
    // Check form labels
    const formInputs = page.locator('input, select, textarea');
    const inputCount = await formInputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = formInputs.nth(i);
      const id = await input.getAttribute('id');
      
      if (id) {
        // Should have associated label
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      }
      
      // Or aria-label/aria-labelledby
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');
      
      expect(ariaLabel || ariaLabelledby).toBeTruthy();
    }
  });
  
  test('Color contrast ratios', async () => {
    await page.goto('/');
    
    // Test main text elements
    const textElements = page.locator('h1, h2, h3, p, a, button');
    const count = await textElements.count();
    
    for (let i = 0; i < Math.min(count, 10); i++) {
      const element = textElements.nth(i);
      
      const styles = await element.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          fontSize: parseFloat(computed.fontSize)
        };
      });
      
      // Calculate contrast ratio (simplified check)
      const contrastRatio = calculateContrastRatio(styles.color, styles.backgroundColor);
      
      // WCAG AA requirements
      if (styles.fontSize >= 18 || element.locator('strong, b').count() > 0) {
        expect(contrastRatio).toBeGreaterThanOrEqual(3.0); // Large text
      } else {
        expect(contrastRatio).toBeGreaterThanOrEqual(4.5); // Normal text
      }
    }
  });
});
```

---

## 📱 Mobile & Cross-Browser Testing

### **1. Responsive Design Testing**
```javascript
describe('Responsive Design', () => {
  
  const viewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];
  
  test.each(viewports)('Layout works on $name viewport', async ({ width, height }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    
    // Check header is visible and functional
    const header = page.locator('#header');
    await expect(header).toBeVisible();
    
    // Check main content is readable
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
    
    // Check CTAs are accessible
    const ctaButtons = page.locator('.btn, [href*="whatsapp"], [href^="tel:"]');
    await expect(ctaButtons.first()).toBeVisible();
    
    // No horizontal scrolling on mobile
    if (width < 768) {
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(width + 50); // Allow small margin
    }
  });
  
  test('Touch interactions work on mobile', async () => {
    await page.emulate(devices['iPhone 12']);
    await page.goto('/');
    
    // Test mobile menu
    const mobileToggle = page.locator('#mobile-toggle');
    await mobileToggle.tap();
    
    const mobileMenu = page.locator('#nav-menu');
    await expect(mobileMenu).toHaveClass(/mobile-active/);
    
    // Test WhatsApp button tap
    const whatsappBtn = page.locator('[href*="whatsapp"]').first();
    if (await whatsappBtn.count() > 0) {
      await expect(whatsappBtn).toBeVisible();
      
      // Should have touch-friendly size
      const box = await whatsappBtn.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });
});
```

### **2. Cross-Browser Compatibility**
```javascript
describe('Cross-Browser Compatibility', () => {
  
  const browsers = ['chromium', 'firefox', 'webkit'];
  
  test.each(browsers)('Core functionality works in %s', async (browserName) => {
    const browser = await playwright[browserName].launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      await page.goto('/');
      
      // Test navigation
      await page.click('a:text("Contact")');
      await expect(page).toHaveURL(/contact/);
      
      // Test form functionality
      await page.fill('#name', 'Test User');
      await page.fill('#email', 'test@example.com');
      await page.fill('#message', 'Browser compatibility test');
      
      await page.click('button[type="submit"]');
      
      // Form should process without errors
      await page.waitForTimeout(2000);
      const errorElements = page.locator('.error, [class*="error"]');
      const errorCount = await errorElements.count();
      
      expect(errorCount).toBe(0);
      
    } finally {
      await context.close();
      await browser.close();
    }
  });
});
```

---

## 🇲🇾 Malaysian Market-Specific Testing

### **1. Localization Testing**
```javascript
describe('Malaysian Market Adaptation', () => {
  
  test('Bahasa Malaysia content displays correctly', async () => {
    await page.goto('/');
    
    // Check for key Malay terms
    const malayTerms = [
      'Pakar',
      'kawalan',
      'serangga', 
      'anai-anai',
      'Pahang',
      'Terengganu',
      'servis',
      'jaminan'
    ];
    
    for (const term of malayTerms) {
      const element = page.locator(`:text("${term}")`);
      await expect(element.first()).toBeVisible();
    }
  });
  
  test('Malaysian contact methods are prioritized', async () => {
    await page.goto('/');
    
    // WhatsApp should be prominently displayed
    const whatsappElements = page.locator('[href*="whatsapp"], [href*="wsap.to"], :text("WhatsApp")');
    await expect(whatsappElements.first()).toBeVisible();
    
    // Malaysian phone number format
    const phoneElements = page.locator(':text("+6011"), :text("011-"), :text("011 ")');
    await expect(phoneElements.first()).toBeVisible();
    
    // Local service areas mentioned
    const serviceAreas = page.locator(':text("Pahang"), :text("Terengganu"), :text("Kuantan")');
    await expect(serviceAreas.first()).toBeVisible();
  });
  
  test('Business hours show Malaysian timezone', async () => {
    await page.goto('/contact');
    
    const hoursElement = page.locator(':text("8:30am"), :text("5:30pm"), :text("Closed")');
    await expect(hoursElement.first()).toBeVisible();
    
    // Should indicate Sunday is closed (common in Malaysia)
    const sundayElement = page.locator(':text("Ahad"), :text("Sunday")');
    if (await sundayElement.count() > 0) {
      const closedElement = page.locator(':text("Tutup"), :text("Closed")');
      await expect(closedElement).toBeVisible();
    }
  });
});
```

### **2. Mobile Data Usage Testing**
```javascript
describe('Mobile Data Optimization', () => {
  
  test('Page loads efficiently on slow connections', async () => {
    // Simulate slow mobile connection (common in rural Malaysia)
    await page.emulateNetworkConditions({
      offline: false,
      downloadThroughput: 200 * 1024 / 8, // 200kb/s 
      uploadThroughput: 200 * 1024 / 8,
      latency: 800
    });
    
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;
    
    // Should load core content within 10 seconds
    expect(loadTime).toBeLessThan(10000);
    
    // Critical elements should be visible
    const criticalElements = page.locator('h1, .primary-cta, [href*="whatsapp"]');
    await expect(criticalElements.first()).toBeVisible();
  });
});
```

---

## 🔄 Test Automation & CI/CD

### **1. Automated Test Pipeline**
```yaml
# .github/workflows/testing.yml
name: KME Pest Control Testing Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright
      run: npx playwright install
    
    - name: Run unit tests
      run: npm run test:unit
    
    - name: Start test server
      run: npm run dev &
      
    - name: Wait for server
      run: npx wait-on http://localhost:3000
    
    - name: Run E2E tests
      run: npx playwright test --browser=${{ matrix.browser }}
    
    - name: Run accessibility tests
      run: npm run test:a11y
    
    - name: Run performance tests
      run: npm run test:lighthouse
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: test-results-${{ matrix.browser }}
        path: test-results/
```

### **2. Test Reporting**
```javascript
// playwright.config.js
module.exports = {
  testDir: './tests',
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-failure'
  },
  
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'Desktop Firefox', 
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'iPhone 12',
      use: { ...devices['iPhone 12'] }
    },
    {
      name: 'Samsung Galaxy',
      use: { ...devices['Galaxy S9+'] }
    }
  ]
};
```

---

## 📊 Test Metrics & KPIs

### **Quality Metrics Dashboard**
```javascript
// Test Metrics Tracking
const testMetrics = {
  // Functional Testing
  testCoverage: {
    target: '>= 90%',
    current: 'Calculate from test runs'
  },
  
  passRate: {
    target: '>= 95%',
    current: 'Track daily'
  },
  
  // Performance Testing
  pageLoadTime: {
    target: '< 2s (desktop), < 3s (mobile)',
    current: 'Monitor continuously'
  },
  
  lighthouseScore: {
    target: '>= 90',
    current: 'Track per deployment'
  },
  
  // User Experience
  formCompletionRate: {
    target: '>= 80%',
    current: 'Monitor via analytics'
  },
  
  mobileUsability: {
    target: 'No issues',
    current: 'Test weekly'
  },
  
  // Security
  securityVulnerabilities: {
    target: '0 critical/high',
    current: 'Scan monthly'
  },
  
  // Accessibility
  accessibilityCompliance: {
    target: 'WCAG 2.1 AA (100%)',
    current: 'Audit quarterly'
  }
};
```

### **Bug Tracking & Priority Matrix**
```
Bug Priority Classification:

P0 - Critical (Fix immediately):
- Website completely down
- Forms not submitting (revenue impact)
- Major security vulnerabilities
- WhatsApp/phone links broken

P1 - High (Fix within 24 hours):
- Page load errors on key pages
- Mobile navigation broken
- Contact information incorrect
- Form validation issues

P2 - Medium (Fix within 1 week):
- Minor layout issues
- Non-critical form fields
- Image loading problems
- Performance degradation

P3 - Low (Fix when possible):
- Typography issues
- Minor responsive problems
- Animation glitches
- Enhancement requests
```

---

## ✅ Pre-Launch Testing Checklist

### **Complete QA Sign-off Checklist**

#### **Functional Testing**
```
□ All navigation links work correctly
□ Mobile menu functions properly
□ Booking form submits successfully
□ Contact form submits successfully
□ Form validation works as expected
□ Phone number validation works for Malaysian numbers
□ Date picker enforces business rules
□ All service pages load correctly
□ Contact information is consistent across pages
□ CTAs (WhatsApp, phone, booking) are functional
□ FAQ section expands/collapses correctly
□ Image galleries work properly
□ Video content loads and plays
```

#### **Performance Testing** 
```
□ Lighthouse performance score >= 90
□ Page load time < 2s on desktop
□ Page load time < 3s on mobile
□ Images optimized and load quickly
□ No layout shift during loading
□ Mobile performance optimized
□ Works on slow connections (3G)
□ No memory leaks or performance issues
```

#### **Cross-Browser & Device Testing**
```
□ Chrome (latest 2 versions)
□ Firefox (latest 2 versions) 
□ Safari (latest 2 versions)
□ Edge (latest 2 versions)
□ iPhone 12/13/14 (Safari)
□ Samsung Galaxy (Chrome Mobile)
□ iPad (Safari)
□ Responsive design works 320px - 1920px
```

#### **Security Testing**
```
□ Forms protected against XSS
□ SQL injection prevention verified
□ HTTPS enforced where applicable
□ No sensitive data in client storage
□ Input validation working properly
□ No console errors revealing sensitive info
□ API endpoints secured appropriately
□ Rate limiting implemented (if applicable)
```

#### **Accessibility Testing**
```
□ WCAG 2.1 AA compliance verified
□ Keyboard navigation fully functional
□ Screen reader compatibility tested
□ Color contrast ratios meet standards
□ Alt text provided for all images
□ Form labels properly associated
□ Focus indicators visible
□ No accessibility violations in axe scan
```

#### **Malaysian Market Readiness**
```
□ Bahasa Malaysia content displays correctly
□ Malaysian phone numbers formatted properly
□ WhatsApp integration prominent and working
□ Service areas (Pahang & Terengganu) mentioned
□ Business hours displayed correctly
□ Local contact preferences prioritized
□ Cultural appropriateness verified
□ Mobile-first experience optimized
```

---

## 📚 Testing Resources & Documentation

### **Testing Tools Documentation**
- [Playwright Testing Framework](https://playwright.dev/)
- [Jest Testing Framework](https://jestjs.io/)
- [Lighthouse Performance Testing](https://developers.google.com/web/tools/lighthouse)
- [axe Accessibility Testing](https://www.deque.com/axe/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### **Malaysian Testing Context**
- [Malaysian Internet Statistics](https://www.statista.com/outlook/digital-market/ecommerce/malaysia)
- [Mobile Usage in Malaysia](https://www.malaymail.com/news/tech-gadgets/2023/01/15/study-malaysians-spend-over-8-hours-daily-on-mobile-devices/52456)
- [WhatsApp Business Best Practices](https://business.whatsapp.com/)

### **Internal Documentation**
- `development/test-server.js` - Local testing server
- `development/test-runner.html` - Manual testing dashboard
- `package.json` - Testing scripts and dependencies
- `development/docs/` - Project-specific testing requirements

---

## 🎯 Testing Best Practices Summary

### **Core Testing Principles**
1. **User-Centric Testing** - Test from Malaysian user perspective
2. **Mobile-First Approach** - 85% of traffic is mobile
3. **Performance Priority** - Speed is critical for conversions
4. **Security Awareness** - Protect user data and business reputation
5. **Accessibility Compliance** - Inclusive design for all users
6. **Continuous Testing** - Integrate testing into development workflow
7. **Real-World Conditions** - Test on actual devices and networks

### **Malaysian Market Testing Focus**
1. **WhatsApp Integration** - Primary contact method, must work perfectly
2. **Mobile Performance** - Optimize for slower connections
3. **Local Language Support** - Bahasa Malaysia text rendering
4. **Cultural Sensitivity** - Appropriate for Malaysian audience
5. **Business Hours Accuracy** - Respect local working patterns
6. **Regional Coverage** - Pahang & Terengganu specific content

---

*Test thoroughly, ship confidently! Ensure every Malaysian user has a perfect experience with KME Pest Control! 🧪*
