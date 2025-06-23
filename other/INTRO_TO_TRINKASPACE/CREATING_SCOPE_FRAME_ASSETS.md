# Creating Scope Frame Assets Tutorial

This guide will walk you through the process of creating effective scope frame assets for your Trinkaspace dioramas.

## What You'll Need

- Image editing software (Photoshop, GIMP, Affinity Photo, etc.)
- Knowledge of your page background color hex code (default: #242424)
- Basic understanding of transparent PNGs

## Step 1: Set Up Your Canvas

1. Determine the dimensions for your frame image:
   - For UPPER/LOWER frames: Width should match your typical diorama width (e.g., 1200px)
   - For LEFT/RIGHT frames: Height should match your typical diorama height (e.g., 800px)
   
2. Create a new document with:
   - Appropriate dimensions
   - Transparent background
   - RGB color mode

## Step 2: Create the Frame Shape

For a jagged upper frame:

1. Fill the top portion of the canvas with your page background color (#242424)
2. Create a jagged transition between the filled area and transparency:
   - Use brushes with rough edges
   - Draw irregular shapes
   - Use the eraser with textured brushes
   - Apply distortion filters or effects
   
3. Remember:
   - The opaque area (your page color) will be the "frame"
   - The transparent area will be where the diorama content shows through

## Step 3: Refine the Edge

1. Zoom in to review your edge details
2. Smooth out any overly sharp or pixelated areas
3. Consider adding subtle texture or noise to the frame edge
4. For added realism, apply a very subtle blur (0.5-1px) to soften the transition

## Step 4: Test Different Styles

Experiment with different frame styles:

1. **Torn Paper**: Create edges resembling torn paper
2. **Rock Formation**: Design edges that look like rock or cliff faces
3. **Organic**: Create vine-like or plant-inspired borders
4. **Architectural**: Design frame edges that look like window frames or doorways
5. **Weathered**: Create edges that appear cracked, eroded or worn

## Step 5: Export

1. Save your image as a PNG with transparency
2. Use appropriate compression for web
3. Name your file following this convention: `frame_[position]_[number]_[hexcolor].png` (e.g., `frame_upper_1_202029.png`)

## Step 6: Place in Appropriate Folder

Place your frame assets in the correct folder:
- Upper frames: `assets/images/primaryArena/scope/frames/scopeUPPER/`
- Lower frames: `assets/images/primaryArena/scope/frames/scopeLOWER/`
- Left frames: `assets/images/primaryArena/scope/frames/scopeLEFT/`
- Right frames: `assets/images/primaryArena/scope/frames/scopeRIGHT/`

## Example Frame Set

For a complete set, create unique frames for all four sides of a diorama:

1. Upper: `frame_upper_1_202029.png`
2. Lower: `frame_lower_1_202029.png`
3. Left: `frame_left_1_202029.png`
4. Right: `frame_right_1_202029.png`

Remember to create entirely new frames for each diorama to maintain a unique aesthetic throughout the experience.

## Tips for Great Looking Frames

1. **Maintain Balance**: Don't make frames too intrusive - they should enhance the diorama, not distract from it
2. **Consider Scale**: Test frames at different diorama sizes to ensure they look good
3. **Create Themes**: Develop frame sets that match different environments (forest, city, underwater)
4. **Mind the Corners**: Pay special attention to how corner transitions work when all four frames are visible
5. **Use Filters Sparingly**: Combined with frames, filters can create a distinctive mood

## Creating Filter Overlays

Filters are full-diorama overlays that add texture or tint effects:

1. Create a new document matching your typical diorama dimensions
2. Add subtle textures, grain, or color overlays
3. Adjust opacity to be very subtle (15-40%)
4. Save as PNG with appropriate transparency
5. Place in the `assets/images/primaryArena/scope/filters/` folder

Remember that filters are applied with a default blend mode of "multiply" and opacity of 0.4, which can be customized in the scope.json configuration.
