# Beat System Design Document

This document outlines the design and implementation plan for the "Beat System" - a specialized type of narrative pause in Trinkaspace that enhances storytelling through different types of intentional pauses.

## Core Concept

Beats are intentional pauses or spaces between moments that serve narrative functions. Unlike moments that contain content, beats contain absence - which itself is meaningful. They provide rhythm, tension, reflection, or emotional space within the narrative.

## Types of Beats

### Hard Beat

**Purpose**: Create tension, focus, and heightened emotional impact
**Characteristics**:
- User scrolling is temporarily disabled
- Creates a feeling of being "trapped" in the narrative moment
- Often accompanied by visual effects (darkening, color shifts)
- May synchronize with character anxiety (UTT reactions)

**Technical Implementation**:
```javascript
{
  type: "beat",
  beatType: "hard",
  duration: 3000, // milliseconds
  scrollLock: true,
  effects: {
    viewport: {
      darken: 0.3,
      desaturate: 0.4
    },
    uttEmotionIntensify: true
  }
}
```

### Normal Beat

**Purpose**: Natural rhythm in conversation, thoughtful pauses
**Characteristics**:
- Standard pause in narrative flow
- User can scroll but visual cues suggest waiting
- Represents thinking time, transitions, or brief emphasis

**Technical Implementation**:
```javascript
{
  type: "beat",
  beatType: "normal",
  duration: 1500, // milliseconds
  scrollLock: false,
  effects: {
    uttPulse: true
  }
}
```

### Soft Beat

**Purpose**: Extended contemplation, appreciation of beauty, rest
**Characteristics**:
- User can freely scroll past
- Often in visually appealing scenes
- May include ambient effects or subtle animation
- Optional "eternity mode" for extended dwelling

**Technical Implementation**:
```javascript
{
  type: "beat",
  beatType: "soft",
  duration: 4000, // base duration
  scrollLock: false,
  eternityMode: true,
  effects: {
    ambientSound: "forest_birds",
    viewportBreathing: true,
    dioramaPan: {
      speed: "very-slow",
      range: 50 // pixels
    }
  }
}
```

## Script Syntax

Beats can be defined in script.md using the following syntax:

```
BEAT_025: hard 3000
```
Where:
- `025` is the moment number
- `hard` is the beat type
- `3000` is the duration in milliseconds

For beats with additional parameters:

```
BEAT_030: soft 5000 [ambient=forest] [breathing=true] [eternity=true]
```

## Implementation Plan

### 1. Extend TextScript Parser

Update the parser in TextScript.js to recognize the beat syntax:

```javascript
// Inside parseScript method
if (line.startsWith('BEAT_')) {
  const beatMatch = line.match(/^BEAT_(\d+):\s+(\w+)\s+(\d+)(?:\s+(.*))?$/);
  if (beatMatch) {
    const moment = parseInt(beatMatch[1], 10);
    const beatType = beatMatch[2]; // hard, normal, soft
    const duration = parseInt(beatMatch[3], 10);
    
    // Parse additional parameters if present
    const params = {};
    if (beatMatch[4]) {
      const paramMatches = [...beatMatch[4].matchAll(/\[(\w+)=([^\]]+)\]/g)];
      paramMatches.forEach(match => {
        params[match[1]] = match[2];
      });
    }
    
    this.scriptQueue.push({
      type: 'beat',
      moment: moment,
      beatType: beatType,
      duration: duration,
      params: params
    });
    continue;
  }
}
```

### 2. Add Beat Processing in TextScript

Extend the processElement method to handle beats:

```javascript
case 'beat':
  console.log(`[TextScript] Beat at moment ${element.moment}: ${element.beatType} for ${element.duration}ms`);
  if (this.engine && this.engine.processBeat) {
    this.engine.processBeat(element.beatType, element.duration, element.params);
  }
  break;
```

### 3. Implement Engine Beat Processor

Add the processBeat method to TrinkaspaceEngine.js:

```javascript
processBeat(beatType, duration, params = {}) {
  console.log(`[TrinkaspaceEngine] Processing ${beatType} beat for ${duration}ms`);
  
  // Create a beat overlay if needed
  let beatOverlay = document.getElementById('beat-overlay');
  if (!beatOverlay) {
    beatOverlay = document.createElement('div');
    beatOverlay.id = 'beat-overlay';
    beatOverlay.className = 'beat-overlay';
    document.body.appendChild(beatOverlay);
  }
  
  // Apply beat-specific effects
  switch (beatType) {
    case 'hard':
      this.applyHardBeatEffects(beatOverlay, duration, params);
      break;
    case 'normal':
      this.applyNormalBeatEffects(beatOverlay, duration, params);
      break;
    case 'soft':
      this.applySoftBeatEffects(beatOverlay, duration, params);
      break;
  }
}
```

### 4. Implement Beat-Specific Effects

For each beat type, create a specialized method:

