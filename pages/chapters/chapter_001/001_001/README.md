# TrinkaText Advanced Narrative System

This system provides a comprehensive, script-based approach to narrative content in Trinkaspace, with support for multiple text display areas and advanced timing and interaction features.

## System Components

### Text Display Areas

1. **LTT (Left TrinkaText)** - Located at the bottom left of the viewport
   - Primarily for Eene's thoughts and dialogue
   - Supports multiple languages (LTR)
   - Can differentiate between spoken text and thoughts

2. **RTT (Right TrinkaText)** - Located at the bottom right of the viewport
   - For "GUEST" characters interacting with Eene
   - Supports RTL languages (Arabic, Hebrew, etc.)
   - Different speakers can have different text styles

3. **UTT (Upper TrinkaText)** - Located near the top left of the viewport
   - Special "crystal ball" / mirror visualization of Eene's subconscious
   - Displays emotions through colors and opacity effects
   - Can become "foggy" to represent embarrassment or censored thoughts

4. **TB (TextBox)** - Various positions throughout the page
   - Describes the world rather than being narrators
   - Connected to diorama elements

### Script Control Files

1. **script.md** - Main narrative content in a theatrical script format
   - Uses TB:, TT:, RTT:, UTT: prefixes to route content
   - Supports style modifiers [dense], [sprinkle]
   - Supports emotion indicators [emotion:happy], [foggy:true]
   - Supports timing control with (pause X seconds)
   - Supports sound effects with SOUND-BOX: directives

2. **page_alpha.json & page_omega.json** - Canonical page structure and runtime configuration
   - `page_alpha.json` defines the blueprint for dioramas, textboxes, and page elements (canonical, never mutated at runtime)
   - `page_omega.json` contains only minimal runtime/config data and references the alpha blueprint
   - Together, these replace the old `page.json` and `page_script.json` system
   - All advanced timing, conditions, and idle behaviors are now handled by the engine and script logic, not by a separate page_script.json

## Key Features

### Dynamic Content Control

- **Scroll-Driven Triggers**: Content appears based on scroll position
- **Time-Based Events**: Sequences with delays between elements
- **Idle Detection**: Special content appears when user is inactive
- **Conditional Logic**: Triggers based on combined conditions

### Character Expression

- **Emotion States**: UTT displays different emotions through colors and animations
- **Thought vs. Speech**: TT can show both internal thoughts and spoken dialogue
- **Opacity Control**: Indicates the strength or clarity of thoughts
- **Fogging Effect**: Represents embarrassment or censored thoughts

### Multilingual Support

- **LTR Support**: English, Japanese, etc. in the LTT
- **RTL Support**: Arabic, Hebrew, etc. in the RTT
- **Custom Fonts**: Noto Sans for multilingual text

## Implementation Guide

### Basic Usage

1. Create a `script.md` file for your page with theatrical-style directives
2. Add a `page_alpha.json` and `page_omega.json` for canonical structure and runtime config
3. Reference these in your engine/page setup

### Advanced Techniques

- Use the UTT for emotional moments and subconscious thoughts
- Implement idle messages for long-form narrative experiences
- Coordinate TB, TT, RTT, and UTT elements for rich storytelling
- Use different speakers in RTT to introduce new characters

## Technical Details

The system is implemented across several key files:
- `trinkaspaceEngine.js` - Core engine with HUD components
- `textScript.js` - Script parsing and execution
- CSS styles for visual presentation

The system uses scroll events, timing, and idle detection to create a dynamic reading experience that responds to user behavior.
