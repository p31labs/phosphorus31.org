# Node-1 PCB - 3D Visualization Renders

## Render 1: Isometric Top View (Main Component Side)

```
                              ┌─────────────┐
                             ╱             ╱│
                            ╱    NODE-1   ╱ │
                           ╱   51×51mm   ╱  │
                          ╱             ╱   │ 1.6mm
                         ╱─────────────╱    │ thick
                        │ ⊕           ⊕│    │
                        │              │    │
                        │  ┌────────┐  │    │
                        │  │ESP32-S3│  │ ┏━━┓─── Rotary Encoder
                        │  │ Module │  │ ┃██┃    (with metal shaft
                        │  │        │  │ ┗━━┛     sticking up)
                        │  └────────┘  │    │
                        │              │    │
    LoRa Module ───────▶│  ┌────────┐ │ ┏━┓│◀─── SEND Switch
    (with antenna)      │  │ LoRa   │ │ ┃█┃│    (Kailh Choc
                        │  │E22-900M│ │ ┗━┛│     with keycap)
                        │  └────────┘ │    │
                        │              │ ┏━┓│◀─── CANCEL Switch
                        │  [ICs]       │ ┃█┃│
                        │              │ ┗━┛│
                        │ ╔════════╗   │    │
    USB-C ─────────────▶│ ║USB-C  ║   │    │
    (on edge)           │ ╚════════╝   │    │
                        │              │    │
    LEDs (underglow)───▶│ ████████████ │    │
    (side-emitting)     │ ║LED strip ║ │   ╱
                        │ ████████████ │  ╱
                        │ ⊕           ⊕│ ╱
                        └──────────────┘╱
                         Matte Black PCB
                         with Gold pads

Key Features Visible:
• Matte black solder mask (non-reflective surface)
• Gold ENIG pads catching light
• Raised mechanical switches with keycaps
• Rotary encoder knob pointing up
• USB-C connector flush with edge
• White silkscreen with geometric patterns
```

## Render 2: Bottom View (Ground Plane & Touch Zones)

```
                         ┌──────────────┐
                        ╱              ╱
                       ╱   NODE-1     ╱
                      ╱   BOTTOM     ╱
                     ╱     VIEW     ╱
                    ╱──────────────╱
                   │ ⊕           ⊕│
                   │              │
                   │   ╔════════╗ │  ┌─────────────┐
                   │   ║ NODE-1 ║ │  │ TOUCH ZONE 2│◀── Circular
                   │   ║  v1.0  ║ │  │  (Smooth    │    exposed
                   │   ╚════════╝ │  │   Gold)     │    gold
                   │              │  └─────────────┘    finish
                   │  ◇ ◇ ◇       │
                   │  ◇ ◇ ◇  Hex  │
                   │  ◇ ◇ ◇  Art  │
                   │              │
                   │ ════════     │  ┌──────────────────┐
                   │ ════════     │  │                  │
                   │ Circuit ═══  │  │  TOUCH ZONE 1    │◀── Large
                   │  Traces      │  │  (Textured Gold) │    rectangular
                   │              │  │  ║║║║║║║║║║║    │    worry stone
                   │              │  │                  │    zone
                   │              │  └──────────────────┘
                   │ ⊕           ⊕│
                   └──────────────┘
                    
                    Matte Black + Exposed Gold Zones
                    (for tactile sensory feedback)

Touch Zone Details:
• Zone 1: 15mm × 15mm rectangle with vertical line texture
• Zone 2: Ø10mm circle, smooth finish
• Both zones: Bare ENIG gold (no solder mask)
• Purpose: Sensory stimulation, "worry stone" effect
```

## Render 3: Side Profile View (Layer Stack Detail)

