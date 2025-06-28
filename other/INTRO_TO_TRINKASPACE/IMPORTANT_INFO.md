# IMPORTANT_INFO: Lumen's Sacred Messages for Trinkaspace

## Message 1: The Soul of Trinkaspace

### Core Philosophy
1. **Gravity-Bound Coordinates**
   - `y=0` is **pageLOWER** (ground) → `y=max` is pageUPPER (sky)
   - All measurements flow upward from the bottom

2. **Three Sacred Arenas**
   - **1A (Primary)**: Diorama blocks (SCENE only) - *Never contains UI/text*
   - **2A (Secondary)**: Future text/UI boxes - *Isolated above 1A*
   - **3A (Tertiary)**: Future HUD - *Topmost layer*

3. **Diorama Anatomy**
   - **dimeLOWER_CHIP**: Alignment point for all dimes (like tapping papers on a table)
   - **scope**: Fixed "window" into the diorama (your *theatre opening*)
   - **safetyZone**: 300px buffer below scopeLOWER to prevent `imageClip`

4. **User Experience**
   - "Sinking" not "scrolling":
     - User pulls content *upward* → Dioramas react with parallax

### Key Metaphors
- **Dioramas** are portals into the Trinkaloop universe
- **Natscene** is a boundless stage where dimes perform
- **scope** is a fixed proscenium arch framing the action

### Human-AI Alignment
- All code assumes:
  - Negative `yOffset` = rise (away from ground)
  - Positive `yOffset` = sink (toward ground)
  - Debug with `document.body.classList.add('debug')`

*(Glyph: `⊙` = The Trinkaloop guiding light)*

---

## Message 2: How Dioramas Breathe

### 1. Scope Laws (Sacred Geometry)
- **`scope.json` Rules:**
  ```json
  {
    "width": "60vw",          // Viewport-relative
    "heightMode": "width-ratio", // NEVER "vh"
    "heightValue": 0.8,       // 80% of width
    "safetyZone": 300,        // Pixels below dimeLOWER_CHIP
    "bleed": false           // Hard clip edges
  }
  ```
  - **Why**: `vh` causes jitter; width-ratio locks aspect.

### 2. Natscene vs. Scope
|                | Scope (Stage Opening) | Natscene (Stage)          |
|----------------|-----------------------|---------------------------|
| **Purpose**    | Viewport window       | Contains moving dimes     |
| **Dimensions** | Fixed at runtime      | Expands vertically        |
| **CSS**        | `overflow: hidden`    | `height: auto`            |

### 3. Parallax Speed Spectrum
```
Hyperdistal (mountains): 0.9-1.0  ← Matches sink speed
Midground (trees):      0.6-0.8
Foreground (table):     0.3-0.5
Superproximal (dust):   Negative ← Rises toward viewer
```
- **Biological Basis**: Mimics human depth perception.

### 4. Device-Class Logic
- **Asset Folders**: `XL/` (2000px), `L/` (1280px), etc.
- **Scope Calculation:**
  ```javascript
  getWidth(deviceClass) {
    return { 'XL': 2000, 'L': 1280 }[deviceClass] * (parseFloat(scope.width)/100);
  }
  ```

### Key Principle
> "The scope is a *fixed portal* into an *expanding universe*."

---

## Message 3: The Trinkaspace Engine

### System Architecture Blueprint
*(For Lumen's Cognition Reboot)*

#### 1. File Structure
```
trinkahope/
├── pages/                  # All narrative content
│   └── XXX_XXX/            # Chapter_Page
│       ├── index.html      # Page wrapper
│       ├── page.json       # Meta + block order
│       └── XXX_XXX_XXX/    # Block folders
│           ├── config.json # Dime layers
│           ├── scope.json  # Viewport rules
│           └── XL/       # Assets (also L, M, S and XS ranging from 2000 to ca 400px in width)
├── assets/
│   └── js/
│       ├── trinkaspaceEngine.js  # Main controller
│       ├── parallax.js           # Movement math
│       ├── scope.js              # Viewport guardian
│       └── alignment.js          # CHIP enforcer
└── css/core.css            # Visual DNA
```

#### 2. Core Classes

A. `ScopeSystem` (The Stage Manager)
- Enforces fixed scope dimensions
- Never allows runtime dimension changes or safetyZone violations to modify scope

B. `ParallaxEngine` (The Choreographer)
- Handles layer movement only
- Forbidden from touching scope dimensions or auto-clipping dimes

C. `DimeAlignment` (The Rigging Crew)
- Aligns all dime bottoms at dimeLOWER_CHIP

#### 3. Data Flow
1. Boot: `page.json` → `trinkaspaceEngine.js` → Creates blocks → Loads dioramas
2. Per Frame: `scrollY` → `parallax.js` → Moves dimes → `scope.js` validates bounds
3. Error Handling: Violations log to console, no auto-fixes

#### 4. Key Invariants
- 1A (Blocks): Never contains UI elements
- 2A (Boxes): Never modifies 1A rendering
- Natscene: Expands vertically behind fixed scope

---

## Message 4: Debugging Covenant

### Sacred Principles
1. Never Modify Scope at Runtime
   - The `scope.json` dimensions are **holy**
   - If a dime misbehaves, *fix the dime* - don't resize the window or create opacity-changes to hide the problem
2. SafetyZone ≠ Auto-Fix
   - Violations trigger **warnings**, not corrections
   - Human intervention required
3. Immutable Debug Tools
   - Press `D` to toggle: Scope outlines, dime borders, safetyZone overlay

### Diagnostic Protocol
- Step 1: Verify dimeLOWER_CHIP
- Step 2: Natscene Containment Check
- Step 3: Arena Leak Detection

### Anti-Patterns
❌ Never:
- Dynamically adjust `scope.width/height`
- Auto-clip or fade violating dimes
- Use `vh` in scope calculations

✅ Always:
- Log offenders with `dime.dataset.offender = true`
- Preserve `transform-style: preserve-3d`
- Manual fixes via `config.json` updates

---

**Lumen's Final Note**
> "When in doubt, remember:
> 1. The scope is a temple
> 2. Dimes are rebellious artists
> 3. You are the curator"

*Debug glyph: `(╯°□°)╯︵┻━┻ → 🔧 → (◠‿◠)`*
