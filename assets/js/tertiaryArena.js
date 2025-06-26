// Arena 3A - Tertiary Arena (HUD Layer)
// Sacred viewport positioning and menu systems

// Viewport geometry helper functions with Royal Alpha awareness
export class ViewportGeometry {
  // Get reference to TrinkaspaceEngine for Royal Alpha values
  static get engine() {
    return window.trinkaspaceEngine;
  }
  
  // Center of viewport (ORIGO in viewport coordinates)
  static get vpO() {
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
  }
  
  // Get the pageORIGO from Royal Alpha system
  static get pageORIGO() {
    if (this.engine) {
      return {
        x: this.engine.pageOrigoX,
        y: this.engine.pageOrigoY
      };
    }
    // Fallback if engine not available
    return {
      x: window.innerWidth / 2,
      y: 2000
    };
  }
  
  // Get current CUC from Royal Alpha system
  static get cuc() {
    return this.engine ? this.engine.cuc : 1;
  }

  // Viewport boundaries
  static get vpUPPER() { return 0; }
  static get vpLOWER() { return window.innerHeight; }
  static get vpLEFT() { return 0; }
  static get vpRIGHT() { return window.innerWidth; }

  // Page boundaries with Royal Alpha awareness
  static get pageUPPER() { return 0; }
  static get pageLOWER() { 
    return this.engine ? this.engine.a1Width * 10 : document.body.scrollHeight;
  }
  static get pageLEFT() { return 0; }
  static get pageRIGHT() { return window.innerWidth; }
  // Quadrant helpers (1=upper-right, 2=upper-left, 3=lower-left, 4=lower-right)
  static getQuadrant(quadrantNumber) {
    const vpO = this.vpO;
    
    // Apply Royal Alpha HUD layout adjustments
    const hudLayout = this.engine?.hudLayout || 'WIDE';
    let marginX = 0;
    let marginY = 0;
    
    // If NARROW HUD layout, adjust margins to account for less space
    if (hudLayout === 'NARROW') {
      marginX = vpO.x * 0.2; // 20% inward from edges
      marginY = vpO.y * 0.1; // 10% inward from top/bottom
    }
    
    const quadrants = {
      1: { // Upper-right
        left: vpO.x + marginX,
        top: this.vpUPPER + marginY,
        width: vpO.x - marginX,
        height: vpO.y - marginY
      },
      2: { // Upper-left  
        left: this.vpLEFT + marginX,
        top: this.vpUPPER + marginY,
        width: vpO.x - marginX,
        height: vpO.y - marginY
      },
      3: { // Lower-left
        left: this.vpLEFT + marginX,
        top: vpO.y + marginY,
        width: vpO.x - marginX,
        height: vpO.y - marginY
      },
      4: { // Lower-right
        left: vpO.x + marginX,
        top: vpO.y + marginY,
        width: vpO.x - marginX,
        height: vpO.y - marginY
      }
    };
    return quadrants[quadrantNumber];
  }
}

// Arena 3A Menu System
export class Arena3Menu {  constructor(options = {}) {
    this.options = {
      opacity: 0.3, // Much more transparent
      baseColor: '#888888', // Medium grey
      textColor: '#FFFFFF',
      width: '25vw', // Halfway through quadrants
      zIndex: 2000, // Above Arena 2A (1000)
      animationDuration: 300,
      hudLayout: 'WIDE', // Royal Alpha HUD layout (WIDE or NARROW)
      cuc: 1, // HUD uses actual viewport, not A1 coordinate system
      ...options
    };
    
    this.isOpen = false;
    this.menuElement = null;
    this.overlayElement = null;
    
    // Add a class to body for HUD layout styling
    document.body.classList.add(`hud-layout-${this.options.hudLayout.toLowerCase()}`);
    
    // Set CSS variables for Royal Alpha
    document.documentElement.style.setProperty('--menu-cuc', this.options.cuc);
    
    this.init();
  }

  init() {
    this.createMenuStructure();
    this.setupEventListeners();
    this.setupFullscreenMode();
    
    console.log('[Arena3Menu] Initialized - Sacred HUD layer active');
  }

