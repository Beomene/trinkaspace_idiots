/**
 * TextScript - A script parsing system for Trinkaspace
 * Processes markdown files with script-like formats to coordinate
 * TextBox and TrinkaText content with timing controls.
 */

export class TextScript {  constructor(trinkaspaceEngine) {
    this.engine = trinkaspaceEngine;
    this.currentScript = null;
    this.scriptQueue = [];
    this.isPlaying = false;
    this.isPaused = false;
    this.defaultBeat = 1000; // Default 1 second beat duration
    this.lineIndex = 0;
    
    // Trinkascript core principles:
    // 1. Text is ALWAYS triggered by scroll position first
    // 2. Time-based elements (beats) can ONLY exist within scroll-triggered moments
    // 3. Moments can chain to other moments without requiring additional scroll
    // 4. NEVER use time as a global fallback for triggering text
    this.useScrollTriggers = true;
    
    console.log('[TextScript] Initialized - Text will only be triggered by scroll position');
    console.log('[TextScript] Beat duration set to: ' + this.defaultBeat + 'ms');
  }
    /**
   * Load a script from a markdown file
   * @param {string} path - Path to the markdown file
   * @returns {Promise} - Promise that resolves when the script is loaded
   */
  async loadScript(path) {
    try {
      console.log(`[TextScript] Loading script from ${path}`);
      const response = await fetch(path);
      
      if (!response.ok) {
        throw new Error(`Failed to load script from ${path}: ${response.status}`);
      }
      
      const content = await response.text();
      this.parseScript(content);
      
      console.log(`[TextScript] Script loaded and parsed: ${this.scriptQueue.length} lines`);
      
      // Also load soft beat areas if we have access to the scroll trigger
      if (this.engine && this.engine.scrollTrigger && 
          typeof this.engine.scrollTrigger.loadSoftBeatAreas === 'function') {
        try {
          await this.engine.scrollTrigger.loadSoftBeatAreas(path);
          console.log(`[TextScript] Soft beat areas loaded from ${path}`);
        } catch (softBeatError) {
          console.warn(`[TextScript] Error loading soft beat areas: ${softBeatError.message}`);
        }
      }
      
      return true;
    } catch (error) {
      console.error('[TextScript] Error loading script:', error);
      return false;
    }
  }
    /**
   * Parse script content into actionable queue
   * @param {string} content - The raw markdown content
   */  parseScript(content) {
    // Clear any existing script
    this.scriptQueue = [];
    
    // Split content into lines
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    // Extract moment definitions and scroll triggers
    const scrollMoments = [];
      // First pass - extract scroll-moment mappings and soft beat areas
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check for the new scroll-moment format: "y=100, moment m:"
      const scrollMomentMatch = line.match(/y=(\d+),\s*\*\*moment\s+(\w+)\*\*/i);
      if (scrollMomentMatch) {
        const yPos = parseInt(scrollMomentMatch[1], 10);
        const momentId = scrollMomentMatch[2];
        
        scrollMoments.push({
          y: yPos,
          moment: momentId
        });
        
        console.log(`[TextScript] Found scroll-moment mapping: Y=${yPos}px maps to moment "${momentId}"`);
      }
      
      // Check for soft beat area markers: "y=100, **soft_beat forest_idle**"
      const softBeatMatch = line.match(/y=(\d+),\s*\*\*soft_beat\s+(\w+)\*\*/i);
      if (softBeatMatch) {
        // We simply log it here - these are processed by the scrollTrigger's parseSoftBeatMarkers
        console.log(`[TextScript] Found soft beat area marker: Y=${softBeatMatch[1]}px with ID "${softBeatMatch[2]}"`);
      }
    }
    
