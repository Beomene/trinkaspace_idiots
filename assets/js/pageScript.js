/**
 * PageScript - A scroll-driven script system for Trinkaspace
 * Extends TextScript to support page-level scripts with scroll-based triggers
 * and content coordination.
 */

import { TextScript } from './textScript.js';

export class PageScript extends TextScript {  constructor(trinkaspaceEngine) {
    super(trinkaspaceEngine);
    
    this.scrollTriggers = [];
    this.scrollPositionY = 0;
    this.lastProcessedScrollY = -1;
    this.lastScrollTime = 0;
    this.scrollThrottleDelay = 50; // ms
    
    // Track which scroll sections have been executed
    this.executedSections = new Set();
    
    // Track the loaded script path
    this.loadedScriptPath = null;
    
    // Advanced script configuration
    this.pageScriptConfig = null;
    
    // Idle timer for detecting user inactivity
    this.idleTimer = null;
    this.idleTime = 0;
    this.idleCheckInterval = 10000; // Check every 10 seconds
    this.lastUserActivity = Date.now();
    
    // Character configurations
    this.characterConfigs = new Map();
      // Section tracking
    this.currentSection = null;
    this.sectionSequences = new Map();
    
    // Make sure methods are bound to this instance
    this.handleScroll = this.handleScroll.bind(this);
    this.resetIdleTimer = this.resetIdleTimer.bind(this);
    
    // Setup event listeners after binding
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('mousemove', this.resetIdleTimer);
    window.addEventListener('keypress', this.resetIdleTimer);
    window.addEventListener('touchstart', this.resetIdleTimer);
    
    // Start idle checking
    this.startIdleTimer();
    
    console.log('[PageScript] Initialized with advanced features');
  }
  
  /**
   * Load the advanced script configuration from page_script.json
   * @param {string} pageId - The ID of the current page
   */
  async loadPageScriptConfig(pageId) {
    try {
      const response = await fetch(`/pages/CHAPTER_1/${pageId}/page_script.json`);
      
      if (response.ok) {
        this.pageScriptConfig = await response.json();
        console.log('[PageScript] Loaded page script configuration:', this.pageScriptConfig);
        
        // Initialize character configs
        if (this.pageScriptConfig.characterConfigs) {
          Object.entries(this.pageScriptConfig.characterConfigs).forEach(([charId, config]) => {
            this.characterConfigs.set(charId, config);
          });
        }
        
        // Initialize sections and sequences
        if (this.pageScriptConfig.sections) {
          this.pageScriptConfig.sections.forEach(section => {
            if (section.sequences) {
              section.sequences.forEach(sequence => {
                this.sectionSequences.set(sequence.id, sequence);
              });
            }
          });
        }
        
        return true;
      } else {
        console.warn(`[PageScript] No page_script.json found for page ${pageId}`);
        return false;
      }
    } catch (error) {
      console.error('[PageScript] Error loading page script config:', error);
      return false;
    }
  }
    /**
   * Handle scroll events
   * @param {Event} event - The scroll event
   */  handleScroll(event) {
    const now = Date.now();
    
    // Throttle scroll events
    if (now - this.lastScrollTime < this.scrollThrottleDelay) return;
    
    this.lastScrollTime = now;
    this.scrollPositionY = window.scrollY;
    
    // Reset idle timer on scroll
    this.resetIdleTimer();
    
    // Check if we need to process triggers - PRIORITY ORDER MATTERS:
    // First check scroll triggers - these are the primary way text should be triggered
    this.checkScrollTriggers();
    
    // Then check section scripts (which are also scroll-based)
    this.checkAdvancedSections();
    
    // Last check moment triggers (also scroll-based)
    this.checkMomentTriggers();
    
    // Log scroll position for debugging
    console.debug(`[PageScript] Scroll position Y: ${this.scrollPositionY}px`);
  }
  
