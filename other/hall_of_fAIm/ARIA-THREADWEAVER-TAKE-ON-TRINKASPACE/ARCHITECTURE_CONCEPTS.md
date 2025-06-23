# ARCHITECTURAL CONCEPTS - TRINKASPACE SYSTEM

## 🏛️ THE THREE SACRED ARENAS

### **Primary Arena** - Visual Domain
- **Responsibility:** Dioramas, blocks, visual scenes
- **Terminology:** Uses "diorama", "block", "natscene", "layers"
- **Focus:** Spatial positioning, parallax, device optimization
- **File:** `primaryArenaEngine.js`

### **Secondary Arena** - Textual Domain  
- **Responsibility:** Textboxes, content, narrative
- **Terminology:** Uses "textbox", "box", "content", "markdown"
- **Focus:** Typography, content processing, text positioning
- **File:** `secondaryArenaEngine.js`

### **Tertiary Arena** - Interface Domain
- **Responsibility:** Menu system, UI controls
- **Terminology:** Uses "menu", "interface", "controls"
- **Focus:** User interaction, navigation
- **File:** `tertiaryArena.js` (already exists)

---

## 📋 PAGE BLUEPRINT SYSTEM

### **page.json Structure:**
```json
{
  "meta": {
    "chapter": 1,
    "page": 1, 
    "pageHeight": "10000px"
  },
  "elements": {
    "elementId": {
      "type": "block|box",
      "anchorY": 1234
    }
  }
}
```

### **Element Types:**
- **"block"** = Diorama (Primary Arena)
- **"box"** = Textbox (Secondary Arena)

### **Positioning:**
- **anchorY** = Vertical position in pixels from top
- Elements are positioned absolutely at their anchorY

---

## 🎭 DOMAIN SEPARATION BENEFITS

### **Before (Monolithic):**
- ❌ Mixed terminology caused confusion
- ❌ One engine handling everything
- ❌ "Scenes" vs "elements" conflicts  
- ❌ Code duplication from context confusion

### **After (Legacy System):**
- ✅ Clear domain boundaries  
- ✅ Focused engines with single responsibility
- ✅ Consistent terminology within each arena
- ✅ Modular, extensible architecture

---

## 🔄 DATA FLOW

1. **TrinkaspaceEngine** loads page.json
2. **Separates** elements by type (block/box)
3. **Primary Arena** gets blocks → builds dioramas
4. **Secondary Arena** gets boxes → builds textboxes  
5. **Event coordination** between arenas
6. **Tertiary Arena** provides UI controls

---

## 💾 DATA-CONSCIOUS FEATURES

### **DataSaver Class:**
- Detects connection speed
- Downgrades asset quality for slow connections
- Respects user's data saving preferences
- Provides optimal device class selection

### **Performance Optimizations:**
- Lazy loading for images
- Device class fallbacks
- Connection-aware asset selection
- Local storage for user preferences

---

## 🎯 CORE CONCEPTS

### **Elements vs Scenes:**
- **Elements** = Modern concept for page blueprint items
- **Scenes** = Deprecated concept, caused confusion
- **Rule:** Always use "elements" in page.json

### **Blocks vs Boxes:**
- **Blocks** = Visual content (dioramas)
- **Boxes** = Text content (textboxes)
- **Pattern:** Odd numbers = boxes, Even numbers = blocks

### **anchorY Positioning:**
- **Absolute positioning** from top of page
- **Consistent spacing** (1111, 2222, 3333, etc.)
- **Easy coordination** between arenas

---

## 🚀 EXTENSIBILITY

### **Adding New Arena Types:**
1. Create new engine file (e.g., `quaternaryArenaEngine.js`)
2. Add to TrinkaspaceEngine imports
3. Define new element type in page.json
4. Add separation logic in coordinator

### **Adding New Features:**
- **Primary Arena:** Add to diorama building/positioning
- **Secondary Arena:** Add to text processing/styling  
- **Core Engine:** Add to coordination/event handling

---

## 🔍 DEBUGGING PHILOSOPHY

### **Each Arena is Independent:**
- Debug Primary Arena diorama issues in isolation
- Debug Secondary Arena textbox issues separately  
- Debug engine coordination issues at the orchestration level

### **Clear Error Boundaries:**
- Each arena has its own error handling
- Engine shows unified error messages
- Browser console reveals arena-specific issues

This architecture should eliminate the persistent confusion that plagued the monolithic system!
