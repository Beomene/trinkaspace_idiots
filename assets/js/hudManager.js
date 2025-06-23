// hudManager.js - Manages HUD components for Arena 3
import { ViewportGeometry } from './tertiaryArena.js';

export class HUDManager {
  constructor(options = {}) {
    this.options = {
      opacity: 0.7,
      baseColor: 'rgba(20, 20, 30, 0.6)',
      textColor: '#ACABBB',
      borderColor: 'rgba(42, 255, 247, 0.3)',
      zIndex: 2100, // Above Arena 3A menu (2000)
      animationDuration: 300,
      hudLayout: 'WIDE', // Royal Alpha HUD layout (WIDE or NARROW)
      cuc: 1, // Royal Alpha Coordinate Unifying Coefficient
      ...options
    };
    
    this.container = null;
    this.elements = new Map();
    this.activeHUD = null;
    this.scrollProgress = 0;
    this.keyboardNavigationInitialized = false;
    
    // Initialize the HUD container
    this.init();
  }
  
  init() {
    // Create HUD container if it doesn't exist
    if (!document.getElementById('arena-hud')) {
      this.container = document.createElement('div');
      this.container.id = 'arena-hud';
      this.container.className = 'arena-hud';
      document.body.appendChild(this.container);
      
      // Add a class to body for HUD layout styling
      document.body.classList.add(`hud-layout-${this.options.hudLayout.toLowerCase()}`);
      
      // Set up event listeners
      this.setupEventListeners();
    } else {
      this.container = document.getElementById('arena-hud');
    }
    
    console.log('[HUDManager] Initialized with layout:', this.options.hudLayout);
  }
  
  setupEventListeners() {
    // Listen for scroll events to update progress
    window.addEventListener('scroll', () => {
      this.updateScrollProgress();
    }, { passive: true });
    
    // Listen for window resize events
    window.addEventListener('resize', () => {
      this.repositionElements();
    });
  }
  
  updateScrollProgress() {
    // Calculate scroll percentage
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = Math.min(100, Math.max(0, (window.scrollY / scrollHeight) * 100));
    
    // Update progress bar if it exists
    this.updateElement('progress-indicator', `
      <div class="hud-progress">
        <div class="hud-progress-bar" style="width: ${this.scrollProgress}%"></div>
      </div>
    `);
  }
  
  repositionElements() {
    // Reposition all elements based on current viewport
    this.elements.forEach((value, id) => {
      const { element, options } = value;
      const positionStyles = this.getPositionStyles(options.position);
      element.style.cssText += `;${positionStyles}`;
    });
  }
  
  loadHUD(config) {
    console.log('[HUDManager] Loading HUD with config:', config);
    
    // Clear any existing HUD elements
    this.clearHUD();
    
    // Set active HUD
    this.activeHUD = config.id;
    
    // Apply layout if specified
    if (config.layout) {
      this.options.hudLayout = config.layout;
      document.body.classList.remove('hud-layout-wide', 'hud-layout-narrow');
      document.body.classList.add(`hud-layout-${this.options.hudLayout.toLowerCase()}`);
    }
    
    // Create elements defined in the config
    if (config.elements && Array.isArray(config.elements)) {
      config.elements.forEach(elementConfig => {
        this.createElement(
          elementConfig.id, 
          { 
            ...elementConfig,
            content: this.getContentForElement(elementConfig)
          }
        );
      });
    }
    
    // Initialize progress indicator
    this.updateScrollProgress();

    // Initialize keyboard navigation for HUD if not already done
    this.initKeyboardNavigation();
    
    return true;
  }
  
  getContentForElement(elementConfig) {
    // Generate content based on element type
    switch (elementConfig.type) {
      case 'text':
        return `<div class="hud-text hud-${elementConfig.id}">${elementConfig.content}</div>`;
        
      case 'progress':
        return `
          <div class="hud-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${this.scrollProgress}">
            <div class="hud-progress-bar" style="width: ${this.scrollProgress}%"></div>
          </div>
        `;
        
      case 'controls':
        let buttonsHTML = '';
        
        if (elementConfig.buttons && Array.isArray(elementConfig.buttons)) {
          buttonsHTML = elementConfig.buttons.map(button => {
            return `
              <div class="hud-button" 
                   data-action="${button.action}" 
                   aria-label="${button.tooltip}"
                   role="button"
                   tabindex="0">
                <img src="assets/UI/graphics/${button.icon}.png" alt="${button.tooltip}">
                <div class="hud-tooltip">${button.tooltip}</div>
              </div>
            `;
          }).join('');
        }
        
        return `<div class="hud-nav-controls" role="toolbar" aria-label="Navigation Controls">${buttonsHTML}</div>`;
        
      default:
        return elementConfig.content || '';
    }
  }
  
