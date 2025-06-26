# Pure A1 Diorama Demonstration

This page showcases **Arena 1 (A1) in its purest form** - visual storytelling through a single, beautiful diorama without the complexity of A2, A3, or A4.

## What This Demonstrates

### 🎭 **Core A1 Principles**
- **400x400px Alpha Viewport**: The foundational 1:1 aspect ratio for story content
- **Royal Alpha Scaling**: CUC-based scaling from the alpha blueprint
- **Device-Responsive Assets**: Automatic selection of XS/S/M/L assets based on viewport
- **pageOrigo System**: Coordinate system for precise positioning

### 📐 **Technical Architecture**
- **Single Diorama**: `001_002_001` with layered parallax assets
- **Alpha Blueprint**: All coordinates defined at 400px baseline
- **Device Adaptation**: Scales correctly on any device while maintaining visual integrity
- **Pure Visual Focus**: No text systems, HUD elements, or orchestration - just immersive visuals

## File Structure

```
001_002/
├── index.html              # Pure A1 demonstration page
├── page_alpha.json         # Page configuration (single diorama)
├── README.md              # This documentation
└── A1/
    └── 001_002_001/       # The single diorama
        ├── config_alpha.json    # Alpha blueprint config (400x500px layers)
        ├── scope_alpha.json     # Centered 400x400px scope
        └── [XS,S,M,L]/          # Responsive asset folders
            ├── sky.png
            ├── wall.png
            ├── furniture.png
            ├── atmo1.png
            └── ...              # Layered parallax assets
```

## Alpha Viewport Concept

This page demonstrates the **Alpha Viewport** concept:
- **Story World**: 400x400px (1:1 ratio) - where narrative content lives
- **Device Reality**: Any actual device size (e.g., 568x320px)
- **CUC Scaling**: Bridges the gap between story coordinates and device reality

### Example for 568x320 Device:
- **Device Viewport**: 568x320px (actual screen)
- **A1 Width**: 400px (story content width)  
- **CUC**: 1.0 (400/400)
- **Asset Class**: XS (for smaller devices)
- **Positioning**: Story content centered in device viewport

## Visual Storytelling Focus

Without A2 (text), A3 (HUD), or A4 (orchestration), this page lets the **visual narrative speak for itself**:
- **Atmospheric Layers**: Sky, walls, furniture creating depth
- **Parallax Effects**: Subtle movement creating immersion  
- **Asset Quality**: Responsive images optimized for each device class
- **Pure Aesthetics**: The diorama as the sole storytelling medium

## The Beauty of A1

A1 represents the **visual foundation** of Trinkaspace:
- **Spatial Storytelling**: Every layer, every position tells part of the story
- **Scalable Artistry**: Beautiful at any device size through Royal Alpha
- **Atmospheric Immersion**: Creating mood and setting through pure visuals
- **Technical Elegance**: Complex responsive behavior with simple, clean implementation

---

*This is A1 in its essence - where visual storytelling meets technical precision.*
