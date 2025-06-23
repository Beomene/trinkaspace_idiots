/**
 * AI Gallery Manager
 * This script handles image loading and parallax effects for the AI-gallery
 */

class AiGalleryManager {
    constructor() {
        this.imageBasePath = '/pages/AI-gallery/images/';
        this.characterId = this._getCharacterId();
        this.parallaxElements = [];
        this.lastScrollPosition = 0;
        this.lastScrollX = 0;
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.ticking = false;
    }

    /**
     * Get the character ID from the current page
     */
    _getCharacterId() {
        // Extract from URL (e.g., aria.html -> aria)
        const pathname = window.location.pathname;
        const filename = pathname.split('/').pop();
        return filename.replace('.html', '');
    }

    /**
     * Load all images for the current character
     */
    loadImages() {
        // Get all images with data-character-image attribute
        const images = document.querySelectorAll('[data-character-image]');
        
        images.forEach(img => {
            const imageType = img.getAttribute('data-character-image');
            let path;
            
            switch(imageType) {
                case 'portrait':
                    path = `${this.imageBasePath}${this.characterId}.png`;
                    break;
                case 'landscape':
                    path = `${this.imageBasePath}backgrounds/${this.characterId}-background.png`;
                    break;
                case 'banner':
                    path = `${this.imageBasePath}banners/${this.characterId}-banner.png`;
                    break;
                case 'midline_banner':
                    path = `${this.imageBasePath}banners/MIDLINE_BANNER_${this.characterId}.png`;
                    break;
                case 'upper_banner':
                    path = `${this.imageBasePath}banners/UPPER_BANNER_${this.characterId}.png`;
                    break;
                case 'lower_banner':
                    path = `${this.imageBasePath}banners/LOWER_BANNER_${this.characterId}.png`;
                    break;
                case 'decoration_banner':
                    path = `${this.imageBasePath}banners/DECORATION_BANNER_${this.characterId}.png`;
                    break;
                default:
                    // For custom image types with specific filenames
                    path = `${this.imageBasePath}${imageType}.png`;
            }
            
            img.src = path;
        });
    }

    /**
     * Initialize parallax effects
     */
    initParallax() {
        // Find elements with parallax data attribute
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        
        // Set up event listeners
        window.addEventListener('scroll', this._handleScroll.bind(this));
        window.addEventListener('resize', this._handleResize.bind(this));
        
        // Store window dimensions
        this._updateWindowDimensions();
        
        // Initial position update
        this._updateParallaxPositions();
        
        // Initialize oversized elements
        this._initOversizedElements();
    }
    
    /**
     * Initialize any elements that should be larger than viewport
     */
    _initOversizedElements() {
        const oversizedElements = document.querySelectorAll('.parallax-oversized');
        
        oversizedElements.forEach(element => {
            // Get the oversized factor (e.g., 1.5 = 150% of viewport width)
            const oversizeFactor = parseFloat(element.getAttribute('data-oversize-factor') || 1.5);
            
            // Apply the oversized width
            if (element.classList.contains('oversize-x')) {
                element.style.width = `${this.windowWidth * oversizeFactor}px`;
                // Center the element
                element.style.left = `${-(this.windowWidth * (oversizeFactor - 1) / 2)}px`;
            }
            
            if (element.classList.contains('oversize-y')) {
                element.style.height = `${this.windowHeight * oversizeFactor}px`;
                // Center the element
                element.style.top = `${-(this.windowHeight * (oversizeFactor - 1) / 2)}px`;
            }
        });
    }

    /**
     * Handle window resize events
     */
    _handleResize() {
        this._updateWindowDimensions();
        this._initOversizedElements();
        this._updateParallaxPositions();
    }
    
    /**
     * Update stored window dimensions
     */
    _updateWindowDimensions() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
    }

    /**
     * Handle scroll events for parallax
     */
    _handleScroll() {
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this._updateParallaxPositions();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    /**
     * Update positions of parallax elements
     */
    _updateParallaxPositions() {
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        
        this.parallaxElements.forEach(element => {
            const speedY = parseFloat(element.getAttribute('data-parallax-speed-y') || 
                             element.getAttribute('data-parallax-speed') || 0);
            const speedX = parseFloat(element.getAttribute('data-parallax-speed-x') || 0);
            
            // Calculate offsets
            const offsetY = scrollY * speedY;
            const offsetX = scrollX * speedX;
            
            // Apply transform based on element type
            let transform = '';
            
            if (element.classList.contains('parallax-y') && element.classList.contains('parallax-x')) {
                transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
            } else if (element.classList.contains('parallax-y')) {
                transform = `translateY(${offsetY}px)`;
            } else if (element.classList.contains('parallax-x')) {
                transform = `translateX(${offsetX}px)`;
            } else {
                transform = `translate3d(0, ${offsetY}px, 0)`;
            }
            
            // Apply transform
            element.style.transform = transform;
        });
    }

    /**
     * Initialize the gallery page
     */
    init() {
        this.loadImages();
        this.initParallax();
        this.initScrollIndicator();
        this.initImageHoverEffect();
        this.initParallaxLayers();
        
        // Log successful initialization
        console.log(`AI Gallery initialized for character: ${this.characterId}`);
    }

    /**
     * Initialize scroll indicator for text content
     */
    initScrollIndicator() {
        const aiTextContent = document.querySelector('.ai-text-content');
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (aiTextContent && scrollIndicator) {
            // Initial check
            this._updateScrollIndicator(aiTextContent, scrollIndicator);
            
            // Hide indicator when scrolled to bottom
            aiTextContent.addEventListener('scroll', () => {
                this._updateScrollIndicator(aiTextContent, scrollIndicator);
            });
            
            // Recheck on window resize
            window.addEventListener('resize', () => {
                this._updateScrollIndicator(aiTextContent, scrollIndicator);
            });
        }
    }
    
    /**
     * Update the scroll indicator visibility
     */
    _updateScrollIndicator(contentElement, indicatorElement) {
        const isScrollable = contentElement.scrollHeight > contentElement.clientHeight;
        
        if (isScrollable) {
            const isAtBottom = contentElement.scrollHeight - contentElement.scrollTop - contentElement.clientHeight < 10;
            indicatorElement.style.display = isAtBottom ? 'none' : 'block';
        } else {
            indicatorElement.style.display = 'none';
        }
    }

    /**
     * Initialize image hover effect
     */
    initImageHoverEffect() {
        const aiImage = document.querySelector('.ai-image');
        if (aiImage) {
            const aiImageContainer = document.querySelector('.ai-image-container');
            
            aiImageContainer.addEventListener('mousemove', (e) => {
                const rect = aiImageContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const moveX = (x - centerX) / 20;
                const moveY = (y - centerY) / 20;
                
                aiImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            aiImageContainer.addEventListener('mouseleave', () => {
                aiImage.style.transform = 'translate(0, 0)';
            });
        }
    }
    
    /**
     * Initialize parallax effect for background layers
     */
    initParallaxLayers() {
        const parallaxLayers = document.querySelectorAll('.parallax-layer');
        
        if (parallaxLayers.length > 0) {
            window.addEventListener('mousemove', (e) => {
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;
                
                parallaxLayers.forEach((layer, index) => {
                    const depth = (index + 1) * 0.05;
                    const moveX = mouseX * depth * 100;
                    const moveY = mouseY * depth * 100;
                    
                    layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
                });
            });
        }
    }
}

// Create and export singleton instance
const aiGalleryManager = new AiGalleryManager();
export default aiGalleryManager;
