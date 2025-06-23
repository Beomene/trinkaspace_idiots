export class ScopeSystem {
  constructor(container, scopeConfig, deviceClass) {
    // Sizing logic
    let width = scopeConfig.width || '100vw';
    let height = scopeConfig.height || null;

    if (scopeConfig.heightMode === 'width-ratio' && scopeConfig.heightValue) {
      const baseWidth = this.#calculateBaseWidth(deviceClass);
      height = `${baseWidth * scopeConfig.heightValue}px`;
    }

    container.style.width = width;
    if (height) container.style.height = height;

    ['left', 'top', 'right', 'bottom', 'zIndex'].forEach(key => {
      if (scopeConfig[key] !== undefined) {
        container.style[key] = scopeConfig[key];
      }
    });

    // Store scope vertical offset if provided
    this.scopeVerticalOffset = scopeConfig.scopeVerticalOffset;
    if (this.scopeVerticalOffset !== undefined) {
      const natscene = container.querySelector('.natscene');
      if (natscene) {
        natscene.style.transform = `translateY(${this.scopeVerticalOffset}px)`;
        natscene.dataset.scopeVerticalOffset = this.scopeVerticalOffset;
        console.log(`[ScopeSystem] Applied scope vertical offset: ${this.scopeVerticalOffset}px`);
      }
    }
    
    // Apply scope frames if provided
    if (scopeConfig.frames) {
      this.applyFrames(container, scopeConfig.frames);
    }
    
    // Apply scope filter if provided
    if (scopeConfig.filter) {
      this.applyFilter(container, scopeConfig.filter);
    }

    this.width = width;
    this.height = height;
    this.safetyZone = scopeConfig.safetyZone || 300;

    // Hide diorama initially
    container.classList.add('diorama-hidden');
    container._imagesPreloaded = false; // Track preload status

    // Intersection Observer for viewport-based toggle (show/hide)
    const offsetPx = Math.round(window.innerHeight * 0.2);
    this.observer = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Show: Remove hidden class after preloading images
            if (!container._imagesPreloaded) {
              ScopeSystem.preloadImages(container).then(() => {
                container._imagesPreloaded = true;
                container.classList.remove('diorama-hidden');
                console.log(`[ScopeSystem] Diorama ${container.id} revealed (images preloaded)`);
                // Update parallax after revealing
                if (window.trinkaspaceEngine && typeof window.trinkaspaceEngine.updateParallax === 'function') {
                  window.trinkaspaceEngine.updateParallax();
                }
              });
            } else {
              // Already preloaded, just show immediately
              container.classList.remove('diorama-hidden');
              console.log(`[ScopeSystem] Diorama ${container.id} revealed (already preloaded)`);
            }
          } else {
            // Hide: Add hidden class when out of viewport
            container.classList.add('diorama-hidden');
            console.log(`[ScopeSystem] Diorama ${container.id} hidden (out of viewport)`);
          }
        });
      },
      {
        root: null,
        rootMargin: `0px 0px -${offsetPx}px 0px`,
        threshold: 0.01
      }
    );
    this.observer.observe(container);

    console.log(`Scope set to ${width} x ${height || 'auto'} with viewport toggle`);
  }  #calculateBaseWidth(deviceClass) {
    const widths = { 
      'M': 854, 'S': 640, 'XS': 426 
    };
    return widths[deviceClass] || 854;
  }  update(layers) {
    // Maintain any scope vertical offset during updates
    if (layers && layers.length > 0) {
      const natscene = layers[0].closest('.natscene');
      if (natscene && natscene.dataset.scopeVerticalOffset) {
        const offset = natscene.dataset.scopeVerticalOffset;
        natscene.style.transform = `translateY(${offset}px)`;
      }
    }
  }

  static preloadImages(container) {
    const images = Array.from(container.querySelectorAll('img'));
    return Promise.all(
      images.map(
        img =>
          img.complete
            ? Promise.resolve()
            : new Promise(resolve => {
                img.onload = img.onerror = resolve;
              })
      )
    );
  }

  /**
   * Apply frame images to the diorama edges
   * @param {HTMLElement} container - The diorama container
   * @param {Object} frames - Object containing frame image paths
   */  applyFrames(container, frames) {
    const framePositions = ['upper', 'lower', 'left', 'right'];
    const baseUrl = '../../assets/images/primaryArena/scope/frames/scope';
    
    framePositions.forEach(position => {
      if (frames[position]) {
        const frameEl = document.createElement('img');
        frameEl.className = `diorama-frame diorama-frame-${position}`;
        frameEl.src = `${baseUrl}${position.toUpperCase()}/${frames[position]}`;
        frameEl.alt = `Scope ${position} frame`;
        console.log(`[ScopeSystem] Loading frame: ${frames[position]} for ${position} position`);
        
        // If this is a vertical frame (left or right), set width
        // Otherwise, for horizontal frames (upper or lower), set height
        if (position === 'left' || position === 'right') {
          // We don't set explicit width for vertical frames
          // as they expand to their natural width
        } else {
          // We don't set explicit height for horizontal frames
          // as they expand to their natural height
        }
        
        container.appendChild(frameEl);
        console.log(`[ScopeSystem] Applied ${position} frame: ${frames[position]}`);
      }
    });
  }
  
  /**
   * Apply filter overlay to the diorama
   * @param {HTMLElement} container - The diorama container
   * @param {string|Object} filter - Filter image path or config object
   */
  applyFilter(container, filter) {
    const filterEl = document.createElement('img');
    filterEl.className = 'diorama-filter';
    
    // Handle string (just path) or object (with additional properties)
    if (typeof filter === 'string') {
      filterEl.src = `../../assets/images/primaryArena/scope/filters/${filter}`;
      filterEl.alt = 'Diorama filter';
    } else {
      filterEl.src = `../../assets/images/primaryArena/scope/filters/${filter.path}`;
      filterEl.alt = filter.alt || 'Diorama filter';
      
      // Apply additional properties if provided
      if (filter.opacity !== undefined) {
        filterEl.style.opacity = filter.opacity;
      }
      
      if (filter.blendMode) {
        filterEl.style.mixBlendMode = filter.blendMode;
      }
    }
    
    container.appendChild(filterEl);
    console.log(`[ScopeSystem] Applied filter: ${typeof filter === 'string' ? filter : filter.path}`);
  }
}