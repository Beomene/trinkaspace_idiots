import { ParallaxEngine } from './A1_js/parallax.js';
import DimeAlignment from './A1_js/alignment.js';

export default class TrinkaspaceEngine {
  constructor({ pageId }) {
    this.pageId = pageId;
    this.container = document.getElementById('arena1-container');
    this.alignment = new DimeAlignment();
    this.parallax = new ParallaxEngine();
    
    this.init();
  }

  async init() {
    try {
      await this.loadPage(this.pageId);
      window.addEventListener('scroll', this.updateParallax.bind(this));
      console.log('Trinkaspace Engine initialized with Alpha purity');
    } catch (error) {
      console.error('Initialization failed:', error);
    }
  }

  async loadPage(pageId) {
    try {
      // Load ONLY from alpha files
      const alphaPath = `pages/chapters/chapter_001/${pageId}/alphas/page_alpha.json`;
      console.log(`Loading Alpha blueprint from: ${alphaPath}`);
      
      const response = await fetch(alphaPath);
      if (!response.ok) throw new Error(`Failed to load Alpha: ${response.status}`);
      
      const alphaData = await response.json();
      
      if (!alphaData.elements?.dioramas) {
        throw new Error('Alpha blueprint missing dioramas array');
      }

      // Set page height from Alpha meta
      this.container.style.height = alphaData.meta?.pageHeight || '10000px';
      this.container.innerHTML = '';

      // Load each diorama from Alpha paths
      for (const diorama of alphaData.elements.dioramas) {
        const configPath = `pages/chapters/chapter_001/${pageId}/A1/${diorama.id}/config_alpha.json`;
        const dioramaElement = await this.buildDiorama(configPath, diorama);
        this.container.appendChild(dioramaElement);
      }
    } catch (error) {
      console.error('Failed to load page:', error);
      throw error;
    }
  }

  async buildDiorama(configPath, dioramaData) {
    try {
      const config = await (await fetch(configPath)).json();
      
      const container = document.createElement('section');
      container.className = 'diorama';
      container.id = `diorama-${dioramaData.id}`;
      
      // Position from Alpha data
      Object.assign(container.style, {
        position: 'absolute',
        left: '0',
        top: `${dioramaData.anchorY || 0}px`,
        width: '100%',
        height: '100vh',
        zIndex: '1'
      });

      const natscene = document.createElement('div');
      natscene.className = 'natscene';
      natscene.style.cssText = `
        width: 100%;
        height: 100%;
        position: relative;
      `;

      // Build layers from Alpha config
      for (const layer of config.layers || []) {
        const layerEl = document.createElement('div');
        layerEl.className = 'dime-layer';
        layerEl.dataset.parallaxSpeed = layer.parallaxSpeed || 0.5;
        
        const img = new Image();
        img.src = this.getLayerPath(dioramaData.id, layer);
        img.onerror = () => {
          layerEl.style.backgroundColor = 'rgba(255,100,100,0.2)';
          layerEl.textContent = layer.name || 'Missing layer';
        };
        
        layerEl.appendChild(img);
        natscene.appendChild(layerEl);
      }

      container.appendChild(natscene);
      return container;
    } catch (error) {
      console.error(`Failed to build diorama ${dioramaData.id}:`, error);
      const errorEl = document.createElement('div');
      errorEl.textContent = `Failed to load diorama ${dioramaData.id}`;
      return errorEl;
    }
  }

  getLayerPath(dioramaId, layer) {
    return `pages/chapters/chapter_001/${this.pageId}/A1/${dioramaId}/${this.getDeviceClass()}/${layer.path}`;
  }

  getDeviceClass() {
    const width = window.innerWidth;
    return width >= 1200 ? 'L' :
           width >= 800 ? 'M' :
           width >= 600 ? 'S' : 'XS';
  }

  updateParallax() {
    const scrollY = window.scrollY;
    document.querySelectorAll('.dime-layer').forEach(layer => {
      const speed = parseFloat(layer.dataset.parallaxSpeed) || 0.5;
      layer.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }
}