    // Register these with the scroll trigger system if available
    if (this.engine && this.engine.scrollTrigger && scrollMoments.length > 0) {
      for (const mapping of scrollMoments) {
        // Get the actual Y position using the Royal Alpha system's CUC for scaling
        const scaledY = this.engine.scaleCoordinate ? 
          this.engine.scaleCoordinate(mapping.y) : 
          mapping.y;
          
        console.log(`[TextScript] Registering scroll trigger at Y=${scaledY}px (alpha=${mapping.y}) for moment "${mapping.moment}"`);
        
        // Add the trigger to the scroll system
        this.engine.scrollTrigger.addTrigger({
          y: scaledY,
          message: `Scroll trigger for moment ${mapping.moment}`,
          moment: mapping.moment,
          onTrigger: () => {
            console.log(`[TextScript] Scroll triggered moment: ${mapping.moment}`);
            this.playMoment(mapping.moment);
          }
        });
      }
    }
      // Second pass - parse the actual script content
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
        // Support for the new format: m1 LTT, m2 RTT, m3 SOUND, etc.
      const newFormatMatch = line.match(/^(\w+)(\d+)\s+(LTT|RTT|UTT|TB|SOUND);\s*(.*)/i);
      if (newFormatMatch) {
        const momentPrefix = newFormatMatch[1]; // e.g., "m", "n", "o"
        const momentNumber = newFormatMatch[2]; // e.g., "1", "2", "3"
        const type = newFormatMatch[3].toUpperCase(); // e.g., "LTT", "RTT", "UTT"
        const content = newFormatMatch[4].trim(); // The actual content
        
        console.log(`[TextScript] Parsed new format: ${momentPrefix}${momentNumber} ${type}: ${content}`);
        
        // Determine the full moment ID
        const fullMomentId = `${momentPrefix}`;
        
        // Create the appropriate script item based on the type
        let scriptItem = {
          momentPrefix: fullMomentId,
          momentNumber: parseInt(momentNumber, 10)
        };
        
        switch (type) {
          case 'LTT':
            // Left TrinkaText - determine if it's a thought or speech
            if (content.startsWith('"') && content.endsWith('"')) {
              // It's speech (has quotes)
              scriptItem.type = 'trinkatext';
              scriptItem.content = content.substring(1, content.length - 1).trim();
              scriptItem.mode = 'speak';
            } else {
              // It's a thought (no quotes)
              scriptItem.type = 'trinkatext';
              scriptItem.content = content;
              scriptItem.mode = 'thought';
            }
            break;
            
          case 'RTT':
            // Right TrinkaText
            scriptItem.type = 'rtrinkatext';
            if (content.startsWith('"') && content.endsWith('"')) {
              scriptItem.content = content.substring(1, content.length - 1).trim();
            } else {
              scriptItem.content = content;
            }
            break;
            
          case 'UTT':
            // Upper TrinkaText - check for emotion in parentheses
            scriptItem.type = 'utrinkatext';
            
            const emotionMatch = content.match(/\(([^)]+)\)/);
            if (emotionMatch) {
              scriptItem.emotion = emotionMatch[1].toLowerCase();
              scriptItem.content = content.replace(/\([^)]+\)/, '').trim();
            } else {
              scriptItem.emotion = 'neutral';
              scriptItem.content = content;
            }
            break;
              case 'TB':
            // TextBox content
            scriptItem.type = 'textbox';
            scriptItem.content = content;
            break;
            
          case 'SOUND':
            // Sound effect
            scriptItem.type = 'sound';
            scriptItem.sound = content;
            scriptItem.target = 'A2'; // Default target is Arena 2
            
            // Check if there's a target specified with a dash
            const soundParts = content.split('-');
            if (soundParts.length > 1) {
              scriptItem.target = soundParts[0].trim();
              scriptItem.sound = soundParts.slice(1).join('-').trim();
            }
            
