# Theatrical Script Format Guide for Trinkaspace

## Overview

The Theatrical Script Format is a powerful way to coordinate TextBox and TrinkaText content, creating a dynamic narrative experience with precise timing controls. This format allows you to write your content as a script, similar to a screenplay or theatrical script, with precise control over timing, character dialogue, and special effects.

## Basic Script Format

The script format uses special prefixes to denote different types of content:

```
TB: Text that appears in the TextBox
TT: Text that appears in the TrinkaText
second: A pause of approximately one second
(SOUND-BOX, target, sound description): Play a sound effect
```

### Example Script

```
TB: "Have you ever felt a pull that is just… erratic?" (pause 3 seconds)
second
second
second
TT: Ugh. Anxiety. Why is it starting up now...
second
TB: "Not the steady tug of knowing *what* to do, knowing *for sure* what's *needed*"
second
TB: "-something *quieter*. A *whisper* in the *ribs*."
second
TT: It's cold outside. Gonna be dark soon.
...
```

## Script Elements in Detail

### TextBox Content (TB:)

Lines starting with `TB:` define content that appears in the main TextBox:

```
TB: "Have you ever felt a pull that is just… erratic?"
```

You can use Markdown formatting:
- `*word*` for italic text
- `**word**` for bold text
- `_word_` for alternative italic text

### TrinkaText Content (TT:)

Lines starting with `TT:` define content that appears in the TrinkaText HUD element:

```
TT: Ugh. Anxiety. Why is it starting up now...
```

This creates a direct connection between the narrative in the TextBox and the character's thoughts or reactions in the TrinkaText.

### Timing Controls

#### Basic Timing: "second"

Use the word `second` on its own line to create a pause of approximately one second:

```
TB: "Have you ever felt a pull that is just… erratic?"
second
second
TT: Why now?
```

This will show the TextBox content, pause for two seconds, then show the TrinkaText content.

#### Custom Timing: (pause X seconds)

For longer or more specific pauses, use the pause directive:

```
TB: "Have you ever felt a pull that is just… erratic?" (pause 3 seconds)
```

This will pause for 3 seconds after displaying the TextBox content.

### Sound Effects

To trigger sound effects, use the SOUND-BOX directive:

```
(SOUND-BOX, A2, the sound of a door opening and closing)
```

Format: `(SOUND-BOX, target, sound description)`
- `target`: The arena where the sound should play (A1, A2, A3)
- `sound description`: Description of the sound to play

## Advanced Techniques

### Sequential Dialogue

You can create a back-and-forth between TextBox and TrinkaText:

```
TB: "If you felt that pull, would you go?"
second
TT: Like I'm letting someone down...
second
TB: "Some stay."
second
TB: "Most stay."
second
TT: Not gonna be able to sleep now, unless I take that walk...
```

### Scene Transitions

Use multiple sound effects and pauses to create scene transitions:

```
TB: "It's best not to look back."
(SOUND-BOX, A2, the sound of a door opening and closing)
(SOUND-BOX, A2, the sound of walking on snow)
TT: Oh god, should've worn thicker socks.
```

### Extended Pauses

For dramatic effect, use multiple pauses:

```
TB: "Some walks begin with a destination."
second
second
TB: "This one begins... with a fox."
second
TT: what the F**K IS THAT?!
```

## How It Works

When a markdown file with this script format is loaded:

1. The TextScript system parses the content into a queue of actions
2. When the content becomes visible, the script automatically plays
3. Each line is processed in sequence, with appropriate timing and effects
4. TextBox and TrinkaText content are coordinated seamlessly

## Best Practices

1. **Be Consistent with Timing**: Use a consistent approach to pacing to create a natural rhythm
2. **Allow Time for Reading**: Give readers enough time to read TextBox content before advancing
3. **Use TrinkaText for Reactions**: TrinkaText works well for character thoughts or reactions to the main narrative
4. **Group Related Content**: Keep related TB and TT content close together for proper context
5. **Test Your Timing**: What seems like enough time when writing may feel different when reading

## Testing Your Scripts

Use the textscript_test.html file in the other/tests folder to experiment with your script format and timing.

## Example Script

See 001_001_003.md for a complete example of the script format in action.

---

With this theatrical script format, you can create dynamic, precisely timed narratives that coordinate perfectly between TextBox content and TrinkaText reactions, creating an engaging and immersive reading experience.
