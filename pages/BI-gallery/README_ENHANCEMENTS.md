# BI Gallery Enhancements

This document outlines the changes made to the BI Gallery system to implement new features and improvements.

## Changes Implemented

### 1. CSS Variable-Based Styling
- Added theming variables for easy customization
- Font colors can now be changed using `--text-color` and `--heading-color` variables
- Text box transparency is controlled via `--text-box-bg` variable
- Each character theme has its own set of variables

### 2. Text Box Improvements
- Changed from fixed height to `fit-to-content` with `max-height`
- Implemented parallax-based text scrolling
- Text now moves upward as the user scrolls (no scrollbar needed)
- Added CSS for content boxes and banners

### 3. Character Interest Items
- Added three floating interest items around each character image
- Items gently animate with soft swivel motion
- Custom configuration available through CSS variables
- Character-specific items with fallbacks

### 4. Landscape Image Handling
- Added fit-to-width functionality for landscape images
- Implemented error handling with fallbacks
- Landscape images are now responsive at all screen sizes

### 5. Asset Directory Structure
- Created proper directory structure for character assets
- Added helpful console logs to direct content creators

## File Structure

```
pages/
  BI-gallery/
    images/
      interests/        <- Place interest items here (character_item1.png)
      landscapes/       <- Place landscape images here (landscape_character.png)
      banners/          <- Banner images go here
    character.html      <- Individual character pages
    template_enhanced.html <- New template with all features
```

## How to Use

### 1. Character Theme Customization

Edit the theme variables in `bi-gallery.css`:

```css
.theme-character {
    --primary-color: #4CAF50;
    --secondary-color: #388E3C;
    --accent-color: #8BC34A;
    --text-color: #E1FFE1;         /* Text color */
    --bg-color: #F1F8E9;
    --text-box-bg: rgba(16, 64, 16, 0.85);  /* Background with transparency */
    --heading-color: #8BC34A;      /* Heading color */
    --interest-item1: url('/pages/BI-gallery/images/interests/character_item1.png');
    --interest-item2: url('/pages/BI-gallery/images/interests/character_item2.png');
    --interest-item3: url('/pages/BI-gallery/images/interests/character_item3.png');
}
```

### 2. Adding Character Assets

Place assets in the following locations:
- Portrait: `/pages/BI-gallery/images/character.png`
- Landscape: `/pages/BI-gallery/images/landscapes/landscape_character.png`
- Interest Items: `/pages/BI-gallery/images/interests/character_item1.png`
- Banners: `/pages/BI-gallery/images/banners/UPPER_BANNER_character.png`

### 3. Using CSS Banners & Boxes

```html
<!-- Custom CSS banner -->
<div class="bi-banner">Character Name</div>

<!-- Decorative content box -->
<div class="bi-content-box">
    <h4>Character Trait</h4>
    <p>Special information goes here.</p>
</div>
```

### 4. Creating a New Character Page

1. Copy `template_enhanced.html` and rename it for your character
2. Replace all instances of `CHARACTER_NAME` and `CHARACTER_ID` with your character's info
3. Update the content of the text areas
4. Create a theme class in `bi-gallery.css` if it doesn't exist
5. Add all required assets to their proper directories

## Parallax Behavior

Scroll behavior has been modified so that:
1. Text moves upward as the user scrolls, revealing more content
2. No scrollbars are shown in text boxes
3. Character images and elements have various parallax speeds
4. Interest items float with a gentle animation independent of scroll

## Troubleshooting

If images aren't loading:
1. Check the console for asset path guidance
2. Ensure files are named correctly (case-sensitive)
3. Create any missing directories
4. Make sure images are PNG format
5. For landscapes, default fallback will be used if character-specific one isn't found
