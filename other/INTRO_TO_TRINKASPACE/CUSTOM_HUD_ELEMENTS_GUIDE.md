# Trinkaspace Custom HUD Elements Guide

This guide explains the custom HUD elements available in Trinkaspace and how to use them in your projects.

## Overview

The Trinkaspace HUD (Heads-Up Display) system includes specialized custom elements:

1. **TRINKATEXT** - A message box with typewriter effect
2. **Sound Toggle** - An interactive button to control sound

These elements are designed to enhance the user experience with minimalist, cyberpunk-inspired visuals that align with the Trinkaspace aesthetic.

## TRINKATEXT

TRINKATEXT is a custom message box that displays text with a typewriter effect and includes a cyan line at the bottom.

### Specifications:
- Position: 8vw from left, 5vh from bottom
- Width: 33vw wide (approximately 733px on a standard desktop)
- Height: 13vh (approximately 250px)
- Features: Typewriter text animation effect and cyan line separator
- Style: Rounded edges, semi-transparent background

### Usage:

```javascript
// Access via trinkaspaceEngine
trinkaspaceEngine.setTrinkatextMessage('Your custom message here.');
```

### Styling:

The TRINKATEXT element uses the following CSS classes:
- `.trinkatext-container` - Main container
- `.trinkatext-message` - Text message element
- `.trinkatext-typing` - Class for the typewriter animation
- `.trinkatext-line` - The cyan line separator

## Sound Toggle

The Sound Toggle is a circular button positioned in the bottom-right corner that allows users to mute/unmute sound.

### Specifications:
- Position: Bottom-right corner
- Design: Circular button with sound icon
- States: Toggles between sound-on.png and sound-off.png
- Style: Semi-transparent background with cyan accent on hover

### Usage:

```javascript
// Programmatically control sound state
trinkaspaceEngine.toggleSound(true); // Enable sound
trinkaspaceEngine.toggleSound(false); // Disable sound

// Check current sound state
const isSoundEnabled = trinkaspaceEngine.soundEnabled;
```

### Styling:

The Sound Toggle element uses the following CSS classes:
- `.sound-toggle-container` - Button container
- `.sound-toggle-icon` - The sound icon image

## Integration Examples

### Story Narration with Sound:

```javascript
// At the start of a scene with ambient sound
trinkaspaceEngine.setTrinkatextMessage('The forest grows quiet as you approach the clearing...');
trinkaspaceEngine.toggleSound(true);

// During an important silent moment
trinkaspaceEngine.setTrinkatextMessage('You hold your breath, listening intently...');
trinkaspaceEngine.toggleSound(false);
```

## Best Practices

1. Keep TRINKATEXT messages concise and impactful
2. Use TRINKATEXT for important narrative moments or instructions
3. Consider the current state of sound when displaying related messages
4. Update TRINKATEXT messages gradually to avoid overwhelming the user
