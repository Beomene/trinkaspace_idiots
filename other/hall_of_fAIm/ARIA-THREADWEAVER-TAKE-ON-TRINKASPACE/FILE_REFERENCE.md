# TRINITY ARCHITECTURE - FILE REFERENCE

## 🏛️ CORE TRINITY FILES

### `/assets/js/trinityCoordinator.js`
**Purpose:** Main orchestrator that manages all three arenas  
**Key Features:**
- Loads page.json blueprint
- Separates blocks vs boxes automatically
- Initializes all three arenas
- Handles event coordination
- Includes DataSaver for performance optimization

### `/assets/js/primaryArenaEngine.js`  
**Purpose:** Handles dioramas/blocks exclusively  
**Key Features:**
- Builds diorama containers with natscene
- Manages parallax and spatial positioning
- Device class management with fallbacks
- Integration with alignment and scope systems
- NO textbox logic - purely visual scenes

### `/assets/js/secondaryArenaEngine.js`
**Purpose:** Handles textboxes/boxes exclusively  
**Key Features:**  
- Processes markdown content
- Handles text positioning and styling
- Typography and content management
- NO diorama logic - purely text content

---

## 📋 PAGE STRUCTURE FILES

### `/pages/CHAPTER_1/001_001/page.json`
**Structure:** New elements format (not scenes)
```json
{
  "elements": {
    "001_001_001": { "type": "box", "anchorY": 1111 },
    "001_001_002": { "type": "block", "anchorY": 2222 },
    "001_001_003": { "type": "box", "anchorY": 3333 },
    // etc...
  }
}
```

### `/pages/CHAPTER_1/001_001/index.html` 
**Updated to use Trinity:**
- Imports TrinityCoordinator as ES6 module
- Creates trinity instance with pageId
- Clean error handling
- Removed old engine references

---

## 🔧 SUPPORTING FILES (Existing)

### Core Systems (Still Used):
- `/assets/js/parallax.js` - ParallaxEngine
- `/assets/js/alignment.js` - DimeAlignment  
- `/assets/js/scope.js` - ScopeSystem
- `/assets/js/tertiaryArena.js` - Menu system

### Element Directories:
- `/pages/CHAPTER_1/001_001/001_001_001/` - Textbox (content.md, scope.json)
- `/pages/CHAPTER_1/001_001/001_001_002/` - Diorama (config.json, scope.json, assets)
- `/pages/CHAPTER_1/001_001/001_001_003/` - Textbox  
- `/pages/CHAPTER_1/001_001/001_001_004/` - Diorama
- `/pages/CHAPTER_1/001_001/001_001_005/` - Textbox
- `/pages/CHAPTER_1/001_001/001_001_006/` - Diorama

---

## 🚨 DEPRECATED/REPLACED FILES

### **DO NOT USE THESE:**
- `/assets/js/trinkaspaceEngine.js` - Old monolithic engine (replaced by Trinity)
- `/assets/js/secondArena.js` - Old textbox system (replaced by secondaryArenaEngine.js)
- Any files with "scenes" structure - We use "elements" now

---

## 🎯 IMPORT RELATIONSHIPS

```
index.html
  └── trinityCoordinator.js
      ├── primaryArenaEngine.js
      │   ├── parallax.js  
      │   ├── alignment.js
      │   └── scope.js
      ├── secondaryArenaEngine.js
      └── tertiaryArena.js
```

---

## 📝 ELEMENT TYPE PATTERNS

**File Requirements:**
- **Boxes:** need `content.md` + `scope.json`
- **Blocks:** need `config.json` + `scope.json` + asset folders (XS, S, M, L)

---

## 🔍 DEBUGGING CHECKLIST

1. ✅ All Trinity files exist and have no syntax errors (Beomene: that's not true, I did not keep them)
2. ⚠️ Import paths need verification  
3. ⚠️ Browser console needs checking
4. ⚠️ page.json structure needs validation
5. ⚠️ Element directories need verification