  clearHUD() {
    // Remove all elements
    this.elements.forEach((value, id) => {
      this.removeElement(id);
    });
    
    this.activeHUD = null;
  }
  
  createElement(id, options = {}) {
    // Merge with default options
    const mergedOptions = {
      position: 'top-right',
      showBackground: true,
      showBorder: true,
      width: 'auto',
      height: 'auto',
      padding: '10px',
      interactive: true,
      ...options
    };
    
    // Create element
    const element = document.createElement('div');
    element.id = `hud-element-${id}`;
    element.className = 'arena-hud-element';
    element.setAttribute('data-hud-id', id);
    
    // Add role for accessibility when relevant
    if (id === 'navigation-controls') {
      element.setAttribute('role', 'navigation');
    } else if (id === 'chapter-title') {
      element.setAttribute('role', 'heading');
      element.setAttribute('aria-level', '1');
    }
    
    // Make element focusable if it contains interactive elements
    if (mergedOptions.interactive) {
      element.setAttribute('tabindex', '0');
    }
    
    // Get position styles
    const positionStyles = this.getPositionStyles(mergedOptions.position);
    
    // Generate base styles
    let stylesArray = [
      `position: absolute`,
      positionStyles,
      `width: ${mergedOptions.width || this.options.width}`,
      `height: ${mergedOptions.height || this.options.height}`,
      `padding: ${mergedOptions.padding || this.options.padding}`,
      `color: ${mergedOptions.textColor || this.options.textColor}`,
      `transition: all ${mergedOptions.animationDuration || this.options.animationDuration}ms ease`,
      `font-family: 'Noto Sans', sans-serif`,
      `font-size: 0.9rem`,
      `line-height: 1.4`,
      `pointer-events: ${mergedOptions.interactive ? 'auto' : 'none'}`
    ];
    
    // Conditional styles
    if (mergedOptions.showBackground) {
      stylesArray.push(`background: ${mergedOptions.baseColor || this.options.baseColor}`);
      stylesArray.push('backdrop-filter: blur(4px)');
    }
    
    if (mergedOptions.showBorder) {
      stylesArray.push(`border: 1px solid ${mergedOptions.borderColor || this.options.borderColor}`);
      stylesArray.push('border-radius: 6px');
      stylesArray.push(`box-shadow: 0 0 10px rgba(42, 255, 247, 0.2)`);
    }
    
    // Apply all styles
    element.style.cssText = stylesArray.join('; ');
    
    // Set content
    if (mergedOptions.content) {
      element.innerHTML = mergedOptions.content;
    }
    
    // Add to DOM
    this.container.appendChild(element);
    
    // Store reference
    this.elements.set(id, { 
      element, 
      options: mergedOptions 
    });
    
    // Set up button interactions
    this._setupButtonInteractions(element);
    
    return element;
  }
  
