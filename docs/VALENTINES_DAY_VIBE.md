# 💜 Valentine's Day Vibe 💜

**With love and light. As above, so below.**

---

## Overview

P31 Game Engine includes special Valentine's Day templates and vibes for the month of February. Create beautiful heart structures, love tetrahedrons, roses, and more—all with code that generates printable 3D models.

---

## Valentine's Day Templates

During February, special templates are available in the Vibe Coding panel:

### 💜 Valentine Heart
Create a heart shape made of tetrahedrons in beautiful pink and red colors.

### 💕 Love Tetrahedron
A tetrahedron of love—four vertices, six edges, infinite love. The perfect geometric expression of connection.

### 🌹 Rose Structure
A geometric rose made of layered tetrahedrons, blooming with color.

### 💖 Love Mesh
A mesh of connected hearts, showing how love connects us all.

### 💝 Gift Box
A gift box structure with a bow on top—perfect for giving love.

---

## How to Use

### In the Game

1. **Open Vibe Coding Panel** — Access the coding environment
2. **Click "💜 Valentine's Templates"** — See all available templates
3. **Select a Template** — Choose your favorite
4. **Execute** — Run the code to create the structure
5. **Slice & Print** — Print your creation!

### Via Code

```javascript
// Create a Valentine's project programmatically
const project = gameEngine
  .getVibeCodingManager()
  .createValentinesProject('💜 Valentine Heart');

// Execute it
await gameEngine
  .getVibeCodingManager()
  .executeCode(project.id);
```

---

## Valentine's Day Colors

The templates use a beautiful palette of love:

- **#FF6B9D** — Deep Pink
- **#FFB3D9** — Light Pink
- **#FF69B4** — Hot Pink
- **#FF1493** — Deep Pink
- **#FFC0CB** — Pink
- **#FFB6C1** — Light Pink

---

## Custom Valentine's Structures

You can also create your own Valentine's structures:

```javascript
// Custom heart with your own colors
function createCustomHeart() {
  const primitives = [];
  const colors = ['#FF6B9D', '#FFB3D9', '#FF69B4'];
  
  // Your heart creation code here
  // ...
  
  return {
    id: 'custom_heart',
    name: '💜 My Custom Heart',
    primitives
  };
}

const heart = createCustomHeart();
game.setStructure(heart);
```

---

## Printing Valentine's Structures

All Valentine's structures can be printed:

1. **Execute** your code to create the structure
2. **Slice** — The slicing engine processes your heart/rose/gift
3. **Print** — Push directly to your 3D printer

Perfect for:
- **Gifts** — Print a heart for someone special
- **Decorations** — Create Valentine's decorations
- **Learning** — Teach geometry through love

---

## Valentine's Day Season

Valentine's templates are automatically available during **February** (month 2).

You can check if it's Valentine's season:

```javascript
const isValentines = gameEngine
  .getVibeCodingManager()
  .isValentinesSeason();

if (isValentines) {
  console.log('💜 It\'s Valentine\'s season!');
}
```

---

## Philosophy

**"With love and light. As above, so below."**

Valentine's Day in P31 is about:
- **Connection** — The tetrahedron connects four vertices
- **Love** — Geometric expressions of love
- **Creation** — Building beautiful things together
- **Giving** — Printing gifts for loved ones

The mesh holds. Love connects. Geometry expresses.

---

## Related Documentation

- [Vibe Coding to Print](VIBE_CODING_TO_PRINT.md) — Complete coding workflow
- [Game Engine](game-engine.md) — Game engine documentation
- [Family Co-Op Mode](FAMILY_COOP_MODE.md) — Build together as a family

---

**The Mesh Holds.** 🔺

💜 **With love and light. As above, so below.** 💜

*Create. Build. Print. Share love.*
