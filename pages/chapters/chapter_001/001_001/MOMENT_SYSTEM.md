# Moment-Based TrinkaText System

This document explains the moment-based approach for managing narrative content in Trinkaspace.

## What are Moments?

"Moments" are precise timing points in the narrative that trigger specific text elements to appear. Rather than relying solely on scroll position or sequential execution, moments allow for more precise choreography of narrative elements.

## How Moments Work

1. **Moment Definition**
   - Each narrative element is assigned a specific moment number (e.g., `LTT_001`, `RTT_010`)
   - Moment numbers are sequential but can have gaps to allow for later insertions
   - Smaller increments (e.g., `LTT_001`, `LTT_002`) for closely timed sequences
   - Larger increments (e.g., `TB_010`, `TB_020`) for major scene transitions

2. **Moment Triggers**
   - Defined in `page_script.json` under the `moments` array
   - Triggered by scroll position (`atY`)
   - Can include delays for fine-tuning
   - Can be one-time or recurring

3. **Execution**
   - When a moment is triggered, all elements assigned to that moment appear
   - Multiple elements can share the same moment number for synchronized appearance

## Syntax for Text Elements

### Left TrinkaText (Eene)

```
LTT_001: "This is spoken text with quotes."
LTT_002: This is thought text without quotes.
```

### Right TrinkaText (Guest Characters)

```
RTT_010: "This is guest character text."
```

### Upper TrinkaText (Eene's Subconscious)

```
UTT_005: (Happy) This is emotion text with an emotion in parentheses.
UTT_006: (Embarrassed) This is text that will appear foggy.
```

### TextBox (World Description)

```
TB_020: This is world description text.
```

## Using Emotions in UTT

The following emotions are available for UTT elements:

- `(Neutral)` - Default blue color
- `(Happy)` - Green color
- `(Excited)` - Yellow color
- `(Curious)` - Light blue color
- `(Nervous)` - Orange color
- `(Embarrassed)` - Red color and fog effect
- `(Surprised)` - Purple color with crystal pulse
- `(Sad)` - Blue color
- `(Thoughtful)` - Purple color
- `(Confused)` - Pink color

## Moment Planning

When designing your narrative, consider:

1. **Major Scene Divisions**
   - Use multiples of 10 (10, 20, 30...) for major scene transitions
   - These often align with diorama positions

2. **Character Interactions**
   - Use incremental moments for back-and-forth dialogue
   - Example: `LTT_021`, `RTT_022`, `LTT_023`

3. **Emotional Responses**
   - Synchronize UTT reactions with LTT content
   - Example: `LTT_030`, `UTT_030` for immediate reaction

4. **Scene Timing**
   - Align moment triggers with scroll positions in `page_script.json`
   - Add delays for dramatic pauses or sequential reveals

## Advanced Features

- **Idle Moments**: Special moments triggered after periods of inactivity
- **Conditional Moments**: Moments that only trigger under specific conditions
- **Character-Specific Styling**: Different visual styles for different speakers
- **Multiple Languages**: Support for both LTR and RTL languages

## Example Workflow

1. Plan your major narrative moments (increments of 10)
2. Add dialogue exchanges with sequential moment numbers
3. Add emotional reactions in UTT elements
4. Configure moment triggers in `page_script.json`
5. Test and refine timing

## Best Practices

- Keep a consistent numbering scheme
- Leave gaps between moment numbers for future additions
- Coordinate UTT emotions with LTT content
- Use quotes consistently to differentiate thoughts from speech
- Document special moments in the `description` field in `page_script.json`
