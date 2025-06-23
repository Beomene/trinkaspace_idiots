/**
 * ScrollTrigger - Controls text display in TRINKATEXT based on scroll position
 * 
 * This class monitors the page's scroll position and triggers different messages
 * in the TRINKATEXT HUD element when the user reaches specific y-positions.
 * 
 * Extended with soft beat areas for idle chatter support.
 */
export class ScrollTrigger {
  /**
   * Create a new ScrollTrigger
   * @param {Object} trinkaspaceEngine - The main TrinkaspaceEngine instance
   */
  constructor(trinkaspaceEngine) {
    this.engine = trinkaspaceEngine;
    this.triggers = []; // Array of scroll trigger points
    this.softBeatTriggers = []; // Array of soft beat area triggers
    this.currentTriggerIndex = -1;
    this.currentSoftBeatArea = null; // Current soft beat area ID
    this.scrollDebounceTimeout = null;
    this.scrollThreshold = 50; // Minimum scroll amount to check triggers (px)
    this.lastScrollPosition = 0;
    
    this.init();
  }
  
  /**
   * Initialize the ScrollTrigger
   */
  init() {
    // Set up scroll event listener with debounce
    window.addEventListener('scroll', () => {
      if (this.scrollDebounceTimeout) {
        clearTimeout(this.scrollDebounceTimeout);
      }
      
      this.scrollDebounceTimeout = setTimeout(() => {
        this.checkScrollTriggers();
      }, 50);
    });
    
    console.log('[ScrollTrigger] Initialized');
  }
  
  /**
   * Add a new scroll trigger
   * @param {Object} trigger - Trigger configuration
   * @param {number} trigger.y - Y-position to trigger at (in pixels)
   * @param {string} trigger.message - Message to display in TRINKATEXT
   * @param {string} trigger.id - Optional identifier for this trigger
   * @param {boolean} trigger.once - If true, trigger only fires once (default: false)
   * @param {function} trigger.onTrigger - Optional callback when triggered
   * @param {number} trigger.delay - Delay in ms before showing message (default: 0)
   */
  addTrigger(trigger) {
    if (!trigger.y || !trigger.message) {
      console.error('[ScrollTrigger] Invalid trigger - must provide y and message');
      return;
    }
    
    // Default values
    trigger.once = trigger.once || false;
    trigger.triggered = false;
    trigger.delay = trigger.delay || 0;
    
    // Add to sorted array (sorted by y position)
    this.triggers.push(trigger);
    this.triggers.sort((a, b) => a.y - b.y);
    
    console.log(`[ScrollTrigger] Added trigger at y=${trigger.y}px`);
    
    // Check if we should trigger immediately (if already scrolled past)
    this.checkScrollTriggers();
  }
  
  /**
   * Add multiple triggers at once
   * @param {Array} triggers - Array of trigger objects
   */
  addTriggers(triggers) {
    triggers.forEach(trigger => this.addTrigger(trigger));
  }
  
  /**
   * Add support for soft beat areas
   * @param {Array} softBeatTriggers - Array of soft beat trigger objects
   */
  addSoftBeatTriggers(softBeatTriggers) {
    if (!this.softBeatTriggers) {
      this.softBeatTriggers = [];
    }
    
    softBeatTriggers.forEach(trigger => {
      this.softBeatTriggers.push(trigger);
    });
    
    // Sort by y position
    this.softBeatTriggers.sort((a, b) => a.y - b.y);
    
    console.log(`[ScrollTrigger] Added ${softBeatTriggers.length} soft beat area triggers`);
    
    // Check if we should trigger any immediately (if already scrolled past)
    this.checkScrollTriggers();
  }