```
                    ┌─────────────────────────────────┐ ◄── White Silkscreen
                    ├─────────────────────────────────┤ ◄── Matte Black Solder Mask
        Mechanical  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ◄── Top Copper (35μm)
         Switch     ║█████║                          │
         (raised    ║█████║                          │
          8mm)      ║█████║    Components            │
           ▼        ║█████║    on surface            │    FR-4 Core
         ┏━━━┓      ║█████║                          │    (1.6mm)
         ┃███┃      ║█████║    ┌──────┐  ┌────┐    │
         ┃███┃──────┻─────┻────┤ESP32 │  │LoRa│    │
         ┗━━━┛                  └──────┘  └────┘    │
    ────────────────────────────────────────────────┤ ◄── Bottom Copper (35μm)
    Ground Plane with exposed touch zones           ├─────────────────────────────────┤ ◄── Matte Black Solder Mask
                                                     └─────────────────────────────────┘ ◄── White Silkscreen

                                  ENIG Finish Detail:
                                  ┌────────────┐
                                  │ Gold       │ ← 0.05μm (flash gold)
                                  ├────────────┤
                                  │ Nickel     │ ← 3-5μm (barrier layer)
                                  ├────────────┤
                                  │ Copper     │ ← 35μm (base metal)
                                  └────────────┘
```

## Render 4: Exploded View (Component Assembly Order)

```
    Layer 6: Accessories (last)
    ┌─────────┐  ┌─────────┐
    │ Keycap  │  │  Knob   │
    │  (3mm)  │  │  (8mm)  │
    └────┬────┘  └────┬────┘
         │            │
         ▼            ▼
    
    Layer 5: Through-hole components
    ┏━━━━━━━┓  ┏━━━━━━━━┓   ┌─────┐   ┌─────┐
    ┃Switch ┃  ┃ Encoder┃   │OLED │   │ JST │
    ┃Choc   ┃  ┃  EC11  ┃   │Hdr  │   │Batt │
    ┗━━━━━━━┛  ┗━━━━━━━━┛   └─────┘   └─────┘
         │         │           │         │
         └─────────┴───────────┴─────────┘
                   │
                   ▼
    
    Layer 4: SMD Components (ICs & Modules)
    ┌─────────────┐  ┌──────────┐  ┌───────┐
    │  ESP32-S3   │  │   LoRa   │  │ DRV   │
    │   Module    │  │ E22-900M │  │2605L  │
    └─────────────┘  └──────────┘  └───────┘
                   │
                   ▼
    
    Layer 3: SMD Components (LEDs & Diodes)
    ████  ████  ████  ████  ████     [D6]
    LED1  LED2  LED3  LED4  LED5   Schottky
                   │
                   ▼
    
    Layer 2: SMD Components (Passives)
    ╔═══╗ ╔═══╗ ╔═══╗ ╔═══╗ ╔═══╗
    ║ R ║ ║ R ║ ║ C ║ ║ C ║ ║ C ║  (0805 size)
    ╚═══╝ ╚═══╝ ╚═══╝ ╚═══╝ ╚═══╝
                   │
                   ▼
    
    Layer 1: Bare PCB
    ╔═══════════════════════════════════╗
    ║  Matte Black PCB with Gold Pads   ║
    ║  51mm × 51mm × 1.6mm              ║
    ║  Top: Components                   ║
    ║  Bottom: Ground + Touch Zones     ║
    ╚═══════════════════════════════════╝

Assembly Sequence:
1. Start with bare PCB
2. Reflow solder all SMD components (or use assembly service)
3. Hand-solder through-hole components
4. Plug in switches and encoder
5. Add keycaps and knob
6. Connect battery and display
```

## Render 5: Detailed Component Closeup (Top Corner)

