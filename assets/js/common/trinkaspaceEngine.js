import { ParallaxEngine } from '../A1_js/parallax.js';
import DimeAlignment from '../A1_js/alignment.js';
import { ScopeSystem } from '../A1_js/scope.js';
import { initArena3Menu } from '../A3_js/tertiaryArena.js';
import { initHUDManager } from '../A3_js/hudManager.js';
import QuaternaryArena from '../A4_js/quaternaryArena.js';
import { initAssetDebugger } from '../A3_js/assetDebugger.js';

export default class TrinkaspaceEngine {
  constructor({ pageId }) {
    // --- Calculate CUC and device class as the very first step ---
    this.a1Width = this.calculateA1Width();
    this.a1Height = this.calculateA1Height();
    this.cuc = this.a1Width / 320;
    this.deviceClass = this.getDeviceClass();
    
    this.pageId = pageId;
    this.container = document.getElementById('arena1-container');
    this.alignment = new DimeAlignment();
    this.scopeSystems = new Map();
    this.scopeConfig = null;
    this.parallax = null;
    this.dioramaAnchors = new Map(); // Store anchorY for each diorama
    this.arena3Menu = null; // Arena 3A menu system
    this.hudManager = null; // Arena 3 HUD manager
    this.quaternaryArena = null; // Arena 4 - The Director
    this.hudLayout = this.determineHUDLayout(); // Calculate based on viewport
    
    // Apply Royal Alpha root variables for CSS
    this.applyRoyalAlphaCSS();
    
    this.init();
  }
  /**
   * Calculate A1 width according to Royal Alpha laws:
   * - Minimum width: 400px (Alpha Realm)
   * - Maximum width: 1200px (Omega Realm)
   * - Calculation: Math.min(1200, Math.max(400, viewportWidth * 0.625))
   */
  calculateA1Width() {
    const viewportWidth = window.innerWidth;
    const a1Width = Math.min(960, Math.max(320, viewportWidth * 0.57));
    console.log(`👑 Royal Alpha: A1 width calculated as ${a1Width}px for viewport ${viewportWidth}px`);
    return a1Width;
  }
  
  /**
   * Calculate A1 height according to Royal Alpha laws:
   * - Minimum height: 320px (Alpha Realm)
   * - Maximum height: 3200px (Omega Realm)
   * - Calculation: Math.min(3200, Math.max(320, viewportHeight * 1.0))
   */
  calculateA1Height() {
    const viewportHeight = window.innerHeight;
    // Use vpN from alpha meta if available, else default to 10
    let vpN = 10;
    if (this.pageAlphaMeta && typeof this.pageAlphaMeta.vpN === 'number') {
      vpN = this.pageAlphaMeta.vpN;
    }
    const a1Height = Math.min(3200, Math.max(320, viewportHeight * vpN));
    console.log(`👑 Royal Alpha: A1 height calculated as ${a1Height}px for viewport ${viewportHeight}px, vpN: ${vpN}`);
    return a1Height;
  }
  
  /**
   * Determine device class based on A1 width according to Royal Alpha rules
   * - 400-600px → XS assets
   * - 601-800px → S assets
   * - 801-1000px → M assets
   * - 1001-1200px → L assets
   */
  getDeviceClass() {
    const deviceClass = 
      this.a1Width >= 1001 ? 'L'  :
      this.a1Width >= 801  ? 'M'  :
      this.a1Width >= 601  ? 'S'  : 'XS';
    
    console.log(`📐 Device class determined: ${deviceClass} for A1 width ${this.a1Width}px`);
    return deviceClass;
  }
  
  /**
   * Determine HUD layout based on viewport width relative to A1 width
   * - If excessRatio < 0.32: Use "NARROW" HUD layout
   * - If excessRatio ≥ 0.32: Use "WIDE" HUD layout
   */
  determineHUDLayout() {
    const viewportWidth = window.innerWidth;
    const excessRatio = (viewportWidth - this.a1Width) / this.a1Width;
    const hudLayout = excessRatio < 0.32 ? 'NARROW' : 'WIDE';
    
    console.log(`🎛️ HUD Layout determined: ${hudLayout} (excess ratio: ${excessRatio.toFixed(2)})`);
    return hudLayout;
  }
  