  /**
   * Parse soft beat markers from script content
   * @param {string} scriptContent - The script content to parse
   * @returns {Array} Array of soft beat trigger objects
   */
  parseSoftBeatMarkers(scriptContent) {
    const softBeatTriggers = [];
    const lines = scriptContent.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Parse start of soft beat area: y=100, **soft_beat forest_idle**
      const startMatch = line.match(/y=(\d+),\s*\*\*soft_beat\s+(\w+)\*\*/i);
      if (startMatch) {
        const yPos = parseInt(startMatch[1], 10);
        const areaId = startMatch[2];
        
        // Get the actual Y position using the Royal Alpha system's CUC for scaling
        const scaledY = this.engine && this.engine.scaleCoordinate ? 
          this.engine.scaleCoordinate(yPos) : yPos;
        
        softBeatTriggers.push({
          y: scaledY,
          id: areaId,
          type: 'soft_beat_start'
        });
        
        console.log(`[ScrollTrigger] Found soft beat area start at Y=${scaledY}px (alpha=${yPos}) with ID: ${areaId}`);
      }
      
      // Parse end of soft beat area: y=150, **end_soft_beat**
      const endMatch = line.match(/y=(\d+),\s*\*\*end_soft_beat\*\*/i);
      if (endMatch) {
        const yPos = parseInt(endMatch[1], 10);
        
        // Get the actual Y position using the Royal Alpha system's CUC for scaling
        const scaledY = this.engine && this.engine.scaleCoordinate ? 
          this.engine.scaleCoordinate(yPos) : yPos;
        
        softBeatTriggers.push({
          y: scaledY,
          type: 'soft_beat_end'
        });
        
        console.log(`[ScrollTrigger] Found soft beat area end at Y=${scaledY}px (alpha=${yPos})`);
      }
    }
    
