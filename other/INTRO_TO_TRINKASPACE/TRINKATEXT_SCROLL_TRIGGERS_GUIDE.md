# TRINKATEXT Scroll Triggers Guide

## Overview

TRINKATEXT Scroll Triggers allow you to change the message displayed in the TRINKATEXT HUD element based on the user's scroll position. This creates dynamic, context-sensitive narration that responds to the user's progress through the page.

## Basic Usage

The ScrollTrigger system is integrated with the TrinkaspaceEngine and automatically initialized when the engine starts. You can add scroll triggers that will display different messages in the TRINKATEXT element when the user scrolls to specific y-positions on the page.

## Defining Scroll Triggers in page.json

The recommended way to define scroll triggers is directly in your page.json file. This keeps all page-related configuration in a single place:

```json
{
  "meta": {
    "chapter": 1,
    "page": 1,
    "title": "Your Page Title",
    "background": "#202029",
    "pageHeight": "10000px"
  },
  "elements": {
    "dioramas": [...],
    "textboxes": [...],
    "scrollTriggers": [
      {
        "y": 0,
        "message": "Welcome to Trinkaspace. Scroll down to explore the story.",
        "id": "intro",
        "once": false
      },
      {
        "y": 2222,
        "message": "You've reached the first scene. Take a moment to observe.",
        "id": "diorama-1-view",
        "delay": 500,
        "once": true
      },
      // Add more triggers as needed
    ]
  }
}
```

The TrinkaspaceEngine automatically loads and activates these triggers when the page loads.

## Adding Scroll Triggers

### Single Trigger

```javascript
// Basic trigger
trinkaspaceEngine.addTextTrigger(
  500, // y-position in pixels
  "This message appears when scrolled to y=500px"
);

// Trigger with options
trinkaspaceEngine.addTextTrigger(
  1000, // y-position in pixels
  "Another message at y=1000px",
  {
    id: "section-intro", // Identifier for this trigger
    once: true,          // Only trigger once, even if scrolling past multiple times
    delay: 300,          // Delay in ms before showing the message
    onTrigger: () => {   // Optional callback when triggered
      console.log("Trigger activated!");
      // You could also play a sound, animate an element, etc.
    }
  }
);
```

### Multiple Triggers

```javascript
// Add multiple triggers at once
trinkaspaceEngine.addTextTriggers([
  {
    y: 0,
    message: "Welcome to this page. Scroll down to explore."
  },
  {
    y: 800,
    message: "Here we introduce the first concept.",
    id: "intro-1"
  },
  {
    y: 1500,
    message: "Now we're getting to the important details.",
    id: "details",
    once: true
  },
  {
    y: 2200,
    message: "The conclusion ties everything together.",
    id: "conclusion",
    delay: 500
  }
]);
```

## Managing Triggers

### Remove a Specific Trigger

```javascript
// Remove a trigger by ID
trinkaspaceEngine.removeTextTrigger("intro-1");
```

### Reset All Triggers

This resets the "triggered" flag for all triggers, allowing once-only triggers to fire again:

```javascript
// Reset all triggers
trinkaspaceEngine.resetTextTriggers();
```

### Clear All Triggers

```javascript
// Remove all triggers
trinkaspaceEngine.clearTextTriggers();
```

## Trigger Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `y` | number | **Required**. The scroll position (in pixels) at which to trigger the message |
| `message` | string | **Required**. The message to display in TRINKATEXT |
| `id` | string | Unique identifier for this trigger (useful for removing later) |
| `once` | boolean | If true, trigger only fires once (default: false) |
| `delay` | number | Delay in ms before showing the message (default: 0) |
| `onTrigger` | function | Callback function executed when triggered |

## Best Practices

1. **Strategic Placement**:
   - Place triggers at the points where the user needs additional context
   - Consider the reading pace and visual flow of your page

2. **Message Length**:
   - Keep messages concise for easier reading
   - Consider breaking longer narratives into multiple trigger points

3. **Performance**:
   - The system includes debouncing to optimize scroll performance
   - Still, avoid having hundreds of triggers on a single page

4. **User Experience**:
   - Use delays strategically to avoid jarring message changes
   - Consider making important messages trigger only once

5. **Testing**:
   - Test triggers on different screen sizes and scroll speeds
   - Ensure messages appear at the appropriate moments

## Example Implementation

Here's how you might implement scroll triggers for a narrative experience:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  // Wait for engine to initialize
  setTimeout(() => {
    // Set up narrative sequence with scroll triggers
    trinkaspaceEngine.addTextTriggers([
      {
        y: 0,
        message: "The forest grows silent as you approach the ancient ruins."
      },
      {
        y: 500,
        message: "Stone pillars rise from the mist, their surfaces covered in mysterious symbols.",
        id: "pillars"
      },
      {
        y: 1200,
        message: "A faint blue light emanates from within the central chamber.",
        id: "blue-light", 
        once: true
      },
      {
        y: 2000,
        message: "As you step closer, you feel the air begin to hum with energy.",
        delay: 300
      }
    ]);
  }, 500);
});
```

## Combining with Other Features

TRINKATEXT Scroll Triggers can be combined with other Trinkaspace features:

1. **Synchronize with diorama animations**:
   - Trigger animations when specific messages appear
   - Use the `onTrigger` callback to start animations

2. **Dynamic sound control**:
   - Trigger ambient sounds when the user reaches certain points
   - Mute or change sound when entering new narrative sections

3. **Interactive elements**:
   - Show instructions in TRINKATEXT when the user reaches interactive elements
   - Provide feedback based on user actions
