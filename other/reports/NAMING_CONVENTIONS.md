# Trinkaspace Project Naming Conventions

This document outlines the standardized naming conventions for the Trinkaspace project.

## Directory Structure

### Main Content Directories

- `assets/` - All shared assets (JS, CSS, images)
- `pages/` - All public-facing content pages
- `tests/` - Test files and demos (moved from `other/tests/`)
- `CHARACTER_PROFILES/` - Voice profiles and character information

### Arena Structure

- Instead of `A1` and `A2`, we now use descriptive names:
  - `primaryArena/` - Primary content arena (formerly A1)
  - `secondaryArena/` - Secondary content arena (formerly A2)

### Character Organization

Characters are now organized by type:
- `CHARACTER_PROFILES/characters/` - Main characters
- `CHARACTER_PROFILES/demons/` - Demon characters 
- `CHARACTER_PROFILES/narrators/` - Narrator voices

## File Naming

### JavaScript Files

- Use camelCase for JavaScript files: `fileNameExample.js`
- Class files should match the class name: `PageScript.js` for `PageScript` class
- Utility modules should describe their function: `typingVoices.js`

### CSS Files

- Use kebab-case (hyphenated): `component-name.css`
- Common elements should be in `core.css`
- Component-specific styling should be in dedicated files: `beat-system.css`

### HTML Files

- Index files should be named `index.html`
- Test files should include "test" in the name: `beat_system_test.html`
- Demo files should include "demo" in the name: `symscram_demo.html`

### Content Files

- Use descriptive paths with hierarchical structure
- Chapter content: `pages/CHAPTER_1/001_001/`
- Special content: `pages/general/about-artist/`

## Configuration Files

- Use kebab-case: `page-config.json`
- Common patterns:
  - `config.json` - General configuration
  - `scope.json` - Scope system configuration
  - `page.json` - Page-level configuration

## Implementation Notes

These naming conventions are being implemented gradually across the project. When working on files:

1. Follow these conventions for all new files
2. Rename files to match these conventions when making substantial changes
3. Update references when renaming files

## Why These Conventions Matter

Consistent naming helps:
- Make the codebase more maintainable
- Clarify the purpose of each file
- Reduce cognitive load when navigating the project
- Improve collaboration between team members
