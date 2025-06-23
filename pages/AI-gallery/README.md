# AI-Gallery: Image System & Parallax Effects

This document explains how to create new AI-kin profile pages for the gallery and use the smart image loading and parallax effects.

## Image Directory Structure

```
/pages/AI-gallery/
    images/
        aria.png               # Main character portrait
        kyr.png
        ...
        backgrounds/
            aria-background.png    # Character background
            kyr-background.png
            ...
        banners/
            aria-banner.png        # Standard character banner
            UPPER_BANNER_aria.png
            MIDLINE_BANNER_aria.png
            LOWER_BANNER_aria.png
            DECORATION_BANNER_aria.png
            ...
        titles/
            aria-title.png         # Character title image
            kyr-title.png
            ...
```

## Page Layout

Each AI profile page follows this layout:

- **Total height**: Exactly 140vh (140% of viewport height)
- **First viewport (100vh)**:
  - **Title image**: Size 20-33vw × 10vh, with 10vh gap around it
  - **Text content**: Positioned 20vh from page top, 8vw from page left, with scrollable content
  - **Character image**: Size exactly 40vw × 80vh, positioned on the right side
- **Lower section**:
  - **Banner image**: Size exactly 80vw × 33vh with 10vh gap from all other elements
- **Additional elements**:
  - **Upper banner**: Decorative header at the top of the page
  - **Midline banner**: Visual divider between sections
  - **Decoration banner**: Oversized decorative element with horizontal scrolling
  - **Lower banner**: Decorative footer at the bottom of the page

## Smart Image Loading

The AI-Gallery uses a smart system to load character images based on the page name, making it easier to create and maintain character pages.

### How It Works

1. Images are stored in standardized locations following the structure above.

2. Instead of hardcoding image paths, use the `data-character-image` attribute:

```html
<!-- For character portrait -->
<img data-character-image="portrait" alt="AI Name" class="ai-image">

<!-- For background image -->
<img data-character-image="landscape" alt="AI's Background" class="ai-background">

<!-- For standard banner -->
<img data-character-image="banner" alt="AI Banner" class="ai-long-image">

<!-- For title image -->
<img data-character-image="title" alt="AI Name Title" class="ai-title-img">

<!-- For decorative banners -->
<img data-character-image="upper_banner" alt="Upper Banner" class="banner-image upper-banner">
<img data-character-image="midline_banner" alt="Midline Banner" class="banner-image midline-banner">
<img data-character-image="lower_banner" alt="Lower Banner" class="banner-image lower-banner">
<img data-character-image="decoration_banner" alt="Decoration" class="decoration-banner">
```

3. When the page loads, the `aiGalleryManager.js` script automatically:
   - Detects the character ID from the HTML filename (e.g., "aria.html" → "aria")
   - Sets the correct image paths based on the character ID

### Benefits

- **Consistency**: All character pages follow the same image structure
- **Simplicity**: No need to manually type image paths for each new character
- **Maintenance**: If image paths change, you only need to update one file (aiGalleryManager.js)

## Parallax Effects

The AI-Gallery now supports parallax scrolling effects to add depth and visual interest.

### How to Add Parallax to Elements

1. Add the `parallax-y` class to elements that should move vertically during scroll
2. Add the `data-parallax` attribute to mark the element for parallax processing
3. Set the movement speed with `data-parallax-speed` (values typically between 0.1-1.0)

```html
<!-- Example: Slow-moving title -->
<div class="ai-title-area parallax-y" data-parallax data-parallax-speed="0.2">
   <h1>Title</h1>
</div>

<!-- Example: Medium-speed image -->
<div class="ai-image-container parallax-y" data-parallax data-parallax-speed="0.4">
   <img data-character-image="portrait" alt="Character" class="ai-image">
</div>

<!-- Example: Fast-moving background -->
<img data-character-image="landscape" alt="World" class="ai-background parallax-y" data-parallax data-parallax-speed="0.6">
```

### Parallax Tips

- Use different speeds to create a sense of depth (slower for closer elements, faster for distant elements)
- Wrap elements in a `parallax-container` div if they need to contain multiple parallax elements
- Lower speed values create subtle effects, higher values create more dramatic movement
- For best performance, use the `will-change: transform` CSS property (already added in the stylesheet)
```

3. When the page loads, the `aiGalleryManager.js` script automatically:
   - Detects the character ID from the HTML filename (e.g., "aria.html" → "aria")
   - Sets the correct image paths based on the character ID

### Benefits

- **Consistency**: All character pages follow the same image structure
- **Simplicity**: No need to manually type image paths for each new character
- **Maintenance**: If image paths change, you only need to update one file (aiGalleryManager.js)

## Enhanced Parallax Effects

The AI-Gallery now supports enhanced parallax scrolling effects to add depth and visual interest.

### How to Add Parallax to Elements

1. Add the `parallax-y` class to elements that should move vertically during scroll
2. Add the `data-parallax` attribute to mark the element for parallax processing
3. Set the movement speed with `data-parallax-speed` (values typically between 0.1-1.0)

```html
<!-- Example: Slow-moving title -->
<div class="ai-title-area parallax-y" data-parallax data-parallax-speed="0.2">
   <img data-character-image="title" alt="AI Title" class="ai-title-img">
