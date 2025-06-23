# Trinkaspace User Authentication System

This document outlines the "Give Yourself a Name" feature implementation for the Trinkaspace website.

## Overview

The user authentication system allows readers to create accounts, personalize their experience, and save bookmarks as they progress through the story. The implementation uses client-side storage (localStorage) to maintain user information.

## Features

- **User Registration**: Create accounts with username, email, and password
- **Login/Logout**: Session persistence across page loads
- **User Profile**: View and update account information
- **Bookmarking**: Save important pages to easily return later
- **Preferences**: Customize the reading experience with themes and settings

## Files Structure

```
assets/
  js/
    userManager.js         # Core user management functionality
    userIntegration.js     # Integration for individual pages
  css/
    user-interface.css     # Styles for user interface components
pages/
  general/
    user-settings/
      index.html           # User settings page
```

## Integration Guide

### Basic Setup

To add user authentication to a page:

1. Include the CSS file in the page header:

```html
<link rel="stylesheet" href="/assets/css/user-interface.css">
```

2. Add a container for the user interface:

```html
<div id="trinkaspace-user-display" class="trinkaspace-user-area"></div>
```

3. Initialize the user system with JavaScript:

```html
<script type="module">
  import { initUserInterface } from '/assets/js/userIntegration.js';
  
  document.addEventListener('DOMContentLoaded', () => {
    initUserInterface({
      pageId: 'unique-page-id',
      pageTitle: 'Page Title',
      enableBookmarking: true
    });
  });
</script>
```

### Adding Bookmarking

Bookmarking functionality is automatically added to pages when `enableBookmarking: true` is set in the initialization options. This adds a star icon that users can click to save the current page.

### Listening for User Events

Your page can respond to login/logout events:

```javascript
document.addEventListener('trinkaspace-user-login', (event) => {
  const user = event.detail;
  console.log(`User logged in: ${user.username}`);
  // Update UI as needed
});

document.addEventListener('trinkaspace-user-logout', () => {
  console.log('User logged out');
  // Update UI as needed
});
```

### Accessing User Data

The userManager provides methods for accessing user data:

```javascript
import { userManager } from '/assets/js/userIntegration.js';

// Check if logged in
const isLoggedIn = userManager.isUserLoggedIn();

// Get current user
const user = userManager.getCurrentUser();

// Get user's bookmarks
const bookmarks = userManager.getBookmarks();

// Get user preferences
const preferences = userManager.getPreferences();
```

## Personalization Options

Users can customize their experience through the settings page:

1. **Theme Selection**: Choose from different color schemes
2. **Text Size**: Adjust text size for better readability
3. **Idle Chatter**: Toggle idle dialogue on/off
4. **Auto-bookmarking**: Enable/disable automatic bookmarks

## Security Considerations

This implementation uses localStorage for simplicity, which comes with these limitations:

- User data is stored in the browser only
- Passwords are stored in plaintext (not recommended for sensitive data)
- No server-side validation or authentication

For a production environment with sensitive data, consider:
- Implementing server-side authentication
- Adding password hashing
- Using HTTPS for all communications
- Adding more robust validation

## Future Enhancements

Potential enhancements for the user system:

1. Server-side authentication for true persistence
2. Social login options (Google, Facebook, etc.)
3. Enhanced profile options (avatars, bios)
4. Reading progress synchronization across devices
5. Enhanced bookmarking with notes
6. User achievements and milestones
7. Email verification and password recovery