```
                    Rotary Encoder Detail
                    ┌────────────────┐
                    │   ╔═══════╗    │
                    │   ║ Knob  ║    │ ← Aluminum knob
                    │   ║(metal)║    │   (user-supplied)
                    │   ╚═══╤═══╝    │
                    │       │        │
                    │   ┌───┴────┐   │
                    │   │ Shaft  │   │ ← 6mm D-shaft
                    │   └───┬────┘   │
                    │  ┏━━━━┷━━━━┓   │
                    │  ┃ Encoder ┃   │ ← EC11 encoder body
                    │  ┃  Body   ┃   │   (vertical mount)
                    │  ┗━━━━━━━━━┛   │
                    │   │││││        │ ← 5 pins soldered
                    └───┴┴┴┴┴────────┘   to PCB

    ┌──────────────────────────────────────┐
    │ Geometric Silkscreen Art             │
    │   ◇─────◇        NODE-1              │
    │   │     │         v1.0                │
    │   ◇─────◇                             │
    │                                       │
    │  ┌───────────────┐  ┏━━━━━━━━━┓     │
    │  │   ESP32-S3    │  ┃ ROTARY  ┃     │
    │  │   16MB Flash  │  ┃ ENCODER ┃     │
    │  │   WiFi + BLE  │  ┗━━━━━━━━━┛     │
    │  └───────────────┘                    │
    │                    ┏━━━━━━━━━┓       │
    │  [IC] [IC] [IC]    ┃ [SEND]  ┃       │ ← Choc switch
    │                    ┃  MechSW ┃       │   with keycap
    │  Circuit Traces    ┗━━━━━━━━━┛       │
    │  ═══════════                          │
    │  ═══════════       ┏━━━━━━━━━┓       │
    │  ═══════════       ┃[CANCEL] ┃       │
    │                    ┃  MechSW ┃       │
    │  Gold ENIG Pads    ┗━━━━━━━━━┛       │
    │  ●  ●  ●  ●                           │
    └───────────────────────────────────────┘
     ▲
     └─ Visible gold finish on pads
```

## Render 6: Lighting Effects Preview (LEDs Active)

```
    Top View with Underglow Effect:
    
    ╔═══════════════════════════════════════╗
    ║                                       ║
    ║    ┌──────────┐      ┏━━━━━┓        ║
    ║    │ ESP32-S3 │      ┃ ⚙️  ┃        ║
    ║    │          │      ┗━━━━━┛        ║
    ║    └──────────┘                      ║
    ║                       ┏━━━━━┓        ║
    ║    ┌──────────┐       ┃ ✓   ┃        ║
    ║    │   LoRa   │       ┗━━━━━┛        ║
    ║    └──────────┘                      ║
    ║                       ┏━━━━━┓        ║
    ║    [IC] [IC]          ┃ ✗   ┃        ║
    ║                       ┗━━━━━┛        ║
    ║    ╔════════╗                         ║
    ║    ║ USB-C  ║                         ║
    ║    ╚════════╝                         ║
    ║                                       ║
    ║    🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦              ║
    ║    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓              ║ ← LED underglow
    ║    💡💡💡💡💡                         ║   (cyan pulse)
    ║    LED  LED  LED  LED  LED            ║
    ╚═══════════════════════════════════════╝
         ⬇️   ⬇️   ⬇️   ⬇️   ⬇️
     Side-emitting LEDs cast light downward/outward

    LED States:
    💙💙💙💙💙 = Idle (soft cyan breathing)
    💚💚💚💚💚 = Transmitting (green chase)
    💛💛💛💛💛 = Low Battery (yellow pulse)
    ❤️❤️❤️❤️❤️ = Error (red flash)
    💙💜💚💛🧡 = Rainbow (demo mode)

    The underglow effect:
    • Reflects off desk surface
    • Creates ambient lighting
    • Visible status at a glance
    • Customizable patterns via code
```

## Render 7: In-Hand Size Comparison

```
    Human Hand for Scale:
    
              ╭─────────╮
             ╱  Finger  ╲
            │            │
            │  ┌──────┐ │  ← 51mm × 51mm board
            │  │NODE-1│ │     fits in palm
            │  │      │ │
            │  │┏━┓┏━┓│ │  ← Thumb can reach
            │  │┃ ┃┃ ┃│ │     both switches
            │  │┗━┛┗━┛│ │
            │  │ ⚙️    │ │  ← Index finger
            │  └──────┘ │     on encoder
            │            │
             ╲   Palm   ╱
              ╰─────────╯
    
    Dimensions:
    • 51mm × 51mm = 2" × 2"
    • Slightly smaller than a credit card
    • Fits in shirt pocket
    • One-handed operation possible
    • Weight: ~40g with battery
```

## Render 8: Material & Finish Details

