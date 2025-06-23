/**
 * keyboardNavigation.js
 *
 * Provides keyboard navigation functionality throughout the Trinkaspace application.
 * Allows users to navigate between sections, access menus, and interact with content using keyboard keys.
 */

class KeyboardNavigationManager {
  constructor() {
    this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.focusableGroups = [];  // Groups of elements that can be navigated with arrow keys
    this.currentFocusGroup = null;
    this.globalShortcuts = {};
    this.skipLinks = [];
    this.isDefaultShortutsRegistered = false;
    
    // Bind methods
    this._handleKeyDown = this._handleKeyDown.bind(this);
    
    // Initialize
    this.init();
  }
  
  /**
   * Initialize keyboard navigation
   */
  init() {
    document.addEventListener('keydown', this._handleKeyDown);
    console.log('[KeyboardNavigation] Initialized');

    // Register default shortcuts if not already registered
    if (!this.isDefaultShortutsRegistered) {
      this._registerDefaultShortcuts();
    }
    
    // Create skip links if needed
    this._createSkipLinks();
  }
  
  /**
   * Register a global shortcut
   * @param {string} key - Key or key combination (e.g., 'h', 'Shift+m')
   * @param {Function} callback - Function to call when the shortcut is used
   * @param {string} description - Description of what the shortcut does
   */
  registerShortcut(key, callback, description) {
    this.globalShortcuts[key.toLowerCase()] = {
      callback,
      description
    };
  }
  
  /**
   * Register a group of elements that can be navigated with arrow keys
   * @param {string} groupId - Unique ID for this navigation group
   * @param {HTMLElement} container - Container element
   * @param {string} selector - Selector for items within the container
   * @param {Object} options - Navigation options
   */
  registerNavigationGroup(groupId, container, selector, options = {}) {
    if (!container) {
      console.error(`[KeyboardNavigation] Container not found for group: ${groupId}`);
      return;
    }
    
    this.focusableGroups.push({
      id: groupId,
      container,
      selector,
      options: {
        grid: options.grid || false,
        columns: options.columns || 1,
        wrap: options.wrap !== undefined ? options.wrap : true,
        onNavigate: options.onNavigate || null
      }
    });
    
    // Add keyboard events to the container
    container.addEventListener('keydown', (e) => {
      this._handleGroupNavigation(groupId, e);
    });
    
    // Add focus handling
    container.addEventListener('focusin', () => {
      this.currentFocusGroup = groupId;
    });
  }

  /**
   * Add skip links to the page for accessibility
   * @param {Array} links - Array of skip link configurations
   */
  addSkipLinks(links = []) {
    this.skipLinks = [...this.skipLinks, ...links];
    this._createSkipLinks();
  }

  /**
   * Make an element focusable and announce it to screen readers
   * @param {HTMLElement} element - The element to make focusable
   * @param {string} text - The text to announce
   */
  makeFocusable(element, text = '') {
    if (!element) return;
    
    if (element.getAttribute('tabindex') === null) {
      element.setAttribute('tabindex', '0');
    }
    
    if (text && !element.getAttribute('aria-label')) {
      element.setAttribute('aria-label', text);
    }
  }

  /**
   * Make page content focusable for keyboard users
   */
  makeContentFocusable() {
    // Find important content sections and make them focusable
    const contentSections = document.querySelectorAll('.textBox, .diorama-layer, .arena-hud-element');
    
    contentSections.forEach(section => {
      this.makeFocusable(section);
    });
  }

