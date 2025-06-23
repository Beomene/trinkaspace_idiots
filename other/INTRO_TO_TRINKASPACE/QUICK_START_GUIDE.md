# Trinkaspace Quick Start Guide

This guide will help you get started with developing for the Trinkaspace framework. It covers the essential concepts and steps to begin working with the system effectively.

## Understanding the Core Concepts

### The Three Arenas

Trinkaspace uses three conceptual "arenas" or layers:

1. **Primary Arena (Arena 1)** - Base layout and structure
2. **Secondary Arena (Arena 2)** - Text and interactive elements
3. **Tertiary Arena (Arena 3)** - HUD layer and menu system

Think of these as layers stacked on top of each other, each handling different aspects of the user interface and experience.

### Key Files to Know

- `trinkaspaceEngine.js` - The core engine that ties everything together
- `secondaryArena.js` - Handles text boxes and interactive elements
- `tertiaryArena.js` - Manages the menu and overlay systems
- `core.css` - The base styling for the entire site

## First Steps

### 1. Explore the Structure

Start by exploring these key areas:

- `/pages/CHAPTER_1/001_001/` - An example chapter page
- `/pages/general/` - Various standalone pages
- `/pages/AI-gallery/` - The AI character gallery
- `/pages/BI-gallery/` - The Biological Intelligence gallery

### 2. Review Test Pages

The test pages provide excellent examples of specific functionality:

- `/other/tests/system_integration_test.html` - Overall system testing
- `/other/tests/menu_test.html` - Menu system testing
- `/other/tests/symscram_test.html` - Text effect testing
- `/other/tests/veil_submenu_test.html` - Submenu testing

### 3. Understand Content Structure

Content in Trinkaspace follows specific patterns:

- **Chapters** are organized numerically (`001_001`, `001_002`, etc.)
- Each chapter section has configuration files (`config.json`, `scope.json`)
- Character voices are stored in `/CHARACTER_PROFILES/` as markdown files
- Gallery entries have standardized HTML templates

## Common Tasks

### Creating a New Page

1. Choose the appropriate location in the `/pages/` directory
2. Create the necessary folder structure
3. Create an `index.html` file based on existing templates
4. Add required configuration files (`config.json`, `scope.json`)
5. Create any needed asset directories

### Adding Text Content

Use the Secondary Arena system:

```javascript
import { addTextBox } from '/assets/js/secondaryArena.js';

// Basic text box
addTextBox("This is some text content", {
  position: "center",
  style: "narrator"
});

// From markdown file
addTextBoxFromMarkdown("/path/to/content.md", {
  position: "bottom"
});
```

### Creating a Visual Layout

1. Use the coordinate systems provided by `ViewportGeometry`
2. Position elements using viewport-relative units (vw, vh)
3. Use parallax layers for depth effects
4. Consider responsive behaviors for different screen sizes

### Adding a New Character

1. Create a voice profile in `/CHARACTER_PROFILES/` (use the alphabetical folders)
2. Create a gallery entry if appropriate
3. Update relevant index files to include the character
4. Add any character-specific assets to the appropriate directories

## Best Practices

### Code Style

- Follow the existing naming conventions
- Use informative comments for complex operations
- Group related functionality together
- Leverage the arena system for appropriate separation of concerns

### Asset Management

- Use appropriate image sizes for different contexts
- Organize assets in the established directory structure
- Follow the naming conventions for easy reference
- Consider performance impacts for large assets

### Testing

- Test on multiple device sizes
- Verify text effects work as expected
- Ensure menu navigation functions correctly
- Check for proper responsive behavior

### Documentation

- Update README files when adding new features
- Document complex functions with comments
- Create or update reports for significant changes
- Maintain the established documentation style

## Getting Help

If you need assistance:

1. Review the existing documentation in `/other/reports/`
2. Check the code comments for relevant functions
3. Look at similar implementations for guidance
4. Review the test pages that demonstrate the functionality you need

---

*This quick start guide provides the basics to begin working with Trinkaspace. Refer to the complete technical documentation for more detailed information.*
