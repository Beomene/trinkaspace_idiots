/**
 * storageConsent.js
 * 
 * A simple localStorage consent notice for Trinkaspace
 * Shows a notice about localStorage usage and gets user consent
 */

class StorageConsent {
  constructor(options = {}) {
    // Default options
    const defaults = {
      consentKey: 'trinkaspace-storage-consent',
      noticeText: 'This site uses localStorage to store your preferences and login information on your device. No data is sent to our servers.',
      buttonText: 'I understand',
      privacyLinkText: 'Privacy Policy',
      privacyLinkUrl: '/pages/general/legal/privacy-policy.html',
      position: 'bottom', // 'bottom', 'top', or 'center'
      theme: 'dark',      // 'dark' or 'light'
    };
    
    // Merge options with defaults
    this.options = { ...defaults, ...options };
    
    // Check if consent has been given
    this.hasConsent = this._checkConsent();
    
    // If no consent yet, show the notice
    if (!this.hasConsent) {
      this._createNotice();
    }
  }
  
  /**
   * Check if the user has already given consent
   * @private
   */
  _checkConsent() {
    return localStorage.getItem(this.options.consentKey) === 'true';
  }
  
  /**
   * Create and display the consent notice
   * @private
   */
  _createNotice() {
    // Create container
    const container = document.createElement('div');
    container.className = `trinkaspace-consent-notice ${this.options.theme} ${this.options.position}`;
    
    // Set position styles
    if (this.options.position === 'bottom') {
      container.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        padding: 1rem;
      `;
    } else if (this.options.position === 'top') {
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        padding: 1rem;
      `;
    } else if (this.options.position === 'center') {
      container.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        padding: 1.5rem;
        max-width: 90%;
        width: 500px;
      `;
    }
    
    // Set theme styles
    if (this.options.theme === 'dark') {
      container.style.cssText += `
        background-color: rgba(32, 32, 48, 0.95);
        color: #ACABBB;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      `;
    } else {
      container.style.cssText += `
        background-color: rgba(245, 245, 250, 0.95);
        color: #333344;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
      `;
    }
    
    // Additional common styles
    container.style.cssText += `
      backdrop-filter: blur(10px);
      border-radius: ${this.options.position === 'center' ? '12px' : '0'};
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      border-top: ${this.options.position === 'bottom' ? '1px solid #2AFFF7' : 'none'};
      border-bottom: ${this.options.position === 'top' ? '1px solid #2AFFF7' : 'none'};
      font-family: 'Noto Sans', sans-serif;
    `;
    
    // Create notice text
    const noticeText = document.createElement('div');
    noticeText.className = 'trinkaspace-consent-text';
    noticeText.style.cssText = `
      flex: 1;
      min-width: 200px;
    `;
    noticeText.textContent = this.options.noticeText;
    
    // Create privacy policy link
    const privacyLink = document.createElement('a');
    privacyLink.href = this.options.privacyLinkUrl;
    privacyLink.textContent = this.options.privacyLinkText;
    privacyLink.style.cssText = `
      margin-left: 5px;
      color: #2AFFF7;
      text-decoration: underline;
    `;
    
    // Append link to notice text
    noticeText.appendChild(document.createTextNode(' '));
    noticeText.appendChild(privacyLink);
    
    // Create buttons container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'trinkaspace-consent-buttons';
    buttonContainer.style.cssText = `
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    `;
    
    // Create accept button
    const acceptButton = document.createElement('button');
    acceptButton.textContent = this.options.buttonText;
    acceptButton.className = 'trinkaspace-consent-button accept';
    acceptButton.style.cssText = `
      padding: 0.75rem 1.5rem;
      background-color: #2AFFF7;
      color: #252535;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s ease;
    `;
    
    // Add hover effect
    acceptButton.addEventListener('mouseover', () => {
      acceptButton.style.backgroundColor = '#1CE8E0';
      acceptButton.style.transform = 'scale(1.05)';
    });
    
    acceptButton.addEventListener('mouseout', () => {
      acceptButton.style.backgroundColor = '#2AFFF7';
      acceptButton.style.transform = 'scale(1)';
    });
    
    // Add click handler
    acceptButton.addEventListener('click', () => {
      this._giveConsent();
      document.body.removeChild(container);
    });
    
    // Assemble the notice
    buttonContainer.appendChild(acceptButton);
    container.appendChild(noticeText);
    container.appendChild(buttonContainer);
    
    // Add to page
    document.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(container);
    });
    
    // If DOM is already loaded, add it now
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      document.body.appendChild(container);
    }
  }
  
  /**
   * Record the user's consent
   * @private
   */
  _giveConsent() {
    localStorage.setItem(this.options.consentKey, 'true');
    this.hasConsent = true;
  }
  
  /**
   * Remove a previous consent
   * @public
   */
  resetConsent() {
    localStorage.removeItem(this.options.consentKey);
    this.hasConsent = false;
    this._createNotice();
  }
}

// Export singleton instance with default options
const storageConsent = new StorageConsent();
export default storageConsent;