  /**
   * Makes HUD controls accessible via keyboard
   * @param {HUDManager} hudManager - The HUD manager instance
   */
  setupHUDNavigation(hudManager) {
    if (!hudManager || !hudManager.container) return;
    
    // Find all HUD buttons and make them focusable
    const hudButtons = hudManager.container.querySelectorAll('.hud-button');
    
    hudButtons.forEach(button => {
      // Ensure it's focusable
      button.setAttribute('tabindex', '0');
      button.setAttribute('role', 'button');
      
      // Add keyboard event
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          button.click();
        }
      });
    });
    
    // Register the HUD controls as a navigation group
    this.registerNavigationGroup(
      'hud-controls',
      hudManager.container,
      '.hud-button',
      {
        grid: false,
        wrap: true
      }
    );

    // Add keyboard shortcut for menu
    this.registerShortcut('m', () => {
      const menuButton = hudManager.container.querySelector('[data-action="toggleMenu"]');
      if (menuButton) menuButton.click();
    }, 'Toggle Menu');

    // Add keyboard shortcut for sound
    this.registerShortcut('s', () => {
      const soundButton = hudManager.container.querySelector('[data-action="toggleSound"]');
      if (soundButton) soundButton.click();
    }, 'Toggle Sound');
  }

  /**
   * Setup navigation for page navigation and textboxes
   */
  setupPageNavigation() {
    // Find page navigation elements
    const pageNavigation = document.querySelector('.page-navigation');
    
    if (pageNavigation) {
      const navButtons = pageNavigation.querySelectorAll('button, a');
      
      navButtons.forEach(button => {
        // Ensure it's focusable
        if (!button.getAttribute('tabindex')) {
          button.setAttribute('tabindex', '0');
        }
      });
      
      // Register as navigation group
      this.registerNavigationGroup(
        'page-navigation',
        pageNavigation,
        'button, a',
        {
          grid: false,
          wrap: true
        }
      );
    }
    
    // Setup shortcut for next/previous page
    this.registerShortcut('arrowright', () => {
      const nextButton = document.querySelector('.page-navigation .next-page');
      if (nextButton) nextButton.click();
    }, 'Next Page');
    
    this.registerShortcut('arrowleft', () => {
      const prevButton = document.querySelector('.page-navigation .prev-page');
      if (prevButton) prevButton.click();
    }, 'Previous Page');
  }

  /**
   * Register the main default keyboard shortcuts
   * @private
   */
  _registerDefaultShortcuts() {
    // Help dialog
    this.registerShortcut('?', () => this.showHelp(), 'Show Keyboard Help');
    this.registerShortcut('shift+/', () => this.showHelp(), 'Show Keyboard Help');
    
    // Navigation shortcuts
    this.registerShortcut('h', () => {
      window.location.href = '/portal.html';
    }, 'Go to Home Page');
    
    this.registerShortcut('c', () => {
      // Try to find and click chapter selection button
      const chapterButton = document.querySelector('button[onclick="showChapterSelect()"]');
      if (chapterButton) {
        chapterButton.click();
      }
    }, 'Chapter Selection');

    // Set flag to prevent duplicate registration
    this.isDefaultShortutsRegistered = true;
  }

  /**
   * Create skip links for accessibility
   * @private
   */
  _createSkipLinks() {
    // Remove any existing skip links
    const existingLinks = document.querySelectorAll('.skip-link');
    existingLinks.forEach(link => {
      link.remove();
    });
    
    if (this.skipLinks.length === 0) {
      // Set default skip links
      this.skipLinks = [
        {
          text: 'Skip to main content',
          target: '#trinkaspace-container'
        },
        {
          text: 'Skip to navigation',
          target: '.page-navigation'
        }
      ];
    }
    
    // Create skip links container
    const skipLinksContainer = document.createElement('div');
    skipLinksContainer.className = 'skip-links-container';
    
    // Generate links
    this.skipLinks.forEach(link => {
      if (!link.target || !link.text) return;
      
      const skipLink = document.createElement('a');
      skipLink.href = link.target;
      skipLink.className = 'skip-link';
      skipLink.textContent = link.text;
      
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetElement = document.querySelector(link.target);
        
        if (targetElement) {
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus();
        }
      });
      
      skipLinksContainer.appendChild(skipLink);
    });
    
    // Add to document
    if (skipLinksContainer.children.length > 0) {
      document.body.insertBefore(skipLinksContainer, document.body.firstChild);
    }
  }
  
  /**
   * Display help with all available keyboard shortcuts
   */
  showHelp() {
    const helpModal = document.createElement('div');
    helpModal.className = 'keyboard-help-modal';
    helpModal.setAttribute('role', 'dialog');
    helpModal.setAttribute('aria-modal', 'true');
    helpModal.setAttribute('aria-label', 'Keyboard Shortcuts');
    
    // Style the modal
    helpModal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #333;
      border: 2px solid #2AFFF7;
      border-radius: 8px;
      padding: 20px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      z-index: 3000;
      color: #fff;
      box-shadow: 0 0 30px rgba(42, 255, 247, 0.2);
    `;
    
    // Create modal content
    let content = '<h2 style="color: #2AFFF7; margin-top: 0;">Keyboard Shortcuts</h2>';
    content += '<div style="margin-bottom: 20px;">Press <kbd style="background: #555; padding: 2px 6px; border-radius: 4px;">?</kbd> or <kbd style="background: #555; padding: 2px 6px; border-radius: 4px;">Shift+/</kbd> to show this help at any time</div>';
    
    // Global navigation
    content += '<h3 style="color: #2AFFF7; border-bottom: 1px solid #2AFFF7; padding-bottom: 5px;">General Navigation</h3>';
    content += '<ul>';
    content += '<li><kbd style="background: #555; padding: 2px 6px; border-radius: 4px;">Tab</kbd> Move to the next focusable element</li>';
    content += '<li><kbd style="background: #555; padding: 2px 6px; border-radius: 4px;">Shift+Tab</kbd> Move to the previous focusable element</li>';
    content += '<li><kbd style="background: #555; padding: 2px 6px; border-radius: 4px;">Enter</kbd> or <kbd style="background: #555; padding: 2px 6px; border-radius: 4px;">Space</kbd> Activate the current element</li>';
    content += '<li><kbd style="background: #555; padding: 2px 6px; border-radius: 4px;">Escape</kbd> Close the current modal or menu</li>';
    content += '<li><kbd style="background: #555; padding: 2px 6px; border-radius: 4px;">H</kbd> Go to home page</li>';
    content += '<li><kbd style="background: #555; padding: 2px 6px; border-radius: 4px;">C</kbd> Open chapter selection</li>';
    content += '<li><kbd style="background: #555; padding: 2px 6px; border-radius: 4px;">M</kbd> Toggle menu (if available)</li>';
    content += '<li><kbd style="background: #555; padding: 2px 6px; border-radius: 4px;">S</kbd> Toggle sound (if available)</li>';
    content += '<li><kbd style="background: #555; padding: 2px 6px; border-radius: 4px;">←</kbd> Previous page</li>';
    content += '<li><kbd style="background: #555; padding: 2px 6px; border-radius: 4px;">→</kbd> Next page</li>';
    content += '</ul>';
    
    // Custom shortcuts
    if (Object.keys(this.globalShortcuts).length > 0) {
      content += '<h3 style="color: #2AFFF7; border-bottom: 1px solid #2AFFF7; padding-bottom: 5px;">Custom Shortcuts</h3>';
      content += '<ul>';
      
      for (const [key, {description}] of Object.entries(this.globalShortcuts)) {
        // Skip duplicates that are already covered in the general section
        if (['?', 'shift+/', 'arrowleft', 'arrowright', 'h', 'c', 'm', 's'].includes(key.toLowerCase())) {
          continue;
        }
        
        const keyDisplay = key.split('+').map(k => 
          `<kbd style="background: #555; padding: 2px 6px; border-radius: 4px;">${k.charAt(0).toUpperCase() + k.slice(1)}</kbd>`
        ).join(' + ');
        
        content += `<li>${keyDisplay} ${description}</li>`;
      }
      
      content += '</ul>';
    }
    
    // Close button
    content += '<div style="text-align: center; margin-top: 20px;">';
    content += '<button id="keyboard-help-close" style="background: #2AFFF7; color: #222; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold;">Close</button>';
    content += '</div>';
    
    helpModal.innerHTML = content;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 2999;
    `;
    
    // Add to DOM
    document.body.appendChild(overlay);
    document.body.appendChild(helpModal);
    
    // Focus the close button
    const closeBtn = document.getElementById('keyboard-help-close');
    closeBtn.focus();
    
    // Close handling
    const closeHelp = () => {
      document.body.removeChild(helpModal);
      document.body.removeChild(overlay);
    };
    
    closeBtn.addEventListener('click', closeHelp);
    overlay.addEventListener('click', closeHelp);
    helpModal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeHelp();
      }
    });
  }
  
  /**
   * Handle keydown events for the entire document
   * @param {KeyboardEvent} e - Keyboard event
   * @private
   */
  _handleKeyDown(e) {
    // Handle global shortcuts
    const key = this._getKeyCombo(e);
    
    // Help shortcut ("?" or "Shift+/")
    if (key === '?' || key === 'shift+/') {
      e.preventDefault();
      this.showHelp();
      return;
    }
    
    // Check registered shortcuts
    if (this.globalShortcuts[key]) {
      e.preventDefault();
      this.globalShortcuts[key].callback();
      return;
    }
  }
  
  /**
   * Handle navigation within a group using arrow keys
   * @param {string} groupId - ID of the navigation group
   * @param {KeyboardEvent} e - Keyboard event
   * @private
   */
  _handleGroupNavigation(groupId, e) {
    const group = this.focusableGroups.find(g => g.id === groupId);
    if (!group) return;
    
    // Only handle arrow keys, Home, End
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      return;
    }
    
    const items = Array.from(group.container.querySelectorAll(group.selector));
    if (items.length === 0) return;
    
    let currentIndex = items.findIndex(item => item === document.activeElement);
    if (currentIndex === -1) currentIndex = 0;
    
    let newIndex = currentIndex;
    
    if (group.options.grid) {
      // Grid navigation (2D)
      const columns = group.options.columns;
      const rows = Math.ceil(items.length / columns);
      const currentRow = Math.floor(currentIndex / columns);
      const currentCol = currentIndex % columns;
      
      switch (e.key) {
        case 'ArrowRight':
          if (currentCol < columns - 1) {
            newIndex = currentIndex + 1;
            if (newIndex >= items.length) newIndex = items.length - 1;
          } else if (group.options.wrap) {
            newIndex = currentRow * columns; // Go to first item in same row
          }
          break;
        case 'ArrowLeft':
          if (currentCol > 0) {
            newIndex = currentIndex - 1;
          } else if (group.options.wrap) {
            newIndex = Math.min((currentRow + 1) * columns - 1, items.length - 1); // Go to last item in same row
          }
          break;
        case 'ArrowDown':
          if (currentRow < rows - 1) {
            newIndex = currentIndex + columns;
            if (newIndex >= items.length) newIndex = currentIndex + (items.length % columns);
          } else if (group.options.wrap) {
            newIndex = currentCol; // Go to first row, same column
          }
          break;
        case 'ArrowUp':
          if (currentRow > 0) {
            newIndex = currentIndex - columns;
          } else if (group.options.wrap) {
            const lastRowItems = items.length % columns || columns;
            const lastRowOffset = currentCol < lastRowItems ? currentCol : lastRowItems - 1;
            newIndex = items.length - lastRowItems + lastRowOffset;
          }
          break;
        case 'Home':
          newIndex = 0; // First item
          break;
        case 'End':
          newIndex = items.length - 1; // Last item
          break;
      }
    } else {
      // Linear navigation (1D)
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          if (currentIndex < items.length - 1) {
            newIndex = currentIndex + 1;
          } else if (group.options.wrap) {
            newIndex = 0; // Wrap to first
          }
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          if (currentIndex > 0) {
            newIndex = currentIndex - 1;
          } else if (group.options.wrap) {
            newIndex = items.length - 1; // Wrap to last
          }
          break;
        case 'Home':
          newIndex = 0; // First item
          break;
        case 'End':
          newIndex = items.length - 1; // Last item
          break;
      }
    }
    
    // If index changed, focus the new item
    if (newIndex !== currentIndex && items[newIndex]) {
      e.preventDefault();
      items[newIndex].focus();
      
      // Call the navigation callback if defined
      if (group.options.onNavigate) {
        group.options.onNavigate(items[newIndex], newIndex);
      }
    }
  }
  
  /**
   * Get a standardized key combination string
   * @param {KeyboardEvent} e - Keyboard event
   * @returns {string} - Standardized key combination
   * @private
   */
  _getKeyCombo(e) {
    const key = e.key.toLowerCase();
    let combo = '';
    
    if (e.ctrlKey) combo += 'ctrl+';
    if (e.altKey) combo += 'alt+';
    if (e.shiftKey) combo += 'shift+';
    if (e.metaKey) combo += 'meta+'; // Command key on Mac
    
    // Handle special keys
    if (key === ' ') {
      combo += 'space';
    } else if (key === 'escape') {
      combo += 'esc';
    } else if (key.length === 1 || ['enter', 'tab', 'backspace', 'delete', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'home', 'end'].includes(key)) {
      combo += key;
    } else {
      return ''; // Ignore other special keys
    }
    
    return combo;
  }
}

// Create and export singleton instance
const keyboardNavigation = new KeyboardNavigationManager();
export default keyboardNavigation;
