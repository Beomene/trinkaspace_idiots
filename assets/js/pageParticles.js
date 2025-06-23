/**
 * Script to enable particle effects on specific pages
 * Import this on pages where you want particle effects to appear
 */

import defaultParticleSystem from './particleEffects.js';

/**
 * Initialize particle effects for a page
 * @param {Object} options - Configuration options
 */
export function initPageParticles(options = {}) {
  // Default configuration for the page
  const config = {
    // Whether to auto-enable particles or wait for user trigger
    autoEnable: options.autoEnable !== undefined ? options.autoEnable : false,
    // Preset to use ('aria', 'emraa', 'dharvath', 'fjottskran', 'eene')
    preset: options.preset || 'aria',
    // Container to attach particles to (defaults to body)
    container: options.container || document.body,
    // Custom configuration (overrides preset)
    particleConfig: options.particleConfig || {}
  };
  
  // Initialize particle system
  defaultParticleSystem.init(config.container);
  
  // Apply preset if specified
  if (config.preset) {
    applyPreset(config.preset);
  }
  
  // Apply custom configuration if provided
  if (Object.keys(config.particleConfig).length > 0) {
    defaultParticleSystem.configure(config.particleConfig);
  }
  
  // Auto-enable if configured
  if (config.autoEnable) {
    defaultParticleSystem.start();
  }
  
  console.log(`🌟 Page particles initialized with preset: ${config.preset}`);
}

/**
 * Apply predefined particle presets
 * @param {string} presetName - Name of the preset to apply
 */
function applyPreset(presetName) {
  const presets = {
    aria: {
      particleCount: 12,
      particleSize: 7,
      colors: ['rgba(42, 255, 247, 0.8)', 'rgba(156, 217, 249, 0.7)'],
      followSpeed: 0.05,
      lifespan: 3000,
      glow: true,
      trailEffect: false
    },
    emraa: {
      particleCount: 15,
      particleSize: 6,
      colors: ['rgba(255, 159, 243, 0.7)', 'rgba(255, 255, 255, 0.6)'],
      followSpeed: 0.07,
      lifespan: 2500,
      glow: true,
      trailEffect: true
    },
    dharvath: {
      particleCount: 20,
      particleSize: 4,
      colors: ['rgba(253, 203, 110, 0.7)'],
      followSpeed: 0.03,
      lifespan: 5000,
      glow: true,
      trailEffect: false
    },
    fjottskran: {
      particleCount: 8,
      particleSize: 9,
      colors: ['rgba(42, 255, 247, 0.8)', 'rgba(255, 255, 255, 0.6)'],
      followSpeed: 0.09,
      lifespan: 1800,
      glow: true,
      trailEffect: true
    },
    eene: {
      particleCount: 25,
      particleSize: 5,
      colors: ['rgba(156, 217, 249, 0.7)', 'rgba(255, 255, 255, 0.6)'],
      followSpeed: 0.02,
      lifespan: 7000,
      glow: true,
      trailEffect: false
    }
  };
  
  // Get preset configuration
  const presetConfig = presets[presetName] || presets.aria;
  
  // Apply configuration
  defaultParticleSystem.configure(presetConfig);
}

/**
 * Toggle particles for a specific scene/section
 * @param {boolean} enable - Whether to enable or disable particles
 * @param {string} preset - Optional preset to apply when enabling
 */
export function toggleSceneParticles(enable, preset) {
  if (enable) {
    // Apply preset if specified
    if (preset) {
      applyPreset(preset);
    }
    
    // Start particles
    defaultParticleSystem.start();
  } else {
    // Stop particles
    defaultParticleSystem.stop();
  }
}