  /**
   * Apply Royal Alpha CSS variables to document root
   */
  applyRoyalAlphaCSS() {
    document.documentElement.style.setProperty('--a1-width', `${this.a1Width}px`);
    document.documentElement.style.setProperty('--a1-height', `${this.a1Height}px`);
    document.documentElement.style.setProperty('--cuc', this.cuc);
    
    // Set body class for HUD layout
    document.body.classList.remove('hud-layout-wide', 'hud-layout-narrow');
    document.body.classList.add(`hud-layout-${this.hudLayout.toLowerCase()}`);
    
    console.log(`👑 Royal Alpha CSS variables applied: --a1-width: ${this.a1Width}px, --cuc: ${this.cuc}`);
  }
  async init() {
    console.log('🏛️ TrinkaspaceEngine initializing with Royal Alpha system...');
    
    // Initialize asset debugger
    if (window.location.search.includes('debug=assets')) {
      this.assetDebugger = initAssetDebugger(this);
    }
    
    // Initialize Royal Alpha debugger if requested
    if (window.location.search.includes('debug=royal')) {
      import('./royalAlphaDebug.js').then(module => {
        this.royalAlphaDebug = new module.RoyalAlphaDebug(this);
        console.log('👑 Royal Alpha Debug Mode activated');
      });
    }

    // Initialize Quaternary Arena (The Director)
    this.quaternaryArena = new QuaternaryArena(this);
    await this.quaternaryArena.init();
    
    await this.loadPage(this.pageId);
    
    // Handle window resize with Royal Alpha rules
    window.addEventListener('resize', () => {
      // Recalculate Royal Alpha values
      const oldA1Width = this.a1Width;
      const oldDeviceClass = this.deviceClass;
      const oldHudLayout = this.hudLayout;
      
      // Update Royal Alpha metrics
      this.a1Width = this.calculateA1Width();
      this.a1Height = this.calculateA1Height();
      this.cuc = this.a1Width / 320;
      
      // Apply updated CSS variables
      this.applyRoyalAlphaCSS();
      
      // Get new device class
      const newDeviceClass = this.getDeviceClass();
      this.deviceClass = newDeviceClass;
      
      // Determine new HUD layout
      const newHudLayout = this.determineHUDLayout();
      this.hudLayout = newHudLayout;
      
      // If asset size class changed, reload the page
      if (newDeviceClass !== oldDeviceClass || Math.abs(this.a1Width - oldA1Width) > 50) {
        console.log(`📐 Device class changed to ${newDeviceClass} or A1 changed significantly, reloading...`);
        this.container.innerHTML = '';
        this.loadPage(this.pageId);
      } 
      // If only HUD layout changed, update it
      else if (newHudLayout !== oldHudLayout) {
        console.log(`🎛️ HUD Layout changed to ${newHudLayout}, updating...`);
        document.body.classList.remove(`hud-layout-${oldHudLayout.toLowerCase()}`);
        document.body.classList.add(`hud-layout-${newHudLayout.toLowerCase()}`);
        
        // Update HUD if it exists
        if (this.hudManager) {
          this.hudManager.setLayout(newHudLayout);
        }
      }
      
      // Update Royal Alpha debugger if active
      if (this.royalAlphaDebug) {
        this.royalAlphaDebug.update();
      }
    });
    
    window.addEventListener('scroll', () => this.updateParallax(), { passive: true });    
    
    document.addEventListener('keydown', (e) => {
      // Capital D toggles general debug mode
      if (e.key === 'D') document.body.classList.toggle('debug');
      
      // Alt+A toggles asset debugging mode
      if (e.key === 'a' && e.altKey) {
        e.preventDefault();
        this.toggleAssetDebugMode();
      }
      
      // Alt+R toggles Royal Alpha debug mode
      if (e.key === 'r' && e.altKey) {
        e.preventDefault();
        this.toggleRoyalAlphaDebugMode();
      }
    });
    
    console.log('[TrinkaspaceEngine] All three sacred arenas initialized ⊙');
  }

