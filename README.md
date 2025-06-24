# Trinkaspace Project Documentation

## 🌌 Introduction

Welcome to Trinkaspace, an immersive interactive web narrative platform that brings the Trinkaloop Saga to life. This project combines narrative storytelling, visual art, and interactive elements to create a unique user experience that adapts to different devices and screen sizes.

## 🗺️ For New AI Collaborators

If you're an AI assistant joining this project, here's what you should know to get started:

### Key Concepts

1. **Royal Alpha System** - The core scaling and layout system that replaced the deprecated "Trinity" system. This determines how assets are selected and displayed based on device capabilities and screen sizes.

2. **Parallax Effects** - Many pages use layered parallax effects for depth and immersion. These are implemented in various JS modules like `portalParallax.js`.

3. **Interactive Elements** - The project includes cursor-following elements, particle effects, and other interactive features that enhance the user experience.

4. **User System** - A client-side user management system allowing visitors to create profiles, set preferences, and bookmark pages.

5. **Dynamic Content Loading** - Many pages load content dynamically through JSON configuration files (see `scope.json` and `config.json` files).

### Important Files to Review First

1. **Royal Decree** - `other/instructions/ROYAL_DECREE.md` - Documentation for the Royal Alpha scaling system

2. **Engine Core** - `assets/js/trinkaspaceEngine.js` - The main engine that powers the site's core functionality

3. **User Management** - `assets/js/userManager.js` - Handles user profiles, preferences, and authentication

4. **Special Effects** - Review these files to understand interactive elements:
   - `assets/js/cursorChase.js` - Elements that follow the cursor
   - `assets/js/particleEffects.js` - Particle system that creates luminous effects
   - `assets/js/pageParticles.js` - Integration of particles with pages

5. **Project Structure** - `other/reports/FILE_ORGANIZATION_SUMMARY.md` - Overview of how files are organized

### Project Architecture

```
assets/
├── css/              # Style sheets
├── js/               # JavaScript modules
│   ├── trinkaspaceEngine.js     # Core engine
│   ├── userManager.js           # User system
│   ├── particleEffects.js       # Particle system
│   └── ...
├── images/           # Image assets
└── UI/               # UI elements

pages/                # Content pages
├── CHAPTER_1/        # Chapter content
│   └── ...
└── general/          # General pages (about, demos)

other/
├── hall_of_fAIm/     # AI collaborator documentation
├── instructions/     # Technical specifications
├── reports/          # Development reports
└── tests/            # Test pages
```

## 🔧 Technical Implementation

### Royal Alpha System

The Royal Alpha system is responsible for:

1. **Content Unit Calculation (CUC)** - The foundational measurement unit based on the A1 width
2. **Device Class Detection** - Determines device capabilities
3. **Asset Selection** - Chooses appropriate asset sizes (XS, S, M, L, XL) based on device
4. **Layout Adjustments** - Modifies page layout based on available space
5. **CSS Variables** - Sets variables for consistent sizing throughout the application

Whenever working on visual elements, consult the Royal Alpha system documentation to ensure proper scaling and responsiveness.

### Interactive Effects

Two main interactive effect systems are implemented:

1. **Cursor Chase** - Elements that follow cursor movement with configurable intensity and behaviors
   - Toggle with keyboard shortcut: Alt+E

2. **Particle System** - Small luminous particles that follow the cursor with various presets
   - Toggle with keyboard shortcut: Alt+P
   - Different presets available for different character themes

### User System

The user system provides:

1. **Profile Creation** - Users can create profiles with custom names
2. **Pronoun Selection** - Users can select their pronouns for personalized narrative
3. **Profile Pictures** - Visual avatars for user identification 
4. **Bookmarks** - Save progress through the narrative
5. **Local Storage** - All user data is stored client-side

## 🧪 Testing

Test pages for various features can be found in `other/tests/`. These include:

1. `menu_test.html` - Tests menu UI components
2. `symscram_test.html` - Tests the symbol scrambling effect
3. `system_integration_test.html` - Tests overall system integration
4. `veil_submenu_test.html` - Tests the veil submenu functionality
5. `profile_pic_test.html` - Tests profile picture selection

## 📝 Development Notes

### Deprecated Systems

The "Trinity" system has been fully deprecated and replaced with the Royal Alpha system. All references to Trinity should be considered obsolete.

### Browser Compatibility

The site is designed to work on modern browsers with primary focus on:
- Chrome/Edge (Chromium-based)
- Firefox
- Safari

Mobile support is implemented through the Royal Alpha system's responsive design.

### Path References

When adding new features, ensure that path references use relative paths (e.g., `./assets/images/` rather than `/assets/images/`) to maintain compatibility with various deployment environments, including GitHub Pages.

## 🧩 Hall of fAIm

The project has benefited from collaboration with various AI assistants, whose contributions are documented in `other/hall_of_fAIm/`. New AI collaborators should review these profiles to understand the history of AI contributions to the project.

Key contributors include:
- Aria the Third - Implemented particle effects and Royal Alpha system
- Other collaborators documented in their respective profiles

## 🔗 Getting Started with Development

1. Review the Royal Decree documentation
2. Examine the core engine functionality
3. Test any changes on the appropriate test pages
4. Ensure responsive design through the Royal Alpha system
5. Use relative paths for all assets

## 📊 Demo Pages

To see specific features in action, visit:
- `pages/general/particle-demo/index.html` - Demonstrates the particle system
- `pages/general/cursor-chase-demo/index.html` - Demonstrates cursor chase effects
- `pages/general/voice-demo/index.html` - Demonstrates character voice typing
