/**
 * Particle Effects System
 * Creates small particles that follow the cursor with various behaviors
 * 
 * This is different from cursorChase.js which affects DOM elements.
 * This system creates small visual particles (7-8px) like glowing dots and orbs
 * that can be enabled on specific pages or scenes.
 */

class ParticleSystem {
  constructor(options = {}) {
    // Default configuration
    this.config = {
      particleCount: options.particleCount || 12,
      particleSize: options.particleSize || 7,
      colors: options.colors || ['rgba(42, 255, 247, 0.8)', 'rgba(255, 255, 255, 0.6)', 'rgba(156, 217, 249, 0.7)'],
      maxDistance: options.maxDistance || 100,
      followSpeed: options.followSpeed || 0.05,
      decay: options.decay || 0.02,
      spawnRate: options.spawnRate || 0.2,
      lifespan: options.lifespan || 3000,
      trailEffect: options.trailEffect || false,
      glow: options.glow || true,
      active: options.active !== undefined ? options.active : false
    };
    
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.canvas = null;
    this.ctx = null;
    this.lastTime = 0;
    this.container = null;
    
    // Bind methods
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.animate = this.animate.bind(this);
  }
  
  /**
   * Initialize the particle system on a specific container
   * @param {string|HTMLElement} container - The container to add particles to
   */
  init(container) {
    // Get or create container
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container || document.body;
    
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'particle-canvas';
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '1000';
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Get drawing context
    this.ctx = this.canvas.getContext('2d');
    
    // Add canvas to container
    this.container.appendChild(this.canvas);
    
    // Add event listeners
    document.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Handle keyboard toggle (Alt+P)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'p' && e.altKey) {
        this.toggle();
        e.preventDefault();
      }
    });
    
    // Start animation if active
    if (this.config.active) {
      this.start();
    }
    
    console.log('✨ Particle system initialized');
    return this;
  }
  
  /**
   * Handle mouse movement
   * @param {MouseEvent} event - Mouse event
   */
  handleMouseMove(event) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    
    // Spawn particles occasionally based on mouse movement
    if (this.config.active && Math.random() < this.config.spawnRate) {
      this.spawnParticle(this.mouseX, this.mouseY);
    }
  }
  
  /**
   * Handle window resize
   */
  handleResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  /**
   * Create a new particle
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  spawnParticle(x, y) {
    const colorIndex = Math.floor(Math.random() * this.config.colors.length);
    const size = this.config.particleSize * (0.5 + Math.random() * 0.8);
    
    // Add random offset
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;
    
    const particle = {
      x: x + offsetX,
      y: y + offsetY,
      targetX: x,
      targetY: y,
      size: size,
      color: this.config.colors[colorIndex],
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: this.config.lifespan * (0.7 + Math.random() * 0.6),
      maxLife: this.config.lifespan,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02
    };
    
    this.particles.push(particle);
    
    // Keep particle count in check
    if (this.particles.length > this.config.particleCount * 2) {
      this.particles.shift();
    }
  }
  
  /**
   * Update and render all particles
   * @param {number} timestamp - Animation timestamp
   */
  animate(timestamp) {
    if (!this.config.active) return;
    
    // Calculate delta time
    const delta = timestamp - (this.lastTime || timestamp);
    this.lastTime = timestamp;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update mouse target coordinates for all particles
    const now = Date.now();
    
    // Update and draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Update life
      particle.life -= delta;
      
      // Remove dead particles
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      
      // Calculate life ratio (1 to 0)
      const lifeRatio = particle.life / particle.maxLife;
      
      // Update position - drift toward cursor with some randomness
      const dx = particle.targetX - particle.x;
      const dy = particle.targetY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Add some drift
      particle.vx += dx * this.config.followSpeed * delta / 16;
      particle.vy += dy * this.config.followSpeed * delta / 16;
      
      // Apply velocity decay
      particle.vx *= (1 - this.config.decay);
      particle.vy *= (1 - this.config.decay);
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Update rotation
      particle.rotation += particle.rotationSpeed;
      
      // Calculate alpha based on life
      const alpha = lifeRatio;
      
      // Draw particle
      this.ctx.save();
      this.ctx.translate(particle.x, particle.y);
      this.ctx.rotate(particle.rotation);
      
      // Handle glow effect
      if (this.config.glow) {
        this.ctx.shadowBlur = particle.size * 2;
        this.ctx.shadowColor = particle.color;
      }
      
      // Create particle shape
      const color = particle.color.replace(/[\d\.]+\)$/, `${alpha})`);
      this.ctx.fillStyle = color;
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
    }
    
    // Continue animation
    requestAnimationFrame(this.animate);
  }
  
  /**
   * Start the particle system
   */
  start() {
    this.config.active = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.animate);
    console.log('✨ Particle system started');
    return this;
  }
  
  /**
   * Stop the particle system
   */
  stop() {
    this.config.active = false;
    console.log('✨ Particle system stopped');
    return this;
  }
  
  /**
   * Toggle particle system on/off
   */
  toggle() {
    if (this.config.active) {
      this.stop();
    } else {
      this.start();
    }
    return this;
  }
  
  /**
   * Change particle system configuration
   * @param {Object} options - New configuration options
   */
  configure(options) {
    this.config = { ...this.config, ...options };
    return this;
  }
}

// Create and export default instance
const defaultParticleSystem = new ParticleSystem();
export default defaultParticleSystem;

// Named export for custom instances
export { ParticleSystem };
