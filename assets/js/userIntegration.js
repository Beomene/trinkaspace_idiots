/**
 * userIntegration.js
 * 
 * Integrates user authentication and personalization features across all pages
 * To be included on all Trinkaspace pages that need user functionality
 */

import userManager from './userManager.js';

// Variables to store page information
let currentPageId = '';
let currentPageTitle = '';
let currentPagePath = '';

/**
 * Initialize the user interface and functionality
 * Should be called from each page after DOM is loaded
 * @param {Object} options - Configuration options
 * @param {string} options.pageId - Unique identifier for the current page
 * @param {string} options.pageTitle - Title of the current page
 * @param {boolean} options.enableBookmarking - Whether to enable bookmarking on this page
 */
export function initUserInterface(options = {}) {
  const defaultOptions = {
    pageId: window.location.pathname,
    pageTitle: document.title,
    enableBookmarking: true
  };
  
  const config = { ...defaultOptions, ...options };
  currentPageId = config.pageId;
  currentPageTitle = config.pageTitle;
  currentPagePath = window.location.pathname;
  
  // Initialize user manager
  userManager.init();
  
  // Create user area if it doesn't exist
  createUserArea();
  
  // Initialize bookmarking if enabled
  if (config.enableBookmarking) {
    initBookmarking();
  }
  
  // Check for personalization options
  applyUserPersonalization();
  
  console.log('[UserIntegration] Initialized with page ID:', currentPageId);
}

/**
 * Create the user interface area
 * @private
 */
function createUserArea() {
  // Check if area already exists
  let userArea = document.getElementById('trinkaspace-user-display');
  
  if (!userArea) {
    // Create header if it doesn't exist
    let header = document.querySelector('header');
    if (!header) {
      header = document.createElement('header');
      document.body.insertBefore(header, document.body.firstChild);
    }
    
    // Create user area
    userArea = document.createElement('div');
    userArea.id = 'trinkaspace-user-display';
    userArea.className = 'trinkaspace-user-area';
    header.appendChild(userArea);
  }
}

/**
 * Initialize bookmarking functionality
 * @private
 */
function initBookmarking() {
  // Check if bookmark button already exists
  let bookmarkBtn = document.querySelector('.bookmark-button');
  
  if (!bookmarkBtn && currentPageId) {
    // Create bookmark button
    bookmarkBtn = document.createElement('button');
    bookmarkBtn.className = 'bookmark-button';
    bookmarkBtn.setAttribute('data-page-id', currentPageId);
    bookmarkBtn.setAttribute('data-page-title', currentPageTitle);
    bookmarkBtn.title = 'Add Bookmark';
    bookmarkBtn.innerHTML = '☆';
    
    // Determine where to add the bookmark button
    let header = document.querySelector('header');
    if (header) {
      header.appendChild(bookmarkBtn);
    } else {
      // If no header, create a floating bookmark button
      bookmarkBtn.style.position = 'fixed';
      bookmarkBtn.style.top = '15px';
      bookmarkBtn.style.left = '15px';
      bookmarkBtn.style.zIndex = '1000';
      document.body.appendChild(bookmarkBtn);
    }
    
    // Add click event
    bookmarkBtn.addEventListener('click', toggleBookmark);
    
    // Check if page is already bookmarked
    updateBookmarkState();
  }
}

/**
 * Toggle bookmark status for the current page
 * @private
 */
function toggleBookmark() {
  if (!userManager.isUserLoggedIn()) {
    // Show login prompt if not logged in
    alert('Please login to bookmark pages');
    return;
  }
  
  const bookmarkBtn = document.querySelector('.bookmark-button');
  if (!bookmarkBtn) return;
  
  const pageId = currentPageId;
  const pageUrl = window.location.href;
  
  // Toggle bookmark status
  if (bookmarkBtn.classList.contains('active')) {
    userManager.removeBookmark(pageId);
    bookmarkBtn.classList.remove('active');
    bookmarkBtn.setAttribute('title', 'Add Bookmark');
    bookmarkBtn.innerHTML = '☆';
  } else {
    userManager.saveBookmark(pageId, currentPageTitle, { url: pageUrl });
    bookmarkBtn.classList.add('active');
    bookmarkBtn.setAttribute('title', 'Remove Bookmark');
    bookmarkBtn.innerHTML = '★';
  }
}

/**
 * Update bookmark button state based on whether the page is bookmarked
 * @private
 */
function updateBookmarkState() {
  if (!userManager.isUserLoggedIn()) return;
  
  const bookmarkBtn = document.querySelector('.bookmark-button');
  if (!bookmarkBtn) return;
  
  const bookmarks = userManager.getBookmarks();
  const isBookmarked = bookmarks.some(b => b.id === currentPageId);
  
  if (isBookmarked) {
    bookmarkBtn.classList.add('active');
    bookmarkBtn.setAttribute('title', 'Remove Bookmark');
    bookmarkBtn.innerHTML = '★';
  } else {
    bookmarkBtn.classList.remove('active');
    bookmarkBtn.setAttribute('title', 'Add Bookmark');
    bookmarkBtn.innerHTML = '☆';
  }
}

/**
 * Apply user personalization settings
 * @private
 */
function applyUserPersonalization() {
  if (!userManager.isUserLoggedIn()) return;
  
  const preferences = userManager.getPreferences();
  
  // Apply theme preferences if available
  if (preferences.theme) {
    document.body.setAttribute('data-theme', preferences.theme);
  }
  
  // Apply text size preferences
  if (preferences.textSize) {
    document.documentElement.style.setProperty('--user-text-size', preferences.textSize);
  }
  
  // Hide idle chatter if disabled
  if (preferences.disableIdleChatter) {
    document.body.classList.add('disable-idle-chatter');
  }
  
  // Apply any other personalization options
  // ...
}

/**
 * Handle user login events
 * @private
 */
function onUserLogin(event) {
  updateBookmarkState();
  applyUserPersonalization();
}

/**
 * Handle user logout events
 * @private
 */
function onUserLogout() {
  // Reset any personalized UI elements
  document.body.removeAttribute('data-theme');
  document.documentElement.style.removeProperty('--user-text-size');
  document.body.classList.remove('disable-idle-chatter');
  
  // Update bookmark button
  const bookmarkBtn = document.querySelector('.bookmark-button');
  if (bookmarkBtn) {
    bookmarkBtn.classList.remove('active');
    bookmarkBtn.setAttribute('title', 'Add Bookmark');
    bookmarkBtn.innerHTML = '☆';
  }
}

// Register event listeners
document.addEventListener('trinkaspace-user-login', onUserLogin);
document.addEventListener('trinkaspace-user-logout', onUserLogout);

// Export key functionality
export { userManager };
