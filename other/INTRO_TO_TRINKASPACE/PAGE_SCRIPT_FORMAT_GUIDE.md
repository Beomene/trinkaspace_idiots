# Page Script Format Guide

The PageScript system is an extension of the TextScript system that centralizes all narrative content for a page into a single markdown file. It adds scroll-based triggers to enable coordinated narration driven by the user's scroll position.

## Overview

The Page Script system:

1. Loads a central `page-script.md` file for each page
2. Parses directives to coordinate TextBox and TrinkaText content
3. Triggers content based on the user's scroll position
4. Supports different TextBox styles (dense or sprinkle)
5. Integrates fully with the existing TextScript timing system

## Script Format

A Page Script uses a markdown-based format with special directives:

```markdown
// This is a comment - it won't be processed

## intro [y=0] [once] [delay=500]
This marks a script section named "intro" that triggers at scroll position 0
The "once" means it will only trigger the first time, and delay is in milliseconds

TB: "Hello, welcome to Trinkaspace!" (pause 3 seconds)
TT: I wonder what this place is...
second
second
TB: "Let me show you around..."

## midway [y=2500] [once]
This section triggers when the user scrolls to y=2500px

[dense] TB: This creates a more prominent, opaque textbox
[sprinkle] TT: This creates a subtle, more transparent message
```

## Script Directives

### Section Headers

Sections define scroll-activated script blocks.

```markdown
## section_name [y=1000] [once] [delay=500]
```

* `##` - Marks the start of a section
* `section_name` - Unique identifier for the section
* `[y=1000]` - Scroll position in pixels that triggers this section
* `[once]` - (Optional) Only trigger this section once
* `[delay=500]` - (Optional) Delay in milliseconds before starting this section after scroll trigger

### Text Content

```markdown
TB: "Text for a TextBox"
TT: Message for TrinkaText HUD
```

### Timing Control

```markdown
second
```

Adds a 1-second pause between lines. You can use multiple for longer pauses.

### Explicit Pauses

```markdown
TB: "This has a pause after it" (pause 5 seconds)
```

This adds a 5-second pause after displaying the text.

### Sound Effects

```markdown
(SOUND-BOX, A2, the sound of a door opening)
```

Plays a sound effect.

### TextBox Styles

```markdown
[dense] TB: "This appears in a more prominent textbox"
[sprinkle] TB: "This appears in a subtle, semi-transparent textbox"
```

## Adding Page Script to a Page

There are two ways to add a page script:

1. Create a `page-script.md` file in your page folder (automatically detected)
2. Specify a custom path in your `page.json`:

```json
{
  "meta": {
    "chapter": 1,
    "page": 1,
    "title": "The Soda Cat Awakens",
    "background": "#202029",
    "pageHeight": "10000px",
    "scriptPath": "./custom-script-path.md"
  },
  ...
}
```

## Example Page Script

```markdown
// Intro section - triggers immediately
## intro [y=0] [once]
TB: "Welcome to the Trinkaspace story experience." (pause 3 seconds)
second
TT: I wonder what this story is about...
second
TB: "Scroll down to begin the journey."

// First scene - triggers at y=2000
## scene1 [y=2000] [once] [delay=500]
[dense] TB: "The forest was utterly still, as if holding its breath."
second
second
[sprinkle] TT: Something feels off...
second
TB: "A twig snapped in the distance."
(SOUND-BOX, A2, twig snap)

// Second scene - triggers at y=4000
## scene2 [y=4000] [once]
TB: "The clearing revealed an ancient stone structure."
second
second
TT: I've seen this before... in my dreams.
second
TB: "Symbols carved into the stone began to glow with an eerie light."
```

## Tips for Writing Effective Page Scripts

1. **Plan your scroll positions:** Coordinate with the visual elements on your page
2. **Use styles purposefully:** `[dense]` for important story beats, `[sprinkle]` for subtle thoughts
3. **Layer your narration:** Combine TB and TT to create dialog between narrator and character
4. **Timing is crucial:** Use `second` and `(pause X seconds)` to control pacing
5. **Remember scroll is primary:** Design your script to work with user's scrolling behavior 

## Debugging Page Scripts

If your script isn't working as expected:

1. Open the browser console to see debug messages
2. Check section IDs for typos
3. Verify y-position values 
4. Make sure your script is being loaded (check the console for "[PageScript] Parsed X lines, Y scroll triggers")

## Advanced: Integration with Scroll Triggers

The PageScript system integrates with the ScrollTrigger system to display messages via TRINKATEXT at specified scroll positions. You can combine both approaches for complex interactions.