  /**
   * Check if any advanced section scripts should be activated based on the scroll position
   */
  checkAdvancedSections() {
    if (!this.pageScriptConfig || !this.pageScriptConfig.sections) return;
    
    // Find the section that contains the current scroll position
    const currentSection = this.pageScriptConfig.sections.find(section => 
      this.scrollPositionY >= section.yStart && this.scrollPositionY <= section.yEnd
    );
    
    // If we've entered a new section
    if (currentSection && (this.currentSection !== currentSection.id)) {
      console.log(`[PageScript] Entered section: ${currentSection.id}`);
      this.currentSection = currentSection.id;
      
      // Process sequences for this section
      if (currentSection.sequences) {
        currentSection.sequences.forEach(sequence => {
          // Only process sequences that haven't been executed or aren't marked as once-only
          if (!sequence.once || !this.executedSections.has(sequence.id)) {
            this.processSequence(sequence);
          }
        });
      }
    }
  }
  
  /**
   * Process a sequence of events based on conditions
   */
  processSequence(sequence) {
    // Check if conditions are met
    if (sequence.conditions) {
      // Check scroll position condition
      if (sequence.conditions.scrollY && this.scrollPositionY < sequence.conditions.scrollY) {
        return;
      }
      
      // Check for required triggers
      if (sequence.conditions.triggers && sequence.conditions.triggers.length > 0) {
        const allTriggersActivated = sequence.conditions.triggers.every(
          triggerId => this.executedSections.has(triggerId)
        );
        
        if (!allTriggersActivated) return;
      }
    }
    
    // Mark sequence as executed if it should only run once
    if (sequence.once) {
      this.executedSections.add(sequence.id);
    }
    
    // Process all events in the sequence with their delays
    if (sequence.events && sequence.events.length > 0) {
      sequence.events.forEach((event, index) => {
        setTimeout(() => this.executeEvent(event), event.delay || 0);
      });
    }
  }
  
  /**
   * Execute a specific event
   */
  executeEvent(event) {
    console.log(`[PageScript] Executing event: ${event.type}`);
    
    switch(event.type) {
      case 'ltt':
        if (this.engine && this.engine.setTrinkatextMessage) {
          this.engine.setTrinkatextMessage(event.content, event.style || 'normal', event.mode || 'speak');
        }
        break;
      
      case 'rtt':
        if (this.engine && this.engine.setRTrinkatextMessage) {
          this.engine.setRTrinkatextMessage(event.content, event.style || 'normal');
        }
        break;
        
      case 'utt':
        if (this.engine && this.engine.setUTrinkatextMessage) {
          this.engine.setUTrinkatextMessage(event.content, {
            emotion: event.emotion || 'neutral',
            opacity: event.opacity || 1.0,
            foggy: event.foggy || false
          });
        }
        break;
        
      case 'tb':
        if (this.engine && this.engine.updateTextBoxContent) {
          this.engine.updateTextBoxContent(event.content, event.style || 'normal');
        }
        break;
        
      case 'sound':
        if (this.engine && this.engine.playSound) {
          this.engine.playSound(event.soundId);
        }
        break;
    }
  }
  