  _setupButtonInteractions(element) {
    const buttons = element.querySelectorAll('.hud-button');
    
    buttons.forEach(button => {
      const action = button.getAttribute('data-action');
      
      if (!action) return;
      
      // Add click handler
      button.addEventListener('click', () => {
        this._executeHUDAction(action, button);
      });

      // Add keyboard handler
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this._executeHUDAction(action, button);
        }
      });
    });
  }
  
  _executeHUDAction(action, button) {
    console.log(`[HUDManager] Executing action: ${action}`);
    
    switch (action) {
      case 'toggleMenu':
        // Dispatch a custom event for menu toggle
        window.dispatchEvent(new CustomEvent('hudToggleMenu'));
        break;
        
      case 'toggleSound':
        // Toggle sound on/off
        const isSoundOn = button.querySelector('img').src.includes('sound-on.png');
        button.querySelector('img').src = `assets/UI/graphics/sound-${isSoundOn ? 'off' : 'on'}.png`;
        button.querySelector('.hud-tooltip').textContent = `Turn Sound ${isSoundOn ? 'On' : 'Off'}`;
        
        // Update ARIA label
        button.setAttribute('aria-label', `Turn Sound ${isSoundOn ? 'On' : 'Off'}`);
        
        // Dispatch a custom event for sound toggle
        window.dispatchEvent(new CustomEvent('hudToggleSound', { detail: { soundEnabled: !isSoundOn }}));
        break;
      
      default:
        // Dispatch a custom event for other actions
        window.dispatchEvent(new CustomEvent('hudAction', { detail: { action }}));
    }
  }
  
  updateElement(id, content) {
    if (!this.elements.has(id)) return false;
    
    const { element } = this.elements.get(id);
    element.innerHTML = content;
    
    // If it's a progress indicator, update the ARIA value
    if (id === 'progress-indicator') {
      const progressbar = element.querySelector('[role="progressbar"]');
      if (progressbar) {
        progressbar.setAttribute('aria-valuenow', this.scrollProgress);
      }
    }
    
    // Set up button interactions again
    this._setupButtonInteractions(element);
    
    return true;
  }
  
  removeElement(id) {
    if (!this.elements.has(id)) return false;
    
    const { element } = this.elements.get(id);
    this.container.removeChild(element);
    this.elements.delete(id);
    
    return true;
  }
  
  getPositionStyles(position) {
    // Default layout is WIDE which uses different positioning
    const isWide = this.options.hudLayout === 'WIDE';
    let styles = '';
    
    switch (position) {
      case 'top-left':
        styles = isWide ? 'top: 20px; left: 20px;' : 'top: 20px; left: 20px;';
        break;
      case 'top-center':
        styles = isWide ? 'top: 20px; left: 50%; transform: translateX(-50%);' : 'top: 20px; left: 50%; transform: translateX(-50%);';
        break;
      case 'top-right':
        styles = isWide ? 'top: 20px; right: 20px;' : 'top: 20px; right: 20px;';
        break;
      case 'middle-left':
        styles = isWide ? 'top: 50%; left: 20px; transform: translateY(-50%);' : 'top: 50%; left: 20px; transform: translateY(-50%);';
        break;
      case 'middle-center':
        styles = isWide ? 'top: 50%; left: 50%; transform: translate(-50%, -50%);' : 'top: 50%; left: 50%; transform: translate(-50%, -50%);';
        break;
      case 'middle-right':
        styles = isWide ? 'top: 50%; right: 20px; transform: translateY(-50%);' : 'top: 50%; right: 20px; transform: translateY(-50%);';
        break;
      case 'bottom-left':
        styles = isWide ? 'bottom: 20px; left: 20px;' : 'bottom: 80px; left: 20px;';
        break;
      case 'bottom-center':
        styles = isWide ? 'bottom: 20px; left: 50%; transform: translateX(-50%);' : 'bottom: 20px; left: 50%; transform: translateX(-50%);';
        break;
      case 'bottom-right':
        styles = isWide ? 'bottom: 20px; right: 20px;' : 'bottom: 80px; right: 20px;';
        break;
      default:
        styles = 'top: 20px; right: 20px;';
    }
    
    return styles;
  }

  /**
   * Initialize keyboard navigation for HUD elements
   */
  async initKeyboardNavigation() {
    if (this.keyboardNavigationInitialized) return;

    try {
      // Dynamically import the keyboard navigation module
      const keyboardNavModule = await import('./keyboardNavigation.js');
      const keyboardNavigation = keyboardNavModule.default;
      
      // Set up HUD navigation
      keyboardNavigation.setupHUDNavigation(this);
      
      // Register specific HUD shortcuts
      this._registerHUDShortcuts(keyboardNavigation);
      
      this.keyboardNavigationInitialized = true;
      console.log('[HUDManager] Keyboard navigation initialized');
    } catch (err) {
      console.error('[HUDManager] Error initializing keyboard navigation:', err);
    }
  }

  /**
   * Register specific shortcuts for HUD actions
   * @param {Object} keyboardNavigation - The keyboard navigation manager
   * @private
   */
  _registerHUDShortcuts(keyboardNavigation) {
    // Toggle HUD visibility with "H" key
    keyboardNavigation.registerShortcut('h', () => {
      this.container.style.display = this.container.style.display === 'none' ? 'block' : 'none';
    }, 'Toggle HUD Visibility');
  }
}

// Export the initialization function to create the HUD manager
export function initHUDManager(options = {}) {
  return new HUDManager(options);
}
