/**
 * quaternaryArena.js - The Director Arena (A4)
 * 
 * The Quaternary Arena serves as the "Director" of the Trinkaspace orchestra,
 * managing timing, moments, beats, and coordination between all other arenas.
 * 
 * Responsibilities:
 * - Moment and beat management
 * - Scroll trigger coordination
 * - Script parsing and timing
 * - Inter-arena communication
 * - Idle chatter and soft beat areas
 */

export class QuaternaryArena {
  constructor(trinkaspaceEngine) {
    this.engine = trinkaspaceEngine;
    this.moments = new Map(); // moment_id -> moment_config
    this.activeBeats = new Set(); // Currently active beat areas
    this.scriptData = null;
    this.currentScrollPosition = 0;
    this.lastTriggerCheck = 0;
    this.triggerThreshold = 50; // Minimum scroll distance before checking triggers
    
    // State tracking
    this.executedMoments = new Set();
    this.currentSoftBeatArea = null;
    this.idleTimeout = null;
    
    console.log('🎬 [QuaternaryArena] Director Arena initialized');
  }

  /**
   * Initialize the director arena
   */
  async init() {
    try {
      // Load script data for the current page
      await this.loadScriptData();
      
      // Parse moments from script data
      this.parseMoments();
      
      // Set up scroll listener for moment triggers
      this.initScrollListener();
      
      // Initialize idle management
      this.initIdleManagement();
      
      console.log('🎬 [QuaternaryArena] Director Arena ready');
    } catch (error) {
      console.error('🎬 [QuaternaryArena] Failed to initialize:', error);
    }
  }

  /**
   * Load script data from page_script.json
   */
  async loadScriptData() {
    try {
      const response = await fetch('./page_script.json');
      if (!response.ok) {
        console.warn('🎬 [QuaternaryArena] No page_script.json found, using basic timing');
        return;
      }
      
      this.scriptData = await response.json();
      console.log('🎬 [QuaternaryArena] Script data loaded:', this.scriptData);
    } catch (error) {
      console.warn('🎬 [QuaternaryArena] Could not load script data:', error);
    }
  }

  /**
   * Parse moments from script data
   */
  parseMoments() {
    if (!this.scriptData || !this.scriptData.moments) {
      console.warn('🎬 [QuaternaryArena] No moments found in script data');
      return;
    }

    this.scriptData.moments.forEach(moment => {
      this.moments.set(moment.moment, {
        id: moment.moment,
        triggerY: moment.atY,
        delay: moment.delay || 0,
        once: moment.once !== false, // Default to true
        description: moment.description || '',
        executed: false
      });
    });

    console.log(`🎬 [QuaternaryArena] Parsed ${this.moments.size} moments`);
  }

  /**
   * Set up scroll listener with debouncing
   */
  initScrollListener() {
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = setTimeout(() => {
        this.handleScroll();
      }, 16); // ~60fps
    });
  }

  /**
   * Handle scroll events and check for moment triggers
   */
  handleScroll() {
    const scrollY = window.pageYOffset;
    const scrollDelta = Math.abs(scrollY - this.currentScrollPosition);
    
    // Only check triggers if we've scrolled enough
    if (scrollDelta < this.triggerThreshold) {
      return;
    }
    
    this.currentScrollPosition = scrollY;
    this.checkMomentTriggers(scrollY);
    this.checkSoftBeatAreas(scrollY);
  }

  /**
   * Check if any moments should be triggered at current scroll position
   */
  checkMomentTriggers(scrollY) {
    this.moments.forEach((moment, momentId) => {
      // Skip if already executed and it's a once-only moment
      if (moment.executed && moment.once) {
        return;
      }
      
      // Check if we've reached the trigger point
      if (scrollY >= moment.triggerY) {
        this.triggerMoment(momentId, moment);
      }
    });
  }

  /**
   * Trigger a specific moment
   */
  async triggerMoment(momentId, moment) {
    if (moment.executed && moment.once) {
      return;
    }

    console.log(`🎬 [QuaternaryArena] Triggering moment ${momentId}: ${moment.description}`);
    
    // Mark as executed
    moment.executed = true;
    this.executedMoments.add(momentId);
    
    // Apply delay if specified
    if (moment.delay > 0) {
      await this.delay(moment.delay);
    }
    
    // Notify other arenas about the moment
    this.broadcastMoment(momentId, moment);
  }

  /**
   * Broadcast moment to other arenas
   */
  broadcastMoment(momentId, moment) {
    const momentEvent = new CustomEvent('trinkaspace-moment', {
      detail: {
        momentId,
        moment,
        timestamp: Date.now()
      }
    });
    
    window.dispatchEvent(momentEvent);
    console.log(`🎬 [QuaternaryArena] Broadcasted moment ${momentId}`);
  }

  /**
   * Check for soft beat areas (idle chatter zones)
   */
  checkSoftBeatAreas(scrollY) {
    // TODO: Implement soft beat area detection
    // This will manage idle chatter based on scroll position
  }

  /**
   * Initialize idle management system
   */
  initIdleManagement() {
    let idleTimer;
    const idleThreshold = 5000; // 5 seconds
    
    const resetIdleTimer = () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
      
      idleTimer = setTimeout(() => {
        this.handleIdleState();
      }, idleThreshold);
    };
    
    // Reset idle timer on user activity
    ['scroll', 'mousemove', 'keydown', 'click'].forEach(event => {
      window.addEventListener(event, resetIdleTimer);
    });
    
    // Start the timer
    resetIdleTimer();
  }

  /**
   * Handle idle state - trigger idle chatter if appropriate
   */
  handleIdleState() {
    console.log('🎬 [QuaternaryArena] User idle, checking for idle content');
    
    // Broadcast idle event
    const idleEvent = new CustomEvent('trinkaspace-idle', {
      detail: {
        scrollPosition: this.currentScrollPosition,
        timestamp: Date.now()
      }
    });
    
    window.dispatchEvent(idleEvent);
  }

  /**
   * Utility function for delays
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Reset moment execution state (for testing)
   */
  resetMoments() {
    this.moments.forEach(moment => {
      moment.executed = false;
    });
    this.executedMoments.clear();
    console.log('🎬 [QuaternaryArena] All moments reset');
  }

  /**
   * Set diorama anchors for coordination
   */
  setDioramas(dioramaAnchors) {
    this.dioramaAnchors = dioramaAnchors;
    console.log('🎬 [QuaternaryArena] Dioramas connected:', Array.from(dioramaAnchors.keys()));
  }

  /**
   * Get current moment state (for debugging)
   */
  getMomentState() {
    return {
      totalMoments: this.moments.size,
      executedMoments: this.executedMoments.size,
      currentScroll: this.currentScrollPosition,
      activeMoments: Array.from(this.moments.entries()).filter(([id, moment]) => 
        this.currentScrollPosition >= moment.triggerY
      )
    };
  }
}