```javascript
applyHardBeatEffects(overlay, duration, params) {
  // Disable scrolling
  document.body.style.overflow = 'hidden';
  
  // Apply visual effects
  overlay.classList.add('hard-beat');
  
  // Intensify UTT emotions if specified
  if (params.uttEmotionIntensify) {
    const uttElement = document.getElementById('arena3-hud-utrinkatext');
    if (uttElement) {
      const crystals = uttElement.querySelectorAll('.utt-crystal');
      crystals.forEach(crystal => {
        crystal.classList.add('intensify');
      });
    }
  }
  
  // After duration, remove effects
  setTimeout(() => {
    document.body.style.overflow = '';
    overlay.classList.remove('hard-beat');
    
    // Remove UTT intensity
    if (params.uttEmotionIntensify) {
      const uttElement = document.getElementById('arena3-hud-utrinkatext');
      if (uttElement) {
        const crystals = uttElement.querySelectorAll('.utt-crystal');
        crystals.forEach(crystal => {
          crystal.classList.remove('intensify');
        });
      }
    }
  }, duration);
}

applySoftBeatEffects(overlay, duration, params) {
  // Apply subtle visual cue
  overlay.classList.add('soft-beat');
  
  // Start ambient sounds if specified
  if (params.ambient) {
    this.playAmbientSound(params.ambient);
  }
  
  // Apply viewport breathing effect if specified
  if (params.breathing === 'true') {
    this.startViewportBreathing();
  }
  
  // Add eternity mode button if specified
  if (params.eternity === 'true') {
    this.addEternityModeButton();
  }
  
  // After duration, remove effects unless in eternity mode
  const eternityActive = !!document.getElementById('eternity-mode-active');
  if (!eternityActive) {
    setTimeout(() => {
      overlay.classList.remove('soft-beat');
      if (params.ambient) {
        this.stopAmbientSound(params.ambient);
      }
      if (params.breathing === 'true') {
        this.stopViewportBreathing();
      }
    }, duration);
  }
}
```

### 5. Add CSS for Beat Effects

```css
.beat-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
  transition: background 0.5s ease, backdrop-filter 0.5s ease;
}

.beat-overlay.hard-beat {
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: saturate(70%);
  pointer-events: auto; /* Block clicks during hard beat */
}

.beat-overlay.soft-beat {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: brightness(105%);
}

.utt-crystal.intensify {
  transform: scale(1.2);
  filter: brightness(120%);
  animation: pulse 0.8s infinite alternate;
}

.eternity-mode-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1001;
}

.eternity-mode-button:hover {
  background-color: rgba(255, 255, 255, 0.4);
}
```

### 6. Optional Eternity Mode

For soft beats with eternal contemplation:

```javascript
addEternityModeButton() {
  // Remove any existing button
  const existingButton = document.getElementById('eternity-mode-button');
  if (existingButton) {
    existingButton.remove();
  }
  
  // Create new button
  const button = document.createElement('button');
  button.id = 'eternity-mode-button';
  button.className = 'eternity-mode-button';
  button.textContent = 'Stay in this moment';
  document.body.appendChild(button);
  
  // Add toggle functionality
  button.addEventListener('click', () => {
    if (button.classList.contains('active')) {
      // End eternity mode
      button.classList.remove('active');
      button.textContent = 'Stay in this moment';
      document.getElementById('eternity-mode-active')?.remove();
      this.stopViewportBreathing();
    } else {
      // Enter eternity mode
      button.classList.add('active');
      button.textContent = 'Continue journey';
      
      // Create a flag element
      const flag = document.createElement('div');
      flag.id = 'eternity-mode-active';
      flag.style.display = 'none';
      document.body.appendChild(flag);
      
      // Enhance ambient effects
      this.enhanceAmbientEffects();
    }
  });
  
  // Auto-hide after 10 seconds if not used
  setTimeout(() => {
    if (!button.classList.contains('active')) {
      button.style.opacity = '0';
      setTimeout(() => button.remove(), 1000);
    }
  }, 10000);
}
```

### 7. Reader Settings Integration

Implement a reader settings panel that allows customization of beat behavior:

```javascript
initBeatSettings() {
  const settings = localStorage.getItem('trinkaspace-beat-settings');
  this.beatSettings = settings ? JSON.parse(settings) : {
    hardBeatEnabled: true,
    hardBeatDurationScale: 1.0,
    normalBeatDurationScale: 1.0,
    softBeatDurationScale: 1.0
  };
  
  // Apply settings when processing beats
  // For example, adjust duration based on user preferences
}
```

## Accessibility Considerations

1. **Hard Beats**: Provide alternative ways to progress for users who find scroll locking disorienting
2. **Visual Effects**: Ensure all visual effects have sufficient contrast and don't trigger photosensitivity issues
3. **Control**: Make sure users can override or customize beat behavior in settings
4. **Notification**: Provide subtle visual cues for beat types and durations

## Testing Plan

Test the beat system with:

1. Different browsers and devices
2. Various accessibility tools
3. Different user preferences (fast vs. slow readers)
4. Edge cases (very short/long beats)
5. Combinations of beats and other narrative elements

## Future Enhancements

1. **Beat Visualization**: Add subtle visual indicators for different beat types
2. **Beat Analytics**: Track how long readers spend in different beats
3. **Dynamic Beats**: Adjust beat duration based on reading patterns
4. **Beat Shortcuts**: Allow power users to skip beats with keyboard shortcuts
5. **Author Tools**: Create a visual beat editor for script authors
