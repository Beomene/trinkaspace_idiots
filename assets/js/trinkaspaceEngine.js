import { ParallaxEngine } from './parallax.js';
import DimeAlignment from './alignment.js';
import { ScopeSystem } from './scope.js';
import { initArena3Menu } from './tertiaryArena.js';
import { initHUDManager } from './hudManager.js';
import keyboardNavigation from './keyboardNavigation.js';
import QuaternaryArena from './quaternaryArena.js';
// Import the asset debugger
import { initAssetDebugger } from './assetDebugger.js';

export default class TrinkaspaceEngine {
  constructor({ pageId }) {
    this.pageId = pageId;
    this.container = document.getElementById('trinkaspace-container');
    this.alignment = new DimeAlignment();
    
    // Royal Alpha properties
    this.a1Width = this.calculateA1Width();  // A1 width in pixels
    this.cuc = this.a1Width / 400;           // Coordinate Unifying Coefficient
    this.pageOrigoX = 200 * this.cuc;        // X coordinate of page origo
    this.pageOrigoY = 2000 * this.cuc;       // Y coordinate of page origo
    
    this.deviceClass = this.getDeviceClass(); // Device class determination 
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
    const a1Width = Math.min(1200, Math.max(400, viewportWidth * 0.625));
    
    console.log(`👑 Royal Alpha: A1 width calculated as ${Math.round(a1Width)}px for viewport ${viewportWidth}px`);
    return Math.round(a1Width);
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
    document.documentElement.style.setProperty('--cuc', this.cuc);
    document.documentElement.style.setProperty('--page-origo-x', `${this.pageOrigoX}px`);
    document.documentElement.style.setProperty('--page-origo-y', `${this.pageOrigoY}px`);
    
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
      this.cuc = this.a1Width / 400;
      this.pageOrigoX = 200 * this.cuc;
      this.pageOrigoY = 2000 * this.cuc;
      
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
    
    // Initialize keyboard navigation
    this.initKeyboardNavigation();
    
    // Initialize the asset debugger
    initAssetDebugger();
    
    console.log('[TrinkaspaceEngine] All three sacred arenas initialized ⊙');
  }

