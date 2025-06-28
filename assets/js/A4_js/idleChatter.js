/**
 * idleChatter.js
 * Implements the Idle Chatter system based on Approach 3 (Hybrid Script and Config System)
 * from the IDLE_CHATTER_DESIGN.md document.
 * 
 * This system displays character dialogue and mascot interactions when the user
 * has been idle for a specific period of time in designated "soft beat areas"
 */

class IdleChatterManager {
  constructor() {
    // Configuration settings
    this.config = {
      checkInterval: 5000, // Check for idle state every 5 seconds
      debugMode: true      // Log debug information
    };
    
    // State tracking
    this.currentSoftBeatArea = null;  // Current soft beat area ID
    this.lastActivity = Date.now();   // Timestamp of last user activity
    this.triggeredLines = new Set();  // Set of already triggered chatter lines
    this.idleInterval = null;         // Interval timer for idle checking
    this.initialized = false;         // Flag to prevent double initialization
    this.idleConfig = null;           // Will hold loaded configuration
    
    // Initialize once DOM is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }
  
  /**
   * Initialize the idle chatter system
   */
  init() {
    if (this.initialized) return;
    this.initialized = true;
    
    this.loadConfiguration()
      .then(() => {
        this.initEventListeners();
        this.debugLog('Idle Chatter system initialized');
      })
      .catch(error => {
        console.error('Failed to initialize Idle Chatter system:', error);
      });
  }
  
  /**
   * Load idle chatter configuration
   */
  async loadConfiguration() {
    try {
      // Load the idle chatter config (mock data for now)
      // In production, this would likely be a fetch call
      this.idleConfig = IDLE_CHATTER_CONFIG; 
      this.debugLog('Idle chatter configuration loaded');
    } catch (error) {
      console.error('Failed to load idle chatter configuration:', error);
      throw error;
    }
  }
  
  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Track user activity events
    ['scroll', 'click', 'keydown', 'mousemove', 'touchstart'].forEach(eventType => {
      window.addEventListener(eventType, () => this.resetIdleTimer());
    });
    
    // Listen for soft beat area changes from scroll triggers
    document.addEventListener('soft_beat_entered', (event) => {
      this.enterSoftBeatArea(event.detail.id);
    });
    
    document.addEventListener('soft_beat_exited', () => {
      this.exitSoftBeatArea();
    });
    
    this.debugLog('Event listeners initialized');
  }
  
  /**
   * Called when entering a soft beat area
   * @param {string} areaId - The ID of the soft beat area
   */
  enterSoftBeatArea(areaId) {
    this.debugLog(`Entered soft beat area: ${areaId}`);
    this.currentSoftBeatArea = areaId;
    this.triggeredLines.clear();
    this.startIdleChecking();
  }
  
  /**
   * Called when exiting a soft beat area
   */
  exitSoftBeatArea() {
    this.debugLog('Exited soft beat area');
    this.currentSoftBeatArea = null;
    this.stopIdleChecking();
  }
  
  /**
   * Start checking for idle state
   */
  startIdleChecking() {
    this.resetIdleTimer();
    if (this.idleInterval) {
      clearInterval(this.idleInterval);
    }
    this.idleInterval = setInterval(() => this.checkIdleState(), this.config.checkInterval);
    this.debugLog('Started idle checking');
  }
  
  /**
   * Stop checking for idle state
   */
  stopIdleChecking() {
    if (this.idleInterval) {
      clearInterval(this.idleInterval);
      this.idleInterval = null;
      this.debugLog('Stopped idle checking');
    }
  }
  
  /**
   * Reset the idle timer when user activity is detected
   */
  resetIdleTimer() {
    this.lastActivity = Date.now();
  }
  
  /**
   * Check if the user is idle and trigger appropriate chatter
   */
  checkIdleState() {
    if (!this.currentSoftBeatArea || !this.idleConfig) return;
    
    const idleConfig = this.idleConfig.areas[this.currentSoftBeatArea];
    if (!idleConfig) {
      this.debugLog(`No idle configuration found for area: ${this.currentSoftBeatArea}`);
      return;
    }
    
    const idleTimeSeconds = (Date.now() - this.lastActivity) / 1000;
    this.debugLog(`Current idle time: ${idleTimeSeconds.toFixed(1)}s in area: ${this.currentSoftBeatArea}`);
    
    // Check for character chatter lines
    this.checkCharacterIdleChatter(idleConfig, idleTimeSeconds);
    
    // Check for mascot appearances after sufficient idle time
    if (idleTimeSeconds >= 120) { // Only check mascots after 2 minutes of idle time
      this.checkMascotAppearances(idleTimeSeconds);
    }
  }
  
  /**
   * Check for character idle chatter based on idle time
   * @param {Object} idleConfig - Configuration for the current soft beat area
   * @param {number} idleTimeSeconds - Time in seconds user has been idle
   */
  checkCharacterIdleChatter(idleConfig, idleTimeSeconds) {
    if (!idleConfig.lines) return;
    
    for (const line of idleConfig.lines) {
      const lineId = `${this.currentSoftBeatArea}-${line.text}`;
      
      if (idleTimeSeconds >= line.time && !this.triggeredLines.has(lineId)) {
        this.displayChatter(idleConfig.character, idleConfig.textbox, line.text);
        this.triggeredLines.add(lineId);
      }
    }
  }
  
