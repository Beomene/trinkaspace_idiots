# The Dioramas

## Introduction to Trinkaspace Dioramas

In traditional media, a diorama is a three-dimensional model representing a scene, often with painted figures and landscapes. In Trinkaspace, the concept of dioramas has been reimagined as layered, interactive digital environments that form the visual foundation of the experience. These are not merely backgrounds but complex, responsive compositions that create depth, atmosphere, and narrative context.

## Anatomy of a Trinkaspace Diorama

### Layer Structure

Each diorama is composed of multiple visual layers arranged in a depth hierarchy:

1. **Background Layers**: Distant elements like skies, horizons, or abstract color fields
2. **Middle Layers**: Environmental elements, structures, and contextual objects
3. **Foreground Layers**: Detailed elements closest to the viewer
4. **Atmospheric Layers**: Overlays like fog, light effects, or particles that affect multiple depth levels
5. **Interactive Layers**: Elements that respond to user interaction or narrative progression

### Size Variations

Dioramas in Trinkaspace often come in multiple size variants to accommodate different viewport dimensions:

- **XS**: Extra small for mobile portrait orientation
- **S**: Small for mobile landscape and small tablets
- **M**: Medium for standard tablets and small desktops
- **L**: Large for desktop displays (including high-resolution displays)

These variations ensure that the visual experience maintains its intended composition regardless of the user's device.

## Technical Implementation

### Directory Structure

Dioramas are typically organized in the following structure within a page directory:

```
001_001_002/
  ├── config.json        # Configuration for the diorama
  ├── scope.json         # Positioning and interaction parameters
  ├── XS/                # Extra small assets
  │   ├── bg.png
  │   ├── mid.png
  │   └── ...
  ├── S/                 # Small assets
  │   └── ...
  ├── M/                 # Medium assets
  │   └── ...
  ├── L/                 # Large assets
  │   ├── atmo1.png
  │   ├── atmo2.png
  │   ├── fog.png  │   ├── foreground.png
  │   ├── furniture.png
  │   ├── light_basic.png
  │   └── ...
```

### Asset Loading and Selection

The appropriate size variant is selected based on viewport dimensions and device capabilities. This is handled by:

```javascript
function loadDioramaAssets(dioramaId, size) {
  // Determine appropriate size variant (XS, S, M, L)
  const sizeVariant = determineSizeVariant(size);
  
  // Load assets from the corresponding directory
  return loadAssetsFromDirectory(`${dioramaId}/${sizeVariant}`);
}
```

### Layer Composition

Layers are composited in the browser using CSS positioning and z-index values:

```css
.diorama-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  transition: transform 0.5s ease-out;
}

.diorama-layer-bg {
  z-index: 1;
}

.diorama-layer-mid {
  z-index: 2;
}

.diorama-layer-fg {
  z-index: 3;
}

.diorama-layer-atmo {
  z-index: 4;
  mix-blend-mode: screen; /* For light effects */
}
```

## Creative Aspects of Diorama Design

### Visual Storytelling

Dioramas in Trinkaspace are not merely decorative but serve specific narrative purposes:

- **Environment Establishment**: Defining the physical or conceptual space where narrative occurs
- **Mood Setting**: Creating atmospheric conditions that support emotional tones
- **Subtle Storytelling**: Including visual elements that hint at broader contexts or histories
- **Character Contextualization**: Providing settings that inform character personalities and relationships

### Artistic Approaches

Several distinct artistic approaches are used in creating dioramas:

1. **Photographic Composites**: Layered photographic elements creating realistic environments
2. **Hand-Drawn Illustrations**: Stylized illustrated scenes with distinctive artistic signatures
3. **Abstract Compositions**: Non-representational visual fields that convey emotion or concept
4. **Mixed Media**: Combinations of techniques that create unique visual languages

### Dynamic Elements

Many dioramas include elements that change over time:

- **Ambient Animations**: Subtle movements like shifting clouds, flickering lights, or floating particles
- **Narrative Progressions**: Visual changes that track with story developments
- **Responsive Elements**: Features that react to user interaction or text progression
- **Time-of-Day Effects**: Lighting changes that suggest the passage of time

## Diorama Interaction with Other Systems

### Parallax Integration

Dioramas typically integrate with the parallax system to create depth effects:

- Different layers move at different rates relative to scrolling or cursor movement
- Atmospheric elements may have special parallax behaviors for enhanced realism
- Focal points can be emphasized through strategic parallax design

### Text Box Positioning

The Secondary Arena's text system works closely with dioramas:

- Text boxes are positioned in relation to diorama elements
- Some diorama elements may be designed specifically to frame or highlight text
- Text timing may be synchronized with visual changes in the diorama

### Interaction Points

Dioramas often include interactive elements that connect to other systems:

- Clickable objects that trigger text or narrative progressions
- Hover-responsive areas that reveal additional information
- Elements that change in response to user choices or narrative paths

## Creating New Dioramas

### Planning Process

1. **Narrative Mapping**: Define the story purpose of the diorama
2. **Layer Sketching**: Plan the depth layers and their relationships
3. **Asset Listing**: Identify all visual elements needed across size variants
4. **Interaction Planning**: Define any interactive or dynamic elements

### Technical Preparation

1. **Directory Setup**: Create the appropriate directory structure with size variant folders
2. **Configuration**: Create the config.json and scope.json files
3. **Asset Creation**: Prepare visuals for all required layers and size variants
4. **Integration Code**: Write any custom code needed for special effects or interactions

### Quality Considerations

When creating dioramas, consider:

- **Performance Impact**: Balance visual richness with loading and rendering performance
- **Responsive Behavior**: Ensure the composition works across different viewport sizes
- **Accessibility**: Consider how the visual information translates to non-visual contexts
- **Narrative Clarity**: Ensure visual elements support rather than distract from the story

## Advanced Diorama Techniques

### Environmental Storytelling

Using visual elements to convey narrative without text:
- **Object Placement**: Positioning items to suggest relationships or histories
- **Wear and Weathering**: Showing the passage of time through visual degradation
- **Juxtaposition**: Creating meaning through the relationship between elements

### Psychological Spaces

Creating environments that represent mental or emotional states:
- **Symbolic Architecture**: Using structural elements as metaphors for psychological constructs
- **Color Psychology**: Employing color schemes that evoke specific emotional responses
- **Spatial Distortion**: Manipulating perspective and scale to represent subjective experience

### Mixed Reality Approaches

Blending different layers of reality within a single diorama:
- **Memory Overlays**: Visual elements that represent remembered or imagined content
- **Reality Fragments**: Combining elements from different ontological categories
- **Dimensional Bleeding**: Visual suggestions of one reality intruding into another

---

*"The diorama is not merely a background but a silent narrator, telling its part of the story through light, space, and subtle detail."*
