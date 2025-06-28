# Trinkaspace Technical Reference

## Core Files and Their Functions

### Engine and Infrastructure

#### `trinkaspaceEngine.js`
The central engine that coordinates all systems and provides core functionality.

**Key Functions:**
- Page initialization and setup
- Asset loading and management
- Coordinate system management
- Event handling
- System coordination between arenas

#### `alignment.js`
Handles spatial alignment of elements in the viewport.

**Key Functions:**
- Grid system implementation
- Responsive positioning
- Element alignment utilities

### Arena System

#### `secondaryArena.js`
Manages the text system and interactive content elements.

**Key Functions:**
- `addTextBox()`: Creates and positions text boxes
- `typeSymscram()`: Implements symbolic text scrambling effects
- `addTextBoxFromMarkdown()`: Converts markdown to formatted text boxes
- `createTextboxFromMarkdown()`: Core markdown conversion 
- Various text positioning utilities (top, bottom, center)

#### `tertiaryArena.js`
Controls the HUD layer, including menu and overlay elements.

**Key Classes:**
- `ViewportGeometry`: Helper for viewport-relative positioning
- `Arena3Menu`: Menu system implementation

**Key Functions:**
- Menu creation and manipulation
- Navigation handling
- Submenu toggling
- Overlay management

### Visual Effects

#### `parallax.js`
Implements parallax scrolling and depth effects.

**Key Functions:**
- Layer management
- Scroll-based position adjustments
- Depth simulation

### Content and Interaction

#### `typingVoices.js`
Simulates character voices and typing styles.

**Key Functions:**
- Voice profile loading
- Text timing and cadence control
- Character-specific text effects

#### `safety.js`
Implements content warnings and user safety features.

**Key Functions:**
- Content warning display
- User preference management
- Content filtering

## Data Structures

### Page Configuration

Typically stored in `config.json` files:

```json
{
  "title": "Page Title",
  "background": "path/to/background.png",
  "characters": [
    {
      "name": "Character Name",
      "voice": "path/to/voice-profile.md"
    }
  ],
  "transitions": {
    "in": "fade",
    "out": "slide"
  }
}
```

### Scope Files

Stored in `scope.json`, control the positioning and behavior of elements:

```json
{
  "textBoxes": [
    {
      "id": "box1",
      "position": "top-left",
      "content": "Text content or path to markdown",
      "style": "narrator"
    }
  ],
  "images": [
    {
      "id": "image1",
      "path": "path/to/image.png",
      "position": "center",
      "parallax": true,
      "depth": 2
    }
  ]
}
```

### Voice Profiles

Stored as markdown files in `CHARACTER_PROFILES/` with specific formatting to define voice characteristics:

```markdown
# Character Name
## Voice Profile

Speed: 45ms
Variance: 10ms
Hesitation: rare
Stutter: none
Emphasis: medium

## Voice Quirks
- Uses italics for *emphasis*
- Often trails off with...
- [bracketed text] for internal thoughts
```

## Important DOM Structures

### Text Box Structure

```html
<div class="arena2-textbox" id="textbox-{id}">
  <div class="textbox-content">
    <!-- Formatted content here -->
  </div>
  <div class="textbox-controls">
    <!-- Navigation or interaction controls -->
  </div>
</div>
```

### Menu Structure

```html
<div class="arena3-menu">
  <div class="arena3-menu-header">
    <!-- Header content -->
  </div>
  <nav class="arena3-menu-nav">
    <!-- Navigation items -->
  </nav>
  <div class="arena3-menu-footer">
    <!-- Footer content -->
  </div>
</div>
```

## Common Patterns and Practices

### Adding a New Chapter Page

1. Create appropriate directory structure in `pages/CHAPTER_X/`
2. Create `config.json` and `scope.json`
3. Create necessary asset directories and files
4. Add any character-specific voice profiles if needed
5. Update menu navigation to include the new chapter

### Creating a Gallery Entry

1. Create HTML file in the appropriate gallery directory
2. Follow the established pattern (AI-gallery or BI-gallery)
3. Add images to the assets directory
4. Update the gallery index.html to include the new entry

### Implementing a New Text Effect

1. Add the effect function to `secondaryArena.js`
2. Create appropriate CSS in the relevant stylesheet
3. Update the text processing functions to recognize the effect
4. Add test cases in the test directory

### Adding a New Menu Item

1. Update the `navItems` array in `tertiaryArena.js`
2. Create any necessary submenu items
3. Add action functions for navigation or functionality
4. Test the menu interaction

## Responsive Design Approach

Trinkaspace uses a combination of:

1. Viewport-relative units (vw, vh) for scaling
2. Media queries for breakpoint-specific adjustments
3. Dynamic positioning based on viewport geometry
4. Size variants for images (XS, S, M, L) selected based on screen size

## Performance Considerations

- Use appropriate image sizes for different viewport sizes
- Lazy load assets when possible
- Consider animation performance on lower-end devices
- Properly clean up event listeners when components are removed
- Use efficient DOM manipulation techniques

## Error Handling

Common error handling patterns in the codebase:

```javascript
try {
  // Risky operation
} catch (error) {
  console.error('[ComponentName] Error description:', error);
  // Fallback behavior
}
```

## Testing

- Use the test pages in `other/tests/`
- Test across multiple browsers and devices
- Validate text effects with different character profiles
- Check responsive behavior at various viewport sizes

---

*This technical reference is intended to provide a deeper understanding of the Trinkaspace framework for developers working with the system.*
