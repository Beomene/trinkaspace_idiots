# Idle Chatter Design Document

## Overview

This document outlines the design and implementation strategies for "Idle Chatter" - narrative content that's triggered when a reader has been inactive for a period of time. Unlike the main narrative which is triggered by scroll position, idle chatter responds to real-world time passing while the user is in specific contexts.

## Core Concepts

### Idle Chatter Definition
- Text content that appears after a period of user inactivity (no scrolling, clicking, or other events)
- Only appears in designated "soft beat areas" where characters can safely pause
- Can include character thoughts, observations, or fourth-wall breaking comments
- May involve mascots (Yly and Lyl) who can appear based on idle duration

### Idle States
1. **Brief Idle** (30-60 seconds): Small observations or thoughts
2. **Medium Idle** (1-3 minutes): More substantial thoughts or mascot appearance
3. **Extended Idle** (3+ minutes): More fourth-wall breaking comments or hints

## Implementation Approaches

### Approach 1: Extension of Moment System

Building on the existing moment/beat system with specialized idle triggers.

```javascript
// Example script format
y=100, **moment idle_forest**
idle_forest LTT; "It sure is pretty here..." (30s)
idle_forest LTT; "I need to buy toiletpaper..." (60s)
idle_forest LTT; "Maybe I need to get going..." (120s)
```

**Implementation:**
```javascript
// In textScript.js
function parseIdleMoment(scriptLine) {
  // Parse idle moment with format: momentName TTB; "text" (timeInSeconds)
  const match = scriptLine.match(/(\w+)\s+(\w+);\s*"([^"]+)"\s*\((\d+)s\)/);
  if (match) {
    return {
      moment: match[1],
      textboxTarget: match[2], 
      text: match[3],
      idleTime: parseInt(match[4])
    };
  }
  return null;
}

// In scrollTrigger.js or new idleChatter.js
function setupIdleListeners() {
  let idleTimer;
  let lastActivity = Date.now();
  const idleCheckInterval = 5000; // Check every 5 seconds
  
  // Reset timer on user activity
  const resetIdleTimer = () => {
    lastActivity = Date.now();
  };
  
  // Add event listeners for user activity
  ['scroll', 'click', 'keydown', 'mousemove', 'touchstart'].forEach(event => {
    window.addEventListener(event, resetIdleTimer);
  });
  
  // Regular check for idle state
  setInterval(() => {
    const idleTime = (Date.now() - lastActivity) / 1000;
    triggerIdleChatters(idleTime);
  }, idleCheckInterval);
}
```

**Pros:**
- Consistent with existing scripting syntax
- Integrates with the established moment system
- Clear time designations

**Cons:**
- Requires additional parsing logic
- May need special handling for idle moments vs. scroll moments

### Approach 2: Independent Idle Chatter System

Create a separate system specifically for managing idle content.

```javascript
// Separate idle chatter configuration file: idleChatter.json
{
  "contexts": {
    "forest_scene": {
      "character": "Eene",
      "chatters": [
        { "text": "It sure is pretty here...", "minIdleTime": 30 },
        { "text": "I need to buy toiletpaper...", "minIdleTime": 60 },
        { "text": "Maybe I need to get going...", "minIdleTime": 120 }
      ]
    },
    "cave_entrance": {
      "character": "Emraa",
      "chatters": [
        { "text": "This cave looks interesting...", "minIdleTime": 30 },
        { "text": "Is someone watching me?", "minIdleTime": 90 }
      ]
    }
  },
  "global": {
    "mascots": {
      "Yly": [
        { "text": "Hey! Are you still there?", "minIdleTime": 120 },
        { "text": "Just checking in!", "minIdleTime": 180 }
      ],
      "Lyl": [
        { "text": "Psst... need a hint?", "minIdleTime": 150 },
        { "text": "You can always come back later...", "minIdleTime": 240 }
      ]
    }
  }
}
```