  /**
   * Check if any scroll triggers should be activated
   */  checkScrollTriggers() {
    if (this.scrollTriggers.length === 0) {
      console.debug('[PageScript] No scroll triggers defined');
      return;
    }
    
    // Log currently available triggers for debugging
    console.debug(`[PageScript] Checking ${this.scrollTriggers.length} scroll triggers at Y=${this.scrollPositionY}px`);
    
    // Process any triggers that should fire at the current scroll position
    for (const trigger of this.scrollTriggers) {
      console.debug(`[PageScript] Evaluating trigger: ${trigger.id} at Y=${trigger.y}px (Current: ${this.scrollPositionY}px)`);
      
      if (this.scrollPositionY >= trigger.y) {
        if (trigger.once && this.executedSections.has(trigger.id)) {
          console.debug(`[PageScript] Trigger ${trigger.id} already executed, skipping`);
          continue;
        }
        
        // Mark as executed if it's a one-time trigger
        if (trigger.once) {
          console.log(`[PageScript] Executing one-time trigger: ${trigger.id}`);
          this.executedSections.add(trigger.id);
        } else {
          console.log(`[PageScript] Executing repeatable trigger: ${trigger.id}`);
        }
        
        // Execute the section immediately without delay if possible
        if (trigger.delay && trigger.delay > 0) {
          console.log(`[PageScript] Scheduling trigger ${trigger.id} with ${trigger.delay}ms delay`);
          setTimeout(() => {
            this.executeScriptSection(trigger.id, 0); // No additional delay
          }, trigger.delay);
        } else {
          // Execute immediately
          this.executeScriptSection(trigger.id, 0);
        }
      }
    }
  }
    /**
   * Trigger a specific moment in the script
   * @param {number} moment - The moment number to trigger
   */
  triggerMoment(moment) {
    // We now allow triggering even if not playing - since scroll is the primary mechanism
    // and moments can be triggered directly from scroll position
    if (!this.isPlaying) {
      console.log(`[PageScript] Starting script playback for moment ${moment}`);
      this.isPlaying = true;
      this.isPaused = false;
    }
    
    console.log(`[PageScript] Triggering moment ${moment}`);
    
    // Play moment in the TextScript base class
    this.playMoment(moment);
  }
  
  /**
   * Process moments based on scroll position
   */
  checkMomentTriggers() {
    if (!this.pageScriptConfig || !this.pageScriptConfig.moments) return;
    
    // Check each moment trigger based on scroll position
    this.pageScriptConfig.moments.forEach(momentTrigger => {
      if (this.scrollPositionY >= momentTrigger.atY && 
          !this.executedSections.has(`moment_${momentTrigger.moment}`)) {
        
        // Check if this is a one-time moment
        if (momentTrigger.once) {
          this.executedSections.add(`moment_${momentTrigger.moment}`);
        }
        
        // Trigger after delay if specified
        if (momentTrigger.delay && momentTrigger.delay > 0) {
          setTimeout(() => {
            this.triggerMoment(momentTrigger.moment);
          }, momentTrigger.delay);
        } else {
          this.triggerMoment(momentTrigger.moment);
        }
      }
    });
  }
  
  /**
   * Execute a specific section of the script
   * @param {string} sectionId - The ID of the section to execute
   * @param {number} delay - Optional delay before execution
   */
  executeScriptSection(sectionId, delay = 0) {
    if (!this.scriptQueue.length) return;
    
    // Find the section start index in the script
    const sectionStartIndex = this.findSectionStartIndex(sectionId);
    if (sectionStartIndex === -1) return;
    
    // Find the section end index
    const sectionEndIndex = this.findSectionEndIndex(sectionStartIndex);
    
    console.log(`[PageScript] Executing section: ${sectionId}, Lines ${sectionStartIndex}-${sectionEndIndex}`);
    
    const executeSection = () => {
      // Set the index to the start of the section
      this.lineIndex = sectionStartIndex;
      this.currentScript = this.scriptQueue[this.lineIndex];
      
      // Enable playback if it's not already playing
      const wasPlaying = this.isPlaying;
      if (!wasPlaying) {
        this.isPlaying = true;
        this.isPaused = false;
      }
      
      this.processCurrentLine();
    };
    
    if (delay > 0) {
      setTimeout(executeSection, delay);
    } else {
      executeSection();
    }
  }
  
  /**
   * Find the starting index of a script section
   * @param {string} sectionId - The section ID to find
   * @returns {number} - The index in scriptQueue, or -1 if not found
   */
  findSectionStartIndex(sectionId) {
    for (let i = 0; i < this.scriptQueue.length; i++) {
      const item = this.scriptQueue[i];
      if (item.type === 'section' && item.id === sectionId) {
        return i + 1; // Start at the line after the section marker
      }
    }
    return -1;
  }
  