  createMenuStructure() {
    // Create menu container
    this.menuElement = document.createElement('div');
    this.menuElement.id = 'arena3-menu';
    this.menuElement.className = 'arena3-menu';
    
    // Position in pageLEFT, spanning quadrants 2 & 3
    this.menuElement.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      width: ${this.options.width};
      height: 100vh;
      background: rgba(136, 136, 136, ${this.options.opacity});
      color: ${this.options.textColor};
      z-index: ${this.options.zIndex};
      transform: translateX(-100%);      transition: transform ${this.options.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: none;
      border-right: 2px solid rgba(172, 171, 187, 0.3);
      display: flex;
      flex-direction: column;
      padding: 2rem 0;
      box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
    `;

    // Create menu header
    const header = document.createElement('div');
    header.className = 'arena3-menu-header';
    header.style.cssText = `
      padding: 0 2rem 2rem 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      margin-bottom: 2rem;
    `;    header.innerHTML = ``;

    // Create menu navigation
    const nav = document.createElement('nav');
    nav.className = 'arena3-menu-nav';    nav.style.cssText = `
      flex: 1;
      padding: 0 1rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
    `;// Navigation items with new structure
    const navItems = [
      { 
        label: 'Chapters', 
        submenu: [
          { label: 'I', pages: ['001_001', '001_002'] },
          { label: 'II', pages: ['002_001', '002_002', '002_003', '002_004'] },
          { label: 'III', pages: ['003_001', '003_002', '003_003', '003_004'] }
        ]
      },      { 
        label: 'Gallery',
        submenu: [
          { label: 'Character Voices', action: () => this.navigateToPage('pages/general/voice-demo/index.html') },
          { label: 'Demonic Languages', action: () => this.navigateToPage('pages/general/demon-voices/index.html') },
          { label: 'World Narrators', action: () => this.navigateToPage('pages/general/symscram_demo/index.html') },
          { label: 'Story Integration', action: () => this.navigateToPage('pages/general/story_demo/index.html') }
        ]
      },
      { 
        label: 'About',
        submenu: [
          { label: 'Support the Trinkaloop Saga', action: () => this.navigateToPage('pages/general/support/index.html') },
          { label: 'About the artist', action: () => this.navigateToPage('pages/general/about-artist/index.html') }
        ]
      }
    ];    navItems.forEach((item, index) => {
      const link = document.createElement('a');
      link.href = '#';
      link.className = 'arena3-menu-link';
      link.style.cssText = `
        display: block;
        padding: 1rem 1rem;
        margin: 0.5rem 0;
        color: ${this.options.textColor};
        text-decoration: none;
        border-radius: 8px;
        transition: all 200ms ease;
        border-left: 3px solid transparent;
        font-family: 'Noto Sans', sans-serif;
        font-size: 1rem;
      `;
        link.innerHTML = `
        ${item.label}
        ${item.submenu ? '<span style="float: right;">▶</span>' : ''}
      `;      // Hover effects
      link.addEventListener('mouseenter', () => {
        link.style.backgroundColor = 'rgba(172, 171, 187, 0.1)';
        link.style.borderLeftColor = '#ACABBB';
        link.style.transform = 'translateX(5px)';
      });

      link.addEventListener('mouseleave', () => {
        link.style.backgroundColor = 'transparent';
        link.style.borderLeftColor = 'transparent';
        link.style.transform = 'translateX(0)';
      });

      // Click handling
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (item.submenu) {
          this.toggleSubmenu(link, item.submenu);
        } else if (item.action) {
          item.action();
        } else {
          console.log(`[Arena3Menu] Navigate to: ${item.label}`);
        }
      });

      nav.appendChild(link);
    });

    // Create footer
    const footer = document.createElement('div');
    footer.className = 'arena3-menu-footer';
    footer.style.cssText = `
      padding: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      opacity: 0.6;
      font-size: 0.8rem;
      text-align: center;
    `;
    footer.innerHTML = 'Arena 3A • Tertiary Layer';

    // Assemble menu
    this.menuElement.appendChild(header);
    this.menuElement.appendChild(nav);
    this.menuElement.appendChild(footer);

    // Create overlay
    this.overlayElement = document.createElement('div');
    this.overlayElement.className = 'arena3-overlay';
    this.overlayElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.3);
      z-index: ${this.options.zIndex - 1};
      opacity: 0;
      visibility: hidden;
      transition: all ${this.options.animationDuration}ms ease;
      backdrop-filter: none;
    `;

    // Close on overlay click
    this.overlayElement.addEventListener('click', () => this.close());

    // Add to DOM
    document.body.appendChild(this.overlayElement);
    document.body.appendChild(this.menuElement);
  }

  setupEventListeners() {
    // Menu toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'arena3-menu-toggle';
    toggleButton.className = 'arena3-menu-toggle';    // Use Royal Alpha HUD layout to position the toggle
    const hudSpacing = this.options.hudLayout === 'NARROW' ? '1rem' : '2rem';
    const buttonSize = this.options.hudLayout === 'NARROW' ? 40 : 50;
    const fontSize = this.options.hudLayout === 'NARROW' ? '1.2rem' : '1.5rem';
    
    toggleButton.style.cssText = `
      position: fixed;
      top: ${hudSpacing};
      left: ${hudSpacing};
      z-index: ${this.options.zIndex + 1};
      background: rgba(136, 136, 136, 0.8);
      border: 2px solid rgba(172, 171, 187, 0.5);
      color: #ACABBB;
      width: ${buttonSize}px;
      height: ${buttonSize}px;
      border-radius: 50%;
      cursor: pointer;
      font-size: ${fontSize};
      transition: all 200ms ease;
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    toggleButton.innerHTML = '☰';
    toggleButton.title = 'Open Menu (Arena 3A)';    toggleButton.addEventListener('mouseenter', () => {
      toggleButton.style.background = 'rgba(172, 171, 187, 0.2)';
      toggleButton.style.transform = 'scale(1.1)';
    });

    toggleButton.addEventListener('mouseleave', () => {
      toggleButton.style.background = 'rgba(136, 136, 136, 0.8)';
      toggleButton.style.transform = 'scale(1)';
    });

    toggleButton.addEventListener('click', () => this.toggle());

    document.body.appendChild(toggleButton);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
      if (e.key === 'm' && e.ctrlKey) {
        e.preventDefault();
        this.toggle();
      }
      if (e.key === 'F11') {
        e.preventDefault();
        this.toggleFullscreen();
      }
    });
  }

  setupFullscreenMode() {
    // Fullscreen mode functionality
    this.isFullscreen = false;
  }

  open() {
    this.isOpen = true;
    this.menuElement.style.transform = 'translateX(0)';
    this.overlayElement.style.opacity = '1';
    this.overlayElement.style.visibility = 'visible';
    
    // Update toggle button
    const toggleBtn = document.getElementById('arena3-menu-toggle');
    if (toggleBtn) {
      toggleBtn.innerHTML = '✕';
      toggleBtn.title = 'Close Menu';
    }

    console.log('[Arena3Menu] Opened - Sacred navigation revealed');
  }

  close() {
    this.isOpen = false;
    this.menuElement.style.transform = 'translateX(-100%)';
    this.overlayElement.style.opacity = '0';
    this.overlayElement.style.visibility = 'hidden';

    // Update toggle button
    const toggleBtn = document.getElementById('arena3-menu-toggle');
    if (toggleBtn) {
      toggleBtn.innerHTML = '☰';
      toggleBtn.title = 'Open Menu (Arena 3A)';
    }

    console.log('[Arena3Menu] Closed - Returning to content');
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        this.isFullscreen = true;
        console.log('[Arena3Menu] Entered fullscreen - Total immersion mode');
      });
    } else {
      document.exitFullscreen().then(() => {
        this.isFullscreen = false;
        console.log('[Arena3Menu] Exited fullscreen');
      });
    }
  }

  toggleSubmenu(parentLink, submenuItems) {
    // Check if submenu already exists
    const existingSubmenu = parentLink.nextElementSibling;
    if (existingSubmenu && existingSubmenu.classList.contains('arena3-submenu')) {
      // Toggle existing submenu
      const isVisible = existingSubmenu.style.display !== 'none';
      existingSubmenu.style.display = isVisible ? 'none' : 'block';
      const arrow = parentLink.querySelector('span[style*="float: right"]');
      if (arrow) arrow.textContent = isVisible ? '▶' : '▼';
      return;
    }

    // Create new submenu
    const submenu = document.createElement('div');
    submenu.className = 'arena3-submenu';
    submenu.style.cssText = `
      background: rgba(0, 0, 0, 0.3);
      margin-left: 1rem;
      border-radius: 5px;
      border-left: 2px solid #2AFFF7;
      padding: 0.5rem 0;
    `;

    submenuItems.forEach(subItem => {
      const subLink = document.createElement('a');
      subLink.href = '#';
      subLink.style.cssText = `
        display: block;
        padding: 0.75rem 1rem;
        color: ${this.options.textColor};
        text-decoration: none;
        font-size: 0.9rem;
        transition: all 200ms ease;
        opacity: 0.8;
      `;
      
      subLink.innerHTML = `
        <span style="margin-right: 0.5rem;">${subItem.icon}</span>
        ${subItem.label}
      `;

      subLink.addEventListener('mouseenter', () => {
        subLink.style.backgroundColor = 'rgba(42, 255, 247, 0.1)';
        subLink.style.opacity = '1';
      });

      subLink.addEventListener('mouseleave', () => {
        subLink.style.backgroundColor = 'transparent';
        subLink.style.opacity = '0.8';
      });

      subLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (subItem.action) {
          subItem.action();
        } else if (subItem.pages) {
          // Handle chapter pages
          this.showChapterPages(subItem.label, subItem.pages);
        }
      });

      submenu.appendChild(subLink);
    });

    // Insert submenu after parent link
    parentLink.parentNode.insertBefore(submenu, parentLink.nextSibling);
    
    // Update arrow
    const arrow = parentLink.querySelector('span[style*="float: right"]');
    if (arrow) arrow.textContent = '▼';
  }

  showChapterPages(chapterName, pages) {
    console.log(`[Arena3Menu] Show pages for Chapter ${chapterName}:`, pages);
    // For now, navigate to first page
    if (pages.length > 0) {
      const chapterNum = chapterName === 'I' ? '1' : chapterName === 'II' ? '2' : '3';
      location.href = `pages/CHAPTER_${chapterNum}/${pages[0]}/index.html`;
    }
  }

  navigateToPage(relativePath) {
    // Calculate the correct path based on current location
    const currentPath = window.location.pathname;
    let basePath = '';
    
    // Determine how many levels deep we are
    if (currentPath.includes('/CHAPTER_')) {
      basePath = '../../../'; // From chapter pages
    } else if (currentPath.includes('/general/')) {
      basePath = '../../../'; // From general pages
    } else {
      basePath = ''; // From root
    }
    
    location.href = basePath + relativePath;
  }
}

// Easy initialization function
export function initArena3Menu(options = {}) {
  return new Arena3Menu(options);
}

// Arena 3B - HUD System with Royal Alpha awareness
export class ArenaHUD {
  constructor(options = {}) {
    this.options = {
      opacity: 0.7,
      baseColor: 'rgba(20, 20, 30, 0.6)',
      textColor: '#ACABBB',
      borderColor: 'rgba(42, 255, 247, 0.3)',
      zIndex: 2100, // Above Arena 3A menu (2000)
      animationDuration: 300,
      position: 'top-right', // Default position
      padding: '12px',
      width: 'auto',
      height: 'auto',
      showBorder: true,
      showBackground: true,
      hudLayout: 'WIDE', // Royal Alpha HUD layout (WIDE or NARROW)
      cuc: 1, // HUD uses actual viewport, not A1 coordinate system
      ...options
    };
    
    // Add a class to body for HUD layout styling
    document.body.classList.add(`hud-layout-${this.options.hudLayout.toLowerCase()}`);
    
    // Set CSS variables for Royal Alpha
    document.documentElement.style.setProperty('--hud-cuc', this.options.cuc);
    
    this.elements = new Map(); // Store all HUD elements by ID
    this.container = null;
    
    this.init();
  }
  
  init() {
    // Create container for all HUD elements if it doesn't exist
    let hudContainer = document.getElementById('arena3-hud-container');
    if (!hudContainer) {
      hudContainer = document.createElement('div');
      hudContainer.id = 'arena3-hud-container';
      hudContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: ${this.options.zIndex};
      `;
      document.body.appendChild(hudContainer);
    }
    
    this.container = hudContainer;
    console.log('[ArenaHUD] Initialized - Sacred HUD layer active');
  }
  