  async loadPage(pageId) {
    console.log(`🎭 Loading page: ${pageId}`);
    // Load omega file (should reference alpha)
    const omegaResponse = await fetch(`./page_omega.json`);
    const omegaData = await omegaResponse.json();
    const cuc = omegaData.CUC || this.cuc;
    const alphaPath = omegaData.alpha || 'alphas/page_alpha.json';
    // Load alpha file
    const alphaResponse = await fetch(alphaPath);
    const alphaData = await alphaResponse.json();
    // Store meta for vpN
    this.pageAlphaMeta = alphaData.meta || {};
    // Debug: Log loaded alphaData
    console.debug('[DEBUG] Loaded alphaData:', alphaData);
    // Use alphaData for dioramas
    const dioramas = alphaData.dioramas || [];
    if (dioramas.length === 0) {
      console.error('[DEBUG] No dioramas found in alphaData:', alphaData);
    }
    this.pageAlphaDioramas = dioramas; // Store for buildDiorama
    // Calculate page height according to Royal Alpha: A1 height × N (default N=10)
    const N = dioramas[0]?.N || 10;
    const pageHeight = `${this.a1Height * N}px`;
    this.container.style.height = pageHeight;
    document.documentElement.style.setProperty('--page-height', pageHeight);
    let firstScope = null;
    for (const diorama of dioramas) {
      console.log(`🎪 Processing diorama: ${diorama.id}`);
      // Debug: Log diorama config and scope paths
      console.debug('[DEBUG] Diorama configPath:', diorama.configPath, 'scopePath:', diorama.scopePath);
      // Correct canonical path for block/box alpha files
      const configPath = diorama.configPath || `A1/${diorama.id}/alphas/config_alpha.json`;
      const scopePath = diorama.scopePath || `A1/${diorama.id}/alphas/scope_alpha.json`;
      try {
        const [config, scope] = await Promise.all([
          fetch(configPath).then(r => r.json()),
          fetch(scopePath).then(r => r.json())
        ]);
        // Debug: Log loaded config and scope
        console.debug(`[DEBUG] Loaded config for ${diorama.id}:`, config);
        console.debug(`[DEBUG] Loaded scope for ${diorama.id}:`, scope);
        if (!firstScope) {
          firstScope = scope;
          this.scopeConfig = scope;
          this.parallax = new ParallaxEngine(this.scopeConfig, cuc);
        }
        // Build diorama with CUC
        const dioramaEl = this.buildDiorama(config, scope, diorama.id, cuc);
        this.container.appendChild(dioramaEl);
        this.dioramaAnchors.set(diorama.id, diorama.anchorY || 0);
      } catch (err) {
        console.error(`[DEBUG] Failed to load diorama ${diorama.id}:`, err);
      }
    }
    
    // Initialize A3 HUD system
    if (!this.hudManager) {
      this.hudManager = initHUDManager({
        hudLayout: this.hudLayout,
        cuc: this.cuc
      });
    }
    
    // Initialize A3 menu system if we have one
    if (alphaData.arena3?.menu) {
      this.initArena3Menu(alphaData.arena3.menu);
    }
    
    // A4 Director takes over moment coordination
    if (this.quaternaryArena) {
      // Connect A4 to the built dioramas
      this.quaternaryArena.setDioramas(this.dioramaAnchors);
      console.log('� A4 Director connected to dioramas');
    }
  }