  async loadPage(pageId) {
    console.log(`🎭 Loading page: ${pageId}`);
    const cleanPageId = pageId.replace(/^pages\//, '');
    console.log(`📁 Fetching page.json from: ./page.json`);
    const response = await fetch(`./page.json`);
    const pageData = await response.json();    console.log('📊 Page data loaded:', pageData);    // Calculate page height according to Royal Alpha: A1 width × 10
    const pageHeight = pageData.meta?.pageHeight || `${this.a1Width * 10}px`;
    this.container.style.height = pageHeight;
    console.log(`👑 Set container height to: ${this.container.style.height} (Royal Alpha: A1 × 10)`);
    
    // Set page dimensions in CSS custom properties
    document.documentElement.style.setProperty('--page-height', pageHeight);
      // Set HUD layout from page meta if available, otherwise use Royal Alpha calculation
    const pageDefinedLayout = pageData.meta?.hudLayout;
    
    if (pageDefinedLayout) {
      this.hudLayout = pageDefinedLayout;
      console.log(`🖥️ HUD Layout set from page meta: ${this.hudLayout}`);
    } else {
      // Use calculated layout from Royal Alpha
      this.hudLayout = this.determineHUDLayout();
      console.log(`� HUD Layout set by Royal Alpha: ${this.hudLayout}`);
    }
    
    // Apply the layout to the body class
    document.body.classList.remove('hud-layout-wide', 'hud-layout-narrow');
    document.body.classList.add(`hud-layout-${this.hudLayout.toLowerCase()}`);

    let firstScope = null;    // Check if we have dioramas (current structure)
    const dioramas = pageData.dioramas || pageData.elements?.dioramas || [];
    
    if (!dioramas.length) {
      console.log('⚠️ No dioramas found in pageData');
      return;
    }

    for (const diorama of dioramas) {
      console.log(`🎪 Processing diorama: ${diorama.id}`);
      
      // Extract folder prefix (A1/, A2/, etc.) from configPath if present
      const configPathParts = diorama.configPath.split('/');
      const folderPrefix = configPathParts.length > 1 ? configPathParts[0] + '/' : '';
      const dioramaFolderPath = folderPrefix + diorama.id;
      
      console.log(`📂 Resolved diorama folder path: ${dioramaFolderPath}`);
      
      const [config, scope] = await Promise.all([
        fetch(diorama.configPath).then(r => r.json()),
        fetch(diorama.scopePath).then(r => r.json())
      ]);
      console.log(`⚙️  Config loaded for ${diorama.id}:`, config);
      console.log(`📐 Scope loaded for ${diorama.id}:`, scope);

      if (!firstScope) {
        firstScope = scope;
        this.scopeConfig = scope;
        this.parallax = new ParallaxEngine(this.scopeConfig);
        console.log('🎯 First scope set for parallax:', firstScope);
      }

      console.log(`🏗️  Building diorama for ${diorama.id}...`);
      // Pass the folder path prefix to the buildDiorama method
      this.buildDiorama(config, scope, dioramaFolderPath);
      
      // Store anchor for diorama
      this.dioramaAnchors.set(diorama.id, config.anchorY || 0);
    }
    
    // Initialize A3 HUD system
    if (!this.hudManager) {
      this.hudManager = initHUDManager({
        hudLayout: this.hudLayout,
        cuc: this.cuc
      });
    }
    
    // Initialize A3 menu system if we have one
    if (pageData.arena3?.menu) {
      this.initArena3Menu(pageData.arena3.menu);
    }
    
    // A4 Director takes over moment coordination
    if (this.quaternaryArena) {
      // Connect A4 to the built dioramas
      this.quaternaryArena.setDioramas(this.dioramaAnchors);
      console.log('� A4 Director connected to dioramas');
    }
  }

  buildDiorama(config, scope, dioramaId) {
    // Use local asset path for pages structure with Royal Alpha size folders
    const assetBase = `./A1/${dioramaId}`;
    console.log(`📁 Using local asset base: ${assetBase}`);
    
    const container = document.createElement('div');
    container.className = 'diorama-container';
    container.id = `diorama-${dioramaId}`;
    
    // Apply Royal Alpha sizing with CUC scaling
    const scaledWidth = config.useAlphaBlueprint ? 400 * this.cuc : this.a1Width;
    const scaledHeight = config.useAlphaBlueprint ? 400 * this.cuc : this.a1Width;
    
    container.style.width = `${scaledWidth}px`;
    container.style.height = `${scaledHeight}px`;
    container.style.position = 'absolute';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    
    console.log(`📐 Diorama ${dioramaId} sized: ${scaledWidth}x${scaledHeight}px (CUC: ${this.cuc})`);
    
    // Set CSS custom properties
    container.style.setProperty('--a1-width', `${scaledWidth}px`);
    container.style.setProperty('--cuc', this.cuc);

    // Create natscene container
    const natscene = document.createElement('div');
    natscene.className = 'natscene';
    natscene.style.width = '100%';
    natscene.style.height = '100%';
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

      // Fit-to-scope logic
      if (layer.fitToScope) {
        layerEl.classList.add('fit-to-scope');
        layerEl.style.width = '100%';
        layerEl.style.height = '100%';
      }

      // Scale layer dimensions with CUC
      if (layer.width) {
        const scaledLayerWidth = config.useAlphaBlueprint ? layer.width * this.cuc : layer.width;
        layerEl.style.width = `${scaledLayerWidth}px`;
      }
      
      if (layer.minHeight) {
        const scaledLayerHeight = config.useAlphaBlueprint ? layer.minHeight * this.cuc : layer.minHeight;
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
        layerEl.style.backgroundSize = layer.fitToScope ? 'cover' : 'contain';
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
      
      // Position layer
      this.alignment.position(layerEl, layer);
      natscene.appendChild(layerEl);

      // Store the layer config for parallax
      container._layerDatas.push(layer);
    });

    container.appendChild(natscene);
    return container;
  }  updateParallax() {
    const visibleDioramas = document.querySelectorAll('.diorama-container:not(.diorama-hidden)');
    visibleDioramas.forEach(diorama => {
      const layers = diorama.querySelectorAll('.dime-layer');
      const layerDatas = diorama._layerDatas || [];
      const anchorY = this.dioramaAnchors.get(diorama.id) || 0;
      const localScroll = Math.max(0, window.scrollY + window.innerHeight - anchorY);

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
   * Initializes keyboard navigation for the page
   */
  initKeyboardNavigation() {
    // Skip links for accessibility
    keyboardNavigation.addSkipLinks([
      {
        text: 'Skip to main content',
        target: '#trinkaspace-container'
      },
      {
        text: 'Skip to navigation',
        target: '#arena-hud'
      }
    ]);

    // Make content sections focusable
    keyboardNavigation.makeContentFocusable();

    // Set up page navigation
    keyboardNavigation.setupPageNavigation();
    
    // Register story-specific shortcuts
    this.registerStoryShortcuts();
    
    console.log('[TrinkaspaceEngine] Keyboard navigation initialized');
  }

  /**
   * Register story-specific keyboard shortcuts
   */
  registerStoryShortcuts() {
    // Scroll to next section
    keyboardNavigation.registerShortcut('n', () => {
      this.scrollToNextSection();
    }, 'Scroll to next section');

    // Toggle debug view
    keyboardNavigation.registerShortcut('d', () => {
      document.body.classList.toggle('debug');
    }, 'Toggle debug view');
  }

  /**
   * Scroll to the next logical section of content
   */
  scrollToNextSection() {
    // Get all anchor points in order
    const anchorPoints = [];
    
    // Add diorama anchors
    this.dioramaAnchors.forEach((anchorY, id) => {
      anchorPoints.push({
        id,
        y: anchorY,
        type: 'diorama'
      });
    });
    
    // Sort by Y position
    anchorPoints.sort((a, b) => a.y - b.y);
    
    // Find the next anchor based on current scroll position
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    
    // Find the first anchor point that's below the current viewport
    const nextAnchor = anchorPoints.find(anchor => {
      const anchorPosition = anchor.y * viewportHeight;
      return anchorPosition > scrollY + (viewportHeight * 0.3);
    });
    
    if (nextAnchor) {
      // Scroll to the next anchor point
      const scrollTarget = nextAnchor.y * viewportHeight;
      window.scrollTo({
        top: scrollTarget,
        behavior: 'smooth'
      });
    } else {
      // If no next anchor, scroll to the end
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }
  
  /**
   * Load and display text boxes based on configuration
   * @param {Array} textBoxes - Array of text box configurations
   */
  async loadTextBoxes(textBoxes) {
    console.log('📝 Loading text boxes:', textBoxes);
    
    if (!Array.isArray(textBoxes)) {
      console.error('⚠️ textBoxes is not an array:', textBoxes);
      return;
    }
    
    // Process and create each text box
    for (let i = 0; i < textBoxes.length; i++) {
      try {
        await this.createTextBox(textBoxes[i], i);
      } catch (err) {
        console.error(`⚠️ Error creating text box ${i}:`, err);
      }
    }
  }
  
  /**
   * Create and render an individual text box
   * @param {Object} config - Text box configuration
   * @param {Number} index - Index of the text box
   */
  async createTextBox(config, index) {
    const { text, contentPath, speaker, voice, anchorTo, offsetY, align } = config;
    
    // Create text box container
    const textBoxElement = document.createElement('div');
    textBoxElement.className = 'text-box';
    textBoxElement.id = config.id || `textbox-${index}`;
    textBoxElement.setAttribute('data-voice', voice || '');
    textBoxElement.setAttribute('data-speaker', speaker || '');
    
    // Create speaker label if provided
    if (speaker) {
      const speakerElement = document.createElement('div');
      speakerElement.className = 'speaker-label';
      speakerElement.textContent = speaker;
      textBoxElement.appendChild(speakerElement);
    }
    
    // Load text content
    let textContent = text || '';
    
    // If contentPath is provided, load from markdown file
    if (contentPath && !text) {
      try {
        const contentUrl = `/pages/chapter_001/001_001/${contentPath}`;
        console.log(`📄 Loading text content from: ${contentUrl}`);
        
        const response = await fetch(contentUrl);
        if (response.ok) {
          textContent = await response.text();
          console.log(`✅ Text content loaded successfully from ${contentPath}`);
        } else {
          console.error(`❌ Failed to load content from ${contentPath}: ${response.status}`);
          textContent = `[Content not found: ${contentPath}]`;
        }
      } catch (error) {
        console.error(`❌ Error loading content from ${contentPath}:`, error);
        textContent = `[Error loading: ${contentPath}]`;
      }
    }
    
    // Create text content element
    const textElement = document.createElement('div');
    textElement.className = 'text-content';
    
    // Parse markdown if we have content
    if (textContent) {
      textElement.innerHTML = DOMPurify.sanitize(marked.parse(textContent));
    } else {
      textElement.innerHTML = '[No content available]';
    }
    
    textBoxElement.appendChild(textElement);
    
    // Position based on anchor if provided
    if (anchorTo) {
      const anchorElement = document.getElementById(`diorama-${anchorTo}`);
      if (anchorElement) {
        // Position relative to the anchor
        const anchorRect = anchorElement.getBoundingClientRect();
        const calculatedOffsetY = offsetY ? this.parseOffset(offsetY) : 0;
        
        textBoxElement.style.position = 'absolute';
        textBoxElement.style.top = `calc(${anchorRect.top + calculatedOffsetY}px)`;
        
        // Handle alignment
        if (align === 'right') {
          textBoxElement.style.right = '5%';
        } else if (align === 'center') {
          textBoxElement.style.left = '50%';
          textBoxElement.style.transform = 'translateX(-50%)';
        } else {
          textBoxElement.style.left = '5%';
        }
      } else {
        console.warn(`⚠️ Anchor element not found for text box: ${config.id}`, anchorTo);
      }
    }
    
    // Add to container
    this.container.appendChild(textBoxElement);
    
    // Add focus ability for keyboard navigation
    if (textBoxElement) {
      textBoxElement.setAttribute('tabindex', '0');
      textBoxElement.setAttribute('role', 'region');
      textBoxElement.setAttribute('aria-label', `${speaker ? speaker + ' says: ' : ''}${textContent}`);
    }
  }
  
  /**
   * Parse offset string into pixels or viewport units
   * @param {String} offset - Offset string (e.g., "10vh", "50px")
   * @returns {Number} - Calculated offset in pixels
   */
  parseOffset(offset) {
    if (typeof offset !== 'string') {
      return 0;
    }
    
    if (offset.endsWith('vh')) {
      const value = parseFloat(offset);
      return (value / 100) * window.innerHeight;
    }
    
    if (offset.endsWith('px')) {
      return parseFloat(offset);
    }
    
    return parseFloat(offset) || 0;
  }
  
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
    
    const deviceClasses = ['XL', 'L', 'M', 'S', 'XS'];
    
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