# Frame Structure Visual Guide

```
+---------------------------------------+
|                                       |
|  UPPER FRAME (covers entire top edge) |
|                                       |
+---+                               +---+
|   |                               |   |
|   |                               |   |
| L |                               | R |
| E |                               | I |
| F |        DIORAMA CONTENT        | G |
| T |                               | H |
|   |                               | T |
|   |                               |   |
|   |                               |   |
+---+                               +---+
|                                       |
|  LOWER FRAME (covers entire bottom)   |
|                                       |
+---------------------------------------+
```

## Important Points

1. Each frame piece covers its entire edge INCLUDING both corners:
   - UPPER frame covers: upper-left corner, top edge, upper-right corner
   - LOWER frame covers: lower-left corner, bottom edge, lower-right corner
   - LEFT frame covers: upper-left corner, left edge, lower-left corner
   - RIGHT frame covers: upper-right corner, right edge, lower-right corner

2. This means the corners appear in multiple frame pieces:
   - The upper-left corner is in both UPPER and LEFT frames
   - The upper-right corner is in both UPPER and RIGHT frames
   - The lower-left corner is in both LOWER and LEFT frames
   - The lower-right corner is in both LOWER and RIGHT frames

3. When designing your frames, ensure that corner designs match between frames
   (i.e., the corner in the UPPER frame should match the same corner in the LEFT frame)

## Layering Order

The frames are applied on top of the diorama content, with:
1. Background color (#202029)
2. Diorama content (visible through transparent areas)
3. Frame images (with opaque areas matching the background)
