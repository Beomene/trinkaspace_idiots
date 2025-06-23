# Arena 3B: HUD System Guide

## Overview

The HUD (Heads-Up Display) system is part of the Tertiary Arena (A3) and provides a way to display information and interactive elements in the viewport that remain visible and fixed, regardless of scrolling. The HUD system is ideal for displaying:

- Page location information
- Status messages
- Interactive controls
- Sound control
- Contextual help
- Narrative text

## Basic Usage

The HUD system is automatically initialized as part of the TrinkaspaceEngine and provides several default HUD elements. You can also create custom HUD elements for specific purposes.

## Default HUD Elements

The system comes with several default HUD elements:

1. **Page Info** (top-left): Shows the current page ID
2. **Sound Toggle** (bottom-right): Controls sound on/off using icons
3. **TRINKATEXT** (custom position): A narrative message box with typewriter effect

## Custom HUD Elements

### TRINKATEXT

TRINKATEXT is a specialized message box that displays text with a typewriter effect and includes a cyan line at the bottom.

- **Position**: 8vw from left, 5vh from bottom
- **Width**: 33vw
- **Height**: 13vh (approximately 250px)
- **Features**: Typewriter text animation and cyan accent line

You can update the message displayed in TRINKATEXT using:

```javascript
// Set a new message
trinkaspaceEngine.setTrinkatextMessage('Your message here');
```

### Sound Toggle

The sound toggle element allows the user to turn sound on and off with a single click.

- **Position**: Bottom-right corner
- **Controls**: Displays sound-on.png or sound-off.png based on state
- **Interaction**: Click to toggle sound state

You can programmatically toggle sound using:

```javascript
// Enable or disable sound
trinkaspaceEngine.toggleSound(true); // Enable sound
trinkaspaceEngine.toggleSound(false); // Disable sound
```

## Creating Custom HUD Elements

You can create custom HUD elements programmatically:

```javascript
// Get the HUD system from the engine
const hud = window.trinkaspaceEngine.arena3HUD;

// Add a custom HUD element
hud.addElement('my-custom-element', {
  position: 'center-right', // Position in the viewport
  width: '200px', // Width of the element
  content: `
    <div class="hud-title">Custom Element</div>
    <div class="hud-value">Hello, World!</div>
  `,
  showBackground: true, // Show background panel
  showBorder: true, // Show border
  interactive: true, // Allow mouse interaction
});
```

## HUD Element Options

When creating a HUD element, you can specify various options:

| Option | Type | Description |
|--------|------|-------------|
| `position` | string | Position in viewport: 'top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right' |
| `width` | string | Width of the element (CSS value) |
| `height` | string | Height of the element (CSS value) |
| `content` | string | HTML content for the element |
| `showBackground` | boolean | Whether to show a background panel |
| `showBorder` | boolean | Whether to show a border |
| `interactive` | boolean | Whether the element can receive mouse events |
| `baseColor` | string | Background color of the element |
| `textColor` | string | Text color of the element |
| `borderColor` | string | Border color of the element |
| `onUpdate` | function | Callback function that returns content for automatic updates |
| `updateInterval` | number | Update interval in ms (if onUpdate is provided) |

## Dynamic Updates

HUD elements can be updated dynamically in several ways:

### 1. Using the Update Callback

```javascript
hud.addElement('status', {
  position: 'top-right',
  updateInterval: 1000, // Update every second
  onUpdate: () => {
    return `
      <div class="hud-title">Status</div>
      <div class="hud-value">${getCurrentStatus()}</div>
    `;
  }
});
```

### 2. Manual Updates

```javascript
hud.updateElement('status', `
  <div class="hud-title">Status</div>
  <div class="hud-value">Manual Update</div>
`);
```

## Styling HUD Elements

HUD elements can be styled using the built-in CSS classes:

### Theme Classes

- `info`: Blue border for informational elements
- `warning`: Yellow border for warnings
- `danger`: Red border for critical information
- `success`: Green border for success messages

```javascript
// Add a theme class
hud.addClass('my-element', 'warning');

// Remove a theme class
hud.removeClass('my-element', 'warning');
```

### Animation Classes

- `pulse`: Pulsing opacity animation
- `fade-in`: Fade-in animation

### Content Styling Classes

- `hud-title`: For element titles
- `hud-value`: For main values
- `hud-subtitle`: For additional information

## Managing HUD Elements

You can manage HUD elements with these methods:

```javascript
// Remove an element
hud.removeElement('element-id');

// Toggle visibility of an element
hud.toggleElement('element-id');

// Show all HUD elements
hud.showAll();

// Hide all HUD elements
hud.hideAll();
```

## Best Practices

1. **Keep it minimal**: Only show information that's necessary
2. **Use appropriate positions**: Place elements where they won't interfere with content
3. **Group related information**: Use a single HUD element for related data
4. **Consider performance**: For elements that update frequently, use requestAnimationFrame
5. **Make interactive elements obvious**: Use visual cues for elements that can be clicked