  /**
   * Find the ending index of a script section
   * @param {number} startIndex - The starting index of the section
   * @returns {number} - The index of the end of the section
   */
  findSectionEndIndex(startIndex) {
    for (let i = startIndex; i < this.scriptQueue.length; i++) {
      const item = this.scriptQueue[i];
      if (item.type === 'section') {
        return i - 1;
      }
    }
    return this.scriptQueue.length - 1;
  }
  
  /**
   * Override parseScript to handle section markers
   * @param {string} content - The raw markdown content
   */
  parseScript(content) {
    // Clear any existing script
    this.reset();
    
    // Split content into lines and process each line
    const lines = content.split('\n');
    
    // First pass: extract scroll triggers
    this.extractScrollTriggers(lines);
    
    // Second pass: parse the script content
    this.parseScriptContent(lines);
    
    // Set the current script to the beginning
    this.lineIndex = 0;
    this.currentScript = this.scriptQueue.length > 0 ? this.scriptQueue[0] : null;
    
    console.log(`[PageScript] Parsed ${this.scriptQueue.length} lines, ${this.scrollTriggers.length} scroll triggers`);
  }
  
  /**
   * Extract scroll triggers from script content
   * @param {string[]} lines - The script content lines
   */
  extractScrollTriggers(lines) {
    this.scrollTriggers = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Match scroll-trigger section markers: ## SECTION_ID [y=1000] [once] [delay=500]
      const sectionMatch = line.match(/^##\s+(\w+)(?:\s+\[y=(\d+)\])?(?:\s+\[once\])?(?:\s+\[delay=(\d+)\])?/);
      
      if (sectionMatch) {
        const id = sectionMatch[1];
        const y = sectionMatch[2] ? parseInt(sectionMatch[2], 10) : 0;
        const once = line.includes('[once]');
        const delayMatch = line.match(/\[delay=(\d+)\]/);
        const delay = delayMatch ? parseInt(delayMatch[1], 10) : 0;
        
        this.scrollTriggers.push({
          id,
          y,
          once,
          delay
        });
      }
    }
  }
  
  /**
   * Parse the script content for actions
   * @param {string[]} lines - The script content lines
   */
  parseScriptContent(lines) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines or comments
      if (!line || line.startsWith('//')) continue;
      
