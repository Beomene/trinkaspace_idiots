/**
 * userManager.js
 * 
 * Provides user identification and personalization for Trinkaspace
 * Handles local storage of user preferences and bookmarks
 * 
 * Features:
 * - Simple user identification (no passwords/email required)
 * - User profile management with avatars
 * - Bookmark/progress saving
 * - Preferences storage
 */

class UserManager {
  constructor() {
    // Initialize the user manager
    this.currentUser = null;
    this.isLoggedIn = false;
    this.USER_STORAGE_KEY = 'trinkaspace-users';
    this.CURRENT_USER_KEY = 'trinkaspace-current-user';
    this.BOOKMARKS_KEY = 'trinkaspace-bookmarks';
    this.PREFERENCES_KEY = 'trinkaspace-preferences';
    
    // Load current user if available
    this._loadCurrentUser();
    
    // Bind event handlers
    this._bindEvents();
  }
  
  /**
   * Initialize the user system and UI
   * @public
   */
  init() {
    this._updateUI();
    console.log('[UserManager] Initialized');
  }
    /**   * Identify a new user (simplified registration)
   * @param {string} username - User's chosen display name
   * @param {string[]} [pronouns=[]] - User's selected pronouns
   * @returns {object} - Result of the identification attempt
   * @public
   */
  identify(username, pronouns = []) {
    // Input validation
    if (!username) {
      return { success: false, error: 'Please provide a name' };
    }
    
    if (username.length < 2) {
      return { success: false, error: 'Name must be at least 2 characters' };
    }
    
    // Check if username already exists
    const users = this._getUsers();
    if (users.some(user => user.username === username)) {
      return { success: false, error: 'This name is already taken' };
    }
      // Create new user (simplified)
    const newUser = {
      id: this._generateUserId(),
      username: username,
      profilePicture: 'default.svg', // Default profile picture
      pronouns: [], // Default empty pronouns array
      created: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      consentTimestamp: new Date().toISOString() // Record when user agreed to terms
    };
    
    // Add user to storage
    users.push(newUser);
    this._saveUsers(users);
    
    // Set as current user
    this._setCurrentUser(newUser);
    
    return { success: true, user: newUser };
  }
    /**
   * Remember a returning user
   * @param {string} username - User's chosen display name
   * @returns {object} - Result of the remember attempt
   * @public
   */
  remember(username) {
    // Input validation
    if (!username) {
      return { success: false, error: 'Please provide your name' };
    }
    
    // Find user by username only
    const users = this._getUsers();
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return { success: false, error: `We don't remember a "${username}" here. Are you sure about that name?` };
    }
    
    // Update last login
    user.lastLogin = new Date().toISOString();
    this._saveUsers(users);
    
    // Set current user
    this._setCurrentUser(user);
    
