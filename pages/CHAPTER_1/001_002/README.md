# TrinkaScript Implementation Guide

This document provides guidance on how to implement a full TrinkaScript approach for narrative content in Trinkaspace.

## What is TrinkaScript?

TrinkaScript is a script-driven approach for managing narrative content in Trinkaspace. It uses a markdown-based format to coordinate TextBoxes (TB), Left TrinkaText (TT), Right TrinkaText (RTT), sound effects, and timing.

## Basic Syntax

- `TB:` - TextBox content
- `TT:` - Left TrinkaText content (LTR languages)
- `RTT:` - Right TrinkaText content (RTL languages)
- `(pause X seconds)` - Pause for X seconds
- `SOUND-BOX: sound_name` - Play a sound effect
- `[dense]` or `[sprinkle]` - Style modifiers for TT and RTT

## Implementation Steps for Page 001_002

1. **Create Folder Structure:**
   - Create A1 folder for dioramas
   - Create A2 folder for scripts and text content

2. **Create Script File:**
   - Create a main script.md file with all narrative content
   - Use the syntax above to define all text elements

3. **Create Scope Configuration:**
   - Define TextBox positioning in scope.json

4. **Update Page Configuration:**
   - Add script reference to page.json
   - Configure autoplay and scroll triggers

5. **Character Voice Implementation:**
   - Use character prefixes in the script
   - Example: `TB: [Eene] Hello there!`

6. **Multi-Language Support:**
   - Use LTT for LTR languages (English, Japanese, etc.)
   - Use RTT for RTL languages (Arabic, Hebrew, etc.)

## Example Script Structure

```markdown
TB: [Narrator] Our story begins on a distant planet...

TT: Welcome to Planet Trinka. The adventure begins here.

RTT: مرحبًا بكم في كوكب ترينكا. تبدأ المغامرة هنا.

(pause 3 seconds)

TB: [Eene] I wonder what we'll find here!

SOUND-BOX: footsteps_soft

TT: [dense] The ground trembles slightly beneath your feet.

(pause 2 seconds)

TB: [Emraa] We should proceed with caution.
```

## Best Practices

1. **Narrative Flow:**
   - Use pauses strategically to control pacing
   - Alternate between TB, TT, and RTT for variety
   - Group related content together

2. **Text Styling:**
   - Use `[dense]` for important information
   - Use `[sprinkle]` for subtle asides or thoughts

3. **Multi-Language Content:**
   - Keep LTR content in TT
   - Keep RTL content in RTT
   - Ensure translations maintain consistent meaning

4. **Sound Integration:**
   - Use SOUND-BOX directives at key moments
   - Pair sounds with relevant text content

5. **Testing:**
   - Test script on different device sizes
   - Verify all text appears correctly
   - Check style implementations

## Next Steps for 001_002

1. Create a compelling narrative script using characters
2. Implement corresponding dioramas
3. Configure proper timing and pacing
4. Test on multiple devices and screen sizes
5. Refine and iterate based on feedback

---

Follow this guide to create a rich, script-driven narrative experience using the dual TrinkaText system!
