# Trinkaspace Narrative Timing System

This document outlines the core concepts and implementation philosophy behind the Trinkaspace narrative timing system.

## Core Concepts

### Objective vs. Subjective Time

In Trinkaspace, we distinguish between two fundamental types of time:

> **Seconds** = Objective measurement of time passing  
> **Moments** = Subjective narrative beats that can expand or contract

This distinction is essential to our storytelling approach. While seconds represent the real-world passing of time, moments represent narrative units that can be experienced differently by each reader.

### Types of Narrative Units

#### Moments

A **Moment** contains narrative events - text, animations, sound effects, or visual changes that advance the story. Moments are identified by numbers (e.g., `LTT_001`, `RTT_010`) and can be triggered by:

- Scroll position
- Reader interaction
- Completion of previous moments
- Idle time thresholds

Moments represent the "what happens" of the narrative.

#### Beats

A **Beat** is a pause or space between moments - intentional silence or stillness that gives narrative rhythm. While moments contain content, beats contain absence, which is itself meaningful.

We define three types of beats:

##### Hard Beat
- User scrolling is disabled
- Creates tension and forced focus
- May include visual effects like color draining or darkening
- Often accompanied by UTT anxiety/panic indicators
- Creates a feeling of being "trapped" in the moment
- Example use: Danger, revelation, shock

##### Normal Beat
- Standard pause in conversation or narrative
- Natural rhythm of dialogue
- Indicates thinking, hesitation, or transition
- Reader can scroll, but the narrative suggests a pause
- Example use: Conversation flow, thoughtful moments

##### Soft Beat
- Extended peaceful pause
- Often in beautiful or serene locations
- May include ambient sounds that can be looped
- Could feature subtle movement like gentle "breathing" of the viewport
- Optional "eternity mode" where the beat can be extended indefinitely
- Example use: Contemplation, rest, appreciation of beauty

## Implementation Philosophy

The timing system is designed with these principles in mind:

1. **Reader Control**: Ultimately, readers should be able to adjust the pacing to their comfort level
2. **Narrative Intent**: The author's intended rhythm should be preserved and communicated
3. **Accessibility**: Different readers have different needs for processing time
4. **Emotional Impact**: Timing is a storytelling tool that affects emotional response
5. **Visual Reinforcement**: Timing should be reinforced by visual and audio cues

## Technical Implementation

### Moment Definition

Moments are defined in script files using the format:

```
ElementType_MomentNumber: Content
```

Example:
```
LTT_001: "Hello there!"
UTT_001: (Curious) Who is this person?
RTT_002: "Greetings, Eene."
```

### Beat Definition

Beats can be defined in several ways:

1. **Explicit Beat**: `BEAT_010: type=hard duration=3000`
2. **Implicit Beat**: Created by significant gaps between moment numbers
3. **Visual Beat**: Triggered by diorama transitions or visual effects

### Reader Pace Control

The system includes a pace control in the HUD that allows readers to adjust:

1. The base duration of moments
2. The expansion or contraction of beats
3. Whether hard beats can be overridden

## Special Effects

### Diorama Integration

Beats can trigger special diorama effects:

- Gentle panning during soft beats
- Slight viewport "breathing" (subtle vertical movement)
- Color shifts during hard beats
- Ambient sound loops during soft beats

### Arena 3 Integration

Arena 3 elements (HUD) work closely with the timing system:

- UTT emotions can intensify during hard beats
- Custom animations can indicate beat types
- Beat counters or visual timers can appear during certain beats

## Future Considerations

- Machine learning to adapt pacing to individual readers
- Analytics to track which beats readers spend the most time on
- Branching narrative paths based on reader response to beats
- Advanced visualization tools to author complex beat patterns