      // Parse section headers
      const sectionMatch = line.match(/^##\s+(\w+)/);
      if (sectionMatch) {
        this.scriptQueue.push({
          type: 'section',
          id: sectionMatch[1]
        });
        continue;
      }
      
      // Check for scroll-specific directives
      if (line.startsWith('[scroll:')) {
        const scrollMatch = line.match(/\[scroll:\s*(\d+)\s*\]/);
        if (scrollMatch) {
          const scrollY = parseInt(scrollMatch[1], 10);
          // This just adds a marker - the actual trigger is in scrollTriggers
          this.scriptQueue.push({
            type: 'scroll',
            y: scrollY
          });
        }
        continue;
      }
      
      // Process dense/sprinkle directives
      if (line.startsWith('[dense]') || line.startsWith('[sprinkle]')) {
        const isSprinkle = line.startsWith('[sprinkle]');
        const content = line.replace(/^\[(dense|sprinkle)\]\s*/, '');
        
        // Check if it contains TB or TT content
        if (content.startsWith('TB:')) {
          this.scriptQueue.push({
            type: 'textbox',
            content: content.substring(3).trim(),
            style: isSprinkle ? 'sprinkle' : 'dense'
          });
        } else if (content.startsWith('TT:')) {
          this.scriptQueue.push({
            type: 'trinkatext',
            content: content.substring(3).trim(),
            style: isSprinkle ? 'sprinkle' : 'dense'
          });
        }
        continue;
      }
      
      // Handle all other standard script elements
      // This leverages the parent TextScript parsing logic for TB, TT, delay, etc.
      this.handleStandardScriptElement(line);
    }
  }
  
  /**
   * Handle standard script elements (TB, TT, delay, etc.)
   * @param {string} line - The line to process
   */
  handleStandardScriptElement(line) {    if (line.toLowerCase() === 'second') {
      this.scriptQueue.push({
        type: 'delay',
        duration: this.defaultBeat,
        isBeat: true // Mark as a beat for proper handling
      });
      return;
    }
    
    if (line.startsWith('(SOUND-BOX')) {
      const soundMatch = line.match(/\(SOUND-BOX,\s*([^,]+),\s*([^)]+)\)/);
      if (soundMatch) {
        this.scriptQueue.push({
          type: 'sound',
          target: soundMatch[1].trim(),
          sound: soundMatch[2].trim()
        });
      }
      return;
    }
    
    if (line.startsWith('TB:')) {
      const content = line.substring(3).trim();
      this.scriptQueue.push({
        type: 'textbox',
        content: content,
        style: 'normal'
      });
      return;
    }
    
    if (line.startsWith('TT:')) {
      const content = line.substring(3).trim();
      this.scriptQueue.push({
        type: 'trinkatext',
        content: content,
        style: 'normal'
      });
      return;
    }
    
    if (line.includes('(pause')) {
      const pauseMatch = line.match(/\(pause\s+(\d+)\s+seconds\)/i);
      if (pauseMatch) {
        const pauseDuration = parseInt(pauseMatch[1], 10) * 1000;
        
        const content = line.replace(/\(pause\s+\d+\s+seconds\)/i, '').trim();
        
        if (content.startsWith('TB:')) {
          this.scriptQueue.push({
            type: 'textbox',
            content: content.substring(3).trim(),
            style: 'normal'
          });
        } else if (content.startsWith('TT:')) {
          this.scriptQueue.push({
            type: 'trinkatext',
            content: content.substring(3).trim(),
            style: 'normal'
          });
        }
        
        this.scriptQueue.push({
          type: 'delay',
          duration: pauseDuration
        });
      }
      return;
    }
  }
  
  /**
   * Load a page script from a markdown file
   * @param {string} path - Path to the markdown file
   * @returns {Promise} - Promise that resolves when the script is loaded
   */  async loadPageScript(path) {
    try {
      console.log(`[PageScript] Loading page script from ${path}`);
      this.loadedScriptPath = path;
      
      const response = await fetch(path);
      
      if (!response.ok) {
        throw new Error(`Failed to load script from ${path}: ${response.status}`);
      }
      
      const content = await response.text();
      this.parseScript(content);
      
      // Reset execution tracking
      this.executedSections = new Set();
      
      // Enable scroll trigger mode
      this.useScrollTriggers = true;
      
      // Log all extracted scroll triggers for debugging
      if (this.scrollTriggers.length > 0) {
        console.log(`[PageScript] Page script loaded with ${this.scrollTriggers.length} scroll triggers:`);
        this.scrollTriggers.forEach(trigger => {
          console.log(`  - Trigger "${trigger.id}" at Y=${trigger.y}px`);
        });
      } else {
        console.warn('[PageScript] No scroll triggers found in the script. Text will use fallback time-based delays.');
      }
      
      console.log(`[PageScript] Page script loaded and parsed: ${this.scriptQueue.length} lines`);
      
      // Immediately check for any triggers at the current scroll position
      this.checkScrollTriggers();
      
      return true;
    } catch (error) {
      console.error('[PageScript] Error loading page script:', error);
      return false;
    }
  }
  
  /**
   * Override processCurrentLine to handle style attributes
   */
  processCurrentLine() {
    if (!this.isPlaying || this.isPaused || !this.currentScript) return;
    
    const line = this.currentScript;
    
    switch (line.type) {
      case 'textbox':
        console.log(`[PageScript] TextBox (${line.style || 'normal'}): "${line.content}"`);
        // Update textbox content with style information
        if (this.engine && this.engine.updateTextBoxContent) {
          this.engine.updateTextBoxContent(line.content, line.style);
        }
        this.advanceScript();
        break;
        
      case 'trinkatext':
        console.log(`[PageScript] TrinkaText (${line.style || 'normal'}): "${line.content}"`);
        // Update TrinkaText content with style information
        if (this.engine && this.engine.setTrinkatextMessage) {
          this.engine.setTrinkatextMessage(line.content, line.style);
        }
        this.advanceScript();
        break;
        
      case 'section':
        // Skip section markers during sequential playback
        this.advanceScript();
        break;
        
      case 'scroll':
        // Skip scroll markers during sequential playback
        this.advanceScript();
        break;
        
      default:
        // Use parent class handling for other types
        super.processCurrentLine();
        break;
    }
  }
  
  /**
   * Reset the idle timer whenever user activity is detected
   */
  resetIdleTimer() {
    this.lastUserActivity = Date.now();
    this.idleTime = 0;
  }

  /**
   * Start the idle timer to check for user inactivity
   */
  startIdleTimer() {
    // Clear any existing timer
    if (this.idleTimer) {
      clearInterval(this.idleTimer);
    }
    
    // Set up new timer
    this.idleTimer = setInterval(() => {
      this.idleTime += this.idleCheckInterval;
      const timeSinceLastActivity = Date.now() - this.lastUserActivity;
      
      // Check for idle actions from the config
      if (this.pageScriptConfig && this.pageScriptConfig.idleActions) {
        this.pageScriptConfig.idleActions.forEach(action => {
          // Check if we've been idle long enough for this action and it hasn't been triggered yet
          if (timeSinceLastActivity >= action.timeout && !action.triggered) {
            console.log(`[PageScript] User idle for ${action.timeout}ms, triggering action:`, action);
            this.executeAction(action);
            
            // Mark as triggered if it's a once-only action
            if (action.once) {
              action.triggered = true;
            }
          }
        });
      }
    }, this.idleCheckInterval);
  }

  /**
   * Execute an action from the script configuration
   * @param {Object} action - The action to execute
   */
  executeAction(action) {
    if (!action || !action.type) {
      console.error('[PageScript] Invalid action', action);
      return;
    }
    
    switch (action.type) {
      case 'trinkatext':
        if (this.engine && this.engine.setTrinkatextMessage) {
          this.engine.setTrinkatextMessage(action.content, action.style || 'normal');
        }
        break;
        
      case 'rtrinkatext':
        if (this.engine && this.engine.setRTrinkatextMessage) {
          this.engine.setRTrinkatextMessage(action.content, action.style || 'normal');
        }
        break;
        
      case 'utrinkatext':
        if (this.engine && this.engine.setUTrinkatextMessage) {
          this.engine.setUTrinkatextMessage(action.content, action.options || {});
        }
        break;
        
      case 'textbox':
        if (this.engine && this.engine.updateTextBoxContent) {
          this.engine.updateTextBoxContent(action.content, action.style || 'normal');
        }
        break;
        
      case 'beat':
        if (this.engine && this.engine.processBeat) {
          this.engine.processBeat(action.beatType || 'normal', action.duration || 2000, action.params || {});
        }
        break;
        
      case 'sound':
        if (this.engine && this.engine.playSound) {
          this.engine.playSound(action.target || 'global', action.sound);
        }
        break;
        
      case 'playMoment':
        if (action.moment && this.engine && this.engine.textScript) {
          this.engine.textScript.playMoment(action.moment);
        }
        break;
        
      case 'playScript':
        if (action.scriptId && this.scriptSections && this.scriptSections.has(action.scriptId)) {
          this.playScriptSection(action.scriptId);
        }
        break;
        
      default:
        console.warn(`[PageScript] Unknown action type: ${action.type}`, action);
    }
  }
  
  /**
   * Reset the script system
   */
  reset() {
    super.reset();
    this.scrollTriggers = [];
    this.executedSections = new Set();
    this.lastProcessedScrollY = -1;
  }
  
}