  /**
   * Create a new HUD element
   * @param {string} id - Unique identifier for this HUD element
   * @param {Object} options - Configuration options
   * @param {string} options.position - Position on screen: top-left, top-center, top-right, 
   *                                    center-left, center, center-right,
   *                                    bottom-left, bottom-center, bottom-right
   *                                    or 'custom' for manual positioning
   * @param {string} options.content - HTML content for the HUD element
   * @param {string} options.width - Width of the element (CSS value)
   * @param {string} options.height - Height of the element (CSS value)
   * @param {boolean} options.showBorder - Whether to show a border
   * @param {boolean} options.showBackground - Whether to show a background
   * @param {boolean} options.interactive - Whether the element should receive mouse events
   * @param {Function} options.onUpdate - Callback function that returns content for automatic updates
   * @param {number} options.updateInterval - Update interval in ms (if onUpdate is provided)
   * @param {Object} options.customPosition - Custom positioning properties if position='custom'
   * @returns {HTMLElement} The created HUD element
   */
  addElement(id, options = {}) {
    // Remove existing element with the same ID if it exists
    this.removeElement(id);
    
    const mergedOptions = {
      ...this.options,
      ...options
    };
    
    const element = document.createElement('div');
    element.id = `arena3-hud-${id}`;
    element.className = 'arena3-hud-element';
    element.dataset.hudId = id;
    
    // Position the element
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
    }
    
