# Beat System User Guide

## Understanding the Beat System

The Beat System introduces three types of intentional pauses to Trinkaspace narratives, allowing authors to control the rhythm, pace, and emotional impact of their stories.

## What are Beats?

Beats are intentional pauses or spaces between narrative moments. Unlike moments that contain content, beats contain absence - which itself is meaningful. They provide rhythm, tension, reflection, or emotional space within the narrative flow.

## Types of Beats

### Hard Beat

**Purpose**: Create tension, focus, and heightened emotional impact
**Characteristics**:
- User scrolling is temporarily disabled
- Creates a feeling of being "trapped" in the narrative moment
- Accompanied by visual effects (darkening, desaturation)
- Can synchronize with character anxiety (UTT reactions)

**When to use**:
- Moments of revelation or shock
- Dramatic confrontations
- When a character is emotionally frozen
- For jump-scares or sudden realizations

### Normal Beat

**Purpose**: Natural rhythm in conversation, thoughtful pauses
**Characteristics**:
- Standard pause in narrative flow
- User can scroll but visual cues suggest waiting
- Represents thinking time, transitions, or brief emphasis

**When to use**:
- Between dialogue lines to create natural conversation rhythm
- During character thought processes
- For brief emphasis of important points
- Transitions between narrative sections

### Soft Beat

**Purpose**: Extended contemplation, appreciation of beauty, rest
**Characteristics**:
- User can freely scroll past
- Often in visually appealing scenes
- May include ambient effects or subtle animation
- Optional "eternity mode" for extended dwelling

**When to use**:
- Scenic moments worth appreciating
- Philosophical reflection
- After intense scenes to provide rest
- For building atmosphere and mood

## Using Beats in Scripts

Beats are defined in the script using the following syntax:

```
BEAT_025: hard 3000
```

Where:
- `025` is the moment number
- `hard` is the beat type (can be `hard`, `normal`, or `soft`)
- `3000` is the duration in milliseconds

For beats with additional parameters:

```
BEAT_030: soft 5000 [ambient=forest] [breathing=true] [eternity=true]
```

Available parameters:
- `[uttEmotionIntensify=true]` - Intensifies the UTT emotion (for hard beats)
- `[uttPulse=true]` - Adds a subtle pulse effect to the UTT (for normal beats)
- `[ambient=name]` - Plays ambient sound (for soft beats)
- `[breathing=true]` - Adds subtle viewport "breathing" animation (for soft beats)
- `[eternity=true]` - Adds a button allowing readers to stay in the moment (for soft beats)

## Beat Sequence Examples

### Example 1: Revelation Sequence

```
LTT_100: "Wait, what's that sound?"

UTT_100: (Nervous) Something's not right here...

BEAT_101: normal 2000

LTT_102: "It's coming from behind the door..."

BEAT_103: hard 4000 [uttEmotionIntensify=true]

LTT_104: "OH MY GOD!"
```

### Example 2: Contemplative Sequence

```
LTT_200: "The sunrise over the mountains was breathtaking."

BEAT_201: soft 5000 [breathing=true] [eternity=true]

LTT_202: "I could have stayed there forever, just watching the colors change."
```

## Reader Control

Readers can control their experience of beats through the Reader Pace settings:

- Enable/disable hard beats (for readers who dislike scroll locking)
- Adjust duration scaling for each beat type
- Settings are remembered between sessions

## Best Practices

1. **Use Sparingly** - Beats are powerful because they're unusual. Overuse will diminish their impact.
2. **Match Duration to Impact** - Longer beats create more significant pauses. Use appropriately.
3. **Consider Accessibility** - Some readers may find hard beats disorienting; provide settings.
4. **Create Rhythm** - Mix different beat types to create narrative rhythm.
5. **Synchronize with Visuals** - Time beats to coincide with visual elements when possible.

## Advanced Techniques

### Sequential Beats

Create advancing tension with sequential beats of increasing intensity:

```
BEAT_300: soft 2000
BEAT_301: normal 3000
BEAT_302: hard 4000
```

### Character-Specific Beats

Use different beat types for different characters to establish personality:

- Thoughtful characters: more soft beats
- Anxious characters: more hard beats
- Conversational characters: more normal beats

### Ambient Storytelling

Use soft beats with ambient sounds to establish location and atmosphere without explicit description.

## Technical Notes

The Beat System integrates with the Moment System and can be triggered by scroll position, user interaction, or idle time, just like other moment elements.
