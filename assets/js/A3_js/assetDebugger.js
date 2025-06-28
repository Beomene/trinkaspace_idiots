/**
 * Asset Loading Debug Tool
 * 
 * This module provides tools to inspect and verify the asset loading system
 * including the L-assets usage and the fallback chain.
 */

export class AssetDebugger {
  constructor(trinkaspaceEngine) {
    this.engine = trinkaspaceEngine;
    this.isActive = window.location.search.includes('debug=assets');
    this.loadedAssets = new Map();
    
    if (this.isActive) {
      this.init();
    }
  }
  
  /**
   * Initialize the debugger
   */
  init() {
    console.log('🔍 Asset Loading Debugger Activated');
    
    // Create debug overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'asset-debug-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      bottom: 10px;
      left: 10px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 10px;
      border-radius: 4px;
      font-family: monospace;
      z-index: 9999;
      max-width: 400px;
      max-height: 300px;
      overflow: auto;
    `;
    
    // Initialize content
    this.updateOverlay();
    document.body.appendChild(this.overlay);
    
    // Monitor image loading
    this.monitorAssetLoading();
    
    // Add controls
    this.addControls();
  }
  
  /**
   * Add control buttons to the overlay
   */
  addControls() {
    const controls = document.createElement('div');
    controls.style.cssText = `
      margin-top: 10px;
      display: flex;
      gap: 5px;
    `;
    
    // Inspect button
    const inspectBtn = document.createElement('button');
    inspectBtn.textContent = 'Inspect Assets';
    inspectBtn.onclick = () => this.inspectAllDioramas();
    
    // Clear button
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear Log';
    clearBtn.onclick = () => this.clearLog();
    
    controls.appendChild(inspectBtn);
    controls.appendChild(clearBtn);
    this.overlay.appendChild(controls);
  }
  
  /**
   * Update the overlay with current information
   */
  updateOverlay() {      // Count assets by device class (no XL in Royal Alpha)
    const counts = {
      'A1_alpha': 0, 'L': 0, 'M': 0, 'S': 0, 'XS': 0, 'unknown': 0
    };
    
    this.loadedAssets.forEach(asset => {
      counts[asset.deviceClass] = (counts[asset.deviceClass] || 0) + 1;
    });
    
    // Create a summary
    let summary = `<h3>Asset Loading Debug</h3>
      <p>Device Class: <strong>${this.engine.deviceClass}</strong></p>
      <p>Assets Loaded:</p>
      <ul>      <li>A1_alpha: ${counts.A1_alpha}</li>
        <li>L: ${counts.L}</li>
        <li>M: ${counts.M}</li>
        <li>S: ${counts.S}</li>
        <li>XS: ${counts.XS}</li>
        <li>Unknown: ${counts.unknown}</li>
      </ul>`;
    
    // Add asset list
    if (this.loadedAssets.size > 0) {
      summary += '<p>Recent assets:</p><ul class="asset-list">';
      
      // Take just the last 5 loaded assets
      const recentAssets = Array.from(this.loadedAssets.entries())
        .slice(-5)
        .reverse();
        
      recentAssets.forEach(([path, asset]) => {
        const shortPath = path.split('/').slice(-2).join('/');
        summary += `<li class="asset-${asset.deviceClass}">${asset.deviceClass}: ${shortPath}</li>`;
      });
      
      summary += '</ul>';
    }
    
    this.overlay.innerHTML = summary;
    
    // Add any controls back if they were removed
    this.addControls();
  }
  
  /**
   * Monitor image loading across the page
   */
  monitorAssetLoading() {    // Override the Image constructor to monitor asset loading
    const originalImage = window.Image;
    const self = this;
    
    window.Image = function() {
      const img = new originalImage();
      
      const originalLoadHandler = img.onload;
      img.addEventListener('load', function() {
        if (originalLoadHandler) originalLoadHandler.call(this);
        
        // Check if this is a diorama asset
        const src = this.src;
        if (src.includes('/XL/') || src.includes('/L/') || 
            src.includes('/M/') || src.includes('/S/') || 
            src.includes('/XS/')) {
          
          // Extract device class
          const deviceClassMatch = src.match(/\/([XLS]+)\//);
          const deviceClass = deviceClassMatch ? deviceClassMatch[1] : 'unknown';
          
          // Record the loaded asset
          self.loadedAssets.set(src, {
            deviceClass,
            timestamp: new Date()
          });
          
          // Update the overlay
          self.updateOverlay();
        }
      });
      
      return img;
    };
    
    window.Image.prototype = originalImage.prototype;
  }
  
  /**
   * Inspect all dioramas on the page
   */
  inspectAllDioramas() {
    const dioramas = document.querySelectorAll('.diorama-container');
    
    if (dioramas.length === 0) {
      console.log('No dioramas found on page');
      return;
    }
    
    console.group('🔍 Inspecting all dioramas');
    
    dioramas.forEach(diorama => {
      const id = diorama.id;
      console.log(`Diorama: ${id}`);
      this.engine.inspectAssetAvailability(id);
    });
    
    console.groupEnd();
  }
  
  /**
   * Clear the log of loaded assets
   */
  clearLog() {
    this.loadedAssets.clear();
    this.updateOverlay();
  }
}

/**
 * Initialize the asset debugger
 * @param {TrinkaspaceEngine} engine - The TrinkaspaceEngine instance
 */
export function initAssetDebugger(engine) {
  return new AssetDebugger(engine);
}