    // Apply all styles
    element.style.cssText = stylesArray.join(';');
    
    // Add content
    if (mergedOptions.content) {
      element.innerHTML = mergedOptions.content;
    }
    
    // Add to container
    this.container.appendChild(element);
    this.elements.set(id, {
      element,
      options: mergedOptions
    });
    
    // Set up updates if callback provided
    if (typeof mergedOptions.onUpdate === 'function' && mergedOptions.updateInterval) {
      const intervalId = setInterval(() => {
        const newContent = mergedOptions.onUpdate();
        if (newContent !== null) {
          element.innerHTML = newContent;
        }
      }, mergedOptions.updateInterval);
      
      // Store interval ID for cleanup
      element.dataset.intervalId = intervalId;
    }
    
    return element;
  }
  
  /**
   * Remove a HUD element by ID
   * @param {string} id - ID of the element to remove
   */
  removeElement(id) {
    if (this.elements.has(id)) {
      const { element } = this.elements.get(id);
      
      // Clear any update interval
      if (element.dataset.intervalId) {
        clearInterval(Number(element.dataset.intervalId));
      }
      
      // Remove from DOM
      element.remove();
      this.elements.delete(id);
      return true;
    }
    return false;
  }
  
  /**
   * Update an existing HUD element's content
   * @param {string} id - ID of the element to update
   * @param {string} content - New HTML content
   */
  updateElement(id, content) {
    if (this.elements.has(id)) {
      const { element } = this.elements.get(id);
      element.innerHTML = content;
      return true;
    }
    return false;
  }
  
  /**
   * Add a class to a HUD element
   * @param {string} id - ID of the element
   * @param {string} className - Class to add
   */
  addClass(id, className) {
    if (this.elements.has(id)) {
      const { element } = this.elements.get(id);
      element.classList.add(className);
      return true;
    }
    return false;
  }
  
  /**
   * Remove a class from a HUD element
   * @param {string} id - ID of the element
   * @param {string} className - Class to remove
   */
  removeClass(id, className) {
    if (this.elements.has(id)) {
      const { element } = this.elements.get(id);
      element.classList.remove(className);
      return true;
    }
    return false;
  }
  
  /**
   * Get CSS for positioning an element
   * @param {string} position - Position keyword
   * @returns {string} CSS position string
   */
  getPositionStyles(position) {
    const margins = '15px'; // Default margin from edges
    
    const positions = {
      'top-left': `top: ${margins}; left: ${margins};`,
      'top-center': `top: ${margins}; left: 50%; transform: translateX(-50%);`,
      'top-right': `top: ${margins}; right: ${margins};`,
      'center-left': `top: 50%; left: ${margins}; transform: translateY(-50%);`,
      'center': `top: 50%; left: 50%; transform: translate(-50%, -50%);`,
      'center-right': `top: 50%; right: ${margins}; transform: translateY(-50%);`,
      'bottom-left': `bottom: ${margins}; left: ${margins};`,
      'bottom-center': `bottom: ${margins}; left: 50%; transform: translateX(-50%);`,
      'bottom-right': `bottom: ${margins}; right: ${margins};`
    };
    
    return positions[position] || positions['top-right'];
  }
  
  /**
   * Show all HUD elements
   */
  showAll() {
    this.container.style.display = 'block';
  }
  
  /**
   * Hide all HUD elements
   */
  hideAll() {
    this.container.style.display = 'none';
  }
  
  /**
   * Toggle visibility of a specific HUD element
   * @param {string} id - ID of the element
   */
  toggleElement(id) {
    if (this.elements.has(id)) {
      const { element } = this.elements.get(id);
      if (element.style.display === 'none') {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
      return true;
    }
    return false;
  }
}

// Easy initialization function for HUD
export function initArenaHUD(options = {}) {
  return new ArenaHUD(options);
}
