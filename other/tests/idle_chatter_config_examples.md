# Idle Chatter Configuration Examples

## Overview
This document provides configuration examples for the idle chatter system. These examples can be used as templates for different scenes and contexts.

## Forest Scene Configuration

```javascript
const FOREST_IDLE_CONFIG = {
  "areas": {
    "forest_idle": {
      "character": "Eene",
      "textbox": "LTT",
      "lines": [
        { "text": "It sure is peaceful here...", "time": 30 },
        { "text": "The birds are singing so beautifully.", "time": 60 },
        { "text": "I wonder what's behind those hills...", "time": 90 },
        { "text": "Maybe I should get going...", "time": 120 },
        { "text": "I need to remember to buy supplies.", "time": 150 }
      ]
    }
  }
};
```

## Cave Scene Configuration

```javascript
const CAVE_IDLE_CONFIG = {
  "areas": {
    "cave_entrance": {
      "character": "Emraa",
      "textbox": "RTT",
      "lines": [
        { "text": "This cave looks interesting...", "time": 30 },
        { "text": "I feel like I'm being watched...", "time": 60 },
        { "text": "The air is surprisingly warm inside.", "time": 90 },
        { "text": "I should probably find a light source.", "time": 120 },
        { "text": "What's that strange sound?", "time": 150 }
      ]
    },
    "cave_deep": {
      "character": "Emraa",
      "textbox": "RTT",
      "lines": [
        { "text": "It's so dark down here...", "time": 30 },
        { "text": "I can barely see anything.", "time": 60 },
        { "text": "The walls feel strange to touch.", "time": 90 },
        { "text": "Is it getting warmer?", "time": 120 },
        { "text": "I should be careful where I step.", "time": 150 }
      ]
    }
  }
};
```

## Town Scene Configuration

```javascript
const TOWN_IDLE_CONFIG = {
  "areas": {
    "town_square": {
      "character": "Eene",
      "textbox": "LTT",
      "lines": [
        { "text": "The town is busy today.", "time": 30 },
        { "text": "I should visit the market.", "time": 60 },
        { "text": "I wonder if the bakery has fresh bread today.", "time": 90 },
        { "text": "That merchant always overcharges.", "time": 120 },
        { "text": "I need to find the blacksmith before they close.", "time": 150 }
      ]
    },
    "town_tavern": {
      "character": "Fjottskran",
      "textbox": "RTT",
      "lines": [
        { "text": "This ale is watered down...", "time": 30 },
        { "text": "That bard can't sing worth anything.", "time": 60 },
        { "text": "I could tell some stories that would impress these folks.", "time": 90 },
        { "text": "Keep your voice down, they're listening...", "time": 120 },
        { "text": "Another round wouldn't hurt.", "time": 150 }
      ]
    }
  }
};
```

## Mascot Configuration

```javascript
const MASCOT_CONFIG = {
  "mascots": {
    "Yly": [
      { "text": "Hey! Are you still there?", "time": 120 },
      { "text": "Just checking in!", "time": 180 },
      { "text": "Looks like you're taking a break.", "time": 240 },
      { "text": "Need a hint?", "time": 300 },
      { "text": "You can continue the story by scrolling.", "time": 360 }
    ],
    "Lyl": [
      { "text": "*pokes head in* Hello?", "time": 150 },
      { "text": "Don't worry, the story will wait for you.", "time": 210 },
      { "text": "Enjoying the scenery?", "time": 270 },
      { "text": "I wonder what happens next...", "time": 330 },
      { "text": "When you're ready, just scroll down to continue.", "time": 390 }
    ]
  }
};
```

## Combined Example

For a complete setup, combine area-specific configurations with mascot configurations:

```javascript
const IDLE_CHATTER_CONFIG = {
  // Global settings
  "globalSettings": {
    "defaultIdleTime": 60,
    "checkInterval": 5000,
    "debugMode": true
  },
  
  // Areas from different scenes
  "areas": {
    // Forest areas
    "forest_idle": {
      "character": "Eene",
      "textbox": "LTT",
      "lines": [
        { "text": "It sure is peaceful here...", "time": 30 },
        { "text": "The birds are singing so beautifully.", "time": 60 },
        { "text": "I wonder what's behind those hills...", "time": 90 }
      ]
    },
    
    // Cave areas
    "cave_entrance": {
      "character": "Emraa",
      "textbox": "RTT",
      "lines": [
        { "text": "This cave looks interesting...", "time": 30 },
        { "text": "I feel like I'm being watched...", "time": 60 },
        { "text": "The air is surprisingly warm inside.", "time": 90 }
      ]
    },
    
    // Town areas
    "town_square": {
      "character": "Eene",
      "textbox": "LTT",
      "lines": [
        { "text": "The town is busy today.", "time": 30 },
        { "text": "I should visit the market.", "time": 60 }
      ]
    }
  },
  
  // Mascots that can appear in any soft beat area
  "mascots": {
    "Yly": [
      { "text": "Hey! Are you still there?", "time": 120 },
      { "text": "Just checking in!", "time": 180 }
    ],
    "Lyl": [
      { "text": "*pokes head in* Hello?", "time": 150 },
      { "text": "Don't worry, the story will wait for you.", "time": 210 }
    ]
  }
};
```

## User Preferences

Consider adding these user preference options to allow customization of the idle chatter experience:

```javascript
const userPreferences = {
  "idleChatter": {
    "enabled": true,               // Master toggle for idle chatter
    "characterChatter": true,      // Toggle for character thoughts/dialogue
    "mascots": true,               // Toggle for mascot appearances
    "frequency": "medium",         // high, medium, low
    "idleThreshold": 60           // Base idle threshold in seconds
  }
};
```

These preferences can be integrated with the idle chatter system to provide a personalized experience for each user.

## Implementation Notes

1. Load these configurations based on the current scene or chapter
2. Apply user preferences to modify the base configuration
3. Update configuration when transitioning between different areas
4. Consider persisting displayed chatters to avoid repetition between sessions

## Special Effects

For added immersion, consider these special effects with idle chatter:

1. **Animated entries**: Have the character or mascot slide in with their message
2. **Typing effect**: Show the text being typed out rather than appearing all at once
3. **Sound effects**: Add subtle audio cues when idle chatter appears
4. **Environmental responses**: Make background elements react to lengthy idle periods (e.g., falling leaves, weather changes)
5. **Fourth wall breaks**: After very long idle periods, have characters or mascots acknowledge the real-world situation