  /**
   * Check for mascot appearances based on idle time
   * @param {number} idleTimeSeconds - Time in seconds user has been idle
   */
  checkMascotAppearances(idleTimeSeconds) {
    if (!this.idleConfig.mascots) return;
    
    for (const [mascot, lines] of Object.entries(this.idleConfig.mascots)) {
      for (const line of lines) {
        const lineId = `mascot-${mascot}-${line.text}`;
        
        if (idleTimeSeconds >= line.time && !this.triggeredLines.has(lineId)) {
          this.displayMascot(mascot, line.text);
          this.triggeredLines.add(lineId);
          
          // Break after displaying one mascot line to avoid multiple mascot lines
          // appearing simultaneously
          return;
        }
      }
    }
  }
  
  /**
   * Display character chatter in the appropriate textbox
   * @param {string} character - Character name
   * @param {string} textbox - Target textbox ID
   * @param {string} text - Text content to display
   */
  displayChatter(character, textbox, text) {
    this.debugLog(`[Idle Chatter] ${character}: ${text}`);
    
    // Use the existing textbox system to display the message
    if (typeof updateTextbox === 'function') {
      updateTextbox(textbox, text, character);
    } else if (typeof window.textboxManager?.showTextInTextbox === 'function') {
      // Alternative textbox interface
      window.textboxManager.showTextInTextbox(text, character);
    } else {
      console.warn('No textbox system found to display idle chatter');
    }
  }
  
  /**
   * Display a mascot with their message
   * @param {string} mascot - Mascot name
   * @param {string} text - Text content to display
   */
  displayMascot(mascot, text) {
    this.debugLog(`[Mascot] ${mascot}: ${text}`);
    
    // Trigger mascot appearance with text
    if (typeof showMascot === 'function') {
      showMascot(mascot, text);
    } else {
      // Fallback to textbox if no mascot system is available
      const textboxId = mascot === "Yly" ? "MTB" : "MTT"; // Mascot Textbox IDs
      this.displayChatter(mascot, textboxId, text);
    }
  }
  
  /**
   * Log debug messages if debug mode is enabled
   * @param {string} message - Debug message
   */
  debugLog(message) {
    if (this.config.debugMode) {
      console.log(`[IdleChatter] ${message}`);
    }
  }
}

/**
 * Configuration for idle chatter
 * This would typically be loaded from a separate file
 */
const IDLE_CHATTER_CONFIG = {
  // Soft beat areas where idle chatter can trigger
  areas: {
    "forest_idle": {
      character: "Eene",
      textbox: "LTT", // Left Text Target
      lines: [
        { text: "It sure is pretty here...", time: 30 },
        { text: "I need to buy toiletpaper...", time: 60 },
        { text: "Maybe I need to get going...", time: 120 }
      ]
    },
    "cave_entrance": {
      character: "Emraa",
      textbox: "RTT", // Right Text Target
      lines: [
        { text: "This cave looks interesting...", time: 30 },
        { text: "Is someone watching me?", time: 90 },
        { text: "I feel like we should explore further...", time: 150 }
      ]
    }
  },
  
  // Mascots that can appear during extended idle periods
  mascots: {
    "Yly": [
      { text: "Hey! Are you still there?", time: 120 },
      { text: "Just checking in!", time: 180 },
      { text: "You can click to continue, you know...", time: 240 }
    ],
    "Lyl": [
      { text: "Psst... need a hint?", time: 150 },
      { text: "You can always come back later...", time: 210 },
      { text: "The story is waiting for you...", time: 270 }
    ]
  }
};

/**
 * Extensions to the scroll trigger system to support soft beat areas
 * This would be added to scrollTrigger.js
 */
function parseSoftBeatMarker(line) {
  // Parse start of soft beat area: y=100, **soft_beat forest_idle**
  const match = line.match(/y=(\d+),\s*\*\*soft_beat\s+(\w+)\*\*/);
  if (match) {
    return {
      y: parseInt(match[1]),
      id: match[2],
      type: 'soft_beat_start'
    };
  }
  
  // Parse end of soft beat area: y=150, **end_soft_beat**
  const endMatch = line.match(/y=(\d+),\s*\*\*end_soft_beat\*\*/);
  if (endMatch) {
    return {
      y: parseInt(endMatch[1]),
      type: 'soft_beat_end'
    };
  }
  
  return null;
}

/**
 * Update scrollTrigger.js to handle soft beat areas
 * This is a reference implementation to be integrated with existing scrollTrigger.js
 */
function handleSoftBeatAreas(scrollY, scrollTriggers) {
  let currentSoftBeatArea = null;
  
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

// Initialize the idle chatter manager
window.idleChatterManager = new IdleChatterManager();