    return softBeatTriggers;
  }
  
  /**
   * Check which trigger should be active based on current scroll position
   */
  checkScrollTriggers() {
    const scrollY = window.scrollY;
    
    // Debug logging - show context information
    console.debug(`[ScrollTrigger] Checking triggers at Y=${scrollY}px (${this.triggers.length} total triggers, ${this.softBeatTriggers?.length || 0} soft beat triggers)`);
    
    // For very small changes, still check at a throttled rate
    const forceCheck = Math.random() < 0.1; // 10% chance of forcing a check
    
    // Skip if scroll change is too small (performance optimization) and not forcing a check
    if (!forceCheck && Math.abs(scrollY - this.lastScrollPosition) < this.scrollThreshold) {
      return;
    }
    
    this.lastScrollPosition = scrollY;
      // Find the appropriate trigger
    let activeIndex = -1;
    
    // Also check soft beat areas if they exist
    this.checkSoftBeatAreas(scrollY);
    
    // Find the last trigger that we've scrolled past
    for (let i = 0; i < this.triggers.length; i++) {
      const trigger = this.triggers[i];
      
      // Skip triggers that are set to fire once and have already triggered
      if (trigger.once && trigger.triggered) {
        continue;
      }
      
      if (scrollY >= trigger.y) {
        activeIndex = i;
        console.log(`[ScrollTrigger] At Y=${scrollY}px, passed trigger at Y=${trigger.y}px - this will activate text`);
        
        // If this trigger refers to a moment, handle that
        if (trigger.moment) {
          console.log(`[ScrollTrigger] This trigger activates moment ${trigger.moment}`);
          // Moments are handled through the activateTrigger method
        }
      } else {
        // Found first trigger we haven't scrolled to yet, break
        console.debug(`[ScrollTrigger] At Y=${scrollY}px, not yet passed trigger at Y=${trigger.y}px`);
        break;
      }
    }
    
    // If we have a new active trigger, activate it
    if (activeIndex !== -1 && activeIndex !== this.currentTriggerIndex) {
      const trigger = this.triggers[activeIndex];
      
      // Mark as current active trigger
      this.currentTriggerIndex = activeIndex;
      
      // If there's a delay, wait before showing the message
      if (trigger.delay > 0) {
        setTimeout(() => {
          this.activateTrigger(trigger);
        }, trigger.delay);
      } else {
        this.activateTrigger(trigger);
      }
    }
  }
    /**
   * Activate a specific trigger
   * @param {Object} trigger - The trigger to activate
   */
  activateTrigger(trigger) {
    // Log activation clearly
    console.log(`[ScrollTrigger] Activated trigger at Y=${trigger.y}px: "${trigger.message.substring(0, 30)}..."`);
    
    // Update TRINKATEXT content
    if (this.engine && this.engine.setTrinkatextMessage) {
      this.engine.setTrinkatextMessage(trigger.message);
    }
    
    // Call onTrigger callback if provided
    if (typeof trigger.onTrigger === 'function') {
      trigger.onTrigger(trigger);
    }
    
    // Mark as triggered if it's a once-only trigger
    if (trigger.once) {
      trigger.triggered = true;
    }
  }
  
  /**
   * Reset all triggers (clear triggered flag)
   */
  resetTriggers() {
    this.triggers.forEach(trigger => {
      trigger.triggered = false;
    });
    
    this.currentTriggerIndex = -1;
    this.checkScrollTriggers();
  }
  
  /**
   * Remove a trigger by ID
   * @param {string} id - The ID of the trigger to remove
   */
  removeTrigger(id) {
    const initialCount = this.triggers.length;
    this.triggers = this.triggers.filter(trigger => trigger.id !== id);
    
    if (this.triggers.length < initialCount) {
      console.log(`[ScrollTrigger] Removed trigger with ID: ${id}`);
      
      // Reset current index and check triggers again
      this.currentTriggerIndex = -1;
      this.checkScrollTriggers();
    }
  }
  
  /**
   * Remove all triggers
   */
  clearTriggers() {
    this.triggers = [];
    this.currentTriggerIndex = -1;
    console.log('[ScrollTrigger] Cleared all triggers');
  }
  
  /**
   * Check if the user has entered or exited soft beat areas
   * @param {number} scrollY - Current scroll position
   */
  checkSoftBeatAreas(scrollY = window.scrollY) {
    if (!this.softBeatTriggers || this.softBeatTriggers.length === 0) {
      return;
    }
    
    let newSoftBeatArea = null;
    let exitedArea = false;
    
    // First track if we're in a soft beat area
    for (let i = 0; i < this.softBeatTriggers.length; i++) {
      const trigger = this.softBeatTriggers[i];
      
      if (trigger.type === 'soft_beat_start' && scrollY >= trigger.y) {
        // We've passed a soft beat area start
        newSoftBeatArea = trigger.id;
      } else if (trigger.type === 'soft_beat_end' && scrollY >= trigger.y && this.currentSoftBeatArea) {
        // We've passed a soft beat area end
        exitedArea = true;
      }
    }
    
    // Check if we need to enter a new soft beat area
    if (newSoftBeatArea && newSoftBeatArea !== this.currentSoftBeatArea && !exitedArea) {
      const oldArea = this.currentSoftBeatArea;
      this.currentSoftBeatArea = newSoftBeatArea;
      
      console.log(`[ScrollTrigger] Entered soft beat area: ${newSoftBeatArea}`);
      
      // Dispatch event for idle chatter system
      document.dispatchEvent(new CustomEvent('soft_beat_entered', { 
        detail: { id: newSoftBeatArea }
      }));
    }
    
    // Check if we need to exit the current soft beat area
    if (exitedArea && this.currentSoftBeatArea) {
      console.log(`[ScrollTrigger] Exited soft beat area: ${this.currentSoftBeatArea}`);
      
      // Dispatch event for idle chatter system
      document.dispatchEvent(new CustomEvent('soft_beat_exited'));
      
      this.currentSoftBeatArea = null;
    }
  }
  
  /**
   * Load soft beat areas from a script file
   * @param {string} path - Path to the script file
   * @returns {Promise} Promise that resolves when soft beat areas are loaded
   */
  async loadSoftBeatAreas(path) {
    try {
      console.log(`[ScrollTrigger] Loading soft beat areas from ${path}`);
      const response = await fetch(path);
      
      if (!response.ok) {
        throw new Error(`Failed to load soft beat areas from ${path}: ${response.status}`);
      }
      
      const content = await response.text();
      const softBeatTriggers = this.parseSoftBeatMarkers(content);
      
      if (softBeatTriggers.length > 0) {
        this.addSoftBeatTriggers(softBeatTriggers);
      }
      
      console.log(`[ScrollTrigger] Loaded ${softBeatTriggers.length} soft beat areas from script`);
      return true;
    } catch (error) {
      console.error('[ScrollTrigger] Error loading soft beat areas:', error);
      return false;
    }
  }
}