            console.log(`[TextScript] Sound effect: "${scriptItem.sound}" in ${scriptItem.target}`);
            break;
        }
        
        // Check for beat symbol "|" and process accordingly
        const beatMatch = content.match(/(\|+)/);
        if (beatMatch) {
          // Replace the beat symbols with empty string in the content
          scriptItem.content = scriptItem.content.replace(/(\|+)/, '').trim();
          
          // Add the script item
          this.scriptQueue.push(scriptItem);
          
          // Then add beat items for each beat symbol
          const beats = beatMatch[1].length;
          for (let j = 0; j < beats; j++) {
            this.scriptQueue.push({
              type: 'delay',
              duration: this.defaultBeat,
              isBeat: true,
              momentPrefix: fullMomentId,
              momentNumber: parseInt(momentNumber, 10) + 0.1 + (j * 0.01) // Maintain order between content and beats
            });
          }
        } else {
          // No beat symbols, just add the script item
          this.scriptQueue.push(scriptItem);
        }
        
        continue; // Skip the rest of the loop
      }
      
      // Skip empty lines
      if (!line) {
        continue;
      }
        // Check for BEAT syntax - BEAT_025: hard 3000
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
          params: params,
          isBeat: true // Explicitly mark as a beat - the only time-based element allowed
        });
        continue;
      }
      
      // Check for new moment-based format (LTT_001:, RTT_004:, UTT_006:, etc.)
      const momentMatch = line.match(/^(LTT|RTT|UTT|TB)_(\d+):/);
      if (momentMatch) {
        const type = momentMatch[1]; // LTT, RTT, UTT, or TB
        const moment = parseInt(momentMatch[2], 10); // The moment number
        let content = line.substring(line.indexOf(':') + 1).trim();
        
        // Process different types of content
        if (type === 'LTT') {
          let mode = 'thought'; // Default mode is thought
          let style = 'normal';
          
          // Check if speech (has semicolons at start and end)
          if (content.startsWith('"') && content.endsWith('"')) {
            mode = 'speak';
            content = content.substring(1, content.length - 1).trim();
          }
          
          this.scriptQueue.push({
            type: 'trinkatext',
            content: content,
            style: style,
            mode: mode,
            moment: moment
          });
        } else if (type === 'RTT') {
          let style = 'normal';
          
          // Check if speech (has quotes)
          if (content.startsWith('"') && content.endsWith('"')) {
            content = content.substring(1, content.length - 1).trim();
          }
          
          this.scriptQueue.push({
            type: 'rtrinkatext',
            content: content,
            style: style,
            moment: moment
          });
        } else if (type === 'UTT') {
          let emotion = 'neutral';
          let opacity = 1.0;
          let foggy = false;
          
          // Check for emotion in parentheses
          const emotionMatch = content.match(/\(([^)]+)\)/);
          if (emotionMatch) {
            emotion = emotionMatch[1].toLowerCase();
            content = content.replace(/\([^)]+\)/, '').trim();
          }
          
          this.scriptQueue.push({
            type: 'utrinkatext',
            content: content,
            emotion: emotion,
            opacity: opacity,
            foggy: foggy,
            moment: moment
          });
        } else if (type === 'TB') {
          this.scriptQueue.push({
            type: 'textbox',
            content: content,
            moment: moment
          });
        }
        
        continue;
      }
      
      // Fall back to the original format for backward compatibility
      // Check for TextBox (TB) content
      if (line.startsWith('TB:')) {
        const content = line.substring(3).trim();
        this.scriptQueue.push({
          type: 'textbox',
          content: content
        });
        continue;
      }
      
      // Check for TrinkaText (TT) content with speak/thought differentiation
      if (line.startsWith('TT:')) {
        let content = line.substring(3).trim();
        let style = 'normal';
        let mode = 'speak'; // Default is speak mode
        
        // Check for style tags like [dense] or [sprinkle]
        if (content.startsWith('[dense]')) {
          style = 'dense';
          content = content.substring(7).trim();
        } else if (content.startsWith('[sprinkle]')) {
          style = 'sprinkle';
          content = content.substring(10).trim();
        } else if (content.startsWith('[thought]')) {
          mode = 'thought';
          content = content.substring(9).trim();
        } else if (content.startsWith('[speak]')) {
          mode = 'speak';
          content = content.substring(8).trim();
        }
        
        this.scriptQueue.push({
          type: 'trinkatext',
          content: content,
          style: style,
          mode: mode
        });
        continue;
      }
      
      // Check for Upper TrinkaText (UTT) content with emotion states
      if (line.startsWith('UTT:')) {
        let content = line.substring(4).trim();
        let emotion = 'neutral';
        let opacity = 1.0;
        let foggy = false;
        
        // Check for emotion tags
        const emotionMatch = content.match(/\[emotion:(\w+)\]/);
        if (emotionMatch) {
          emotion = emotionMatch[1];
          content = content.replace(/\[emotion:\w+\]/, '').trim();
        }
        
        // Check for foggy state
        const foggyMatch = content.match(/\[foggy:(true|false)\]/);
        if (foggyMatch) {
          foggy = foggyMatch[1] === 'true';
          content = content.replace(/\[foggy:(true|false)\]/, '').trim();
        }
        
        // Check for opacity settings
        const opacityMatch = content.match(/\[opacity:(0\.\d+|1\.0|1)\]/);
        if (opacityMatch) {
          opacity = parseFloat(opacityMatch[1]);
          content = content.replace(/\[opacity:(0\.\d+|1\.0|1)\]/, '').trim();
        }
        
        this.scriptQueue.push({
          type: 'utrinkatext',
          content: content,
          emotion: emotion,
          opacity: opacity,
          foggy: foggy
        });
        continue;
      }
      
      // Check for Right TrinkaText (RTT) content - RTL support
      if (line.startsWith('RTT:')) {
        let content = line.substring(4).trim();
        let style = 'normal';
        
        // Check for style tags like [dense] or [sprinkle]
        if (content.startsWith('[dense]')) {
          style = 'dense';
          content = content.substring(7).trim();
        } else if (content.startsWith('[sprinkle]')) {
          style = 'sprinkle';
          content = content.substring(10).trim();
        }
        
        this.scriptQueue.push({
          type: 'rtrinkatext',
          content: content,
          style: style
        });
        continue;
      }
      
      // Check for timing controls
      if (line.toLowerCase() === 'second') {        this.scriptQueue.push({
          type: 'delay',
          duration: this.defaultBeat,
          isBeat: true // Mark as a beat for proper handling
        });
        continue;
      }
      
      // Check for sound effects
      if (line.startsWith('(SOUND-BOX')) {
        const soundMatch = line.match(/\(SOUND-BOX,\s*([^,]+),\s*([^)]+)\)/);
        if (soundMatch) {
          this.scriptQueue.push({
            type: 'sound',
            target: soundMatch[1].trim(),
            sound: soundMatch[2].trim()
          });
        }
        continue;
      }
      
      // If there's a line with pause directive
      if (line.includes('(pause')) {
        const pauseMatch = line.match(/\(pause\s+(\d+)\s+seconds\)/i);
        if (pauseMatch) {
          const pauseDuration = parseInt(pauseMatch[1], 10) * 1000;
          
          // Extract the content without the pause directive
          const content = line.replace(/\(pause\s+\d+\s+seconds\)/i, '').trim();
          
          // Add the content first
          if (content.startsWith('TB:')) {
            this.scriptQueue.push({
              type: 'textbox',
              content: content.substring(3).trim()
            });
          } else if (content.startsWith('TT:')) {
            this.scriptQueue.push({
              type: 'trinkatext',
              content: content.substring(3).trim()
            });
          }
            // Then add the pause as a beat (the only allowed time-based element)
          this.scriptQueue.push({
            type: 'delay',
            duration: pauseDuration,
            isBeat: true // Mark as a beat so it's allowed to use time
          });
          
          continue;
        }
      }
    }
    
    // Set the current script to the beginning
    this.lineIndex = 0;
    this.currentScript = this.scriptQueue.length > 0 ? this.scriptQueue[0] : null;
  }
  /**
   * Play the script from the current position - ALWAYS uses scroll triggers as the primary mechanism
   * Time-based elements are only allowed within moments that were triggered by scroll
   */
  play() {
    if (this.isPlaying || !this.currentScript) return;
    
    this.isPlaying = true;
    this.isPaused = false;
    // Always use scroll triggers - time is NEVER a fallback
    this.useScrollTriggers = true;
    
    console.log(`[TextScript] Playing script in scroll-triggered mode only`);
    this.processCurrentLine();
  }
  
  /**
   * Pause script playback
   */
  pause() {
    this.isPaused = true;
  }
  
  /**
   * Resume script playback
   */
  resume() {
    if (!this.isPaused) return;
    
    this.isPaused = false;
    this.processCurrentLine();
  }
  
  /**
   * Reset the script to the beginning
   */
  reset() {
    this.scriptQueue = [];
    this.lineIndex = 0;
    this.currentScript = null;
    this.isPlaying = false;
    this.isPaused = false;
  }
    /**
   * Process the current line in the script queue
   */  processCurrentLine() {
    if (!this.isPlaying || this.isPaused || !this.currentScript) return;
    
    const line = this.currentScript;
    
    // Log the moment information if available (for better debugging)
    if (line.momentPrefix) {
      console.log(`[TextScript] Processing moment ${line.momentPrefix}${line.momentNumber}: ${line.type}`);
    } else if (line.moment) {
      console.log(`[TextScript] Processing moment ${line.moment}: ${line.type}`);
    }
    
    switch (line.type) {
      case 'textbox':
        console.log(`[TextScript] TextBox: "${line.content}"`);
        // Update textbox content (this would be handled by your TextBox system)
        if (this.engine && this.engine.updateTextBoxContent) {
          this.engine.updateTextBoxContent(line.content);
        }
        this.advanceScript();
        break;
          case 'trinkatext':
        console.log(`[TextScript] TrinkaText: "${line.content}", style: "${line.style || 'normal'}", mode: "${line.mode || 'speak'}"`);
        // Update TrinkaText content with style parameter
        if (this.engine && this.engine.setTrinkatextMessage) {
          this.engine.setTrinkatextMessage(line.content, line.style || 'normal', line.mode || 'speak');
        }
        this.advanceScript();
        break;
        
      case 'utrinkatext':
        console.log(`[TextScript] UTrinkaText: "${line.content}", emotion: "${line.emotion || 'neutral'}", opacity: ${line.opacity || 1}, foggy: ${line.foggy || false}`);
        // Update Upper TrinkaText with emotion and visual state
        if (this.engine && this.engine.setUTrinkatextMessage) {
          this.engine.setUTrinkatextMessage(line.content, {
            emotion: line.emotion || 'neutral',
            opacity: line.opacity || 1,
            foggy: line.foggy || false
          });
        }
        this.advanceScript();
        break;
        
      case 'rtrinkatext':
        console.log(`[TextScript] RTrinkaText: "${line.content}", style: "${line.style || 'normal'}"`);
        // Update Right TrinkaText content with RTL support and style parameter
        if (this.engine && this.engine.setRTrinkatextMessage) {
          this.engine.setRTrinkatextMessage(line.content, line.style || 'normal');
        }
        this.advanceScript();
        break;
        
      case 'utrinkatext':
        console.log(`[TextScript] UTrinkaText: "${line.content}", emotion: "${line.emotion || 'neutral'}", opacity: ${line.opacity}, foggy: ${line.foggy}`);
        // Update Upper TrinkaText content with emotion and foggy state
        if (this.engine && this.engine.setUTrinkatextMessage) {
          this.engine.setUTrinkatextMessage(line.content, line.emotion || 'neutral', line.opacity, line.foggy);
        }
        this.advanceScript();
        break;      case 'delay':
        console.log(`[TextScript] Delay: ${line.duration}ms`);
        
        // Check if this is a narrative beat (which is allowed to use time)
        if (line.isBeat) {
          // Beats are the ONLY case where time is allowed 
          console.log(`[TextScript] Using time-based delay for beat: ${line.duration}ms`);
          setTimeout(() => {
            if (this.isPlaying && !this.isPaused) {
              this.advanceScript();
            }
          }, line.duration);
        } else {
          // All other delays should be converted to scroll waits
          console.log(`[TextScript] Non-beat delay converted to scroll wait - next content will be triggered by scroll position`);
          // Don't advance script - wait for scroll trigger to advance it instead
          // The script continues when the next scroll trigger activates a moment
        }
        break;
        
      case 'sound':
        console.log(`[TextScript] Sound: ${line.sound} in ${line.target}`);
        // Play the sound effect (this would be handled by your sound system)
        if (this.engine && this.engine.playSound) {
          this.engine.playSound(line.target, line.sound);
        }
        this.advanceScript();
        break;
        
      case 'beat':
        console.log(`[TextScript] Beat: ${line.beatType} for ${line.duration}ms`);
        // Handle beat actions (this would be handled by your beat system)
        if (this.engine && this.engine.handleBeat) {
          this.engine.handleBeat(line.beatType, line.duration, line.params);
        }
        this.advanceScript();
        break;
    }
  }
  
  /**
   * Advance to the next line in the script
   */
  advanceScript() {
    this.lineIndex++;
    
    if (this.lineIndex < this.scriptQueue.length) {
      this.currentScript = this.scriptQueue[this.lineIndex];
      this.processCurrentLine();
    } else {
      // End of script
      console.log('[TextScript] End of script reached');
      this.isPlaying = false;
      this.currentScript = null;
    }
  }
  
  /**
   * Jump to a specific line in the script
   * @param {number} index - The line index to jump to
   */
  jumpToLine(index) {
    if (index >= 0 && index < this.scriptQueue.length) {
      this.lineIndex = index;
      this.currentScript = this.scriptQueue[this.lineIndex];
      
      if (this.isPlaying && !this.isPaused) {
        this.processCurrentLine();
      }
    }
  }
  
  /**
   * Play script content at a specific moment
   * @param {number} moment - The moment number to trigger
   */
  playMoment(moment) {
    if (!this.scriptQueue || this.scriptQueue.length === 0) {
      console.warn('[TextScript] No script loaded to play moment', moment);
      return;
    }
    
    console.log(`[TextScript] Playing moment ${moment}`);
    
    // Find all script elements at this moment
    const elementsAtMoment = this.scriptQueue.filter(item => item.moment === moment);
    
    if (elementsAtMoment.length === 0) {
      console.log(`[TextScript] No elements found at moment ${moment}`);
      return;
    }
    
    // Process each element at this moment
    elementsAtMoment.forEach(element => {
      this.processElement(element);
    });
  }
  
  /**
   * Process a single script element
   * @param {Object} element - The script element to process
   */
  processElement(element) {
    switch (element.type) {
      case 'beat':
        console.log(`[TextScript] Beat at moment ${element.moment}: ${element.beatType} for ${element.duration}ms`);
        if (this.engine && this.engine.processBeat) {
          this.engine.processBeat(element.beatType, element.duration, element.params || {});
        }
        break;
        
      case 'textbox':
        console.log(`[TextScript] TextBox at moment ${element.moment}: "${element.content}"`);
        if (this.engine && this.engine.updateTextBoxContent) {
          this.engine.updateTextBoxContent(element.content);
        }
        break;
        
      case 'trinkatext':
        console.log(`[TextScript] TrinkaText at moment ${element.moment}: "${element.content}", mode: "${element.mode || 'speak'}"`);
        if (this.engine && this.engine.setTrinkatextMessage) {
          this.engine.setTrinkatextMessage(element.content, element.style || 'normal', element.mode || 'speak');
        }
        break;
        
      case 'utrinkatext':
        console.log(`[TextScript] UTrinkaText at moment ${element.moment}: "${element.content}", emotion: "${element.emotion || 'neutral'}"`);
        if (this.engine && this.engine.setUTrinkatextMessage) {
          this.engine.setUTrinkatextMessage(element.content, {
            emotion: element.emotion || 'neutral',
            opacity: element.opacity || 1,
            foggy: element.foggy || false
          });
        }
        break;
        
      case 'rtrinkatext':
        console.log(`[TextScript] RTrinkaText at moment ${element.moment}: "${element.content}"`);
        if (this.engine && this.engine.setRTrinkatextMessage) {
          this.engine.setRTrinkatextMessage(element.content, element.style || 'normal');
        }        break;
    }
  }
  
  /**
   * Add support for moment chaining according to the Trinkascript specification
   * Allows moments to trigger other moments without requiring additional scroll
   * @param {string|number} momentId - The ID of the moment to chain to
   */  /**
   * Play a specific moment from the script
   * @param {string|number} momentId - The ID of the moment to play
   */
  playMoment(momentId) {
    console.log(`[TextScript] Playing moment: ${momentId}`);
    
    // Mark script as playing if it's not already
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.isPaused = false;
    }
    
    // Find all script lines associated with this moment
    const momentLines = this.scriptQueue.filter(line => {
      // Check for moment-specific formats:
      
      // New format: m1 LTT, m2 RTT, etc.
      if (line.momentPrefix && line.momentPrefix === momentId) {
        return true;
      }
      
      // Legacy format: direct moment property
      if (line.moment === momentId || 
         (typeof line.moment === 'string' && line.moment.toLowerCase() === String(momentId).toLowerCase())) {
        return true;
      }
      
      return false;
    });
    
    if (momentLines.length === 0) {
      console.warn(`[TextScript] Cannot play moment ${momentId}: moment not found in script`);
      return false;
    }
    
    console.log(`[TextScript] Found ${momentLines.length} lines for moment ${momentId}`);
    
    // Get the index of the first line of the moment
    const firstLineIndex = this.scriptQueue.findIndex(line => 
      (line.momentPrefix && line.momentPrefix === momentId) ||
      line.moment === momentId || 
      (typeof line.moment === 'string' && line.moment.toLowerCase() === String(momentId).toLowerCase())
    );
    
    if (firstLineIndex === -1) {
      console.warn(`[TextScript] Cannot find index for moment ${momentId}`);
      return false;
    }
    
    // Jump to this moment and continue processing
    this.lineIndex = firstLineIndex;
    this.currentScript = this.scriptQueue[this.lineIndex];
    this.processCurrentLine();
    
    return true;
  }
  
  /**
   * Chain to another moment without requiring a scroll trigger
   * @param {string|number} momentId - The ID of the moment to chain to
   */
  chainToMoment(momentId) {
    console.log(`[TextScript] Chaining to moment: ${momentId}`);
    return this.playMoment(momentId);
  }
}
