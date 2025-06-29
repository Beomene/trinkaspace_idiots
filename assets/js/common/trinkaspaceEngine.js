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
    console.log(`🎭 Loading page from ALPHA blueprint: ${pageId}`);
    // Fetch the alpha files relative to the current page directory
    const alphaPath = `alphas/page_alpha.json`;
    const scriptPath = `alphas/script_alpha.json`;
    try {
      const [alphaResponse, scriptResponse] = await Promise.all([
        fetch(alphaPath),
        fetch(scriptPath)
      ]);
      const alphaData = await alphaResponse.json();
      const scriptData = await scriptResponse.json();
      // Optionally, initialize A4 Director with the true alpha script
      if (this.quaternaryArena) {
        // Instead of loadScript, call loadScriptData with the correct path
        this.quaternaryArena.scriptData = scriptData;
        if (typeof this.quaternaryArena.parseMoments === 'function') {
          this.quaternaryArena.parseMoments();
        }
        console.log('🎬 A4 Director has received the alpha script.');
      }
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
      // Build dioramas and append to container
      this.container.innerHTML = '';
      for (const diorama of dioramas) {
        console.log(`🎪 Processing diorama: ${diorama.id}`);
        // Debug: Log diorama config and scope paths
        console.debug('[DEBUG] Diorama configPath:', diorama.configPath, 'scopePath:', diorama.scopePath);
        // Use correct canonical path for block/box alpha files
        // If configPath/scopePath are not provided, use the convention: A1/{diorama.id}/alphas/config_alpha.json
        const configPath = diorama.configPath || `A1/${diorama.id}/alphas/config_alpha.json`;
        const scopePath = diorama.scopePath || `A1/${diorama.id}/alphas/scope_alpha.json`;
        try {
          const [config, scope] = await Promise.all([
            fetch(configPath).then(r => r.json()),
            fetch(scopePath).then(r => r.json())
          ]);
          // Debug: Log loaded config and scope
          console.debug(`[DEBUG] Loaded config for ${diorama.id}:`, config);
          const dioramaElement = this.buildDiorama(config, scope, diorama.id, this.cuc);
          this.container.appendChild(dioramaElement);
        } catch (e) {
          console.error(e);
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
    } catch (e) {
      console.error(e);
    }
  }

  buildDiorama(config, scope, dioramaId, cuc = 1.0) {
    const container = document.createElement('section');
    container.className = 'diorama'; // Remove local-scroll
    container.id = dioramaId;
    
    // Set explicit dimensions
    container.style.width = `${config.width * cuc}px`;
    container.style.height = `${config.height * cuc}px`;
    container.style.left = `${config.x * cuc}px`;
    container.style.top = `${config.y * cuc}px`;
    
    // Create visible debug outline
    if (this.debugMode) {
      container.style.outline = '2px dashed cyan';
    }

    // Natscene container
    const natscene = document.createElement('div');
    natscene.className = 'natscene';
    natscene.style.width = '100%';
    natscene.style.height = '100%';
    
    // Add layers
    config.layers.forEach(layer => {
      const layerEl = document.createElement('div');
      layerEl.className = 'dime-layer';
      layerEl.style.backgroundImage = `url(${this.getAssetPath(layer.path)})`;
      layerEl.style.backgroundSize = 'contain';
      natscene.appendChild(layerEl);
    });

    container.appendChild(natscene);
    return container;
  }

  updateParallax() {
    // Use the correct selector for diorama sections
    const visibleDioramas = document.querySelectorAll('.diorama.local-scroll:not(.diorama-hidden)');
    const debugEnabled = this.pageAlphaMeta && this.pageAlphaMeta.debug;
    visibleDioramas.forEach(diorama => {
      const layers = diorama.querySelectorAll('.dime-layer');
      const layerDatas = diorama._layerDatas || [];
      // Use local scroll for each diorama
      const localScroll = diorama.scrollTop;
      if (this.parallax) {
        this.parallax.update(layers, layerDatas, localScroll);
        if (debugEnabled) {
          console.debug(`[PARALLAX DEBUG] Parallax updated for diorama ${diorama.id} with scrollTop:`, localScroll);
        }
      } else if (debugEnabled) {
        console.warn(`[PARALLAX DEBUG] Parallax engine is NOT initialized for diorama ${diorama.id}`);
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
}