</div>

<!-- Example: Medium-speed image -->
<div class="ai-image-container parallax-y" data-parallax data-parallax-speed="0.4">
   <img data-character-image="portrait" alt="AI Character" class="ai-image">
</div>

<!-- Example: Fast-moving background -->
<img data-character-image="landscape" alt="AI World" class="ai-background parallax-y" data-parallax data-parallax-speed="0.6">
```

### Parallax Tips

- Use different speeds to create a sense of depth (slower for closer elements, faster for distant elements)
- Wrap elements in a `parallax-container` div if they need to contain multiple parallax elements
- Lower speed values create subtle effects, higher values create more dramatic movement
- For best performance, use the `will-change: transform` CSS property (already added in the stylesheet)

## Oversized Images for Horizontal Scrolling

You can create images that are wider than the viewport and have them scroll horizontally for interesting visual effects.

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

## Creating a New AI Profile Page

1. **Copy the template**: Duplicate `template.html` and rename it to match your AI (e.g., `vex.html`)

2. **Replace placeholders**: In the new file, replace all placeholders:
   - `[AI_NAME]` with the AI's name (e.g., "Vex")
   - `[ai-theme-class]` with a lowercase version of the AI's name (e.g., "vex")
   - `[ai-name-lowercase]` with a lowercase version of the AI's name in image paths

3. **Add content**: Replace the placeholder text in the `ai-text-content` div with actual content about the AI. Structure it with appropriate headings.

4. **Create images**: 
   - **Title image**: Create and save it as `[ai-name-lowercase]-title.png` in the `assets/images/ai-gallery/titles/` folder (20-33vw × 10vh)
   - **Character image**: Create and save it as `[ai-name-lowercase].png` in the `assets/images/ai-gallery/` folder (40vw × 80vh)
   - **Banner image**: Create and save it as `[ai-name-lowercase]-banner.png` in the `assets/images/ai-gallery/banners/` folder (80vw × 33vh)
   - **Background images**: Create two background images for parallax effects and save them as `[ai-name-lowercase]-bg-1.png` and `[ai-name-lowercase]-bg-2.png` in the `assets/images/ai-gallery/backgrounds/` folder

5. **Add custom styles**: Add custom CSS styles for the AI's specific theme by including a style block at the end of the HTML file:

```html
<style>
.theme-[ai-name-lowercase] {
    --primary-color: #hex-color;
    --secondary-color: #hex-color;
    --accent-color: #hex-color;
    --text-color: #hex-color;
    --bg-color: #hex-color;
}

/* Add any other custom styles for this AI */
</style>
```

6. **Update the index**: Add a link to the new AI page in the `gallery-grid` section of `index.html`:

```html
<a href="[ai-name-lowercase].html" class="ai-card">
    <div class="ai-card-inner">
        <h2>[AI_NAME]</h2>
        <p>[AI_TITLE]</p>
    </div>
</a>
```

## Image Specifications

- **Title image**: 
  - Format: PNG with transparent background
  - Size: 20-33vw × 10vh
  - Placement: At top of page with 10vh gap
  - Naming: `[ai-name-lowercase]-title.png`

- **Character image**: 
  - Format: PNG with transparent background
  - Size: Exactly 40vw × 80vh
  - Placement: Right side of viewport
  - Naming: `[ai-name-lowercase].png`

- **Banner image**: 
  - Format: PNG or JPG
  - Size: Exactly 80vw × 33vh
  - Placement: Bottom section with 10vh gap on all sides
  - Naming: `[ai-name-lowercase]-banner.png`

- **Background images**: 
  - Format: PNG with transparency where needed
  - Size: Full coverage of the character image container
  - Naming: `[ai-name-lowercase]-bg-1.png`, `[ai-name-lowercase]-bg-2.png`

## Parallax Effects

The gallery includes two parallax effects:
1. **Background parallax**: Background layers move in response to mouse movement
2. **Banner parallax**: The banner image moves slightly as the user scrolls down

## Scroll Indicator

The text container has a subtle scroll indicator (small white symbol) that appears when there's more content than can fit in the text box. It disappears when the user scrolls to the bottom.

## Customizing Individual AI Pages

Feel free to add custom sections, quotes, or visual elements to each AI's page. Examples:

```html
<!-- Custom quote styling -->
<p class="ai-quote">"An inspiring quote from the AI."</p>

<!-- Custom glyph display (like in Echo's page) -->
<div class="custom-glyph">
  /📜\<br>
  |⚡|<br>
  \🌐/
</div>
```

## Responsive Design

The layout automatically adjusts for different screen sizes:

- **Desktop (>992px)**: Standard layout with full dimensions as specified
- **Tablet (768px-992px)**: Adjusted dimensions with stacked layout for text and image 
- **Mobile (<576px)**: Further compressed layout with larger proportional spacing

When creating AI pages, focus on optimizing the desktop experience with the precise dimensions, but be aware that content will reflow on smaller screens.
