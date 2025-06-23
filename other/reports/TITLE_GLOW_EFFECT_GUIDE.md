# Title Glow Effect Implementation Guide

## Overview

This document outlines how to implement the title glow effect across all pages in the Trinkaspace project. The glow effect creates a subtle, pulsating cyan glow around title images that adds visual interest and depth.

## Implementation

### 1. CSS File

The title glow effect is implemented in a dedicated CSS file:
`assets/css/title-glow.css`

This file includes all the necessary styles and animations to create the glow effect.

### 2. Including the Effect on All Pages

To include the glow effect on any page, simply add the following line to the `<head>` section:

```html
<link rel="stylesheet" href="assets/css/title-glow.css">
```

For pages in subdirectories, adjust the path accordingly:

```html
<link rel="stylesheet" href="../../assets/css/title-glow.css">
```

### 3. CSS Classes

The title glow effect will automatically apply to the following CSS classes:

- `.trinkatitle`
- `.page-title img`
- `.chapter-title img`
- `.story-title img`
- `img.title-image`
- `.title-container img`

If you have title images with different class names, add them to the selector list in `title-glow.css`.

## Animation Details

The title glow effect consists of two animations:

1. **Glow Animation**
   - Creates a pulsating cyan shadow around the title
   - Cycles every 4 seconds
   - Shadow color: rgba(42, 255, 247, x) where x varies between 0.3 and 0.6

2. **Float Animation** (for non-parallax titles)
   - Adds a very subtle up and down movement
   - Only 2px of vertical movement
   - Cycles every 8 seconds

## Design Rationale

The glow effect was designed to:

1. Add visual interest without being distracting
2. Create a sense of "aliveness" in the UI
3. Highlight the title as an important element
4. Reinforce the cyberpunk/digital aesthetic with the cyan color
5. Create consistency across all pages

## Customization

To adjust the intensity of the glow:

1. Open `title-glow.css`
2. Modify the shadow values in the `globalTitleGlow` keyframes
3. Test on various screen sizes to ensure it looks good on all displays

## Browser Compatibility

The glow effect uses standard CSS animations and filters that are compatible with all modern browsers. For older browsers, the effect will gracefully degrade to a static title without glow.

---

**Note:** This effect should remain consistent across all pages to maintain the design language of the Trinkaspace project.
