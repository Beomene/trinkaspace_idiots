/**
 * Portal Title Animation Effects
 * Applies cursor-chasing effects to portal title elements
 */

import defaultCursorChase, { CursorChase } from '../A1_js/cursorChase.js';

/**
 * Initialize cursor chase effects for portal title elements
 * @param {Object} options - Configuration options
 */
export function initPortalTitleEffects(options = {}) {
  // Default configuration
  const config = {
    selector: '.portal-title, .portal-element, [data-cursor-effect]',
    intensity: 0.03,
    delay: 0.08,
    maxDistance: 60,
    behavior: 'hover',
    hoverDistance: 300,
    ...options
  };
  
  // Apply to all matching elements
  defaultCursorChase.applyToSelector(config.selector, config);
  
  console.log('✨ Portal title cursor effects applied');
  
  // Add toggle key (Alt+E)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'e' && e.altKey) {
      toggleCursorEffects();
      e.preventDefault();
    }
  });
}

/**
 * Toggle cursor chase effects on/off
 */
function toggleCursorEffects() {
  const elements = document.querySelectorAll('.portal-title, .portal-element, [data-cursor-effect]');
  const active = elements[0]?.classList.contains('cursor-chase-active');
  
  elements.forEach(element => {
    if (active) {
      // Disable effects
      defaultCursorChase.removeElement(element);
      console.log('🔄 Cursor effects disabled');
    } else {
      // Re-enable effects
      defaultCursorChase.addElement(element);
      console.log('🔄 Cursor effects enabled');
    }
  });
}

/**
 * Apply specific cursor chase behavior to an element
 * @param {HTMLElement|string} element - Element or selector to apply effects to
 * @param {string} behavior - 'chase', 'flee', or 'hover'
 * @param {Object} options - Additional options
 */
export function applyElementEffect(element, behavior = 'hover', options = {}) {
  // Handle string selector
  if (typeof element === 'string') {
    document.querySelectorAll(element).forEach(el => {
      applyElementEffect(el, behavior, options);
    });
    return;
  }
  
  // Apply effect to element
  defaultCursorChase.addElement(element, {
    behavior,
    ...options
  });
  
  // Add data attribute for tracking
  element.setAttribute('data-cursor-effect', behavior);
}
