# Scope Frames Guide

## Overview

Scope frames allow you to add visual embellishments to the rectangular edges of diorama scope windows. Instead of having perfectly rectangular diorama windows, you can add jagged or decorative edges that blend with the page background.

## Asset Structure

Scope frame assets are organized in the following folder structure:

```
assets/images/primaryArena/scope/
├── frames/
│   ├── scopeUPPER/
│   ├── scopeLOWER/
│   ├── scopeLEFT/
│   ├── scopeRIGHT/
└── filters/
```

### Frames

Frame assets should be PNG images with transparent backgrounds where:
- The non-transparent part should match the page background color
- The transparent part defines the visible area of the diorama

#### Guidelines for Frame Assets

1. **Size and Position**:
   - Each frame should be sized according to the side it's placed on
   - UPPER and LOWER frames should span the entire diorama width, including both left and right corners
   - LEFT and RIGHT frames should span the entire diorama height, including both top and bottom corners
   - Think of it like placing decorative elements (e.g., twigs) around a painting, with each piece covering an entire side

2. **Transparency**:
   - Use semi-transparency to create soft edges where needed
   - Full transparency creates the visible area of the diorama
   - Opaque areas (matching page background) create the "frame"

3. **Naming Convention**:
   - Include the color hex code in your filenames to identify the page background color they're designed for:
     - `frame_upper_1_202029.png`
     - `frame_lower_2_202029.png`
     - `frame_left_3_202029.png`
     - `frame_right_1_202029.png`
   - Each frame should be unique to avoid repetitive patterns that break immersion

### Filters

The filters folder can contain overlay textures or color adjustments to apply to entire dioramas. These could include:
- Grain textures
- Vignette effects
- Subtle color overlays

## Implementation

Scope frames are configured in the scope.json file for each diorama:

```json
{
  "scopeType": "vertical",
  "frames": {
    "upper": "jagged_edge_1.png",
    "lower": "rough_border_2.png",
    "left": "torn_edge_1.png",
    "right": "torn_edge_2.png"
  },
  "filter": "subtle_grain.png"
}
```

### CSS Implementation

The system uses absolute positioning to attach frame images to each side of the diorama container:

```css
.diorama-frame {
  position: absolute;
  z-index: 2; /* Above the diorama content */
  pointer-events: none; /* Allow clicks to pass through */
}

.diorama-frame-upper {
  top: 0;
  left: 0;
  width: 100%;
  transform-origin: top left;
}

.diorama-frame-lower {
  bottom: 0;
  left: 0;
  width: 100%;
  transform-origin: bottom left;
}

.diorama-frame-left {
  top: 0;
  left: 0;
  height: 100%;
  transform-origin: top left;
}

.diorama-frame-right {
  top: 0;
  right: 0;
  height: 100%;
  transform-origin: top right;
}
```

## Best Practices

1. **Match Background Colors**:
   - Ensure the opaque parts of your frame images match the page background
   - Create variations for different background themes

2. **Consider Scale**:
   - Design frames that work at different diorama sizes
   - Use percentage-based scaling where appropriate

3. **Subtle Effects**:
   - Less is often more - subtle jagged edges often look more professional
   - Test frames at different scroll positions to ensure they look good

4. **Performance**:
   - Keep frame images optimized for web (compressed PNGs)
   - Avoid overly complex transparency patterns that might cause rendering issues

5. **Consistency**:
   - Consider creating themed sets of frames that work well together
   - Maintain a consistent style across related dioramas

## Example Assets

You can create frame assets with these characteristics:
- Natural torn paper edges
- Jagged rock formations
- Organic plant/vine outlines
- Architectural elements (window frames, doorways)
- Abstract geometric patterns
- Weathered or eroded edges

Each set of frames can be themed to match the content or mood of specific dioramas.