// A2 Connection: Make A2 listen to A4 moments
class SecondaryArenaConnector {
  constructor() {
    this.textElements = new Map(); // Store text elements by moment ID
    this.init();
  }

  init() {
    // Listen for moment broadcasts from A4
    window.addEventListener('trinkaspace-moment', (event) => {
      this.handleMoment(event.detail);
    });
    
    // Listen for idle events
    window.addEventListener('trinkaspace-idle', (event) => {
      this.handleIdle(event.detail);
    });
    
    console.log('📝 [A2 Connector] Connected to A4 Director');
  }

  handleMoment(momentData) {
    const { momentId, moment } = momentData;
    console.log(`📝 [A2] Received moment ${momentId}: ${moment.description}`);
    
    // Trigger text elements associated with this moment
    this.triggerTextForMoment(momentId);
  }

  handleIdle(idleData) {
    console.log('📝 [A2] Handling idle state');
    // Trigger idle chatter if appropriate
    this.triggerIdleChatter(idleData.scrollPosition);
  }

  triggerTextForMoment(momentId) {
    // Look for text elements with matching moment IDs
    const textElements = document.querySelectorAll(`[data-moment="${momentId}"]`);
    textElements.forEach(element => {
      this.displayText(element);
    });
  }

  triggerIdleChatter(scrollPosition) {
    // Find appropriate idle chatter for current position
    const idleElements = document.querySelectorAll('[data-idle="true"]');
    // Implementation for idle chatter
  }

  displayText(element) {
    const text = element.dataset.text;
    const voice = element.dataset.voice || 'narrator';
    
    if (text && window.typeText) {
      window.typeText(element, text, voice);
    }
  }
}

// A3 Connection: Make A3 listen to A4 for HUD updates
class TertiaryArenaConnector {
  constructor() {
    this.hudElements = new Map();
    this.init();
  }

  init() {
    window.addEventListener('trinkaspace-moment', (event) => {
      this.handleMoment(event.detail);
    });
    
    console.log('🎛️ [A3 Connector] Connected to A4 Director');
  }

  handleMoment(momentData) {
    const { momentId } = momentData;
    
    // Update HUD elements based on moments
    this.updateHUDForMoment(momentId);
    
    // Update menu state if needed
    this.updateMenuForMoment(momentId);
  }

  updateHUDForMoment(momentId) {
    // Find HUD elements that should respond to this moment
    const hudElements = document.querySelectorAll(`[data-hud-moment="${momentId}"]`);
    hudElements.forEach(element => {
      element.classList.add('moment-active');
    });
  }

  updateMenuForMoment(momentId) {
    // Update navigation or menu based on story progress
    if (window.trinkaspaceEngine?.hudManager) {
      // Notify HUD manager of story progress
    }
  }
}

// Initialize connectors when loaded
let secondaryConnector, tertiaryConnector;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    secondaryConnector = new SecondaryArenaConnector();
    tertiaryConnector = new TertiaryArenaConnector();
  });
} else {
  secondaryConnector = new SecondaryArenaConnector();
  tertiaryConnector = new TertiaryArenaConnector();
}

// Export for use in other modules
export default QuaternaryArena;