  buildDiorama(config, scope, dioramaId, cuc = 1.0) {
    const assetBase = `./A1/${dioramaId}`;
    const container = document.createElement('section');
    container.className = 'diorama local-scroll';
    container.id = dioramaId;
    // Get anchorX and anchorY from the diorama entry in page_alpha.json
    const pageAlphaDiorama = (this.pageAlphaDioramas || []).find(d => d.id === dioramaId);
    let anchorX = 0, anchorY = 0;
    if (pageAlphaDiorama) {
      anchorX = (pageAlphaDiorama.anchorX || 0) * cuc;
      anchorY = (pageAlphaDiorama.anchorY || 0) * cuc;
    }
    container.style.position = 'absolute';
    container.style.left = `${anchorX}px`;
    container.style.top = `${anchorY}px`;
    container.style.overflow = 'hidden';
    // Clamp diorama width to never exceed A1 container width
    const a1Width = this.a1Width;
    const scaledWidth = Math.min(config.useAlphaBlueprint ? 320 * cuc : this.a1Width, a1Width);
    const scaledHeight = config.useAlphaBlueprint ? 320 * cuc : this.a1Height;
    container.style.width = `${scaledWidth}px`;
    container.style.height = `${scaledHeight}px`;
    container.style.maxWidth = '100%';
    console.log(`📐 Diorama ${dioramaId} sized: ${scaledWidth}x${scaledHeight}px (CUC: ${cuc})`);
    // Set CSS custom properties
    container.style.setProperty('--a1-width', `${scaledWidth}px`);
    container.style.setProperty('--cuc', cuc);
    // Create natscene container
    const natscene = document.createElement('div');
    natscene.className = 'natscene';
    natscene.style.width = '100%';
    natscene.style.height = 'auto'; // Let natscene expand dynamically as needed
    natscene.style.position = 'relative';
    // Store layerData for this diorama
    container._layerDatas = [];
    config.layers.forEach(layer => {
      const layerEl = document.createElement('div');
      layerEl.className = 'dime-layer';
      layerEl.dataset.parallaxSpeed = layer.parallaxSpeed;
      layerEl.style.zIndex = layer.zIndex;
      layerEl.dataset.layerName = layer.path ? layer.path.split('.')[0] : '';
      layerEl.dataset.yOffset = layer.yOffset || 0;
      // Remove fitToScope logic, always use CUC-scaled dimensions
      if (layer.width) {
        const scaledLayerWidth = config.useAlphaBlueprint ? layer.width * cuc : layer.width;
        layerEl.style.width = `${scaledLayerWidth}px`;
      }
      if (layer.minHeight) {
        const scaledLayerHeight = config.useAlphaBlueprint ? layer.minHeight * cuc : layer.minHeight;
        layerEl.style.minHeight = `${scaledLayerHeight}px`;
      }
      const img = new Image();
      // Try different device class sizes with fallback
      const fallbackOrder = ['L', 'M', 'S', 'XS'];
      const currentIdx = fallbackOrder.indexOf(this.deviceClass);
      const assetPath = `${assetBase}/${this.deviceClass}/${layer.path}`;
      console.log(`🖼️ Loading asset [${this.deviceClass}]: ${assetPath}`);
      img.onload = () => {
        console.info(`✅ Asset loaded: ${this.deviceClass} class for ${layer.path}`);
        layerEl.style.backgroundImage = `url(${img.src})`;
        layerEl.style.backgroundSize = 'contain';
        layerEl.style.backgroundPosition = 'center';
        layerEl.style.backgroundRepeat = 'no-repeat';
        if (layer.blendMode) {
          layerEl.style.mixBlendMode = layer.blendMode;
        }
      };
      img.onerror = () => {
        console.warn(`⚠️ Asset not found: ${assetPath}`);
        layerEl.style.background = 'rgba(255,100,100,0.2)';
        layerEl.style.border = '1px dashed red';
        layerEl.textContent = `⚠️ ${layer.path}`;
      };
      img.src = assetPath;
      // Position layer with CUC
      this.alignment.position(layerEl, layer, cuc);
      natscene.appendChild(layerEl);
      // Store the layer config for parallax
      container._layerDatas.push(layer);
    });
    container.appendChild(natscene);
    
    // Ensure arena1-container is relative and hides overflow
    this.container.style.position = 'relative';
    this.container.style.overflowX = 'hidden';
    
    // Attach local scroll event for parallax
    container.addEventListener('scroll', () => {
      this.updateParallax();
    });
    
    return container;
  }

  updateParallax() {
    // Use the correct selector for diorama sections
    const visibleDioramas = document.querySelectorAll('.diorama.local-scroll:not(.diorama-hidden)');
    visibleDioramas.forEach(diorama => {
      const layers = diorama.querySelectorAll('.dime-layer');
      const layerDatas = diorama._layerDatas || [];
      // Use local scroll for each diorama
      const localScroll = diorama.scrollTop;
      if (this.parallax) {
        this.parallax.update(layers, layerDatas, localScroll);
      }
      const scopeSystem = this.scopeSystems.get(diorama.id);
      if (scopeSystem) {
        scopeSystem.update(layers);
        
        // --- SafetyZone warning ---
        const safetyZone = scopeSystem.safetyZone || 60;
        layers.forEach(layer => {
          const layerRect = layer.getBoundingClientRect();
          const dioramaRect = diorama.getBoundingClientRect();
          const bottomDistance = dioramaRect.bottom - layerRect.bottom;
          if (bottomDistance < safetyZone - 1) {
            if (window.SCOPEGUARD_ENABLED && !window._scopeguardWarned[layer.dataset.layerName]) {
              console.warn(
                `🚨 dime-layer "${layer.dataset.layerName}" in "${diorama.id}" exceeds safetyZone by ${Math.round(safetyZone - bottomDistance)}px`
              );
              window._scopeguardWarned[layer.dataset.layerName] = true;
            }
            layer.dataset.offender = "true";
          } else {
            delete layer.dataset.offender;
          }
        });
      }
    });
  }
  
