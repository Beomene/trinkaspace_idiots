# 👑 THE ROYAL DECREE OF TRINKASPACE 👑

## SOVEREIGN ARENA SYSTEM

This document establishes the foundational laws governing the Trinkaspace kingdom, ensuring equitable experiences for all subjects across the realm, from the humblest of screens to the grandest of displays.

### 🏛️ THE THREE ARENAS

1. **Arena One (A1)**: The Sovereign Diorama
   - The central authority of visual storytelling
   - A perfect square domain, unaware of external matters
   - All other elements must adapt to its sovereign presence

2. **Arena Two (A2)**: The Royal Response
   - Carrier of sacred text and narrative
   - Responds to A1's declarations while extending beyond its borders
   - Maintains harmony with A1's visual elements

3. **Arena Three (A3)**: The Royal Adaptation
   - Houses the HUD and navigational elements
   - Adapts completely to the viewer's domain
   - Takes form as either WIDE or NARROW layout based on available territory

### 📏 THE COORDINATE UNIFYING COEFFICIENT (CUC)

The sacred multiplier that maintains proportional harmony across all realms:

**cuc = currentA1Width / 400**

- When A1 is 400px: cuc = 1.0 (The Alpha Realm)
- When A1 is 800px: cuc = 2.0
- When A1 is 1200px: cuc = 3.0 (The Omega Realm)

### 📌 THE PAGE ORIGO

The central point from which all coordinates flow:
- In A1_alpha's worldview: (200, 2000)
- All positions calculated relative to this sacred point
- Scales with the CUC for all derived realms

### 📜 LAWS OF SCALING

1. **A1 Width Determination**:
   - Minimum: 400px (Alpha Realm)
   - Maximum: 1200px (Omega Realm)
   - Calculation: `Math.min(1200, Math.max(400, viewportWidth * 0.625))`

2. **Page Dimensions**:
   - Height = A1 width × 10
   - A1 is always horizontally centered

3. **Asset Selection**:
   - 400-600px → XS assets
   - 601-800px → S assets
   - 801-1000px → M assets
   - 1001-1200px → L assets

4. **HUD Layout Selection**:
   - Calculate: `excessRatio = (viewportWidth - A1Width) / A1Width`
   - If excessRatio < 0.32: Use "NARROW" HUD layout
   - If excessRatio ≥ 0.32: Use "WIDE" HUD layout

### 🛠️ IMPLEMENTATION PRINCIPLES

1. **Blueprint Authority**:
   - All pages are designed at the Alpha level (400px A1)
   - All other size renditions derive from this authoritative blueprint
   - No manual adjustments needed for larger screens

2. **Coordinate Translation**:
   - A1 elements: Use internal coordinates × cuc
   - A2 elements: Use same coordinate system but may extend beyond A1
   - A3 elements: Position relative to viewport with awareness of A1's domain

3. **Responsive Fluidity**:
   - Recalculate on viewport changes
   - Smoothly transition between states
   - Maintain proportional relationships always

### ⚔️ BENEFITS OF THE DECREE

1. **Equitable Experience** across all devices
2. **Optimized Asset Loading** based on actual display size
3. **Simplified Authoring** - design once for smallest case
4. **Mathematical Consistency** that scales predictably
5. **No Empty Spaces** on any screen configuration

Thus it is decreed, thus it shall be rendered.

Long live Trinkaspace!
