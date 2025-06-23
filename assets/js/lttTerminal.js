/**
 * LTT - Loop Tracking Terminal
 * 
 * Creates and manages the visual Loop Tracking Terminal interface
 * Handles text display, animations, and stress level visualization
 */

class LoopTrackingTerminal {
  constructor(containerId = 'ltt-container') {
    this.containerId = containerId;
    this.stressLevel = 0; // 0-4: none, low, medium, high, max
    this.isGenerating = false;
    this.currentText = '';
    this.typingSpeed = 50; // ms between characters
    this.textQueue = [];
    
    this.stressClasses = [
      '', // no stress class at level 0
      'ltt-stress-low',
      'ltt-stress-medium', 
      'ltt-stress-high',
      'ltt-stress-max'
    ];
    
    // Initialize the terminal after DOM is loaded
    document.addEventListener('DOMContentLoaded', () => this.initialize());
  }
  
  /**
   * Create the LTT structure in the DOM
   */
  initialize() {
    // Create the container if it doesn't exist
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      document.body.appendChild(container);
    }
    
    container.className = 'ltt-container';
    
    // Create border elements
    this.createBorders(container);
    
    // Create corner elements
    this.createCorners(container);
    
    // Create text area (in corner 2 - upper left)
    this.createTextArea(container);
    
    console.log('[LTT] Loop Tracking Terminal initialized');
  }
  
  /**
   * Create the border lines for the terminal
   */
  createBorders(container) {
    const borders = {
      'ltt-upper': 'lttUPPER',
      'ltt-lower': 'lttLOWER',
      'ltt-left': 'lttLEFT',
      'ltt-right': 'lttRIGHT'
    };
    
    for (const [className, id] of Object.entries(borders)) {
      const border = document.createElement('div');
      border.className = `ltt-border ${className}`;
      border.id = id;
      container.appendChild(border);
    }
  }
  
  /**
   * Create the corner elements for the terminal
   */
  createCorners(container) {
    for (let i = 1; i <= 4; i++) {
      const corner = document.createElement('div');
      corner.className = `ltt-corner ltt-corner${i}`;
      corner.id = `lttCorner${i}`;
      container.appendChild(corner);
    }
  }
  
  /**
   * Create the text output area in corner 2 (upper left)
   */
  createTextArea(container) {
    const textArea = document.createElement('div');
    textArea.className = 'ltt-text-area';
    textArea.id = 'lttTextArea';
    
    const prefix = document.createElement('span');
    prefix.className = 'ltt-prefix';
    prefix.textContent = 'E:';
    prefix.id = 'lttPrefix';
    
    const output = document.createElement('span');
    output.className = 'ltt-output';
    output.id = 'lttOutput';
    
    const cursor = document.createElement('span');
    cursor.className = 'ltt-cursor';
    cursor.id = 'lttCursor';
    
    textArea.appendChild(prefix);
    textArea.appendChild(output);
    textArea.appendChild(cursor);
    container.appendChild(textArea);
  }
  
  /**
   * Set the stress level of the terminal (affects animation speed and color)
   * @param {number} level - Stress level (0-4)
   */
  setStressLevel(level) {
    // Ensure level is between 0 and 4
    this.stressLevel = Math.max(0, Math.min(4, level));
    
    const container = document.getElementById(this.containerId);
    if (!container) return;
    
    // Remove all stress classes
    this.stressClasses.forEach(cls => {
      if (cls) container.classList.remove(cls);
    });
    
    // Add the appropriate stress class
    if (this.stressLevel > 0) {
      container.classList.add(this.stressClasses[this.stressLevel]);
    }
  }
  
  /**
   * Add text to the output queue
   * @param {string} text - Text to add
   * @param {number} stressLevel - Optional stress level for this text (0-4)
   */
  addText(text, stressLevel = null) {
    this.textQueue.push({
      text,
      stressLevel: stressLevel !== null ? stressLevel : this.stressLevel
    });
    
    if (!this.isGenerating) {
      this.processQueue();
    }
  }
  
  /**
   * Process the text queue
   */
  async processQueue() {
    if (this.textQueue.length === 0) {
      this.isGenerating = false;
      return;
    }
    
    this.isGenerating = true;
    const item = this.textQueue.shift();
    
    // Set stress level if provided
    if (item.stressLevel !== null) {
      this.setStressLevel(item.stressLevel);
    }
    
    await this.typeText(item.text);
    
    // Process next item in queue
    this.processQueue();
  }
  
  /**
   * Type text character by character
   * @param {string} text - Text to type
   */
  async typeText(text) {
    const output = document.getElementById('lttOutput');
    if (!output) return;
    
    // Clear existing text for now (can be modified to append if needed)
    output.textContent = '';
    this.currentText = '';
    
    // Type each character with delay
    for (let i = 0; i < text.length; i++) {
      this.currentText += text[i];
      output.textContent = this.currentText;
      
      // Calculate typing speed based on stress level
      // Higher stress = faster typing
      const adjustedSpeed = this.typingSpeed - (this.stressLevel * 5);
      
      // Wait before typing next character
      await new Promise(resolve => setTimeout(resolve, adjustedSpeed));
    }
    
    // Add a pause after completing the text
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  /**
   * Clear all text from the terminal
   */
  clearText() {
    const output = document.getElementById('lttOutput');
    if (output) {
      output.textContent = '';
      this.currentText = '';
    }
  }
  
  /**
   * Adjust terminal dimensions based on viewport size
   */
  resize() {
    // This can be expanded to handle responsive behavior beyond CSS
    // For example, adjusting the text length or other dynamic features
  }
  
  /**
   * Position the terminal on the screen
   * @param {string} position - Position ('topleft', 'topright', 'bottomleft', 'bottomright' or specific CSS)
   */
  setPosition(position) {
    const container = document.getElementById(this.containerId);
    if (!container) return;
    
    switch (position) {
      case 'topleft':
        container.style.top = '20px';
        container.style.left = '20px';
        break;
      case 'topright':
        container.style.top = '20px';
        container.style.right = '20px';
        break;
      case 'bottomleft':
        container.style.bottom = '20px';
        container.style.left = '20px';
        break;
      case 'bottomright':
        container.style.bottom = '20px';
        container.style.right = '20px';
        break;
      default:
        // Assume position contains CSS properties
        // e.g. "top: 50px; left: 100px;"
        const styles = position.split(';');
        styles.forEach(style => {
          if (!style.trim()) return;
          
          const [property, value] = style.split(':');
          if (property && value) {
            container.style[property.trim()] = value.trim();
          }
        });
    }
  }
}

// Create and export singleton instance
const lttTerminal = new LoopTrackingTerminal();
export default lttTerminal;