```
    Surface Material Comparison:

    Matte Black Solder Mask:
    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ← Non-reflective
    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     Velvety texture
    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     Deep black color
    
    ENIG Gold Finish:
    ⚬⚬⚬⚬⚬⚬⚬⚬⚬⚬⚬⚬⚬⚬
    ⚬⚬⚬⚬⚬⚬⚬⚬⚬⚬⚬⚬⚬⚬  ← Shiny, reflective
    ⚬⚬⚬⚬⚬⚬⚬⚬⚬⚬⚬⚬⚬⚬     Smooth, cold touch
    ⚬⚬⚬⚬⚬⚬⚬⚬⚬⚬⚬⚬⚬⚬     Warm gold color

    White Silkscreen:
    ────────────────
    ══════ NODE-1 ══
    ────────────────  ← Crisp white ink
    ◇───◇───◇───◇───     High contrast
                          Geometric patterns

    Combined Effect:
    ┌─────────────────────────┐
    │ ══ NODE-1 ══           │ ← White text
    │ ▓▓▓▓▓▓▓▓▓▓▓            │ ← Matte black
    │ ▓▓⚬⚬⚬▓▓⚬⚬⚬▓▓         │ ← Gold pads
    │ ▓▓⚬⚬⚬▓▓⚬⚬⚬▓▓         │
    │ ▓▓▓▓▓▓▓▓▓▓▓            │
    └─────────────────────────┘
    
    Premium "Cyberdeck" Aesthetic
    • Industrial yet refined
    • Visible technology as art
    • Professional maker quality
```

## Render 9: Real-World Use Case Scenario

```
    Mounted in Clear Acrylic Case (Optional):

         Top View Through Clear Lid:
    ┌────────────────────────────────────┐
    │  ╭─ Clear Acrylic ─╮              │
    │  │ ┌──────────────┐ │              │
    │  │ │              │ │              │
    │  │ │   NODE-1     │ │  ← Board visible
    │  │ │              │ │     through case
    │  │ │  ┏━┓  ┏━┓    │ │              │
    │  │ │  ┃ ┃  ┃ ┃ ⚙️ │ │  ← Controls
    │  │ │  ┗━┛  ┗━┛    │ │     accessible
    │  │ │              │ │              │
    │  │ │💙💙💙💙💙    │ │  ← Underglow
    │  │ └──────────────┘ │     visible
    │  ╰───────────────────╯              │
    └────────────────────────────────────┘
    
    Side view showing LED glow:
    ┌─────────────────┐
    │ ╭─────────────╮ │
    │ │  Components │ │
    │ ╰─────────────╯ │
    │                 │
    │ ╭─────────────╮ │
    │ ██████████████  │ ← LEDs shine
    │ 💙💙💙💙💙       │   downward
    └─────────────────┘
       ⬇️ ⬇️ ⬇️ ⬇️ ⬇️
    ═══════════════════  ← Reflects off desk
    Desk surface glows

    Or display open (no case) on desk:
    
    Desk View:
    ┌─────────────────────────────────┐
    │  ☕ Coffee                      │
    │                                  │
    │     📱 Phone    [NODE-1]  ✏️   │
    │                 ┏━┓┏━┓ ⚙️       │
    │     💻 Laptop   ┗━┛┗━┛         │
    │                 💙💙💙          │
    │                                  │
    │  📓 Notebook         🖱️ Mouse   │
    └─────────────────────────────────┘
    
    NODE-1 as a desk accessory:
    • LoRa messenger for off-grid comms
    • Macro pad for computer shortcuts
    • Fidget device during meetings
    • Beautiful tech art conversation piece
```

## Summary: What You'll Get

When you build Node-1, you'll have:

1. **A stunning 51mm × 51mm PCB** with matte black and gold finish
2. **Tactile controls**: 2 clicky switches + rotary encoder
3. **Visual feedback**: 5 RGB LEDs with customizable underglow
4. **Haptic feedback**: Vibration motor for physical confirmation
5. **Wireless connectivity**: WiFi, Bluetooth, and LoRa radio
6. **Touch zones**: Exposed gold copper for sensory stimulation
7. **Professional aesthetic**: Looks like a high-end maker product

The board is designed to be displayed openly, not hidden in a case. It's both functional hardware and a work of art.

---

**Note**: These are conceptual renders created with ASCII art. For photorealistic 3D renders, you would need to import the KiCad files into a 3D rendering tool like Blender with the PCB models.

**Tools for creating actual 3D renders:**
- KiCad's built-in 3D viewer (basic but functional)
- Blender + KiCad StepUp plugin (photorealistic)
- FreeCAD (engineering-focused)
- Online services like PCBWay's viewer (when you upload files)
