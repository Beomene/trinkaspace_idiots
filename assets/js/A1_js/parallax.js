export class ParallaxEngine {
  constructor(scopeConfig, cuc = 1.0) {
    this.scopeConfig = scopeConfig;
    this.cuc = cuc;
    this.ticking = false;
    this._tickingTimeout = null;
    this.lastScrollY = 0;
    // Store layer calculations to avoid recomputing every frame
    this.layerCache = new Map();
  }

  update(layers, layerDatas, scrollY) {
    // Only update if scroll position has changed significantly (at least 1px)
    if (Math.abs(this.lastScrollY - scrollY) < 1) {
      return;
    }
    this.lastScrollY = scrollY;
    
    if (!this.ticking) {
      // Set a failsafe timeout
      this._tickingTimeout = setTimeout(() => {
        this.ticking = false;
      }, 3000);

      window.requestAnimationFrame(() => {
        layers.forEach((layer, i) => {
          const layerId = layer.dataset.layerName || `layer-${i}`;
          let speed, yOffset;
          
          // Use cached values when available to avoid recalculating
          if (!this.layerCache.has(layerId)) {
            speed = parseFloat(layer.dataset.parallaxSpeed) || 0;
            yOffset = (layerDatas[i] && layerDatas[i].yOffset) ? layerDatas[i].yOffset : 0;
            this.layerCache.set(layerId, { speed, yOffset });
          } else {
            const cached = this.layerCache.get(layerId);
            speed = cached.speed;
            yOffset = cached.yOffset;
          }
          
          // Apply CUC scaling to yOffset
          const scaledYOffset = yOffset * this.cuc;
          // Use translate3d for hardware acceleration
          layer.style.transform = `translate3d(-50%, ${scaledYOffset + scrollY * speed}px, 0)`;
        });
        
        this.ticking = false;
        if (this._tickingTimeout) {
          clearTimeout(this._tickingTimeout);
          this._tickingTimeout = null;
        }
      });
      this.ticking = true;
    }
  }
}