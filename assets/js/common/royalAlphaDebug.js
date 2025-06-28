/**
 * Royal Alpha Debug Utility
 * 
 * This module provides debugging tools for the Royal Alpha coordinate system.
 * Include this script with ?debug=royal in the URL to activate.
 */

export class RoyalAlphaDebug {
  constructor(trinkaspaceEngine) {
    this.engine = trinkaspaceEngine;
    this.isActive = window.location.search.includes('debug=royal');
    
    if (this.isActive) {
      this.init();
    }
  }
  
  /**
   * Initialize the debug overlay
   */
  init() {
    console.log('👑 Royal Alpha Debug Mode Activated');
    
    // Add debug class to body
    document.body.classList.add('debug-mode');
    
    // Create debug overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'royal-alpha-debug visible';
    this.overlay.innerHTML = `
      <h3>Royal Alpha Debug</h3>
      <table>
        <tr><td>A1 Width:</td><td>${this.engine.a1Width}px</td></tr>
        <tr><td>CUC:</td><td>${this.engine.cuc.toFixed(3)}</td></tr>
        <tr><td>Device:</td><td>${this.engine.deviceClass}</td></tr>
        <tr><td>HUD:</td><td>${this.engine.hudLayout}</td></tr>
        <tr><td>Page Height:</td><td>${this.engine.a1Width * 10}px</td></tr>
        <tr><td>Alpha Origin:</td><td>0×0</td></tr>
      </table>
      <div class="debug-controls">
        <button id="toggle-grid">Toggle Grid</button>
        <button id="highlight-a1">Highlight A1</button>
      </div>
    `;
    document.body.appendChild(this.overlay);
    
    // Setup event listeners for debug controls
    this.setupEventListeners();
  }
  
  /**
   * Setup event listeners for debug controls
   */
  setupEventListeners() {
    const toggleGridBtn = document.getElementById('toggle-grid');
    if (toggleGridBtn) {
      toggleGridBtn.addEventListener('click', () => this.toggleGrid());
    }
    
    const highlightA1Btn = document.getElementById('highlight-a1');
    if (highlightA1Btn) {
      highlightA1Btn.addEventListener('click', () => this.highlightA1());
    }
  }
  
  /**
   * Update the debug overlay with current values
   */
  update() {
    if (!this.isActive || !this.overlay) return;
    
    // Update debug info
    this.overlay.querySelector('table').innerHTML = `
      <tr><td>A1 Width:</td><td>${this.engine.a1Width}px</td></tr>
      <tr><td>CUC:</td><td>${this.engine.cuc.toFixed(3)}</td></tr>
      <tr><td>Device:</td><td>${this.engine.deviceClass}</td></tr>
      <tr><td>HUD:</td><td>${this.engine.hudLayout}</td></tr>
      <tr><td>Page Height:</td><td>${this.engine.a1Width * 10}px</td></tr>
      <tr><td>Alpha Origin:</td><td>0×0</td></tr>
    `;
  }
  
  /**
   * Toggle coordinate grid overlay
   */
  toggleGrid() {
    if (this.grid) {
      this.grid.remove();
      this.grid = null;
      return;
    }
    
    // Create grid
    this.grid = document.createElement('div');
    this.grid.className = 'royal-alpha-grid';
    this.grid.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: ${this.engine.a1Width * 10}px;
      pointer-events: none;
      z-index: 9998;
      background-image: 
        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
      background-size: ${this.engine.a1Width / 10}px ${this.engine.a1Width / 10}px;
      background-position: -0.5px -0.5px;
    `;
    document.body.appendChild(this.grid);
  }
  
  /**
   * Highlight A1 arena boundaries
   */
  highlightA1() {
    if (this.a1Highlight) {
      this.a1Highlight.remove();
      this.a1Highlight = null;
      return;
    }
    
    // Create A1 highlight
    const dioramas = document.querySelectorAll('.diorama-container');
    
    dioramas.forEach((diorama, index) => {
      const highlight = document.createElement('div');
      highlight.className = 'royal-alpha-highlight';
      highlight.style.cssText = `
        position: absolute;
        top: ${diorama.offsetTop}px;
        left: ${diorama.offsetLeft}px;
        width: ${diorama.offsetWidth}px;
        height: ${diorama.offsetHeight}px;
        border: 2px solid rgba(255,220,0,0.8);
        box-shadow: 0 0 0 2px rgba(0,0,0,0.5);
        pointer-events: none;
        z-index: 9997;
        box-sizing: border-box;
      `;
      
      // Label the diorama with its ID and coordinates
      const label = document.createElement('div');
      label.style.cssText = `
        position: absolute;
        top: -20px;
        left: 0;
        background: rgba(0,0,0,0.7);
        color: yellow;
        padding: 2px 5px;
        font-size: 10px;
        white-space: nowrap;
      `;
      
      const alphaY = diorama.dataset.alphaAnchorY;
      const scaledY = diorama.dataset.scaledAnchorY;
      
      label.textContent = `${diorama.id}: Alpha Y=${alphaY || '?'}, Scaled Y=${scaledY || '?'}`;
      highlight.appendChild(label);
      
      document.body.appendChild(highlight);
      
      if (!this.a1Highlight) {
        this.a1Highlight = [];
      }
      
      this.a1Highlight.push(highlight);
    });
  }
}
