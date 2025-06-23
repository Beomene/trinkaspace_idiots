# Scope Vertical Offset Feature Guide

## Overview

The Scope Vertical Offset feature allows you to adjust the vertical position of a diorama's content (natscene) within its scope window. This is useful for:

- Focusing on specific parts of a large scene
- Creating cinematic framing effects
- Showing different areas of the same diorama at different scroll positions
- Optimizing scene composition

## How to Use

1. Add the `scopeVerticalOffset` property to your diorama's `scope.json` file:

```json
{
  "width": "60vw",
  "heightMode": "width-ratio",
  "heightValue": 0.75,
  "safetyZone": 300,
  "bleed": false,
  "left": "20vw",
  "zIndex": 10,
  "scopeVerticalOffset": -200
}
```

## Parameter Details

- `scopeVerticalOffset`: (number) The vertical offset in pixels
  - Negative values (-200): Move the natscene upwards (show more of the top)
  - Positive values (200): Move the natscene downwards (show more of the bottom)
  - Default: 0 (no offset)

## Technical Details

The `scopeVerticalOffset` parameter applies a CSS transform to the `.natscene` element:

```css
transform: translateY(-200px);
```

This shifts the content while keeping it within the scope window's dimensions.

## Best Practices

1. **Start with small adjustments**: Begin with small offset values (±50-100px) and adjust as needed.

2. **Consider parallax effects**: Remember that parallax effects will still be applied on top of the offset.

3. **Check across device sizes**: Ensure your offset works well across different device classes (M, S, XS).

4. **Use with caution**: Large offset values may cause some layers to move out of view, so test thoroughly.

## Examples

- **Skyline focus**: `"scopeVerticalOffset": -300` to focus on the top portion of a cityscape
- **Ground-level detail**: `"scopeVerticalOffset": 150` to show more ground detail
- **Character framing**: `"scopeVerticalOffset": -100` to better position a character in the frame

## Troubleshooting

If your scope offset isn't working:

1. Check that your `scope.json` file contains the `scopeVerticalOffset` property
2. Ensure the value is a number (not a string with "px")
3. Try a larger value to confirm the effect is visible
4. Check the console for any error messages