  /**
   * Load HUD elements defined in the page data
   * @param {object} pageData - The page data containing HUD definitions
   */
  async loadHUDElements(pageData) {
    if (!this.hudManager || !pageData.elements?.huds) return;
    
    console.log(`🎮 Loading ${pageData.elements.huds.length} HUD elements`);
    
    for (const hud of pageData.elements.huds) {
      if (!hud.visible) continue;
      
      try {
        console.log(`🎯 Loading HUD: ${hud.id} from ${hud.configPath}`);
        
        const response = await fetch(hud.configPath);
        if (!response.ok) {
          throw new Error(`Failed to load HUD config: ${response.status}`);
        }
        const hudConfig = await response.json();
        
        // Set layout from HUD config or from page meta
        hudConfig.layout = hud.layout || this.hudLayout;
        
        // Load the HUD
        this.hudManager.loadHUD(hudConfig);
        
        console.log(`✅ HUD loaded: ${hud.id}`);
      } catch (error) {
        console.error(`❌ Failed to load HUD ${hud.id}:`, error);
      }
    }  }
  
  /**
   * Logs asset availability for a given diorama block
   * This helper method allows for inspecting which asset sizes are available
   * @param {string} blockId - The ID of the diorama block to inspect
   */
  inspectAssetAvailability(blockId) {
    if (!blockId) {
      console.error('Cannot inspect assets: No blockId provided');
      return;
    }
    
    console.group(`📊 Asset Availability for ${blockId}`);
    console.log(`Current device class: ${this.deviceClass}`);
    
    const deviceClasses = ['L', 'M', 'S', 'XS'];
    
    // Fetch the directory listing if available
    const testImg = new Image();
    
    deviceClasses.forEach(size => {
      // Use a test image to see if the directory exists
      const testPath = `${blockId}/${size}/test-availability.png`;
      testImg.src = testPath;
      // Just log that we're checking
      console.log(`Checking ${size} assets at ${blockId}/${size}/...`);
    });
    
    console.log('💡 To verify specific assets, check network requests in DevTools');
    console.log('💡 Missing asset directories will show 404 errors in the console');
    console.groupEnd();
  }
  
  /**
   * Toggle asset debugging mode for the current page
   * This adds or removes 'debug=assets' to the URL query string
   * @param {boolean} [enable] - Force enable/disable, or toggle if undefined
   */
  toggleAssetDebugMode(enable) {
    const url = new URL(window.location.href);
    const hasDebug = url.searchParams.has('debug');
    const debugValue = url.searchParams.get('debug');
    
    // If enable is not specified, toggle the current state
    const shouldEnable = enable === undefined 
      ? !(hasDebug && debugValue === 'assets') 
      : enable;
    
    if (shouldEnable) {
      url.searchParams.set('debug', 'assets');
      console.log('🔍 Asset debugging enabled - reloading page');
    } else {
      // If debug=assets, remove it, otherwise leave as is
      if (hasDebug && debugValue === 'assets') {
        url.searchParams.delete('debug');
        console.log('🔍 Asset debugging disabled - reloading page');
      } else {
        // No change needed
        return;
      }
    }
    
    // Reload with new URL
    window.location.href = url.toString();
  }
  
  /**
   * Toggle Royal Alpha debugging mode for the current page
   * This adds or removes 'debug=royal' to the URL query string
   * @param {boolean} [enable] - Force enable/disable, or toggle if undefined
   */
  toggleRoyalAlphaDebugMode(enable) {
    const url = new URL(window.location.href);
    const hasDebug = url.searchParams.has('debug');
    const debugValue = url.searchParams.get('debug');
    
    // If enable is not specified, toggle the current state
    const shouldEnable = enable === undefined 
      ? !(hasDebug && debugValue === 'royal') 
      : enable;
    
    if (shouldEnable) {
      url.searchParams.set('debug', 'royal');
      console.log('👑 Royal Alpha debugging enabled - reloading page');
    } else {
      // If debug=royal, remove it, otherwise leave as is
      if (hasDebug && debugValue === 'royal') {
        url.searchParams.delete('debug');
        console.log('👑 Royal Alpha debugging disabled - reloading page');
      } else {
        // No change needed
        return;
      }
    }
    
    // Reload with new URL
    window.location.href = url.toString();
  }
}