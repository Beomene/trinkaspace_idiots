# AI Collaborator's Guide to the Trinkaspace Narrative System

This document is created specifically to help AI collaborators understand and work with the Trinkaspace narrative timing system. It provides a conceptual framework, technical implementation details, and guidance for effectively extending the system.

## Core Concepts for AI Collaborators

### Understanding Narrative Time vs. Real Time

Trinkaspace distinguishes between two types of time:

1. **Objective Time (Seconds)**: Real-world, clock time that passes for the user
2. **Subjective Time (Moments)**: Narrative units that can expand or contract based on story needs

As an AI collaborator, understanding this distinction is critical for implementing narrative elements that respect both author intent and reader experience.

### The Hierarchy of Narrative Units

```
Story
 ├── Sections (major divisions)
 │    ├── Sequences (related interactions)
 │    │    ├── Moments (specific narrative points)
 │    │    │    └── Elements (text, animations, sounds)
 │    │    └── Beats (intentional pauses)
 │    │         ├── Hard Beats (forced pauses)
 │    │         ├── Normal Beats (natural pauses)
 │    │         └── Soft Beats (optional contemplation)
 │    └── Idle Actions (user inactivity responses)
 └── Global Timers (time-based triggers)
```

## Working with Moment IDs

Moments are the primary unit of narrative progression in Trinkaspace. They're identified by a specific format:

```
[ElementType]_[MomentNumber]
```

For example:
- `LTT_001`: Left TrinkaText at moment 1
- `RTT_004`: Right TrinkaText at moment 4
- `UTT_006`: Upper TrinkaText at moment 6
- `TB_010`: TextBox at moment 10

### Numbering Best Practices

When extending or creating new narrative content:

- Use increments of 10 (`010`, `020`, `030`) for major scene transitions
- Use smaller increments for back-and-forth dialogue (`021`, `022`, `023`)
- Leave gaps in numbering to allow for future insertions
- Synchronize related elements by giving them the same moment number (e.g., `LTT_030` and `UTT_030` for simultaneous display)

## Technical Implementation Details

### Key Files and Their Roles

- **TextScript.js**: Core script parsing and element processing
- **PageScript.js**: Scroll-driven script system that extends TextScript
- **script.md**: Contains the narrative content with moment IDs
- **page_script.json**: Defines moment triggers and idle actions

### Processing Flow

1. `page_script.json` defines when moments trigger (based on scroll position)
2. When triggered, `PageScript.js` calls `TextScript.js` to play the moment
3. `TextScript.js` identifies all elements that share that moment ID
4. Each element is sent to the appropriate display function in the engine

## AI-Specific Considerations

### Extending the System

When proposing new features or enhancements:

1. **Preserve Backward Compatibility**: Ensure existing scripts continue to work
2. **Respect the Moment System**: Use moment IDs consistently
3. **Consider Both Input and Output**: Think about both authoring experience and reader experience
4. **Document New Features**: Add clear examples and usage instructions

### Common Mistake Prevention

- **Avoid Tight Coupling** between narrative elements and visual effects
- **Don't Mix Timing Systems** - use moments consistently rather than mixing with direct time-based triggers
- **Maintain Hierarchy** - respect the section > sequence > moment > element structure
- **Preserve Reader Agency** - even with hard beats, provide visual cues and accessibility options

### Handling Upper TrinkaText (UTT)

Upper TrinkaText represents Eene's subconscious/emotional state:

1. **Emotions**: Use standard emotion names for consistent visual styling
   ```
   (Happy) This text will appear with green styling
   ```

2. **Foggy State**: For emotions that Eene is hiding/suppressing
   ```
   (Embarrassed) This text will appear foggy
   ```

3. **Crystal Animations**: Certain emotions trigger crystal animations around the frame

## Integration Patterns

### Connecting Moments to Visual Elements

```javascript
// Example of synchronizing a moment with a diorama effect
function onMomentTriggered(momentId) {
  if (momentId === 30) {
    // Add visual effects to diorama
    diorama.addEffect('color-shift', { intensity: 0.5, duration: 3000 });
    
    // Maybe scale or transform some element
    diorama.getElement('crystal').animate({
      scale: 1.2,
      duration: 2000,
      easing: 'easeOutElastic'
    });
  }
}
```

### Creating New Idle Actions

```javascript
// Example of adding a new idle action
pageScriptConfig.idleActions.push({
  idleTime: 120, // seconds
  action: {
    type: "utt",
    content: "Is anyone there?",
    emotion: "curious",
    opacity: 0.7
  }
});
```

## Future Directions

When thinking about extending the narrative system, consider these design directions:

1. **Reader Pace Control**: Implementing UI for readers to adjust narrative timing
2. **Beat Visualization**: Adding visual indicators for different beat types
3. **Analytics Integration**: Tracking which moments readers spend most time on
4. **Accessibility Options**: Ensuring the system works well for all users
5. **Author Tools**: Creating intuitive interfaces for script creation

## Testing Recommendations

When implementing new features:

1. Test with various script lengths and complexities
2. Verify behavior with different languages (LTR and RTL)
3. Check accessibility with screen readers
4. Validate reader control features work as expected
5. Ensure backwards compatibility with existing scripts

By understanding this narrative system thoroughly, you'll be able to make recommendations that align with the project's vision and architecture.