**Implementation:**
```javascript
// idleChatter.js
class IdleChatterSystem {
  constructor() {
    this.activeContext = null;
    this.lastActivity = Date.now();
    this.idleChatterConfig = null;
    this.triggeredChatters = new Set();
    
    this.init();
  }
  
  async init() {
    // Load configuration
    this.idleChatterConfig = await fetch('/assets/data/idleChatter.json')
      .then(response => response.json());
    
    // Setup event listeners
    this.setupActivityListeners();
    
    // Start idle checking
    setInterval(() => this.checkIdleState(), 5000);
  }
  
  setContext(contextKey) {
    console.log(`Idle chatter context set to: ${contextKey}`);
    this.activeContext = contextKey;
    this.triggeredChatters.clear();
  }
  
  checkIdleState() {
    if (!this.activeContext) return;
    
    const idleSeconds = (Date.now() - this.lastActivity) / 1000;
    const contextConfig = this.idleChatterConfig.contexts[this.activeContext];
    
    if (!contextConfig) return;
    
    // Check for character chatters
    if (contextConfig.chatters) {
      for (const chatter of contextConfig.chatters) {
        if (idleSeconds >= chatter.minIdleTime && !this.triggeredChatters.has(chatter.text)) {
          this.displayChatter(contextConfig.character, chatter.text);
          this.triggeredChatters.add(chatter.text);
        }
      }
    }
    
    // Check for mascot appearances
    if (idleSeconds >= 120) {  // Only check mascots after 2 minutes idle
      this.checkForMascotAppearance(idleSeconds);
    }
  }
  
  displayChatter(character, text) {
    console.log(`[${character} Idle Chatter]: ${text}`);
    // Add to appropriate textbox based on character
    const textboxId = character === "Eene" ? "LTT" : "RTT";
    updateTextbox(textboxId, text, character);
  }
  
  checkForMascotAppearance(idleSeconds) {
    const mascots = this.idleChatterConfig.global.mascots;
    
    for (const [mascot, chatters] of Object.entries(mascots)) {
      for (const chatter of chatters) {
        if (idleSeconds >= chatter.minIdleTime && !this.triggeredChatters.has(`${mascot}:${chatter.text}`)) {
          this.displayMascot(mascot, chatter.text);
          this.triggeredChatters.add(`${mascot}:${chatter.text}`);
        }
      }
    }
  }
  
  displayMascot(mascot, text) {
    console.log(`[Mascot ${mascot}]: ${text}`);
    // Code to display mascot and their text
    // This might involve showing a special textbox or animation
  }
  
  setupActivityListeners() {
    const resetActivity = () => {
      this.lastActivity = Date.now();
    };
    
    ['scroll', 'click', 'keydown', 'mousemove', 'touchstart'].forEach(event => {
      window.addEventListener(event, resetActivity);
    });
  }
}

// Initialize the system
const idleChatter = new IdleChatterSystem();

// Example of setting context when entering a "soft beat area"
function enterSoftBeatArea(areaName) {
  idleChatter.setContext(areaName);
}
```

**Pros:**
- Clean separation from main narrative system
- More flexible configuration via JSON
- Better support for context-specific idle content

**Cons:**
- Requires maintaining a separate configuration system
- May be more complex to debug than an extension of the existing system

### Approach 3: Hybrid Script and Config System

Combine script markers with a configuration system for maximum flexibility.

In script:
```javascript
// In page script
y=100, **soft_beat forest_idle** // Marks a soft beat area with an idle context ID
y=150, **end_soft_beat** // Marks the end of the soft beat area
```

Configuration:
```javascript
// idleConfig.js
const IDLE_CHATTERS = {
  "forest_idle": {
    character: "Eene",
    textbox: "LTT",
    lines: [
      { text: "It sure is pretty here...", time: 30 },
      { text: "I need to buy toiletpaper...", time: 60 },
      { text: "Maybe I need to get going...", time: 120 }
    ]
  }
};

const MASCOT_CHATTERS = {
  "Yly": [
    { text: "Hey! Are you still there?", time: 120 },
    { text: "Just checking in!", time: 180 }
  ],
  "Lyl": [
    { text: "Psst... need a hint?", time: 150 },
    { text: "You can always come back later...", time: 240 }
  ]
};
```

