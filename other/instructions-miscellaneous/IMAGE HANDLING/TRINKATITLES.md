# TRINKATITLES - Custom Page Titles for Trinkaloop Saga

## Overview
Trinkatitles are custom PNG images that serve as page titles throughout the Trinkaloop Saga. Unlike standard HTML text headings, these are specially designed graphic elements that match the artistic style of the story.

## How to Use Trinkatitles

### 1. Title Image Placement

Place your custom PNG title images in:
```
/assets/images/trinkatitles/
```

Recommended naming convention:
- `portal-title.png` - Main title for the portal page
- `chapter1-title.png` - Chapter-level titles
- `001_001-title.png` - Page-specific titles (matching page ID)

### 2. Adding a Trinkatitle to a Page

Add the following HTML to your page:

```html
<div class="trinkatitle-container">
  <img src="/assets/images/trinkatitles/your-title.png" alt="Page Title" class="trinkatitle">
</div>
```

### 3. Title Size Options

The default trinkatitle CSS provides different size classes:

- Default: 90% width
- Small: `<img class="trinkatitle small" ...>` (60% width)
- Medium: `<img class="trinkatitle medium" ...>` (75% width)
- Large: `<img class="trinkatitle large" ...>` (90% width)

### 4. Special Effects

Add a subtle glow effect to your title:
```html
<img src="..." class="trinkatitle glow">
```

## Integrating with Page Templates

For story pages, you can automate the trinkatitle loading based on page ID:

```html
<div class="trinkatitle-container">
  <img src="/assets/images/trinkatitles/{{pageId}}-title.png" 
       alt="{{pageTitle}}" 
       class="trinkatitle"
       onerror="this.style.display='none'">
</div>
```

This will automatically show the correct title if one exists for the current page, and hide the container if no matching title is found.

## Best Practices

1. **Design Consistency**: Keep your titles visually consistent with the Trinkaloop style guide
2. **File Size**: Optimize PNGs for web to ensure fast loading times
3. **Transparency**: Use transparent backgrounds for better integration with different page styles
4. **Fallbacks**: For accessibility, always include descriptive alt text

## Example Implementation

In a chapter page (e.g., 001_001/index.html):

```html
<div class="chapter-page">
  <div class="trinkatitle-container">
    <img src="/assets/images/trinkatitles/001_001-title.png" alt="Chapter 1: Beginning" class="trinkatitle">
  </div>
  
  <!-- Rest of the page content -->
</div>
```

---
Created for Trinkaloop Saga © 2025
