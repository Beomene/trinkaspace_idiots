/**
 * Portal Page Parallax
 * 
 * Handles parallax effects specifically for the portal page title
 */

class PortalParallax {  constructor() {
    this.ticking = false;
    this.initialized = false;
    this.titleLayers = [];    // Movement factors for super-tiny parallax effect (6vh max)
    this.movementFactors = {
      layer1: { y: 0, x: 0 },       // No movement - keep it perfect with just the glow
      layer2: { y: -0.03, x: 0.01 }, // Minimal vertical & horizontal movement
      layer3: { y: 0.02, x: -0.01 } // Opposite minimal movement
    };
    
    // Initialize once the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.initialize();
      
      // Force immediate reset of all layers
      setTimeout(() => {
        console.log('[PortalParallax] Emergency stabilization');
        this.resetAllLayers();
      }, 100);
    });
  }
  
  /**
   * Initialize the parallax effect
   */
  initialize() {
    if (this.initialized) return;
    
    // Find the title layers
    this.titleLayers = [
      document.querySelector('.trinkatitle-1'),
      document.querySelector('.trinkatitle-2'),
      document.querySelector('.trinkatitle-3')
    ];
    
    // If layers aren't found, parallax elements might not be on this page
    if (!this.titleLayers[0] || !this.titleLayers[1] || !this.titleLayers[2]) {
      console.warn('[PortalParallax] Title layers not found. Parallax not initialized.');
      return;
    }
    
    // Add event listeners
    window.addEventListener('scroll', () => this.handleScroll());
    window.addEventListener('resize', () => this.handleResize());
    
    // Handle mouse movement for enhanced effect
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    
    this.initialized = true;
    console.log('[PortalParallax] Initialized');
    
    // Initial positioning
    this.updateParallax(0);
  }
    /**
   * Handle scroll detection for UI elements
   * @param {number} scrollY - Current scroll position
   */
  handleScrollUI(scrollY) {
    // Add a class to body when user has scrolled down
    if (scrollY > 50) {
      document.body.classList.add('has-scrolled');
      
      // Gradually fade out the scroll indicator based on scroll position
      const scrollIndicator = document.querySelector('.scroll-indicator');
      if (scrollIndicator) {
        const opacity = Math.max(0, 1 - (scrollY / 300));
        scrollIndicator.style.opacity = opacity.toFixed(2);
      }
    } else {
      document.body.classList.remove('has-scrolled');
      
      // Restore scroll indicator
      const scrollIndicator = document.querySelector('.scroll-indicator');
      if (scrollIndicator) {
        scrollIndicator.style.opacity = '0.7';
      }
    }
    
    // Add scroll depth class for specific animations or effects
    const scrollDepth = window.innerHeight;
    if (scrollY > scrollDepth) {
      document.body.classList.add('deep-scroll');
    } else {
      document.body.classList.remove('deep-scroll');
    }
  }
  
  /**
   * Handle scroll events
   */
  handleScroll() {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        this.updateParallax(scrollY);
        this.handleScrollUI(scrollY);
        this.ticking = false;
      });
      
      this.ticking = true;
    }
  }
  
  /**
   * Update parallax positions based on scroll
   * @param {number} scrollY - Current scroll position
   */  updateParallax(scrollY) {
    if (!this.initialized) return;
    
    // For each layer, apply very subtle transform based on scroll position
    this.titleLayers.forEach((layer, index) => {
      if (!layer) return;
      
      const layerNum = index + 1;
      const factor = this.movementFactors[`layer${layerNum}`];
      
      // Skip layer 1 - keep it perfect
      if (layerNum === 1) return;
      
      if (factor) {
        // Limit the max movement to stay within our 6vh constraint
        const maxScroll = 200; // Limit effect to first 200px of scrolling
        const limitedScroll = Math.min(scrollY, maxScroll);
        
        // Apply very small offset
        const yOffset = limitedScroll * factor.y;
        const xOffset = limitedScroll * factor.x;
        
        layer.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
      }
    });
  }
    /**
   * Handle mouse movement for additional parallax effect
   * @param {MouseEvent} e - Mouse move event
   */  handleMouseMove(e) {
    if (!this.initialized) return;
    
    // Skip if using cursor chase effects (check for class on first element)
    if (this.titleLayers[0]?.classList.contains('cursor-chase-active')) {
      return;
    }
    
    // Calculate mouse position relative to the center of the viewport
    const mouseX = e.clientX - window.innerWidth / 2;
    const mouseY = e.clientY - window.innerHeight / 2;
    
    // Apply subtle movement only to layers 2 and 3
    this.titleLayers.forEach((layer, index) => {
      if (!layer) return;
      const layerNum = index + 1;
      
      // Skip layer 1 (keep it perfect with just the glow)
      if (layerNum === 1) return;
      
      // Super minimal sensitivity for subtle effect
      const sensitivity = layerNum === 2 ? 0.0005 : 0.0003;
      
      // Apply subtle movement opposite directions for layers 2 and 3
      const directionX = layerNum === 2 ? 1 : -1;
      const directionY = layerNum === 2 ? -1 : 1;
      
      const mouseXEffect = mouseX * sensitivity * directionX;
      const mouseYEffect = mouseY * sensitivity * directionY;
      
      // Limit the maximum movement to create the tiny effect (fraction of vh)
      const maxMove = 3; // pixels
      const limitedX = Math.max(-maxMove, Math.min(maxMove, mouseXEffect));
      const limitedY = Math.max(-maxMove, Math.min(maxMove, mouseYEffect));
      
      layer.style.transform = `translate3d(${limitedX}px, ${limitedY}px, 0)`;
    });
  }
  
  /**
   * Handle window resize
   */
  handleResize() {
    // Reset positions on resize
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    this.updateParallax(scrollY);
  }
  
  /**
   * Emergency reset of all layers to default position
   */
  resetAllLayers() {
    const allLayers = document.querySelectorAll('.trinkatitle-layer');
    console.log('[PortalParallax] Emergency reset for', allLayers.length, 'layers');
    
    allLayers.forEach(layer => {
      layer.style.transform = 'none';
      layer.style.transition = 'none';
    });
  }
}

// Create and export singleton instance
const portalParallax = new PortalParallax();
export default portalParallax;
