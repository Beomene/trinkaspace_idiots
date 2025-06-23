# BI-Gallery: Image System & Parallax Effects

This document explains how to use the smart image loading system and parallax effects in the BI-Gallery.

## Image Directory Structure

```
/pages/BI-gallery/
    images/
        eene.png              # Main character portrait
        emraa.png
        ...
        landscapes/
            eene-landscape.png    # Character world background
            emraa-landscape.png
            ...
        banners/
            UPPER_BANNER_eene.png
            MIDLINE_BANNER_eene.png
            LOWER_BANNER_eene.png
            DECORATION_BANNER_eene.png
            ...
```

## Smart Image Loading

The BI-Gallery now uses a smart system to load character images based on the page name, making it easier to create and maintain character pages.

### How It Works

1. Images are stored in standardized locations:
   - Character portraits: `./images/[character-id].png`
   - Landscape images: `./images/landscapes/[character-id]-landscape.png`

2. Instead of hardcoding image paths, use the `data-character-image` attribute:

```html
<!-- For character portrait -->
<img data-character-image="portrait" alt="Character Name" class="bi-image">

<!-- For landscape/background -->
<img data-character-image="landscape" alt="Character's World" class="bi-long-image">

<!-- For decorative banners -->
<img data-character-image="upper_banner" alt="Upper Banner" class="banner-image upper-banner">
<img data-character-image="midline_banner" alt="Midline Banner" class="banner-image midline-banner">
<img data-character-image="lower_banner" alt="Lower Banner" class="banner-image lower-banner">
<img data-character-image="decoration_banner" alt="Decoration" class="decoration-banner">
```

3. When the page loads, the `biGalleryManager.js` script automatically:
   - Detects the character ID from the HTML filename (e.g., "eene.html" → "eene")
   - Sets the correct image paths based on the character ID

### Benefits

- **Consistency**: All character pages follow the same image structure
- **Simplicity**: No need to manually type image paths for each new character
- **Maintenance**: If image paths change, you only need to update one file (biGalleryManager.js)

## Parallax Effects

The BI-Gallery now supports parallax scrolling effects to add depth and visual interest.

### How to Add Parallax to Elements

1. Add the `parallax-y` class to elements that should move vertically during scroll
2. Add the `data-parallax` attribute to mark the element for parallax processing
3. Set the movement speed with `data-parallax-speed` (values typically between 0.1-1.0)

```html
<!-- Example: Slow-moving title -->
<div class="bi-title-area parallax-y" data-parallax data-parallax-speed="0.2">
   <h1>Title</h1>
</div>

<!-- Example: Medium-speed image -->
<div class="bi-image-container parallax-y" data-parallax data-parallax-speed="0.4">
   <img data-character-image="portrait" alt="Character" class="bi-image">
</div>

<!-- Example: Fast-moving background -->
<img data-character-image="landscape" alt="World" class="bi-long-image parallax-y" data-parallax data-parallax-speed="0.6">
```

### Parallax Tips

- Use different speeds to create a sense of depth (slower for closer elements, faster for distant elements)
- Wrap elements in a `parallax-container` div if they need to contain multiple parallax elements
- Lower speed values create subtle effects, higher values create more dramatic movement
- For best performance, use the `will-change: transform` CSS property (already added in the stylesheet)

## Creating a New Character Page

1. Copy the `template.html` file
2. Rename it to your character name (e.g., `newcharacter.html`)
3. Replace the placeholder content (character name, descriptions, etc.)
4. Add your character images to:
   - `./images/newcharacter.png`
   - `./images/landscapes/newcharacter-landscape.png`
   - `./images/banners/UPPER_BANNER_newcharacter.png`
   - `./images/banners/MIDLINE_BANNER_newcharacter.png`
   - `./images/banners/LOWER_BANNER_newcharacter.png`
   - `./images/banners/DECORATION_BANNER_newcharacter.png`
5. The page will automatically load the correct images and enable parallax effects

## How the System Works

The `biGalleryManager.js` script handles all the image loading and parallax effects. It:

1. Automatically detects the current character from the page URL
2. Loads the appropriate images based on data attributes
3. Initializes parallax effects for elements with the proper attributes 
4. Updates element positions during page scroll

No additional configuration is needed for basic usage beyond adding the proper HTML attributes.

## Oversized Images for Horizontal Scrolling

You can create images that are wider than the viewport and have them scroll horizontally for interesting visual effects. This is particularly useful for decorative banners and background elements.

### Setting Up Oversized Images

1. Add the `parallax-oversized` and `oversize-x` classes to your image
2. Add the `data-oversize-factor` attribute with a value greater than 1.0 (e.g., 2.0 for twice the viewport width)
3. Add `parallax-x` class for horizontal movement

```html
<!-- Example: Oversized decorative banner -->
<div class="oversize-container" style="height: 200px;">
    <img data-character-image="decoration_banner" 
         class="decoration-banner parallax-oversized oversize-x parallax-x" 
         data-parallax data-parallax-speed-x="-0.03"
         data-oversize-factor="2.0">
</div>
```

### Horizontal Parallax Tips

- Use `data-parallax-speed-x` to control horizontal scrolling speed
- Negative values move in the opposite direction of scroll
- Smaller values (0.01 to 0.1) create subtle effects
- Use the `oversize-container` to manage the height of the oversized area

## Banner Types and Placement

The gallery includes various banner types for visual interest:

### Upper Banner
- Positioned at the top of the page
- Creates a decorative header
- Typically has subtle horizontal movement

### Midline Banner
- Positioned between content sections
- Creates visual separation
- Can move horizontally at medium speed

### Lower Banner
- Positioned at the bottom of the page
- Creates a decorative footer
- Typically has subtle horizontal movement

### Decoration Banner
- Oversized decorative element
- Can be positioned anywhere
- Usually has slow horizontal movement in the opposite direction of scroll
