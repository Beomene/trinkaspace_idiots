/**
 * scrollTriggerIntegration.js
 * 
 * This file contains extensions to the ScrollTrigger class to support soft beat areas
 * for idle chatter. It should be imported into scrollTrigger.js.
 */

// Extend the ScrollTrigger class
export function extendScrollTrigger(ScrollTrigger) {
  // Original prototype reference for inheritance
  const originalCheckScrollTriggers = ScrollTrigger.prototype.checkScrollTriggers;

  /**
   * Add support for soft beat areas
   * @param {Array} softBeatTriggers - Array of soft beat trigger objects
   */
  ScrollTrigger.prototype.addSoftBeatTriggers = function(softBeatTriggers) {
    if (!this.softBeatTriggers) {
      this.softBeatTriggers = [];
      this.currentSoftBeatArea = null;
    }
    
    softBeatTriggers.forEach(trigger => {
      this.softBeatTriggers.push(trigger);
    });
    
    // Sort by y position
    this.softBeatTriggers.sort((a, b) => a.y - b.y);
    
    console.log(`[ScrollTrigger] Added ${softBeatTriggers.length} soft beat area triggers`);
    
    // Check if we should trigger any immediately (if already scrolled past)
    this.checkScrollTriggers();
  };
  
  /**
   * Parse soft beat markers from script content
   * @param {string} scriptContent - The script content to parse
   * @returns {Array} Array of soft beat trigger objects
   */
  ScrollTrigger.prototype.parseSoftBeatMarkers = function(scriptContent) {
    const softBeatTriggers = [];
    const lines = scriptContent.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Parse start of soft beat area: y=100, **soft_beat forest_idle**
      const startMatch = line.match(/y=(\d+),\s*\*\*soft_beat\s+(\w+)\*\*/i);
      if (startMatch) {
        const yPos = parseInt(startMatch[1], 10);
        const areaId = startMatch[2];
        
        softBeatTriggers.push({
          y: yPos,
          id: areaId,
          type: 'soft_beat_start'
        });
        
        console.log(`[ScrollTrigger] Found soft beat area start at Y=${yPos}px with ID: ${areaId}`);
      }
      
      // Parse end of soft beat area: y=150, **end_soft_beat**
      const endMatch = line.match(/y=(\d+),\s*\*\*end_soft_beat\*\*/i);
      if (endMatch) {
        const yPos = parseInt(endMatch[1], 10);
        
        softBeatTriggers.push({
          y: yPos,
          type: 'soft_beat_end'
        });
        
        console.log(`[ScrollTrigger] Found soft beat area end at Y=${yPos}px`);
      }
    }
    
    return softBeatTriggers;
  };
  
  /**
   * Override the checkScrollTriggers method to also check soft beat areas
   */
  ScrollTrigger.prototype.checkScrollTriggers = function() {
    // Call the original method first
    originalCheckScrollTriggers.call(this);
    
    // Then check for soft beat areas if they exist
    if (this.softBeatTriggers && this.softBeatTriggers.length > 0) {
      this.checkSoftBeatAreas();
    }
  };
  
  /**
   * Check if the user has entered or exited soft beat areas
   */
  ScrollTrigger.prototype.checkSoftBeatAreas = function() {
    const scrollY = window.scrollY;
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
  };
  
  /**
   * Load soft beat areas from a script file
   * @param {string} path - Path to the script file
   * @returns {Promise} Promise that resolves when soft beat areas are loaded
   */
  ScrollTrigger.prototype.loadSoftBeatAreas = async function(path) {
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
  };
  
  return ScrollTrigger;
}