    return { success: true, user };
  }
  
  /**
   * Log out the current user
   * @public
   */
  logout() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.currentUser = null;
    this.isLoggedIn = false;
    this._updateUI();
    
    // Trigger a logout event
    const event = new CustomEvent('trinkaspace-user-logout');
    document.dispatchEvent(event);
    
    return { success: true };
  }
  
  /**
   * Get the current user if logged in
   * @returns {object|null} - Current user or null if not logged in
   * @public
   */
  getCurrentUser() {
    return this.currentUser ? this._sanitizeUser(this.currentUser) : null;
  }
  
  /**
   * Check if a user is currently logged in
   * @returns {boolean} - Whether a user is logged in
   * @public
   */
  isUserLoggedIn() {
    return this.isLoggedIn;
  }
    /**
   * Update user profile information
   * @param {object} updates - Object containing fields to update
   * @returns {object} - Result of the update attempt
   * @public
   */
  updateProfile(updates) {
    if (!this.isLoggedIn) {
      return { success: false, error: 'Not recognized as a user' };
    }
    
    // Get all users
    const users = this._getUsers();
    const userIndex = users.findIndex(u => u.id === this.currentUser.id);
    
    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }
      // Update allowed fields
    const allowedUpdates = ['username', 'profilePicture', 'pronouns'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        // Check if username is already taken
        if (field === 'username' && 
            users.some(u => u.id !== this.currentUser.id && u[field] === updates[field])) {
          throw new Error(`This name is already in use`);
        }
        users[userIndex][field] = updates[field];
      }
    });
    
    // Save updated users
    this._saveUsers(users);
    
    // Update current user
    this.currentUser = users[userIndex];
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(this.currentUser));
    
    // Update UI
    this._updateUI();
    
    return { success: true, user: this._sanitizeUser(this.currentUser) };
  }
  
  /**
   * Save a bookmark for the current user
   * @param {string} pageId - ID of the page to bookmark
   * @param {string} title - Title of the bookmarked page
   * @param {object} metadata - Any additional metadata to store with the bookmark
   * @returns {object} - Result of the bookmark operation
   * @public
   */
  saveBookmark(pageId, title, metadata = {}) {
    if (!this.isLoggedIn) {
      return { success: false, error: 'User not logged in' };
    }
    
    if (!pageId) {
      return { success: false, error: 'Page ID is required' };
    }
    
    // Get current bookmarks
    const bookmarks = this._getBookmarks();
    
    // Create or update bookmark
    const bookmark = {
      id: pageId,
      title: title || 'Unnamed Bookmark',
      timestamp: new Date().toISOString(),
      metadata: metadata
    };
    
    // Check if bookmark already exists and update it
    const existingIndex = bookmarks.findIndex(b => b.id === pageId);
    if (existingIndex >= 0) {
      bookmarks[existingIndex] = bookmark;
    } else {
      bookmarks.push(bookmark);
    }
    
    // Save bookmarks
    this._saveBookmarks(bookmarks);
    
    return { success: true, bookmark };
  }
  
  /**
   * Get all bookmarks for the current user
   * @returns {array} - Array of bookmarks
   * @public
   */
  getBookmarks() {
    if (!this.isLoggedIn) {
      return [];
    }
    
    return this._getBookmarks();
  }
  
  /**
   * Remove a bookmark for the current user
   * @param {string} pageId - ID of the page bookmark to remove
   * @returns {object} - Result of the remove operation
   * @public
   */
  removeBookmark(pageId) {
    if (!this.isLoggedIn) {
      return { success: false, error: 'User not logged in' };
    }
    
    // Get current bookmarks
    const bookmarks = this._getBookmarks();
    
    // Filter out the removed bookmark
    const newBookmarks = bookmarks.filter(b => b.id !== pageId);
    
    // If no bookmarks were removed, return error
    if (bookmarks.length === newBookmarks.length) {
      return { success: false, error: 'Bookmark not found' };
    }
    
    // Save updated bookmarks
    this._saveBookmarks(newBookmarks);
    
    return { success: true };
  }
  
  /**
   * Save user preferences
   * @param {object} preferences - Preferences to save
   * @returns {object} - Result of the save operation
   * @public
   */
  savePreferences(preferences) {
    if (!this.isLoggedIn) {
      return { success: false, error: 'User not logged in' };
    }
    
    const currentPrefs = this._getPreferences();
    const updatedPrefs = { ...currentPrefs, ...preferences };
    
    localStorage.setItem(`${this.PREFERENCES_KEY}-${this.currentUser.id}`, 
                         JSON.stringify(updatedPrefs));
    
    return { success: true, preferences: updatedPrefs };
  }
    /**
   * Get user preferences
   * @returns {object} - User preferences
   * @public
   */
  getPreferences() {
    if (!this.isLoggedIn) {
      return {};
    }
    
    return this._getPreferences();
  }
  
  /**
   * Delete the current user account completely
   * @returns {object} - Result of the deletion
   * @public
   */
  deleteAccount() {
    if (!this.isLoggedIn || !this.currentUser) {
      return { success: false, error: 'No user logged in' };
    }
    
    try {
      // Get all users
      const users = this._getUsers();
      
      // Filter out the current user
      const filteredUsers = users.filter(user => user.id !== this.currentUser.id);
      
      // Save the filtered users list
      this._saveUsers(filteredUsers);
      
      // Delete all user-related data from localStorage
      this._deleteUserData();
      
      // Log out the user
      this.logout();
      
      return { success: true, message: 'Account deleted successfully' };
    } catch (err) {
      console.error('[UserManager] Error deleting account:', err);
      return { success: false, error: 'Failed to delete account' };
    }
  }
  
  /**
   * Export the current user's data as a JSON string
   * @returns {string|null} - JSON string of user data or null if not logged in
   * @public
   */
  exportUserData() {
    if (!this.isLoggedIn || !this.currentUser) {
      return null;
    }
    
    // Gather all user data
    const userData = {
      profile: this._sanitizeUser(this.currentUser),
      bookmarks: this._getBookmarks(),
      preferences: this._getPreferences(),
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(userData, null, 2);
  }
  
  /**
   * Get the list of available profile pictures   * @returns {Array} - List of profile picture options
   * @public
   */
  getProfilePictureOptions() {
    // You can add PNG options by using the format 'png/filename.png'
    // SVG options use the format 'filename.svg'
    return [
      { filename: 'default.svg', name: 'Default', type: 'svg' },
      { filename: 'purple.svg', name: 'Purple', type: 'svg' },
      { filename: 'png/eene.png', name: 'Eene', type: 'png' },
      { filename: 'png/emraa.png', name: 'Emraa', type: 'png' },
/*    { filename: 'png/lyl.png', name: 'Lyl', type: 'png' },
      { filename: 'png/yly.png', name: 'Yly', type: 'png' },*/
      { filename: 'png/pride.png', name: 'Pride', type: 'png' },
      { filename: 'png/demi.png', name: 'Demisexual', type: 'png' },
      { filename: 'png/pan.png', name: 'Pansexual', type: 'png' },
/*    { filename: 'png/bi.png', name: 'Bisexual', type: 'png' },*/
      { filename: 'png/asexual.png', name: 'Asexual', type: 'png' },
      { filename: 'png/queer.png', name: 'Queer', type: 'png' },
      { filename: 'png/polyamorous.png', name: 'Polyamorous', type: 'png' },
      { filename: 'png/anarchy.png', name: 'Anarchy', type: 'png' },
  /*    { filename: 'png/unknown.png', name: 'Unknown', type: 'png' },*/
      { filename: 'png/fox.png', name: 'Fox', type: 'png' },
      { filename: 'png/palestine.png', name: 'Palestine', type: 'png' },
      { filename: 'png/rhearipley.png', name: 'Rhea Ripley', type: 'png' },
/*    { filename: 'png/eyes-emoji.png', name: 'Eyes Emoji', type: 'png' },*/
      { filename: 'png/trans.png', name: 'Transgender', type: 'png' },
/*    { filename: 'png/ace.png', name: 'Ace', type: 'png' },
  */  { filename: 'png/lesbian.png', name: 'Lesbian', type: 'png' },/*
      { filename: 'png/aro.png', name: 'Aromantic', type: 'png' },
      { filename: 'png/ally.png', name: 'Ally', type: 'png' },
      { filename: 'png/blacklivesmatter.png', name: 'Black Lives Matter', type: 'png' },
      { filename: 'png/indigenous.png', name: 'Indigenous', type: 'png' },
      { filename: 'png/latinx.png', name: 'Latinx', type: 'png' },
      { filename: 'png/asian.png', name: 'Asian', type: 'png' },*/
   /* { filename: 'png/disabled.png', name: 'Disabled', type: 'png' },*/
      { filename: 'png/peace.png', name: 'Peace', type: 'png' },
 /*   { filename: 'png/earth.png', name: 'Earth', type: 'png' },*/
      { filename: 'png/fElon.png', name: 'fElon', type: 'png' },
/*    { filename: 'png/patron1.png', name: 'Patron 1', type: 'png' },
      { filename: 'png/patron2.png', name: 'Patron 2', type: 'png' },
      { filename: 'png/patron3.png', name: 'Patron 3', type: 'png' },
      { filename: 'png/patron4.png', name: 'Patron 4', type: 'png' },
      { filename: 'png/patron5.png', name: 'Patron 5', type: 'png' },
      { filename: 'png/patron6.png', name: 'Patron 6', type: 'png' },*/
      // PNG examples - uncomment and replace with your actual PNG files once created
      // { filename: 'png/character1.png', name: 'Character 1', type: 'png' },
      // { filename: 'png/character2.png', name: 'Character 2', type: 'png' },
    ];
  }
  
  // Private methods
  
  /**
   * Load the current user from local storage
   * @private
   */
  _loadCurrentUser() {
    const storedUser = localStorage.getItem(this.CURRENT_USER_KEY);
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
        
        // Ensure current user has profilePicture (for backward compatibility)
        if (!this.currentUser.profilePicture) {
          this.currentUser.profilePicture = 'default.svg';
          localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(this.currentUser));
        }
        
        this.isLoggedIn = true;
      } catch (e) {
        console.error('[UserManager] Error parsing stored user', e);
        localStorage.removeItem(this.CURRENT_USER_KEY);
      }
    }
  }
  
  /**
   * Set the current user and update local storage
   * @param {object} user - User object to set as current
   * @private
   */
  _setCurrentUser(user) {
    this.currentUser = user;
    this.isLoggedIn = true;
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    
    // Update the UI
    this._updateUI();
    
    // Trigger a login event
    const event = new CustomEvent('trinkaspace-user-login', { 
      detail: this._sanitizeUser(user) 
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Get all users from local storage
   * @returns {array} - Array of user objects
   * @private
   */
  _getUsers() {
    try {
      const users = JSON.parse(localStorage.getItem(this.USER_STORAGE_KEY) || '[]');
      
      // Ensure all users have profilePicture (for backward compatibility)
      users.forEach(user => {
        if (!user.profilePicture) {
          user.profilePicture = 'default.svg';
        }
      });
      
      // Save back to storage if we added profile pictures
      if (users.some(user => user.profilePicture === 'default.svg')) {
        localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(users));
      }
      
      return users;
    } catch (e) {
      console.error('[UserManager] Error parsing users', e);
      return [];
    }
  }
  
  /**
   * Save all users to local storage
   * @param {array} users - Array of user objects to save
   * @private
   */
  _saveUsers(users) {
    localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(users));
  }
  
  /**
   * Generate a unique user ID
   * @returns {string} - Unique ID
   * @private
   */
  _generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }
    /**
   * Prepare user object for external use
   * @param {object} user - User object
   * @returns {object} - Clean user object
   * @private
   */
  _sanitizeUser(user) {
    // Just return a copy of the user
    return { ...user };
  }
  
  /**
   * Get bookmarks for the current user
   * @returns {array} - Array of bookmark objects
   * @private
   */
  _getBookmarks() {
    if (!this.currentUser) {
      return [];
    }
    
    const storedBookmarks = localStorage.getItem(`${this.BOOKMARKS_KEY}-${this.currentUser.id}`);
    if (!storedBookmarks) {
      return [];
    }
    
    try {
      return JSON.parse(storedBookmarks);
    } catch (e) {
      console.error('[UserManager] Error parsing stored bookmarks', e);
      return [];
    }
  }
  
  /**
   * Save bookmarks for the current user
   * @param {array} bookmarks - Array of bookmark objects to save
   * @private
   */
  _saveBookmarks(bookmarks) {
    if (!this.currentUser) {
      return;
    }
    
    localStorage.setItem(`${this.BOOKMARKS_KEY}-${this.currentUser.id}`, 
                         JSON.stringify(bookmarks));
  }
  
  /**
   * Get preferences for the current user
   * @returns {object} - User preferences
   * @private
   */
  _getPreferences() {
    if (!this.currentUser) {
      return {};
    }
    
    const storedPrefs = localStorage.getItem(`${this.PREFERENCES_KEY}-${this.currentUser.id}`);
    if (!storedPrefs) {
      return {};
    }
    
    try {
      return JSON.parse(storedPrefs);
    } catch (e) {
      console.error('[UserManager] Error parsing stored preferences', e);
      return {};
    }
  }
  
  /**
   * Update the UI based on the current user state
   * @private
   */
  _updateUI() {
    const userDisplay = document.getElementById('trinkaspace-user-display');
    if (!userDisplay) {
      return; // UI element not found
    }
    
    if (this.isLoggedIn && this.currentUser) {
      // Ensure profilePicture exists for backward compatibility
      const profilePic = this.currentUser.profilePicture || 'default.svg';
        userDisplay.innerHTML = `
        <div class="user-info">
          <div class="user-avatar clickable" tabindex="0" role="button" aria-label="View profile">
            <div class="avatar-frame">
              <img src="/assets/images/profile-pics/${profilePic}" alt="${this.currentUser.username}'s avatar">
            </div>
          </div>
          <button class="user-name" aria-haspopup="true" aria-expanded="false" tabindex="0">
            ${this.currentUser.username}
            ${this.currentUser.pronouns && this.currentUser.pronouns.length > 0 ? 
              `<span class="user-pronouns">(${this.currentUser.pronouns.join(', ')})</span>` : ''}
          </button>
          <div class="user-menu" style="display: none;" role="menu" aria-hidden="true">
            <a href="#" class="view-profile" role="menuitem" tabindex="-1">Your Profile</a>
            <a href="#" class="view-bookmarks" role="menuitem" tabindex="-1">Bookmarks</a>
            <a href="#" class="logout" role="menuitem" tabindex="-1">Forget Me</a>
          </div>
        </div>
      `;
      
      // Add event listeners for the user menu
      const menuToggle = userDisplay.querySelector('.user-name');
      const menu = userDisplay.querySelector('.user-menu');
      const menuItems = menu.querySelectorAll('[role="menuitem"]');
      
      if (menuToggle && menu) {
        // Toggle menu on click
        menuToggle.addEventListener('click', (e) => {
          e.preventDefault();
          const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
          toggleMenu(!isExpanded);
        });
        
        // Toggle menu on Space or Enter
        menuToggle.addEventListener('keydown', (e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            toggleMenu(!isExpanded);
          }
        });
        
        // Handle keyboard navigation within menu
        menu.addEventListener('keydown', (e) => {
          // Close on Escape
          if (e.key === 'Escape') {
            toggleMenu(false);
            menuToggle.focus();
            return;
          }
          
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            
            const currentIndex = Array.from(menuItems).findIndex(
              item => item === document.activeElement
            );
            
            let newIndex;
            if (e.key === 'ArrowDown') {
              newIndex = (currentIndex + 1) % menuItems.length;
            } else { // ArrowUp
              newIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
            }
            
            menuItems[newIndex].focus();
          }
        });
        
        // Toggle menu function
        const toggleMenu = (show) => {
          menu.style.display = show ? 'block' : 'none';
          menu.setAttribute('aria-hidden', !show);
          menuToggle.setAttribute('aria-expanded', show);
          
          // Set tabindex to allow focus on menu items when menu is open
          menuItems.forEach(item => {
            item.setAttribute('tabindex', show ? '0' : '-1');
          });
          
          // Focus first menu item when opened
          if (show && menuItems.length > 0) {
            menuItems[0].focus();
          }
        };
          // Handle avatar click to open profile directly
        const avatarElement = userDisplay.querySelector('.user-avatar');
        if (avatarElement) {
          avatarElement.addEventListener('click', (e) => {
            e.preventDefault();
            this._showProfileModal();
          });
          
          avatarElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this._showProfileModal();
            }
          });
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
          if (!userDisplay.contains(e.target)) {
            toggleMenu(false);
          }
        });
        
        // Add event listeners for menu items
        const logoutBtn = menu.querySelector('.logout');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
          });
          
          logoutBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.logout();
            }
          });
        }
        
        const profileBtn = menu.querySelector('.view-profile');
        if (profileBtn) {
          profileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this._showProfileModal();
          });
          
          profileBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this._showProfileModal();
            }
          });
        }
        
        const bookmarksBtn = menu.querySelector('.view-bookmarks');
        if (bookmarksBtn) {
          bookmarksBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this._showBookmarksModal();
          });
          
          bookmarksBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this._showBookmarksModal();
            }
          });
        }
      }    } else {
      userDisplay.innerHTML = `
        <button class="register-btn" aria-label="Create a new account">Who are you?</button>
      `;
      
      // Add event listeners for identification button
      const identifyBtn = userDisplay.querySelector('.register-btn');
      
      if (identifyBtn) {
        identifyBtn.addEventListener('click', () => this._showIdentifyModal());
      }
    }
  }
    /**
   * Show the "Have we met before?" modal for returning users
   * @private
   */
  _showRememberModal() {
    const modal = this._createModal('Have we met before?');
    
    modal.content.innerHTML = `
      <form id="remember-form" class="user-form">
        <div class="form-group">
          <label for="remember-username">What's your name?</label>
          <input type="text" id="remember-username" required>
          <small>The name you used previously</small>
        </div>
        <div class="form-error" style="display: none; color: #FF6B6B;"></div>
        <div class="form-actions">
          <button type="submit" class="primary-btn">That's me!</button>
          <button type="button" class="secondary-btn modal-close">Cancel</button>
        </div>
      </form>
    `;
    
    // Add form submission handler
    const form = modal.content.querySelector('#remember-form');
    const errorDisplay = modal.content.querySelector('.form-error');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = form.querySelector('#remember-username').value;
      
      try {
        const result = this.remember(username);
        if (result.success) {
          modal.close();
        } else {
          errorDisplay.textContent = result.error;
          errorDisplay.style.display = 'block';
        }
      } catch (err) {
        errorDisplay.textContent = err.message;
        errorDisplay.style.display = 'block';
      }
    });
    
    // Show modal
    document.body.appendChild(modal.element);
  }
    /**
   * Show the "Who are you?" modal for new users
   * @private
   */    _showIdentifyModal() {
    const modal = this._createModal('Who are you?');
      modal.content.innerHTML = `      <form id="identify-form" class="user-form">
        <div class="form-group">
          <label for="identify-username">Choose a name for your journey:</label>
          <input type="text" id="identify-username" required minlength="2" placeholder="Enter your preferred name">
          <small>Whatever feels right. Maybe try something new?</small>
        </div>
        
        <div class="form-group">
          <div class="info-message" style="background-color: rgba(42, 255, 247, 0.1); border: 1px solid var(--neoncyan, #2AFFF7); padding: 12px; margin: 15px 0; border-radius: 8px;">
            <p style="margin: 0; color: #CCC;">After you've picked a name you can select profile picture and pronouns in your settings.</p>
          </div>
        </div>
        
        <div class="note-box" style="background-color: rgba(42, 255, 247, 0.1); border: 1px solid var(--neoncyan, #2AFFF7); padding: 12px; margin: 15px 0; border-radius: 8px;">
          <p style="margin: 0; color: #CCC; font-size: 0.9em;">Your profile is <strong>stored only in your browser</strong>. If you've used Trinkaspace before but don't see your profile, you may be using a different browser or device.</p>
          <p style="margin-top: 10px; color: #2AFFF7; font-style: italic;">Enjoy personalizing your journey! //Beomene, the Trinkaloop Saga Artist</p>
        </div>
        
        <div class="form-group" style="margin-top: 1rem; font-size: 0.9em; color: #999;">
          <div class="setting-option">
            <input type="checkbox" id="privacy-agreement" required>
            <label for="privacy-agreement">I agree to the <a href="/pages/general/legal/privacy-policy.html" target="_blank" style="color: #2AFFF7;">Privacy Policy</a> and <a href="/pages/general/legal/privacy-policy.html#terms" target="_blank" style="color: #2AFFF7;">Terms of Service</a></label>
          </div>
          <small style="display: block; margin-top: 0.5rem; margin-left: 1.7rem;">Your data is stored locally in your browser only.</small>
        </div>
        <div class="form-error" style="display: none; color: #FF6B6B;"></div>
        <div class="form-actions">
          <button type="submit" class="primary-btn">That's me!</button>
          <button type="button" class="secondary-btn modal-close">Cancel</button>
        </div>
      </form>
    `;
      // Add form submission handler
    const form = modal.content.querySelector('#identify-form');
    const errorDisplay = modal.content.querySelector('.form-error');    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = form.querySelector('#identify-username').value;
      const privacyAgreement = form.querySelector('#privacy-agreement').checked;
      
      // Check privacy agreement
      if (!privacyAgreement) {
        errorDisplay.textContent = 'You must agree to the Privacy Policy and Terms of Service';
        errorDisplay.style.display = 'block';
        return;
      }
      
      // Initialize with empty pronouns array - users will set this in profile settings
      const selectedPronouns = [];
      
      try {
        const result = this.identify(username, selectedPronouns);
        if (result.success) {
          modal.close();
        } else {
          errorDisplay.textContent = result.error;
          errorDisplay.style.display = 'block';
        }
      } catch (err) {
        errorDisplay.textContent = err.message;
        errorDisplay.style.display = 'block';
      }
    });
    
    // Show modal
    document.body.appendChild(modal.element);
  }
  
  /**
   * Show the profile modal
   * @private
   */
  _showProfileModal() {
    if (!this.isLoggedIn || !this.currentUser) {
      return;
    }
    
    const modal = this._createModal('Your Profile');
    
    // Ensure profilePicture exists (for backward compatibility)
    const currentPic = this.currentUser.profilePicture || 'default.svg';
    const profileOptions = this.getProfilePictureOptions();
    
    modal.content.innerHTML = `
      <form id="profile-form" class="user-form profile-form-landscape">
        <div class="profile-form-header">
          <div class="current-profile-header">
            <div class="current-profile-pic">
              <div class="avatar-frame large">
                <img src="/assets/images/profile-pics/${currentPic}" alt="Current Profile">
              </div>
            </div>
            <div class="current-profile-name">${this.currentUser.username}</div>
          </div>
          
          <div class="form-group">
            <label for="profile-username">Your name:</label>
            <input type="text" id="profile-username" value="${this.currentUser.username}" required>
          </div>
        </div>
          <div class="form-group profile-pic-container">
          <label id="profile-pic-label">Profile Picture:</label>
          <div class="profile-pic-options" role="grid" aria-labelledby="profile-pic-label" tabindex="0">
            ${profileOptions.map((pic, index) => `
              <div class="profile-pic-option ${currentPic === pic.filename ? 'selected' : ''}" 
                data-pic="${pic.filename}" 
                role="gridcell" 
                tabindex="${currentPic === pic.filename ? '0' : '-1'}"
                aria-selected="${currentPic === pic.filename ? 'true' : 'false'}"
                data-index="${index}">
                <div class="avatar-frame small">
                  <img src="/assets/images/profile-pics/${pic.filename}" alt="${pic.name}">
                </div>
                <span>${pic.name}</span>
              </div>
            `).join('')}
          </div>
          <input type="hidden" id="profile-picture" value="${currentPic}">
        </div>
        
        <div class="form-group">
          <label id="profile-pronouns-label">Your pronouns (optional):</label>
          <div class="pronouns-selector" role="group" aria-labelledby="profile-pronouns-label">
            <div class="pronouns-options">
              <div class="pronoun-option">
                <input type="checkbox" id="profile-pronoun-they" value="they/them" class="pronoun-checkbox"
                  ${this.currentUser.pronouns && this.currentUser.pronouns.includes('they/them') ? 'checked' : ''}>
                <label for="profile-pronoun-they">they/them</label>
              </div>
              <div class="pronoun-option">
                <input type="checkbox" id="profile-pronoun-she" value="she/her" class="pronoun-checkbox"
                  ${this.currentUser.pronouns && this.currentUser.pronouns.includes('she/her') ? 'checked' : ''}>
                <label for="profile-pronoun-she">she/her</label>
              </div>
              <div class="pronoun-option">
                <input type="checkbox" id="profile-pronoun-he" value="he/him" class="pronoun-checkbox"
                  ${this.currentUser.pronouns && this.currentUser.pronouns.includes('he/him') ? 'checked' : ''}>
                <label for="profile-pronoun-he">he/him</label>
              </div>
              <div class="pronoun-option">
                <input type="checkbox" id="profile-pronoun-any" value="any pronouns" class="pronoun-checkbox"
                  ${this.currentUser.pronouns && this.currentUser.pronouns.includes('any pronouns') ? 'checked' : ''}>
                <label for="profile-pronoun-any">any pronouns</label>
              </div>
              <div class="pronoun-option">
                <input type="checkbox" id="profile-pronoun-xe" value="xe/xem" class="pronoun-checkbox"
                  ${this.currentUser.pronouns && this.currentUser.pronouns.includes('xe/xem') ? 'checked' : ''}>
                <label for="profile-pronoun-xe">xe/xem</label>
              </div>
              <div class="pronoun-option">
                <input type="checkbox" id="profile-pronoun-ze" value="ze/zir" class="pronoun-checkbox"
                  ${this.currentUser.pronouns && this.currentUser.pronouns.includes('ze/zir') ? 'checked' : ''}>
                <label for="profile-pronoun-ze">ze/zir</label>
              </div>
              <div class="pronoun-option">
                <input type="checkbox" id="profile-pronoun-ey" value="ey/em" class="pronoun-checkbox"
                  ${this.currentUser.pronouns && this.currentUser.pronouns.includes('ey/em') ? 'checked' : ''}>
                <label for="profile-pronoun-ey">ey/em</label>
              </div>
              <div class="pronoun-option">
                <input type="checkbox" id="profile-pronoun-figuring" value="figuring it out" class="pronoun-checkbox"
                  ${this.currentUser.pronouns && this.currentUser.pronouns.includes('figuring it out') ? 'checked' : ''}>
                <label for="profile-pronoun-figuring">figuring it out</label>
              </div>
              <div class="pronoun-option">
                <input type="checkbox" id="profile-pronoun-none" value="prefer not to say" class="pronoun-checkbox"
                  ${this.currentUser.pronouns && this.currentUser.pronouns.includes('prefer not to say') ? 'checked' : ''}>
                <label for="profile-pronoun-none">prefer not to say</label>
              </div>            </div>            <small>
              Are your pronouns missing?<br>
              Let me know at: beomene@gmail.com<br>
              or on: patreon.com/trinkaloop<br>
              (free memberships and public posts!)
            </small>
          </div>
        </div>
        <div class="form-error" style="display: none; color: #FF6B6B;"></div>
        <div class="form-actions">
          <button type="submit" class="primary-btn">Save Changes</button>
          <button type="button" class="secondary-btn modal-close">Cancel</button>
        </div>
      </form>    `;
    
    // Add form submission handler
    const form = modal.content.querySelector('#profile-form');
    const errorDisplay = modal.content.querySelector('.form-error');
    const profilePicInput = form.querySelector('#profile-picture');
    const profilePicGrid = form.querySelector('.profile-pic-options');
    const picOptions = form.querySelectorAll('.profile-pic-option');
    
    // Apply landscape mode class to ensure proper styling
    form.classList.add('profile-form-landscape');
    
    // Set up keyboard navigation grid for profile pictures
    profilePicGrid.addEventListener('keydown', (e) => {
      // Find current position
      const current = form.querySelector('.profile-pic-option[aria-selected="true"]');
      const currentIndex = parseInt(current.dataset.index);
        let newIndex = currentIndex;
      const columns = 6; // Now using 6 avatars per row for landscape layout
      const totalItems = picOptions.length;
      const rows = Math.ceil(totalItems / columns);
      
      // Calculate current row and column
      const currentRow = Math.floor(currentIndex / columns);
      const currentCol = currentIndex % columns;
      
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          newIndex = Math.min(currentIndex + 1, totalItems - 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = Math.max(currentIndex - 1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          // Move down one row, stay in same column
          if (currentRow < rows - 1) {
            newIndex = Math.min(currentIndex + columns, totalItems - 1);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          // Move up one row, stay in same column
          if (currentRow > 0) {
            newIndex = Math.max(currentIndex - columns, 0);
          }
          break;
        case 'Home':
          e.preventDefault();
          newIndex = 0; // First item
          break;
        case 'End':
          e.preventDefault();
          newIndex = totalItems - 1; // Last item
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          selectProfilePic(current);
          return;
      }
      
      // If index changed, focus and select the new item
      if (newIndex !== currentIndex) {
        const newItem = picOptions[newIndex];
        selectProfilePic(newItem);
        newItem.focus();
      }
    });
    
    // Function to select a profile picture
    const selectProfilePic = (option) => {
      // Update selected state for all options
      picOptions.forEach(opt => {
        opt.classList.remove('selected');
        opt.setAttribute('aria-selected', 'false');
        opt.setAttribute('tabindex', '-1');
      });
      
      // Add selected class and update attributes for clicked option
      option.classList.add('selected');
      option.setAttribute('aria-selected', 'true');
      option.setAttribute('tabindex', '0');
      
      // Update hidden input value
      profilePicInput.value = option.dataset.pic;
    };
    
    // Add click handlers for profile picture options
    picOptions.forEach(option => {
      option.addEventListener('click', () => {
        selectProfilePic(option);
      });
    });
      form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = form.querySelector('#profile-username').value;
      const profilePicture = profilePicInput.value;
      
      // Collect selected pronouns
      const selectedPronouns = [];
      form.querySelectorAll('.pronoun-checkbox:checked').forEach(checkbox => {
        selectedPronouns.push(checkbox.value);
      });
      
      try {
        const updates = { username, profilePicture, pronouns: selectedPronouns };
        
        const result = this.updateProfile(updates);
        if (result.success) {
          modal.close();
        } else {
          errorDisplay.textContent = result.error;
          errorDisplay.style.display = 'block';
        }
      } catch (err) {
        errorDisplay.textContent = err.message;
        errorDisplay.style.display = 'block';
      }
    });
    
    // Show modal
    document.body.appendChild(modal.element);
  }
  
  /**
   * Show the bookmarks modal
   * @private
   */
  _showBookmarksModal() {
    if (!this.isLoggedIn || !this.currentUser) {
      return;
    }
    
    const bookmarks = this.getBookmarks();
    const modal = this._createModal('Your Bookmarks');
    
    if (bookmarks.length === 0) {
      modal.content.innerHTML = `
        <div class="no-bookmarks">
          <p>You don't have any bookmarks yet.</p>
          <p>As you explore the story, you can bookmark pages to easily return to them later.</p>
        </div>
        <div class="form-actions">
          <button type="button" class="primary-btn modal-close">Close</button>
        </div>
      `;
    } else {
      let bookmarksHtml = bookmarks
        .map(bookmark => `
          <div class="bookmark-item" data-id="${bookmark.id}">
            <a href="${bookmark.metadata.url || '#'}" class="bookmark-link">${bookmark.title}</a>
            <div class="bookmark-meta">
              ${new Date(bookmark.timestamp).toLocaleDateString()}
            </div>
            <button class="remove-bookmark" data-id="${bookmark.id}">Remove</button>
          </div>
        `)
        .join('');
        
      modal.content.innerHTML = `
        <div class="bookmarks-list">
          ${bookmarksHtml}
        </div>
        <div class="form-actions">
          <button type="button" class="primary-btn modal-close">Close</button>
        </div>
      `;
      
      // Add event listeners to remove buttons
      const removeButtons = modal.content.querySelectorAll('.remove-bookmark');
      removeButtons.forEach(button => {
        button.addEventListener('click', () => {
          const bookmarkId = button.getAttribute('data-id');
          this.removeBookmark(bookmarkId);
          
          // Remove from the DOM
          const bookmarkElement = modal.content.querySelector(`.bookmark-item[data-id="${bookmarkId}"]`);
          if (bookmarkElement) {
            bookmarkElement.remove();
          }
          
          // If no bookmarks are left, update the content
          if (modal.content.querySelectorAll('.bookmark-item').length === 0) {
            modal.content.querySelector('.bookmarks-list').innerHTML = `
              <div class="no-bookmarks">
                <p>You don't have any bookmarks.</p>
              </div>
            `;
          }
        });
      });
    }
    
    // Show modal
    document.body.appendChild(modal.element);
  }
  
  /**
   * Create a modal element
   * @param {string} title - Title of the modal
   * @returns {object} - Modal element and content
   * @private
   */
  _createModal(title) {
    const modal = document.createElement('div');
    modal.classList.add('trinkaspace-modal');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    `;
      const modalContent = document.createElement('div');
    modalContent.classList.add('trinkaspace-modal-content');
    modalContent.style.cssText = `
      background: #333;
      padding: 2em;
      border-radius: 15px;
      width: 95%;
      max-width: 800px; /* Wider to accommodate landscape layout */
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      border: 2px solid #2AFFF7;
    `;
    
    const modalHeader = document.createElement('div');
    modalHeader.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5em;
    `;
    
    const modalTitle = document.createElement('h3');
    modalTitle.textContent = title;
    modalTitle.style.cssText = `
      margin: 0;
      color: #2AFFF7;
    `;
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.cssText = `
      background: none;
      border: none;
      font-size: 1.5em;
      color: #ccc;
      cursor: pointer;
    `;
    closeButton.classList.add('modal-close');
    closeButton.setAttribute('aria-label', 'Close');
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);
    modalContent.appendChild(modalHeader);
    modal.appendChild(modalContent);
    
    // Close modal when clicking the X or outside the modal
    const closeModal = () => document.body.removeChild(modal);
    closeButton.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    // Add keyboard navigation
    modal.addEventListener('keydown', (e) => {
      // Close on Escape key
      if (e.key === 'Escape') {
        closeModal();
      }
      
      // Trap focus within modal
      if (e.key === 'Tab') {
        const focusableElements = modalContent.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // If shift+tab and on first element, focus the last element
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } 
        // If tab and on last element, focus the first element
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
    
    // Add close function to all modal-close elements
    const setupCloseButtons = () => {
      const closeButtons = modal.querySelectorAll('.modal-close');
      closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
      });
    };
    
    // Run initially and whenever content changes
    const observer = new MutationObserver(setupCloseButtons);
    observer.observe(modalContent, { childList: true, subtree: true });
    
    // Initial focus management - focus the first focusable element when modal opens
    setTimeout(() => {
      const firstFocusable = modalContent.querySelector(
        'button:not(.modal-close), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        closeButton.focus();
      }
    }, 50);
    
    return {
      element: modal,
      content: modalContent,
      close: closeModal
    };
  }
  
  /**
   * Bind event listeners for the user system
   * @private
   */
  _bindEvents() {
    // Add event listener for profile triggering (testing purposes)
    document.addEventListener('trinkaspace-show-profile', () => {
      this._showProfileModal();
    });
    
    // Other event handlers can be added here
  }
}

// Create and export singleton instance
const userManager = new UserManager();
export default userManager;
