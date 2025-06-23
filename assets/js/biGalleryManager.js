/**
 * BI Gallery Manager
 * This script handles image loading and parallax effects for the BI-gallery
 */

class BiGalleryManager {
    constructor() {
        this.imageBasePath = '/pages/BI-gallery/images/';
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
        // Extract from URL (e.g., eene.html -> eene)
        const pathname = window.location.pathname;
        const filename = pathname.split('/').pop();
        return filename.replace('.html', '');
    }    /**
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
                    path = `${this.imageBasePath}landscapes/landscape_${this.characterId}.png`;
                    // Add fit-to-width styling for landscape images
                    img.style.width = '100%';
                    img.style.height = 'auto';
                    img.style.objectFit = 'cover';
                    // Add error handling for landscape images
                    img.onerror = () => {
                        console.warn(`Failed to load landscape image for ${this.characterId}, trying fallback`);
                        img.src = `${this.imageBasePath}landscapes/default_landscape.png`;
                    };
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
                case 'interest-item1':
                    path = `/pages/BI-gallery/images/interests/${this.characterId}_item1.png`;
                    // Fallback to defaults if character-specific doesn't exist
                    img.onerror = () => img.src = '/pages/BI-gallery/images/interests/default_item1.png';
                    break;
                case 'interest-item2':
                    path = `/pages/BI-gallery/images/interests/${this.characterId}_item2.png`;
                    img.onerror = () => img.src = '/pages/BI-gallery/images/interests/default_item2.png';
                    break;
                case 'interest-item3':
                    path = `/pages/BI-gallery/images/interests/${this.characterId}_item3.png`;
                    img.onerror = () => img.src = '/pages/BI-gallery/images/interests/default_item3.png';
                    break;
                default:
                    // For custom image types with specific filenames
                    path = `${this.imageBasePath}${imageType}.png`;
            }
            
            img.src = path;
        });
        
        // Also load any interest items that use CSS background-image
        this.loadInterestItemsFromCSS();
    }
    
    /**
     * Load interest items that use CSS background-image
     */
    loadInterestItemsFromCSS() {
        const interestItems = document.querySelectorAll('.interest-item');
        
        interestItems.forEach((item, index) => {
            // Use the CSS variables defined in the theme classes
            const propertyName = `--interest-item${index + 1}`;
            const imagePath = getComputedStyle(document.body).getPropertyValue(propertyName);
            
            if (imagePath && imagePath.trim() !== '') {
                item.style.backgroundImage = imagePath;
            } else {
                // Fallback to default if no CSS variable is defined
                item.style.backgroundImage = `url('/pages/BI-gallery/images/interests/default_item${index + 1}.png')`;
            }
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
    }    /**
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
            
            // Special handling for text boxes - move content up for better text reading
            if (element.classList.contains('bi-text-container')) {
                // For text containers, we want to reveal more content as we scroll down
                // This reverses the parallax effect for better readability
                const textContent = element.querySelector('.bi-text-content');
                if (textContent) {
                    // Move text content up as we scroll, but faster than the container itself
                    const textSpeedMultiplier = 1.5;
                    const textOffsetY = scrollY * speedY * textSpeedMultiplier * -1; // Negative for upward movement
                    textContent.style.transform = `translateY(${textOffsetY}px)`;
                }
            }
            
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
            
            // Apply transform to the element itself
            element.style.transform = transform;
        });
    }    /**
     * Create and add interest item boxes around character image
     */
    addInterestItems() {
        const imageContainer = document.querySelector('.bi-image-container');
        if (!imageContainer) return;
        
        // Create container for interest items
        const interestsContainer = document.createElement('div');
        interestsContainer.className = 'character-interests-container';
        
        // Create three interest items
        for (let i = 1; i <= 3; i++) {
            const item = document.createElement('div');
            item.className = `interest-item item${i}`;
            item.setAttribute('data-character-image', `interest-item${i}`);
            interestsContainer.appendChild(item);
        }
        
        // Add to image container
        imageContainer.appendChild(interestsContainer);
        
        console.log('Added character interest items');
    }
    
    /**
     * Initialize the gallery page
     */
    init() {
        this.loadImages();
        this.addInterestItems();
        this.initParallax();
        
        // Create folder structure if needed
        this._ensureInterestImagesDirectoryExists();
        
        // Log successful initialization
        console.log(`BI Gallery initialized for character: ${this.characterId}`);
    }
    
    /**
     * Helper to check if interest images directory exists
     * This logs a message to help content creators know where to place assets
     */
    _ensureInterestImagesDirectoryExists() {
        const interestImagePath = '/pages/BI-gallery/images/interests/';
        const landscapePath = '/pages/BI-gallery/images/landscapes/';
        
        console.log(`
==== BI Gallery Asset Placement Guide ====
Character portrait:     ${this.imageBasePath}${this.characterId}.png
Landscape image:       ${landscapePath}landscape_${this.characterId}.png
Interest items:        ${interestImagePath}${this.characterId}_item1.png, item2.png, item3.png
Banner images:         ${this.imageBasePath}banners/UPPER_BANNER_${this.characterId}.png
                       ${this.imageBasePath}banners/MIDLINE_BANNER_${this.characterId}.png
                       ${this.imageBasePath}banners/LOWER_BANNER_${this.characterId}.png
                       ${this.imageBasePath}banners/DECORATION_BANNER_${this.characterId}.png
========================================
`);
    }
}

// Create and export singleton instance
const biGalleryManager = new BiGalleryManager();
export default biGalleryManager;
