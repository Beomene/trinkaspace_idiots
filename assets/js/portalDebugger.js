/**
 * Portal Page Debug Tools
 * 
 * Provides debugging functionality for the portal page layout
 */

class PortalDebugger {
  constructor() {
    this.debugMode = false;
    this.overlayElements = {};
    this.controlPanel = null;
    this.positionInfo = null;
    this.initialized = false;
    this.activeElement = null;
    this.elementStyles = {};
    
    // Initialize when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', () => this.initialize());
  }
  
  /**
   * Initialize the debugger
   */
  initialize() {
    if (this.initialized) return;
    
    console.log('[PortalDebugger] Initializing debugger tools');
    
    // Add keyboard shortcut to toggle debug mode - Ctrl+Shift+D
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.toggleDebugMode();
      }
    });
    
    // Check for URL parameter to enable debug mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === 'true') {
      this.enableDebugMode();
    }
    
    this.initialized = true;
  }
  
  /**
   * Toggle debug mode on/off
   */
  toggleDebugMode() {
    if (this.debugMode) {
      this.disableDebugMode();
    } else {
      this.enableDebugMode();
    }
  }
  
  /**
   * Enable debug mode
   */
  enableDebugMode() {
    console.log('[PortalDebugger] Enabling debug mode');
    this.debugMode = true;
    
    // Create overlays for key elements
    this.createOverlays();
    
    // Create control panel
    this.createControlPanel();
    
    // Create position info display
    this.createPositionInfo();
    
    // Create overlay for responsive breakpoint visualization
    this.createBreakpointIndicator();
    
    // Log key page metrics
    this.logPageMetrics();
    
    // Add mouseover highlight to all elements
    this.addElementHighlighting();
    
    // Log CSS conflicts
    this.checkCssConflicts();
    
    // Add resize and scroll listeners
    window.addEventListener('resize', () => this.updateDebugInfo());
    window.addEventListener('scroll', () => this.updateDebugInfo());
      // Add body class for additional debug styling
    document.body.classList.add('debug-mode');
      // Log animation performance metrics
    this.logAnimationPerformance();
  }
  
  /**
   * Disable debug mode
   */
  disableDebugMode() {
    console.log('[PortalDebugger] Disabling debug mode');
    this.debugMode = false;
    
    // Remove overlays
    Object.values(this.overlayElements).forEach(el => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    this.overlayElements = {};
    
    // Remove control panel
    if (this.controlPanel && this.controlPanel.parentNode) {
      this.controlPanel.parentNode.removeChild(this.controlPanel);
      this.controlPanel = null;
    }
    
    // Remove position info display
    if (this.positionInfo && this.positionInfo.parentNode) {
      this.positionInfo.parentNode.removeChild(this.positionInfo);
      this.positionInfo = null;
    }
    
    // Remove element highlighting
    document.removeEventListener('mouseover', this.handleMouseOver);
    document.removeEventListener('mouseout', this.handleMouseOut);
    
    // Remove body class
    document.body.classList.remove('debug-mode');
  }
  
  /**
   * Create visual overlays for key page elements
   */
  createOverlays() {
    const elements = {
      portal: document.querySelector('.portal'),
      title: document.querySelector('.trinkatitle-container'),
      buttons: document.querySelector('.portal-buttons-container'),
      footer: document.querySelector('.portal-footer'),
      mainButton: document.querySelector('.main-button'),
      continueButton1: document.querySelector('.continue-button:nth-of-type(1)'),
      continueButton2: document.querySelector('.continue-button:nth-of-type(2)')
    };
    
    // Create overlays for each element
    Object.entries(elements).forEach(([key, element]) => {
      if (!element) return;
      
      // Store original styles
      this.elementStyles[key] = {
        position: element.style.position,
        top: element.style.top,
        left: element.style.left,
        zIndex: element.style.zIndex
      };
      
      // Create overlay
      const overlay = document.createElement('div');
      overlay.className = `debug-overlay debug-${key}`;
      overlay.innerHTML = `<div class="debug-label">${key}</div>`;
      
      // Position overlay over the element
      const rect = element.getBoundingClientRect();
      overlay.style.position = 'absolute';
      overlay.style.top = `${rect.top + window.scrollY}px`;
      overlay.style.left = `${rect.left + window.scrollX}px`;
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;
      overlay.style.backgroundColor = this.getRandomColor(0.2);
      overlay.style.border = `2px dashed ${this.getRandomColor(0.8)}`;
      overlay.style.zIndex = '9999';
      overlay.style.pointerEvents = 'none';
      
      // Add dimensions
      const dimensions = document.createElement('div');
      dimensions.className = 'debug-dimensions';
      dimensions.textContent = `${Math.round(rect.width)}x${Math.round(rect.height)}`;
      dimensions.style.position = 'absolute';
      dimensions.style.bottom = '0';
      dimensions.style.right = '0';
      dimensions.style.background = 'rgba(0,0,0,0.7)';
      dimensions.style.color = '#fff';
      dimensions.style.padding = '2px 5px';
      dimensions.style.fontSize = '10px';
      overlay.appendChild(dimensions);
      
      document.body.appendChild(overlay);
      this.overlayElements[key] = overlay;
    });
  }
  
  /**
   * Create control panel for adjusting elements
   */
  createControlPanel() {
    const panel = document.createElement('div');
    panel.className = 'debug-control-panel';
    panel.style.position = 'fixed';
    panel.style.top = '10px';
    panel.style.left = '10px';
    panel.style.backgroundColor = 'rgba(0,0,0,0.8)';
    panel.style.padding = '10px';
    panel.style.borderRadius = '5px';
    panel.style.zIndex = '10000';
    panel.style.maxHeight = '80vh';
    panel.style.overflowY = 'auto';
    panel.style.color = '#fff';
    panel.style.fontSize = '12px';
    panel.style.width = '300px';
    
    // Add title
    const title = document.createElement('h3');
    title.textContent = 'Portal Page Debugger';
    title.style.marginTop = '0';
    title.style.color = '#2AFFF7';
    panel.appendChild(title);
    
    // Add element selector
    const selector = document.createElement('select');
    selector.style.width = '100%';
    selector.style.marginBottom = '10px';
    selector.style.padding = '5px';
    selector.style.backgroundColor = '#333';
    selector.style.color = '#fff';
    selector.style.border = '1px solid #555';
    selector.style.borderRadius = '3px';
    
    const elements = {
      portal: '.portal',
      title: '.trinkatitle-container',
      buttons: '.portal-buttons-container',
      footer: '.portal-footer',
      mainButton: '.main-button',
      continueButton1: '.continue-button:nth-of-type(1)',
      continueButton2: '.continue-button:nth-of-type(2)'
    };
    
    Object.entries(elements).forEach(([name, selector]) => {
      const option = document.createElement('option');
      option.value = selector;
      option.textContent = name;
      selector.appendChild(option);
    });
    
    panel.appendChild(selector);
    
    // Add position controls
    ['position', 'top', 'left', 'width', 'height', 'zIndex'].forEach(prop => {
      const group = document.createElement('div');
      group.style.marginBottom = '10px';
      
      const label = document.createElement('label');
      label.textContent = prop;
      label.style.display = 'block';
      label.style.marginBottom = '5px';
      group.appendChild(label);
      
      const input = document.createElement('input');
      input.type = 'text';
      input.id = `debug-${prop}`;
      input.style.width = '100%';
      input.style.padding = '5px';
      input.style.backgroundColor = '#333';
      input.style.color = '#fff';
      input.style.border = '1px solid #555';
      input.style.borderRadius = '3px';
      group.appendChild(input);
      
      panel.appendChild(group);
    });
    
    // Add apply button
    const applyBtn = document.createElement('button');
    applyBtn.textContent = 'Apply Changes';
    applyBtn.style.backgroundColor = '#2AFFF7';
    applyBtn.style.color = '#000';
    applyBtn.style.border = 'none';
    applyBtn.style.padding = '8px';
    applyBtn.style.width = '100%';
    applyBtn.style.marginBottom = '10px';
    applyBtn.style.cursor = 'pointer';
    applyBtn.style.borderRadius = '3px';
    
    applyBtn.addEventListener('click', () => {
      const selectedElement = selector.value;
      const element = document.querySelector(selectedElement);
      if (!element) return;
      
      // Apply changes
      ['position', 'top', 'left', 'width', 'height', 'zIndex'].forEach(prop => {
        const value = document.getElementById(`debug-${prop}`).value;
        if (value) {
          element.style[prop] = value;
        }
      });
      
      // Update overlays
      setTimeout(() => this.updateOverlays(), 100);
    });
    
    panel.appendChild(applyBtn);
    
    // Add toggle grid button
    const gridBtn = document.createElement('button');
    gridBtn.textContent = 'Toggle Grid';
    gridBtn.style.backgroundColor = '#6A00FF';
    gridBtn.style.color = '#fff';
    gridBtn.style.border = 'none';
    gridBtn.style.padding = '8px';
    gridBtn.style.width = '100%';
    gridBtn.style.marginBottom = '10px';
    gridBtn.style.cursor = 'pointer';
    gridBtn.style.borderRadius = '3px';
    
    gridBtn.addEventListener('click', () => {
      this.toggleGrid();
    });
    
    panel.appendChild(gridBtn);
    
    // Add info section
    const info = document.createElement('div');
    info.innerHTML = `
      <h4 style="color: #2AFFF7; margin-top: 15px;">Keyboard Shortcuts:</h4>
      <ul style="padding-left: 20px; margin-top: 5px;">
        <li>Ctrl+Shift+D: Toggle debug mode</li>
        <li>Ctrl+Shift+G: Toggle grid</li>
        <li>Hover: Show element info</li>
      </ul>
    `;
    panel.appendChild(info);
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close Debug Panel';
    closeBtn.style.backgroundColor = '#ff4444';
    closeBtn.style.color = '#fff';
    closeBtn.style.border = 'none';
    closeBtn.style.padding = '8px';
    closeBtn.style.width = '100%';
    closeBtn.style.marginTop = '20px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.borderRadius = '3px';
    
    closeBtn.addEventListener('click', () => {
      this.disableDebugMode();
    });
    
    panel.appendChild(closeBtn);
    
    document.body.appendChild(panel);
    this.controlPanel = panel;
    
    // Add selector change event
    selector.addEventListener('change', () => {
      const element = document.querySelector(selector.value);
      if (element) {
        this.populateElementControls(element);
      }
    });
  }
  
  /**
   * Create position info display
   */
  createPositionInfo() {
    const info = document.createElement('div');
    info.className = 'debug-position-info';
    info.style.position = 'fixed';
    info.style.bottom = '10px';
    info.style.right = '10px';
    info.style.backgroundColor = 'rgba(0,0,0,0.8)';
    info.style.padding = '10px';
    info.style.borderRadius = '5px';
    info.style.zIndex = '10000';
    info.style.color = '#fff';
    info.style.fontSize = '12px';
    info.style.maxWidth = '300px';
    
    // Fill with initial data
    info.innerHTML = `
      <h3 style="margin-top: 0; color: #2AFFF7;">Page Info</h3>
      <div id="debug-viewport-size">Viewport: ${window.innerWidth}x${window.innerHeight}</div>
      <div id="debug-scroll-position">Scroll: ${window.scrollX}x${window.scrollY}</div>
      <div id="debug-mouse-position">Mouse: 0,0</div>
      <div id="debug-element-path">Element: None</div>
    `;
    
    document.body.appendChild(info);
    this.positionInfo = info;
    
    // Add mouse move listener for position tracking
    document.addEventListener('mousemove', (e) => {
      if (!this.debugMode) return;
      
      const mouseInfo = document.getElementById('debug-mouse-position');
      if (mouseInfo) {
        mouseInfo.textContent = `Mouse: ${e.clientX},${e.clientY}`;
      }
    });
  }
  
  /**
   * Create overlay for responsive breakpoint visualization
   */
  createBreakpointIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'debug-breakpoint-indicator';
    indicator.style.position = 'fixed';
    indicator.style.bottom = '10px';
    indicator.style.left = '10px';
    indicator.style.padding = '5px 10px';
    indicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    indicator.style.color = '#2AFFF7';
    indicator.style.fontSize = '12px';
    indicator.style.fontFamily = 'monospace';
    indicator.style.borderRadius = '4px';
    indicator.style.zIndex = '9999';
    indicator.style.pointerEvents = 'none';
    
    document.body.appendChild(indicator);
    this.overlayElements.breakpointIndicator = indicator;
    
    this.updateBreakpointIndicator();
    
    // Update on resize
    window.addEventListener('resize', () => this.updateBreakpointIndicator());
  }
  
  /**
   * Update the breakpoint indicator with current viewport info
   */
  updateBreakpointIndicator() {
    const indicator = this.overlayElements.breakpointIndicator;
    if (!indicator) return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = (width / height).toFixed(2);
    
    // Determine current breakpoint
    let breakpoint = '';
    if (width <= 768) breakpoint = 'mobile';
    else if (width <= 1200) breakpoint = 'tablet';
    else if (width <= 1600) breakpoint = 'desktop';
    else breakpoint = 'large-desktop';
    
    // Determine aspect ratio category
    let aspect = '';
    if (aspectRatio < 1) aspect = 'portrait';
    else if (aspectRatio <= 1.33) aspect = '4:3';
    else if (aspectRatio <= 1.78) aspect = '16:9';
    else aspect = 'ultrawide';
    
    indicator.innerHTML = `
      <div><strong>Width:</strong> ${width}px</div>
      <div><strong>Height:</strong> ${height}px</div>
      <div><strong>Aspect:</strong> ${aspectRatio} (${aspect})</div>
      <div><strong>Breakpoint:</strong> ${breakpoint}</div>
    `;
  }
  
  /**
   * Update overlays to match current element positions
   */
  updateOverlays() {
    const elements = {
      portal: document.querySelector('.portal'),
      title: document.querySelector('.trinkatitle-container'),
      buttons: document.querySelector('.portal-buttons-container'),
      footer: document.querySelector('.portal-footer'),
      mainButton: document.querySelector('.main-button'),
      continueButton1: document.querySelector('.continue-button:nth-of-type(1)'),
      continueButton2: document.querySelector('.continue-button:nth-of-type(2)')
    };
    
    // Update overlays for each element
    Object.entries(elements).forEach(([key, element]) => {
      if (!element || !this.overlayElements[key]) return;
      
      const overlay = this.overlayElements[key];
      const rect = element.getBoundingClientRect();
      
      overlay.style.top = `${rect.top + window.scrollY}px`;
      overlay.style.left = `${rect.left + window.scrollX}px`;
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;
      
      // Update dimensions
      const dimensions = overlay.querySelector('.debug-dimensions');
      if (dimensions) {
        dimensions.textContent = `${Math.round(rect.width)}x${Math.round(rect.height)}`;
      }
    });
  }
  
  /**
   * Add element highlighting on mouseover
   */
  addElementHighlighting() {
    this.handleMouseOver = (e) => {
      if (!this.debugMode) return;
      
      const target = e.target;
      if (target === this.activeElement) return;
      
      this.activeElement = target;
      
      // Create highlight
      let highlight = document.querySelector('.debug-hover-highlight');
      if (!highlight) {
        highlight = document.createElement('div');
        highlight.className = 'debug-hover-highlight';
        highlight.style.position = 'absolute';
        highlight.style.pointerEvents = 'none';
        highlight.style.zIndex = '9998';
        highlight.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
        highlight.style.border = '1px solid yellow';
        document.body.appendChild(highlight);
      }
      
      // Position highlight
      const rect = target.getBoundingClientRect();
      highlight.style.top = `${rect.top + window.scrollY}px`;
      highlight.style.left = `${rect.left + window.scrollX}px`;
      highlight.style.width = `${rect.width}px`;
      highlight.style.height = `${rect.height}px`;
      
      // Update element path
      const pathInfo = document.getElementById('debug-element-path');
      if (pathInfo) {
        let elPath = '';
        let current = target;
        while (current && current !== document.body) {
          let elDesc = current.tagName.toLowerCase();
          if (current.id) {
            elDesc += `#${current.id}`;
          } else if (current.className) {
            const classes = Array.from(current.classList).join('.');
            if (classes) {
              elDesc += `.${classes}`;
            }
          }
          elPath = elPath ? `${elDesc} > ${elPath}` : elDesc;
          current = current.parentElement;
        }
        pathInfo.textContent = `Element: ${elPath}`;
      }
    };
    
    this.handleMouseOut = (e) => {
      if (!this.debugMode) return;
      
      this.activeElement = null;
      
      // Remove highlight
      const highlight = document.querySelector('.debug-hover-highlight');
      if (highlight) {
        highlight.style.top = '-9999px';
        highlight.style.left = '-9999px';
      }
    };
    
    document.addEventListener('mouseover', this.handleMouseOver);
    document.addEventListener('mouseout', this.handleMouseOut);
  }
  
  /**
   * Toggle grid overlay
   */
  toggleGrid() {
    let grid = document.querySelector('.debug-grid-overlay');
    
    if (grid) {
      document.body.removeChild(grid);
      return;
    }
    
    grid = document.createElement('div');
    grid.className = 'debug-grid-overlay';
    grid.style.position = 'fixed';
    grid.style.top = '0';
    grid.style.left = '0';
    grid.style.right = '0';
    grid.style.bottom = '0';
    grid.style.zIndex = '9990';
    grid.style.pointerEvents = 'none';
    grid.style.backgroundImage = `
      linear-gradient(to right, rgba(42, 255, 247, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(42, 255, 247, 0.1) 1px, transparent 1px)
    `;
    grid.style.backgroundSize = '100px 100px';
    
    // Add vw/vh guidance lines
    for (let i = 10; i < 100; i += 10) {
      // Vertical lines (vw)
      const vLine = document.createElement('div');
      vLine.style.position = 'fixed';
      vLine.style.top = '0';
      vLine.style.bottom = '0';
      vLine.style.left = `${i}vw`;
      vLine.style.width = '1px';
      vLine.style.backgroundColor = i === 50 ? 'rgba(255, 0, 0, 0.5)' : 'rgba(42, 255, 247, 0.3)';
      vLine.style.zIndex = '9991';
      
      const vLabel = document.createElement('div');
      vLabel.style.position = 'fixed';
      vLabel.style.top = '5px';
      vLabel.style.left = `${i}vw`;
      vLabel.style.transform = 'translateX(-50%)';
      vLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      vLabel.style.color = '#fff';
      vLabel.style.padding = '2px 5px';
      vLabel.style.fontSize = '10px';
      vLabel.style.borderRadius = '3px';
      vLabel.textContent = `${i}vw`;
      vLabel.style.zIndex = '9992';
      
      grid.appendChild(vLine);
      grid.appendChild(vLabel);
      
      // Horizontal lines (vh)
      const hLine = document.createElement('div');
      hLine.style.position = 'fixed';
      hLine.style.left = '0';
      hLine.style.right = '0';
      hLine.style.top = `${i}vh`;
      hLine.style.height = '1px';
      hLine.style.backgroundColor = i === 50 ? 'rgba(255, 0, 0, 0.5)' : 'rgba(42, 255, 247, 0.3)';
      hLine.style.zIndex = '9991';
      
      const hLabel = document.createElement('div');
      hLabel.style.position = 'fixed';
      hLabel.style.left = '5px';
      hLabel.style.top = `${i}vh`;
      hLabel.style.transform = 'translateY(-50%)';
      hLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      hLabel.style.color = '#fff';
      hLabel.style.padding = '2px 5px';
      hLabel.style.fontSize = '10px';
      hLabel.style.borderRadius = '3px';
      hLabel.textContent = `${i}vh`;
      hLabel.style.zIndex = '9992';
      
      grid.appendChild(hLine);
      grid.appendChild(hLabel);
    }
    
    document.body.appendChild(grid);
  }
  
  /**
   * Update debug information displays
   */
  updateDebugInfo() {
    if (!this.debugMode) return;
    
    // Update position info
    const viewportInfo = document.getElementById('debug-viewport-size');
    if (viewportInfo) {
      viewportInfo.textContent = `Viewport: ${window.innerWidth}x${window.innerHeight}`;
    }
    
    const scrollInfo = document.getElementById('debug-scroll-position');
    if (scrollInfo) {
      scrollInfo.textContent = `Scroll: ${Math.round(window.scrollX)}x${Math.round(window.scrollY)}`;
    }
    
    // Update overlays
    this.updateOverlays();
  }
  
  /**
   * Fill form controls with element's current style values
   * @param {HTMLElement} element - The element to read styles from
   */
  populateElementControls(element) {
    if (!element) return;
    
    const computedStyle = window.getComputedStyle(element);
    
    ['position', 'top', 'left', 'width', 'height', 'zIndex'].forEach(prop => {
      const input = document.getElementById(`debug-${prop}`);
      if (input) {
        input.value = computedStyle[prop];
      }
    });
  }
  
  /**
   * Log basic page metrics to console
   */
  logPageMetrics() {
    console.log('---------- PORTAL PAGE METRICS ----------');
    console.log(`Viewport size: ${window.innerWidth}x${window.innerHeight}`);
    console.log(`Device pixel ratio: ${window.devicePixelRatio}`);
    console.log(`Document height: ${document.body.scrollHeight}px`);
    
    // Log key element metrics
    const elements = {
      portal: document.querySelector('.portal'),
      title: document.querySelector('.trinkatitle-container'),
      buttons: document.querySelector('.portal-buttons-container'),
      footer: document.querySelector('.portal-footer'),
      mainButton: document.querySelector('.main-button'),
      continueButton1: document.querySelector('.continue-button:nth-of-type(1)'),
      continueButton2: document.querySelector('.continue-button:nth-of-type(2)')
    };
    
    Object.entries(elements).forEach(([key, element]) => {
      if (!element) return;
      
      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element);
      
      console.log(`\n${key} metrics:`);
      console.log(`- Size: ${Math.round(rect.width)}x${Math.round(rect.height)}`);
      console.log(`- Position: left=${Math.round(rect.left)}, top=${Math.round(rect.top)}`);
      console.log(`- Style position: ${computedStyle.position}`);
      console.log(`- Style top: ${computedStyle.top}`);
      console.log(`- Style left: ${computedStyle.left}`);
      console.log(`- Z-Index: ${computedStyle.zIndex}`);
      console.log(`- Display: ${computedStyle.display}`);
      console.log(`- Visibility: ${computedStyle.visibility}`);
      console.log(`- Overflow: ${computedStyle.overflow}`);
    });
    
    console.log('---------------------------------------');
  }
  
  /**
   * Check for CSS conflicts and specificity issues
   */
  checkCssConflicts() {
    console.log('---------- CHECKING CSS CONFLICTS ----------');
    
    const elements = {
      portal: document.querySelector('.portal'),
      title: document.querySelector('.trinkatitle-container'),
      buttons: document.querySelector('.portal-buttons-container'),
      footer: document.querySelector('.portal-footer'),
      mainButton: document.querySelector('.main-button'),
      continueButton1: document.querySelector('.continue-button:nth-of-type(1)'),
      continueButton2: document.querySelector('.continue-button:nth-of-type(2)')
    };
    
    Object.entries(elements).forEach(([key, element]) => {
      if (!element) return;
      
      // Check for conflicting position styles
      const position = window.getComputedStyle(element).position;
      console.log(`${key} position: ${position}`);
      
      if (element.hasAttribute('style') && element.style.position) {
        console.log(`- Has inline position: ${element.style.position}`);
      }
      
      // Log all applied CSS rules for position property
      if (window.getMatchedCSSRules) {
        const rules = window.getMatchedCSSRules(element);
        if (rules) {
          console.log(`- Applied CSS rules for position (${rules.length} rules):`);
          for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (rule.style.position) {
              console.log(`  - ${rule.selectorText}: position: ${rule.style.position}`);
            }
          }
        }
      }
    });
    
    console.log('------------------------------------------');
  }
  
  /**
   * Generate a random color with specified opacity
   * @param {number} opacity - Opacity value (0-1)
   * @returns {string} - RGBA color string
   */
  getRandomColor(opacity) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  /**
   * Log animation performance metrics
   */
  logAnimationPerformance() {
    if (!window.performance || !window.performance.timing) {
      console.log('[PortalDebugger] Performance API not supported');
      return;
    }
    
    // Create performance monitor
    const performanceMonitor = document.createElement('div');
    performanceMonitor.className = 'debug-performance-monitor';
    performanceMonitor.style.position = 'fixed';
    performanceMonitor.style.top = '10px';
    performanceMonitor.style.left = '10px';
    performanceMonitor.style.padding = '5px 10px';
    performanceMonitor.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    performanceMonitor.style.color = '#2AFFF7';
    performanceMonitor.style.fontSize = '12px';
    performanceMonitor.style.fontFamily = 'monospace';
    performanceMonitor.style.borderRadius = '4px';
    performanceMonitor.style.zIndex = '9999';
    
    document.body.appendChild(performanceMonitor);
    this.overlayElements.performanceMonitor = performanceMonitor;
    
    // Track frame rate
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 0;
    
    const updateFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      const elapsedTime = currentTime - lastTime;
      
      if (elapsedTime >= 1000) { // Update every second
        fps = Math.round((frameCount * 1000) / elapsedTime);
        frameCount = 0;
        lastTime = currentTime;
        
        // Update display
        this.updatePerformanceInfo(fps);
      }
      
      if (this.debugMode) {
        requestAnimationFrame(updateFPS);
      }
    };
    
    requestAnimationFrame(updateFPS);
    
    // Log initial page load time
    const loadTime = (window.performance.timing.loadEventEnd - window.performance.timing.navigationStart) / 1000;
    console.log(`[PortalDebugger] Page load time: ${loadTime.toFixed(2)}s`);
  }
  
  /**
   * Update performance information display
   */
  updatePerformanceInfo(fps) {
    const monitor = this.overlayElements.performanceMonitor;
    if (!monitor) return;
    
    // Color code based on performance
    let fpsColor = '#2AFFF7'; // Good (default)
    if (fps < 30) fpsColor = '#FF5555'; // Poor
    else if (fps < 50) fpsColor = '#FFAA00'; // Warning
    
    monitor.innerHTML = `
      <div><strong>FPS:</strong> <span style="color: ${fpsColor}">${fps}</span></div>
      <div><strong>Animations:</strong> ${document.getAnimations().length}</div>
    `;
  }
}

// Create and export singleton instance
const portalDebugger = new PortalDebugger();
export default portalDebugger;
