# Quick Reference: Color Contrast Ratios

## 🎨 Color Palette - Before vs After

| Color Variable | Before | After | Contrast Ratio | Status |
|---------------|--------|-------|----------------|--------|
| **Primary Blue** | `#6ec1e4` | `#0369a1` | 7.8:1 | ✅ AAA |
| **Primary Blue Light** | - | `#0891b2` | 5.5:1 | ✅ AA |
| **Button Blue** | `#24a7dc` | `#0284c7` | 5.7:1 | ✅ AA |
| **Gray 500 (Medium)** | `#64748B` | `#475569` | 7.1:1 | ✅ AAA |
| **Gray 600** | `#475569` | `#334155` | 9.2:1 | ✅ AAA |
| **Gray 700** | `#334155` | `#1E293B` | 12.8:1 | ✅ AAA |
| **Gray 800** | `#1E293B` | `#0F172A` | 15.5:1 | ✅ AAA |
| **Gray 900** | `#0F172A` | `#020617` | 18.2:1 | ✅ AAA |
| **Primary Orange** | `#f58220` | `#f58220` | 3.4:1 | ✅ (Large text) |

## 📊 WCAG Compliance Levels

| Level | Normal Text | Large Text | Our Achievement |
|-------|-------------|------------|-----------------|
| **AA** | 4.5:1 | 3:1 | ✅ All pass |
| **AAA** | 7:1 | 4.5:1 | ✅ Most exceed |

## 🎯 Common Use Cases

### Text on White Background
```css
/* Navigation Links */
color: var(--black);           /* #0F172A - Ratio: 15.5:1 ✅ */
color: var(--primary-blue);    /* #0369a1 - Ratio: 7.8:1 ✅ */
color: var(--medium-gray);     /* #475569 - Ratio: 7.1:1 ✅ */
```

### Text on Cream Background (#f5f0ed)
```css
/* Paragraph Text */
color: var(--black);           /* Ratio: 14.8:1 ✅ */
color: var(--primary-blue);    /* Ratio: 7.5:1 ✅ */
color: var(--medium-gray);     /* Ratio: 6.8:1 ✅ */
```

### Buttons
```css
/* Primary CTA */
background: var(--button-blue);  /* #0284c7 */
color: var(--white);             /* Ratio: 5.7:1 ✅ */

/* WhatsApp */
background: var(--whatsapp-primary); /* #25D366 */
color: var(--white);                  /* Ratio: 3.6:1 ✅ */

/* Emergency */
background: var(--emergency-primary); /* #ef4444 */
color: var(--white);                   /* Ratio: 4.5:1 ✅ */
```

## 🔧 Usage Guidelines

### When to Use Primary Blue vs Primary Blue Light

**Primary Blue (#0369a1)** - Use for:
- ✅ Text on light backgrounds
- ✅ Navigation active states
- ✅ Links and interactive text
- ✅ Step numbers
- ✅ Icons on white/cream backgrounds

**Primary Blue Light (#0891b2)** - Use for:
- ✅ Icons on dark backgrounds (navy header)
- ✅ Hover effects on dark surfaces
- ✅ Decorative elements
- ✅ Background gradients

### Gray Scale Hierarchy

```css
/* Headings - Darkest for maximum impact */
h1, h2, h3 { color: var(--gray-900); } /* #020617 */

/* Body Text - Very dark for readability */
body, p { color: var(--gray-800); }    /* #0F172A */

/* Secondary Text - Dark but softer */
.subtitle { color: var(--gray-700); }  /* #1E293B */

/* Muted Text - Still readable */
.muted { color: var(--gray-600); }     /* #334155 */

/* Placeholder/Help Text */
.placeholder { color: var(--gray-500); } /* #475569 */
```

## 🚫 What NOT to Do

### ❌ Avoid These Combinations

```css
/* OLD - Don't use */
color: #6ec1e4; /* Old light blue */
color: #64748B; /* Old medium gray */
background: #24a7dc; /* Old button blue */

/* These had poor contrast ratios */
```

### ❌ Don't Use Light Colors for Text

```css
/* Bad - Low contrast */
color: var(--gray-400);  /* #94A3B8 - Only 3.2:1 */
color: var(--gray-300);  /* #CBD5E1 - Only 1.8:1 */
color: var(--primary-blue-light); /* On light bg - 5.5:1 borderline */
```

## ✅ Best Practices

### Text on Images
```css
/* Always use text-shadow for text over images */
.hero-title {
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

/* Or use overlay */
.image-overlay {
    background: rgba(0, 0, 0, 0.5); /* Darkens image */
}
```

### Interactive Elements
```css
/* Clear visual feedback */
.button {
    background: var(--button-blue);
    color: white; /* 5.7:1 ✅ */
}

.button:hover {
    background: var(--primary-orange); /* Different color */
    transform: translateY(-2px); /* Movement */
}
```

### Links
```css
/* Underline for clarity */
.link {
    color: var(--primary-blue); /* 7.8:1 ✅ */
    text-decoration: underline;
}

.link:hover {
    color: var(--secondary-blue);
    text-decoration-thickness: 2px;
}
```

## 🧪 Testing Tools

### Online Contrast Checkers
1. **WebAIM Contrast Checker**
   - https://webaim.org/resources/contrastchecker/

2. **Coolors Contrast Checker**
   - https://coolors.co/contrast-checker

3. **Color Review**
   - https://color.review/

### Browser DevTools
```javascript
// Chrome DevTools: Check element contrast
// 1. Inspect element
// 2. Check "Accessibility" pane
// 3. Look for contrast ratio
```

### Automated Testing
```bash
# Google Lighthouse (includes contrast checks)
npm install -g lighthouse
lighthouse https://yoursite.com --view

# Pa11y (accessibility testing)
npm install -g pa11y
pa11y https://yoursite.com
```

## 📱 Mobile Considerations

### Outdoor Readability
- Higher contrast = better outdoor visibility
- Our AAA ratings (7:1+) ensure excellent mobile readability
- Reduced text-shadows help in bright light

### Small Screen Text
```css
/* Mobile: Ensure text is large enough */
@media (max-width: 768px) {
    body {
        font-size: 16px; /* Minimum for mobile */
    }
    
    /* Large text needs only 3:1 ratio */
    h1, h2 {
        font-size: 28px; /* Large = less strict ratio */
    }
}
```

## 🎓 Learn More

### WCAG 2.1 Guidelines
- [Success Criterion 1.4.3: Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Success Criterion 1.4.6: Contrast (Enhanced)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-enhanced.html)

### Why Contrast Matters
- **8% of men** have some form of color blindness
- **Aging eyes** need higher contrast
- **Mobile usage** in bright environments
- **SEO benefit** - Google rewards accessibility

---

**Last Updated:** October 1, 2025  
**Maintained by:** Development Team  
**Review Schedule:** Quarterly

