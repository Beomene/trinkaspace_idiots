/**
 * Cursor Chase Effect
 * 
 * This module allows elements to gently chase or react to the user's cursor position.
 * Elements can be configured with different behaviors:
 * - chase: Element follows the cursor with configurable delay and intensity
 * - flee: Element moves away from the cursor
 * - hover: Element hovers around its original position based on cursor
 */

export class CursorChase {
  constructor(options = {}) {
    // Default configuration
    this.config = {
      intensity: options.intensity || 0.05,  // Movement intensity (0-1)
      delay: options.delay || 0.1,           // Movement delay (higher = more lag)
      maxDistance: options.maxDistance || 100, // Maximum travel distance from origin in px
      behavior: options.behavior || 'chase', // 'chase', 'flee', or 'hover'
      activeClass: options.activeClass || 'cursor-chase-active',
      hoverDistance: options.hoverDistance || 200, // Distance at which elements start responding
      respectBounds: options.respectBounds !== false, // Keep elements within viewport
      mode: options.mode || 'transform'      // 'transform' or 'position'
    };
    
    // Track all elements managed by this instance
    this.elements = new Map();
    
    // Track mouse position
    this.mouseX = 0;
    this.mouseY = 0;
    
    // Track if system is active
    this.active = false;
    
    // Initialize
    this.init();
  }
  
  /**
   * Initialize the cursor chase system
   */
  init() {
    // Set up mouse tracking
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    
    // Set up animation loop
    this.startAnimationLoop();
    
    console.log('🐁 Cursor Chase initialized');
  }
  
  /**
   * Handle mouse movement
   * @param {MouseEvent} event - The mouse event
   */
  handleMouseMove(event) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }
  
  /**
   * Start the animation loop
   */
  startAnimationLoop() {
    if (!this.active) {
      this.active = true;
      this.lastFrame = performance.now();
      requestAnimationFrame(this.animate.bind(this));
    }
  }
  
  /**
   * Animation loop
   * @param {number} timestamp - Current time
   */
  animate(timestamp) {
    if (!this.active) return;
    
    // Calculate delta time for smoother animation
    const deltaTime = (timestamp - this.lastFrame) / 16; // Normalize to ~60fps
    this.lastFrame = timestamp;
    
    // Update all elements
    this.elements.forEach((data, element) => {
      this.updateElement(element, data, deltaTime);
    });
    
    // Continue animation loop
    requestAnimationFrame(this.animate.bind(this));
  }
  
  /**
   * Update a specific element's position based on cursor
   * @param {HTMLElement} element - The element to update
   * @param {Object} data - Element data including original position
   * @param {number} deltaTime - Time since last frame (normalized)
   */
  updateElement(element, data, deltaTime) {
    const rect = element.getBoundingClientRect();
    const elementCenterX = rect.left + rect.width / 2;
    const elementCenterY = rect.top + rect.height / 2;
    
    // Calculate distance from mouse to element center
    const distanceX = this.mouseX - elementCenterX;
    const distanceY = this.mouseY - elementCenterY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // Check if mouse is within hover distance
    if (distance > this.config.hoverDistance) {
      // Reset element position with easing when out of range
      data.currentX += (0 - data.currentX) * this.config.delay * deltaTime;
      data.currentY += (0 - data.currentY) * this.config.delay * deltaTime;
    } else {
      // Calculate movement based on behavior
      let targetX = 0;
      let targetY = 0;
      
      // Apply intensity and distance factors
      const intensityFactor = this.config.intensity * (1 - Math.min(1, distance / this.config.hoverDistance));
      
      switch (this.config.behavior) {
        case 'chase':
          // Move toward cursor
          targetX = distanceX * intensityFactor;
          targetY = distanceY * intensityFactor;
          break;
          
        case 'flee':
          // Move away from cursor
          targetX = -distanceX * intensityFactor;
          targetY = -distanceY * intensityFactor;
          break;
          
        case 'hover':
          // Hover around original position based on cursor
          targetX = distanceX * intensityFactor * 0.2;
          targetY = distanceY * intensityFactor * 0.2;
          break;
      }
      
      // Limit distance from original position
      const currentDistance = Math.sqrt(targetX * targetX + targetY * targetY);
      if (currentDistance > this.config.maxDistance) {
        const scale = this.config.maxDistance / currentDistance;
        targetX *= scale;
        targetY *= scale;
      }
      
      // Apply smoothing with delta time
      data.currentX += (targetX - data.currentX) * this.config.delay * deltaTime;
      data.currentY += (targetY - data.currentY) * this.config.delay * deltaTime;
    }
    
    // Apply position to element
    if (this.config.mode === 'transform') {
      element.style.transform = `translate(${data.currentX}px, ${data.currentY}px)`;
    } else {
      element.style.left = `${data.originalLeft + data.currentX}px`;
      element.style.top = `${data.originalTop + data.currentY}px`;
    }
    
    // Apply active class if moving
    if (Math.abs(data.currentX) > 0.5 || Math.abs(data.currentY) > 0.5) {
      element.classList.add(this.config.activeClass);
    } else {
      element.classList.remove(this.config.activeClass);
    }
  }
  
  /**
   * Add an element to be managed by cursor chase
   * @param {HTMLElement} element - The element to add
   * @param {Object} options - Individual element options (overrides global config)
   */
  addElement(element, options = {}) {
    // Combine global config with element-specific options
    const elementConfig = { ...this.config, ...options };
    
    // Store original position
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    
    // Set initial state
    const data = {
      originalLeft: parseFloat(computedStyle.left) || rect.left,
      originalTop: parseFloat(computedStyle.top) || rect.top,
      originalPosition: computedStyle.position,
      currentX: 0,
      currentY: 0,
      config: elementConfig
    };
    
    // Ensure element is positioned
    if (elementConfig.mode === 'position' && 
        computedStyle.position !== 'absolute' && 
        computedStyle.position !== 'fixed') {
      element.style.position = 'relative';
    }
    
    // Add to managed elements
    this.elements.set(element, data);
    
    // Start animation loop if stopped
    this.startAnimationLoop();
    
    // Return chainable instance
    return this;
  }
  
  /**
   * Remove an element from cursor chase management
   * @param {HTMLElement} element - The element to remove
   */
  removeElement(element) {
    if (this.elements.has(element)) {
      // Get original data
      const data = this.elements.get(element);
      
      // Reset styles
      if (this.config.mode === 'transform') {
        element.style.transform = '';
      } else {
        element.style.left = `${data.originalLeft}px`;
        element.style.top = `${data.originalTop}px`;
      }
      
      // Remove active class
      element.classList.remove(this.config.activeClass);
      
      // Remove from managed elements
      this.elements.delete(element);
    }
    
    // Stop animation if no elements left
    if (this.elements.size === 0) {
      this.active = false;
    }
    
    // Return chainable instance
    return this;
  }
  
  /**
   * Apply cursor chase behavior to elements matching a selector
   * @param {string} selector - CSS selector for elements
   * @param {Object} options - Configuration options
   */
  applyToSelector(selector, options = {}) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      this.addElement(element, options);
    });
    
    // Return chainable instance
    return this;
  }
}

// Create and export a singleton instance with default settings
const defaultCursorChase = new CursorChase();

export default defaultCursorChase;