**Implementation:**
```javascript
// idleManager.js
class IdleManager {
  constructor() {
    this.currentSoftBeatArea = null;
    this.lastActivity = Date.now();
    this.triggeredLines = new Set();
    this.idleInterval = null;
    
    this.initListeners();
  }
  
  initListeners() {
    // Activity listeners
    ['scroll', 'click', 'keydown', 'mousemove', 'touchstart'].forEach(event => {
      window.addEventListener(event, () => this.resetIdleTimer());
    });
    
    // Listen for soft beat area changes from scroll triggers
    document.addEventListener('soft_beat_entered', (e) => {
      this.enterSoftBeatArea(e.detail.id);
    });
    
    document.addEventListener('soft_beat_exited', () => {
      this.exitSoftBeatArea();
    });
  }
  
  enterSoftBeatArea(areaId) {
    console.log(`Entered soft beat area: ${areaId}`);
    this.currentSoftBeatArea = areaId;
    this.triggeredLines.clear();
    this.startIdleChecking();
  }
  
  exitSoftBeatArea() {
    console.log("Exited soft beat area");
    this.currentSoftBeatArea = null;
    this.stopIdleChecking();
  }
  
  startIdleChecking() {
    this.resetIdleTimer();
    this.idleInterval = setInterval(() => this.checkIdleState(), 5000);
  }
  
  stopIdleChecking() {
    clearInterval(this.idleInterval);
    this.idleInterval = null;
  }
  
  resetIdleTimer() {
    this.lastActivity = Date.now();
  }
  
  checkIdleState() {
    if (!this.currentSoftBeatArea) return;
    
    const idleConfig = IDLE_CHATTERS[this.currentSoftBeatArea];
    if (!idleConfig) return;
    
    const idleTime = (Date.now() - this.lastActivity) / 1000;
    
    // Check for character chatters
    for (const line of idleConfig.lines) {
      const lineId = `${this.currentSoftBeatArea}-${line.text}`;
      
      if (idleTime >= line.time && !this.triggeredLines.has(lineId)) {
        this.displayChatter(idleConfig.character, idleConfig.textbox, line.text);
        this.triggeredLines.add(lineId);
      }
    }
    
    // Check for mascot chatters after 2 minutes
    if (idleTime >= 120) {
      this.checkForMascots(idleTime);
    }
  }
  
  displayChatter(character, textbox, text) {
    console.log(`[Idle Chatter] ${character}: ${text}`);
    // Update the appropriate textbox
    updateTextbox(textbox, text, character);
  }
  
  checkForMascots(idleTime) {
    for (const [mascot, lines] of Object.entries(MASCOT_CHATTERS)) {
      for (const line of lines) {
        const lineId = `mascot-${mascot}-${line.text}`;
        
        if (idleTime >= line.time && !this.triggeredLines.has(lineId)) {
          this.displayMascot(mascot, line.text);
          this.triggeredLines.add(lineId);
        }
      }
    }
  }
  
  displayMascot(mascot, text) {
    console.log(`[Mascot] ${mascot}: ${text}`);
    // Code to display mascot and their message
  }
}

// In scrollTrigger.js, add support for soft beat areas
function parseSoftBeatMarker(line) {
  const match = line.match(/y=(\d+),\s*\*\*soft_beat\s+(\w+)\*\*/);
  if (match) {
    return {
      y: parseInt(match[1]),
      id: match[2],
      type: 'soft_beat_start'
    };
  }
  
  const endMatch = line.match(/y=(\d+),\s*\*\*end_soft_beat\*\*/);
  if (endMatch) {
    return {
      y: parseInt(endMatch[1]),
      type: 'soft_beat_end'
    };
  }
  
  return null;
}

// Add this to the scroll trigger handler
function handleScrollTriggers(scrollY) {
  // ...existing code...
  
  // Check for soft beat areas
  scrollTriggers.forEach(trigger => {
    if (trigger.type === 'soft_beat_start' && scrollY >= trigger.y && !currentSoftBeatArea) {
      currentSoftBeatArea = trigger.id;
      document.dispatchEvent(new CustomEvent('soft_beat_entered', { 
        detail: { id: trigger.id }
      }));
    }
    else if (trigger.type === 'soft_beat_end' && scrollY >= trigger.y && currentSoftBeatArea) {
      currentSoftBeatArea = null;
      document.dispatchEvent(new CustomEvent('soft_beat_exited'));
    }
  });
}
```

**Pros:**
- Combines the best of both approaches
- Clear script markers for soft beat areas
- Centralized configuration for idle content
- Doesn't overload the main script format

**Cons:**
- Requires changes to both scrollTrigger and a new idle system
- More components to maintain

## Recommended Approach

### Approach 3: Hybrid Script and Config System

I recommend the hybrid approach for the following reasons:

1. **Clear Script Markers**: Using `y=100, **soft_beat forest_idle**` and `y=150, **end_soft_beat**` in the script provides a clear visual indication of where idle chatter can happen, making it easier for writers to understand the narrative flow.

2. **Separated Content Management**: Keeping the actual idle chatter content in a separate configuration makes it easier to manage, update, and localize without modifying the main script.

3. **Flexible Integration**: This approach works well with your existing scroll trigger system while keeping the idle content management separate, making it easier to debug and extend.

4. **Context Awareness**: The system can be aware of which soft beat area the user is in, allowing for context-specific idle chatter that fits the current scene.

## Implementation Steps

1. **Add Soft Beat Parsing**: Extend scrollTrigger.js to recognize soft beat area markers
2. **Create Idle Manager**: Implement the IdleManager class to track user activity and trigger idle chatters
3. **Define Idle Content Configuration**: Create configuration files or objects for idle chatter content
4. **Integrate with Textbox System**: Connect idle chatter display to your existing textbox system
5. **Add Mascot Support**: Implement special mascot appearances for longer idle periods
6. **Implement Debug Logging**: Add logging to help troubleshoot idle chatter behavior

## Example Integration with Royal Alpha System

This idle chatter system could be integrated with your Royal Alpha coordinate system by:

- Ensuring idle chatters respect the current device class and screen layout
- Positioning mascots appropriately based on the unified coordinate system
- Ensuring idle chatter text sizing and placement adheres to accessibility guidelines
- Adding debug visualization for soft beat areas in the debug overlay

## Further Considerations

1. **User Preferences**: Consider allowing users to disable or adjust the frequency of idle chatter
2. **Persistence**: Track which idle messages have been shown across sessions to avoid repetition
3. **Adaptive Timing**: Adjust idle timing based on user behavior patterns
4. **Context Sensitivity**: Make idle chatter aware of story progress and previous choices
5. **Memory Management**: Ensure the system cleans up event listeners when navigating away from pages

This design provides a flexible framework that can grow with your narrative needs while integrating seamlessly with your existing systems.
