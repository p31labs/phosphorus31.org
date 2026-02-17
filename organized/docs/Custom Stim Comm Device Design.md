

# **Engineering the Stim Comm: A Comprehensive Design Report on Haptic-Feedback Handheld Communication Devices**

## **1\. Introduction: The Convergence of Sensory Regulation and Off-Grid Telemetry**

The contemporary landscape of open-source hardware is witnessing a unique convergence between assistive technology—specifically devices designed for sensory regulation, commonly known as "stim" or "fidget" tools—and decentralized communication platforms. This report presents a rigorous engineering analysis and a design roadmap for the "Stim Comm," a custom handheld device that integrates the long-range, low-power communication capabilities of the LoRa (Long Range) protocol with high-fidelity tactile inputs. This project is conceptualized not merely as an electronic assembly task but as a sophisticated exercise in human-machine interface (HMI) design, targeted specifically at a father-son collaborative build.

The genesis of this device lies in addressing two distinct human needs: the psychological requirement for tactile grounding (often addressed through mechanical switches and textured surfaces) and the functional requirement for resilient, off-grid communication (addressed by the Meshtastic ecosystem). The engineering challenge is to synthesize these requirements into a single, robust form factor that is accessible to hobbyist builders yet professional in its execution. By leveraging a "Carrier Board" architecture—where pre-certified microcontroller modules are mounted onto a custom printed circuit board (PCB)—the project mitigates the significant technical risks associated with Radio Frequency (RF) design while maximizing the opportunity for creative, aesthetic, and tactile customization.

This report provides an exhaustive examination of every subsystem required for the Stim Comm. It analyzes the comparative advantages of the ESP32-S3 versus the emerging Raspberry Pi RP2350 architectures, dissects the physics of "satisfying" mechanical inputs such as click-bar switches and magnetic rotary encoders, and explores advanced PCB fabrication techniques for creating sensory textures. Furthermore, it outlines a pedagogical "Design-to-Device" roadmap that balances engineering depth with the practical constraints of a home workshop.

## **2\. Architectural Strategy: The Carrier Board Paradigm**

### **2.1 The Engineering Rationale for Modular Design**

In the domain of RF electronics, the distinction between "chip-down" design and "modular" design is non-trivial. A chip-down approach involves placing the bare silicon die of the microcontroller and radio transceiver directly onto the PCB, requiring the designer to handle crystal oscillators, impedance matching networks, and complex power delivery grids. While this offers the lowest unit cost at scale, it presents a formidable barrier to entry for hobbyists. The primary failure modes in chip-down LoRa designs include detuned antenna paths due to improper trace impedance, parasitic capacitance affecting crystal stability, and regulatory non-compliance.1

The Carrier Board approach adopted for the Stim Comm circumvents these issues by utilizing "System-on-Module" (SoM) or castellated development boards. These modules—such as the Seeed Studio XIAO or M5Stack Stamp—encapsulate the high-frequency critical path components within a shielded, pre-certified package. The custom PCB designed by the user functions effectively as a motherboard or "breakout," routing power and input/output (I/O) signals while relying on the module's internal engineering for core processing and wireless transmission.2 This strategy decouples the risk of RF failure from the custom interface design, ensuring that the "communication" aspect of the device remains reliable while the builders focus on the "stimulation" features.

### **2.2 Comparative Analysis of Core Processing Modules**

The selection of the microcontroller unit (MCU) dictates the firmware compatibility, power budget, and I/O capabilities of the device. Three primary candidates have been evaluated for the Stim Comm: the Seeed Studio XIAO ESP32-S3, the M5Stack M5Stamp S3, and the Raspberry Pi Pico 2 W (RP2350).

#### **2.2.1 Seeed Studio XIAO ESP32-S3**

The Seeed Studio XIAO ESP32-S3 represents a triumph of miniaturization. Measuring only 21 x 17.8mm, it integrates the Espressif ESP32-S3 SoC, which features a dual-core Xtensa LX7 processor running at up to 240MHz.3

* **Power Architecture:** A critical advantage of the XIAO is its integrated battery charge management circuitry. It supports lithium battery charging currents of 50mA or 100mA, selectable via software or hardware configuration. This eliminates the need for an external Power Management IC (PMIC) like the TP4056 on the carrier board, significantly simplifying the schematic and reducing the bill of materials (BOM).4  
* **I/O Constraints:** The trade-off for its size is limited GPIO availability. The standard XIAO pinout exposes only 11 digital pins. For a device requiring a screen (SPI: 4 pins), a LoRa module (SPI \+ Control: 6-7 pins), and multiple tactile buttons, this pin count is restrictive. However, the presence of I2C and UART interfaces allows for the use of I/O expanders if necessary.2  
* **RF Performance:** The module includes a U.FL connector for an external antenna, which is essential for achieving the range expected of a LoRa device. The onboard ceramic antenna is sufficient for WiFi/Bluetooth but suboptimal for long-range telemetry.

#### **2.2.2 M5Stack M5Stamp S3**

The M5Stamp S3 offers a more robust mechanical integration suited for handheld devices that will experience frequent physical manipulation.

* **Mechanical Integration:** Unlike the XIAO, which typically uses through-hole header pins, the M5Stamp features 1.27mm pitch castellated holes along its perimeter. This allows the module to be surface-mounted directly onto the carrier board, providing superior mechanical shear resistance against the stresses of button presses and handling.5  
* **I/O Density:** The M5Stamp breaks out 23 GPIOs, vastly expanding the interface possibilities. This allows for the implementation of a direct-wired keyboard matrix (eliminating the need for complex encoding schemes) or the integration of extensive RGB lighting arrays for visual feedback without compromising the availability of pins for the LoRa radio.5  
* **Thermal Management:** The ESP32-S3 can generate significant heat during continuous WiFi or LoRa transmission. The larger surface area and the high-temperature plastic cap of the M5Stamp aid in thermal dissipation, potentially preventing thermal throttling during intense mesh network activity.7

#### **2.2.3 Raspberry Pi RP2350 (Pico 2 W)**

The RP2350, the successor to the RP2040, introduces the powerful Arm Cortex-M33 architecture with TrustZone security and improved floating-point performance.

* **Computational Power:** With 520KB of on-chip SRAM and dual cores capable of 150MHz, the RP2350 is a powerhouse for applications requiring heavy local processing, such as on-device encryption or complex display rendering (as seen in the Thumby Color gaming device).8  
* **Meshtastic Ecosystem Maturity:** While the hardware is capable, the software support for the RP2350 within the Meshtastic project is currently in an "Alpha" state. The primary limitation is the Bluetooth stack; unlike the ESP32-S3, which has a mature and fully integrated Bluetooth Low Energy (BLE) stack used for phone pairing, the RP2350 port often lacks this feature or requires experimental implementations.9 This would render the Stim Comm a standalone device, unable to interface with the Meshtastic mobile app for mapping and configuration, which is a significant functional deficit for a beginner project.  
* **Conclusion:** While the RP2350 is a superior chip for gaming-focused handhelds like the Thumby, the ESP32-S3 remains the definitive engineering choice for a reliable communication device due to its mature wireless stack.11

### **2.3 Radio Frequency Integration: The LoRa Transceiver**

Since the ESP32-S3 handles local connectivity (WiFi/BLE), a dedicated LoRa transceiver is required for the mesh network. The industry standard for modern Meshtastic nodes is the **Semtech SX1262**.

* **Module Selection:** Discrete modules such as the **Waveshare Core1262** or **EByte E22-900M30S** are recommended. These modules expose the SPI interface (MISO, MOSI, SCK, CS) along with critical control lines: Reset (RST), Busy, and DIO1 (Interrupt).12  
* **Design Considerations:** A critical layout rule for the carrier board is the "Keep-Out Zone." The area of the PCB directly underneath the antenna connector and the RF matching circuit of the module must be void of copper fills on all layers. This prevents parasitic capacitance from detuning the antenna and ensures the radiation pattern remains omnidirectional.1

### **2.4 Summary Comparison of MCU Modules**

| Feature | Seeed XIAO ESP32-S3 | M5Stack M5Stamp S3 | Raspberry Pi Pico 2 W (RP2350) |
| :---- | :---- | :---- | :---- |
| **Architecture** | Xtensa LX7 (Dual Core) | Xtensa LX7 (Dual Core) | Arm Cortex-M33 (Dual Core) |
| **Clock Speed** | 240 MHz | 240 MHz | 150 MHz |
| **Flash / PSRAM** | 8MB / 8MB | 8MB / None (Base Model) | External / Internal |
| **GPIO Count** | 11 | 23 | 26 |
| **Battery Mgmt** | Integrated (Charge IC) | External Required | External Required |
| **Meshtastic Status** | Stable / Supported | Stable / Supported | Alpha / Experimental |
| **Mounting Style** | THT / SMD | SMD Castellated | THT / SMD Castellated |
| **Ideal Use Case** | Miniature, low-power | Robust, high-I/O | Gaming, high-compute |

## **3\. The Physics of Tactility: Engineering Sensory Inputs**

The distinguishing feature of the Stim Comm is its focus on "tactile engineering." In standard consumer electronics, switches are selected for low cost and low profile. Here, they are selected for their force curves, acoustic signatures, and hysteresis profiles to provide specific sensory regulation.

### **3.1 Mechanical Switch Dynamics: The Click Bar Mechanism**

For a fidget device, the "click" is the product. Traditional "clicky" switches, such as the Cherry MX Blue, utilize a **click jacket** mechanism—a floating plastic slider that snaps down against the housing to generate sound. Critics often describe this feeling as "rattling" or distinct from the actual actuation point, leading to a disconnect between the tactile event and the electrical signal.

The **Kailh Choc Low Profile** series, specifically the "Box" and "Thick Click" variants, utilizes a superior mechanism known as the **Click Bar**.

* **Mechanism:** The click bar is a transverse metal spring bar located inside the switch housing. As the stem is depressed, a small protrusion on the stem pushes the bar aside, building potential energy. When the stem clears the bar, it snaps back against the housing with high velocity.13  
* **Tactile Implications:** This mechanism generates a tactile event on both the downstroke (actuation) and the upstroke (reset). The result is a crisp, sharp "snap" rather than a "crunch." This distinct hysteresis allows the user to "ride the click"—rapidly oscillating the switch around the actuation point for stimming purposes—without the "mushy" feeling associated with click jackets.14

### **3.2 Force Curve Analysis: Jade vs. Navy**

Selecting the correct switch requires analyzing their force-displacement curves.

* **Kailh Choc Navy:**  
  * *Actuation Force:* \~60gf (gram-force).  
  * *Tactile Force:* \~70gf.  
  * *Characteristics:* The Navy switch features a thicker click bar, resulting in a massive tactile bump. The force required to overcome the bump is significantly higher than the force to bottom out. This creates a "heavy" interaction that requires deliberate intent. It is ideal for a "Send" button or a singular, high-importance interaction, providing a deep sense of closure to an action.15  
* **Kailh Choc Jade:**  
  * *Actuation Force:* \~50gf.  
  * *Tactile Force:* \~60gf.  
  * *Characteristics:* The Jade uses the same thick click bar logic but with a lighter spring. The result is a tactile event that is just as crisp and audible as the Navy but requires less sustained force to hold down. This reduces finger fatigue during repetitive fidgeting or rapid typing.17  
* **Design Recommendation:** For the Stim Comm, a hybrid layout is proposed. The directional pad (D-Pad) and main action buttons should utilize **Choc Jades** for ease of use, while a single, isolated **Choc Navy** switch can serve as the "Enter/Transmit" key, offering a distinct, weighted confirmation for sending messages.

### **3.3 Rotational Haptics: The Physics of Detents**

Rotary encoders provide a continuous fidgeting outlet, distinct from the binary nature of switches. The quality of an encoder is defined by its **detents**—the mechanical "bumps" felt during rotation.

* **Component Selection:** The **ALPS EC11** series is the industry benchmark. Specifically, the **EC11E** models are highly regarded for their stability and lack of shaft wobble.18  
* **Detent Resolution:**  
  * *30 Detents (15 Pulses):* This configuration offers a fine-grained, smooth rotation. It is effective for scrolling through long lists of messages but provides less individual tactile feedback per step.  
  * *18 Detents (9 Pulses):* This configuration offers coarse, heavy clicks. Each step feels like a distinct mechanical event. For a "stim" toy, the lower resolution is often preferred because the haptic "thud" of each detent is more pronounced and satisfying.20  
* **Inertial Mass:** The tactile feel is further modified by the knob choice. A solid aluminum knob adds rotational mass (moment of inertia), which dampens high-frequency vibrations and makes the detents feel more substantial. A plastic knob, by contrast, can feel "hollow" and transmit more scratchy friction to the fingers.

## **4\. Active Haptics: The Feedback Loop**

Passive mechanics provide input feedback; active haptics allow the device to communicate back to the user. This creates a bidirectional sensory loop.

### **4.1 Actuator Physics: LRA vs. ERM**

* **Eccentric Rotating Mass (ERM):** These are DC motors with an off-center mass. When powered, they spin, creating vibration. The physics of an ERM involves a "spin-up" and "spin-down" time due to inertia. This results in a "buzzy" or "laggy" sensation that lacks definition.  
* **Linear Resonant Actuator (LRA):** LRAs consist of a magnetic mass suspended on a spring inside a coil. They are driven by an AC signal, oscillating back and forth. Because they operate at a resonant frequency, they can start and stop almost instantly (typically within 10-20ms). This allows them to simulate sharp "tocks" or "clicks" that mimic a physical button press, creating a much higher fidelity haptic experience.21

### **4.2 The DRV2605L Driver Implementation**

Driving an LRA is not as simple as toggling a GPIO pin. It requires a specialized driver like the **Texas Instruments DRV2605L**.

* **Waveform Library:** The DRV2605L contains an embedded ROM with 123 distinct haptic waveforms licensed from Immersion TouchSense. Instead of programming "vibrate for 500ms," the microcontroller sends a command over I2C to "Play Effect \#47" (a sharp double-click). This abstraction allows the Stim Comm to have a "vocabulary" of vibrations—a soft ramp-up for a notification, a sharp tick for UI scrolling, and a heavy thud for errors.23  
* **Auto-Resonance:** The DRV2605L actively monitors the back-EMF (Electromotive Force) of the LRA to detect its resonant frequency. As the device is held or placed on different surfaces, the resonant frequency of the motor changes. The driver dynamically adjusts the AC frequency to match, ensuring maximum vibration strength and efficiency regardless of how the device is gripped.23  
* **Circuit Requirements:** The driver requires a robust power delivery network. When the motor starts, it draws a significant current spike. A 1µF low-ESR ceramic capacitor placed immediately adjacent to the VDD pin of the DRV2605L is mandatory to prevent voltage droop that could reset the driver or the MCU.25

## **5\. PCB as a Canvas: Texture and Functional Art**

In traditional engineering, the PCB is hidden. In the Stim Comm, the PCB is the enclosure. By manipulating the standard manufacturing layers, we can create complex visual and tactile patterns directly on the board surface.

### **5.1 The Manufacturing Layer Stack as an Art Medium**

A standard PCB comprises four layers that can be manipulated for aesthetic effect:

1. **Silkscreen (White/Black):** The ink layer used for text. It has a slight thickness and a smooth texture.  
2. **Solder Mask (LPI):** The liquid photo-imageable polymer that protects the copper. It creates the board's primary color (Green, Matte Black, Purple). It has a smooth, sometimes rubbery texture (especially with matte finishes).  
3. **Copper (Plated):** The conductive layer. When the solder mask is removed ("Solder Mask Opening"), the exposed copper is plated with a surface finish.  
   * **HASL (Hot Air Solder Leveling):** Leaves a silver, uneven, slightly rough solder finish.  
   * **ENIG (Electroless Nickel Immersion Gold):** Leaves a flat, extremely smooth, gold finish. This is the premium choice for "touchable" art.26  
4. **FR4 Substrate:** The core fiberglass material. It is lower than the copper and has a fibrous, matte texture.

### **5.2 Texture Engineering Techniques**

By combining these layers, specific tactile effects can be engineered:

* **Gold Relief (Exposed Copper):** Drawing a geometric shape on the Copper layer and placing an identical shape on the Solder Mask Opening layer creates a raised, gold-plated area. This feels cool to the touch and extremely smooth.  
* **Blind Texture (Copper under Mask):** Drawing a shape on the Copper layer *without* a Solder Mask Opening creates a "bump" in the solder mask. The mask conforms over the copper trace (typically 35µm high), creating a subtle, embossed texture that is felt rather than seen.  
* **Debossed Texture (Mask Removal):** Removing the solder mask over a bare FR4 area creates a depression or "valley." The texture shifts from the smooth mask to the rougher raw fiberglass.

### **5.3 Software Workflow: From Vector to Gerber**

Designing these organic patterns requires a workflow that bridges graphic design and Computer-Aided Design (CAD).

1. **Vector Design:** Software like **Inkscape** or Adobe Illustrator is used to create complex patterns (e.g., Voronoi diagrams, phyllotaxis spirals, or noise textures).28 These patterns are saved as Scalable Vector Graphics (SVG).  
2. **Import to EDA:**  
   * **KiCad:** The "Import Graphics" tool allows SVGs to be mapped to specific layers (e.g., F.Mask for solder mask openings). Plugins like "KiCad StepUp" or "SVG to PCB" facilitate this conversion with high fidelity, preserving the Bezier curves of the original art.30  
   * **EasyEDA:** The "Import Image" function converts raster or vector images into PCB layers. While convenient, complex SVGs can sometimes degrade into jagged polygons. Using DXF format for intricate mechanical outlines is often more reliable.32  
3. **The "Badge Life" Technique:** A popular technique in the PCB art community is to cross-hatch the ground plane using a 0.5mm line width and expose it through the solder mask. With ENIG plating, this creates a "knurled" gold grip surface that serves a dual purpose: it provides a high-friction texture for holding the device and acts as a functional electrical shield.26

## **6\. The Software Ecosystem: Meshtastic and Device Firmware**

### **6.1 Firmware Target Selection**

Meshtastic is a hardware-agnostic firmware, but feature support varies significantly by chipset.

* **ESP32-S3:** This is the recommended platform. The firmware-esp32-s3-diy target is stable and supports the full feature set, including WiFi, Bluetooth, and Store-and-Forward messaging (utilizing the S3's PSRAM). The "Canned Messages" plugin is particularly relevant for a stim device; it allows the user to scroll through a list of pre-defined emotional status updates (e.g., "Overwhelmed," "Safe," "Heading Home") using the rotary encoder and send them with a single click, bypassing the need for a complex keyboard.11  
* **RP2040/RP2350:** Support is currently in "Alpha." The critical deficiency is Bluetooth support. Without a functioning Bluetooth stack, the device cannot pair with a smartphone app (like the Meshtastic Android/iOS app). This forces the device to be fully standalone, relying entirely on its own screen and inputs. While this "digital minimalism" might be desirable for some, it limits the device's utility as a serious communication tool.34

### **6.2 Display Driver Integration**

The visual interface relies on the **ST7789** TFT LCD controller.

* **Wiring Topology:** The screen requires a 4-wire SPI interface.  
  * **SCK/MOSI:** Shared with the LoRa radio on the SPI bus.  
  * **CS (Chip Select):** Must be a unique GPIO to distinguish screen commands from radio commands.  
  * **DC (Data/Command):** A unique GPIO used to switch the display between command mode and pixel data mode.  
  * **RST (Reset):** Can be shared with the global system reset or assigned a unique GPIO.35  
* **Configuration:** In the Meshtastic firmware build configuration (or the web flasher), these specific pins must be defined. If compiling from source, this is done in the variant.h file for the custom board definition.

## **7\. Reference Hardware Deconstruction**

To validate the "Stim Comm" concept, it is instructive to analyze existing open-source devices that solve similar engineering problems.

### **7.1 The LilyGo T-Deck: A Input Matrix Case Study**

The LilyGo T-Deck 36 is a sophisticated handheld that crams a full QWERTY keyboard and screen into a pocketable form factor.

* **Matrix Scanning:** To read over 40 keys with limited GPIO, the T-Deck utilizes the **74HC138** 3-to-8 line decoder. This chip allows the ESP32 to scan 8 rows of keys using only 3 GPIO control lines (plus the column read lines). This is a vital lesson: if the Stim Comm expands beyond a simple D-Pad to a full keypad, an I/O expander or decoder is mathematically necessary to preserve pins for the radio and screen.38  
* **Trackball:** The T-Deck uses a miniature BlackBerry-style trackball. While functionally excellent, the mechanical integration of such a component is high-risk for a beginner builder (requiring precise soldering of Hall effect sensors). The ALPS EC11 encoder is a more robust and "solder-friendly" alternative for scrolling.

### **7.2 The Thumby Color: RP2350 Integration**

The Thumby Color 8 proves the viability of the RP2350 as a handheld core.

* **Power Architecture:** It demonstrates how to drive an ST7789 screen directly from the RP2350's high-speed SPI interfaces.  
* **Form Factor:** Its compact "game boy" layout is a perfect ergonomic template for the Stim Comm. However, the Thumby is a gaming device, not a radio. Adapting its schematic requires ensuring that the high-speed SPI lines for the screen do not cause RF interference (RFI) with the LoRa module, a common issue in tightly packed RF devices.40

## **8\. Design-to-Device Roadmap: A Father-Son Curriculum**

The following roadmap structures the build process not just as a manufacturing sequence, but as an educational curriculum that introduces engineering concepts in stages.

### **Phase 1: Breadboarding & Logic Verification (Weeks 1-2)**

* **Objective:** Validate the electronics before committing to a PCB.  
* **Curriculum:** Circuit Logic, SPI/I2C Protocols.  
* **Action:** Connect the Seeed XIAO ESP32-S3 to the SX1262 module and ST7789 screen using a solderless breadboard. Flash the basic Meshtastic firmware. Verify that the device boots and the screen displays the boot logo. This confirms that the "brain" and the "voice" of the device are functional.

### **Phase 2: Schematic Capture (Weeks 3-4)**

* **Objective:** Translate the physical wires into a logical diagram.  
* **Curriculum:** Abstraction, Datasheet Reading.  
* **Action:** Use **EasyEDA** (web-based) for schematic capture. This allows collaborative editing. Import the specific footprints for the Kailh switches and ALPS encoder.41 Add the DRV2605L circuit, ensuring the I2C pull-up resistors (4.7kΩ) and decoupling capacitors are present.

### **Phase 3: PCB Layout & Artistic Design (Weeks 5-6)**

* **Objective:** Design the physical board.  
* **Curriculum:** Spatial Reasoning, Vector Graphics.  
* **Action:**  
  1. Define the board outline in Inkscape. Create a comfortable, rounded shape ("soap bar" form factor).  
  2. Generate the "grip texture" patterns (Voronoi or Hexagonal) in Inkscape and export as DXF/SVG.28  
  3. Import the outline and texture into EasyEDA. Assign the texture to the Solder Mask layer.  
  4. Route the traces. Teach the importance of trace width (thick for power, thin for data) and ground planes.

### **Phase 4: Fabrication & Hybrid Assembly (Week 7\)**

* **Objective:** Manufacture the PCB.  
* **Curriculum:** Supply Chain, DFM (Design for Manufacturing).  
* **Action:** Use the "Hybrid Assembly" strategy. Order the PCBs from **JLCPCB** with the **PCBA service**. Have the factory solder the difficult Surface Mount (SMD) components (the tiny DRV2605L, resistors, capacitors).43 Leave the "fun" Through-Hole (THT) components (Switches, Screen, Encoder) unpopulated. Select **ENIG** finish for the gold textures.

### **Phase 5: The Build Weekend (Week 9\)**

* **Objective:** Final construction.  
* **Curriculum:** Soldering Thermodynamics, Mechanical Assembly.  
* **Action:**  
  1. Solder the Kailh Choc switches. Their large pins are easy for beginners to solder.  
  2. Solder the rotary encoder and the headers for the XIAO.  
  3. Mount the screen using double-sided foam tape (to provide mechanical damping) and solder its wires.  
  4. Flash the final configured firmware. Test the haptic feedback by scrolling the encoder—feeling the "tick" of the motor synchronize with the "clunk" of the knob.

## **9\. Detailed Technical Addendum: Component Data**

### **9.1 Switch Force Curve Data**

| Feature | Kailh Choc White | Kailh Choc Jade | Kailh Choc Navy | Engineering Implication |
| :---- | :---- | :---- | :---- | :---- |
| **Mechanism** | Click Bar (Thin) | Click Bar (Thick) | Click Bar (Thick) | Thick bar provides superior auditory/tactile feedback.14 |
| **Actuation Force** | 50gf | 50gf | 60gf | Navy requires 20% more force, reducing accidental presses. |
| **Tactile Force** | 60gf | 60gf | 70gf | High tactile force creates the "snap" sensation. |
| **Sound Profile** | High Pitch | Lower Pitch, "Thock" | Deep "Thock" | Lower pitch is generally perceived as higher quality. |
| **Hysteresis** | Low | High | High | High hysteresis allows for satisfying "fidgeting" without actuation errors. |

### **9.2 Power Budget Estimation**

A 1000mAh LiPo battery is recommended for the Stim Comm.

* **ESP32-S3 (Active/WiFi):** \~100mA.  
* **SX1262 (TX @ 22dBm):** \~120mA.  
* **ST7789 Display (Backlight 50%):** \~30mA.  
* **Haptic Motor (LRA \- Pulsed):** \~50-80mA.  
* **Estimated Runtime:** 5-8 hours of continuous heavy use, or 24+ hours in "Meshtastic Low Power" mode where the ESP32 sleeps between LoRa duty cycles.

## **10\. Conclusion**

The "Stim Comm" is more than a radio; it is a tactile artifact. By fusing the resilient connectivity of the Meshtastic network with the psycho-acoustic satisfaction of mechanical click-bars and precision haptics, the device serves a dual role as a communication lifeline and a sensory regulation tool. The engineering pathway defined in this report—utilizing modular carrier boards, hybrid assembly processes, and artistic PCB fabrication—ensures that this complex project is not only achievable for a father-son team but also rich in educational value. It transforms the abstract concepts of RF engineering and material science into a tangible, satisfying object that fits in the palm of the hand.

#### **Works cited**

1. Best Practices for Using Approved Modules \- Nemko, accessed November 24, 2025, [https://www.nemko.com/hubfs/Radio%20-%20Testing%20Strategies%20and%20best%20practice%20for%20using%20approved%20modules%20per%20FCC%20KDB99369.pdf](https://www.nemko.com/hubfs/Radio%20-%20Testing%20Strategies%20and%20best%20practice%20for%20using%20approved%20modules%20per%20FCC%20KDB99369.pdf)  
2. Schematic Symbol for Seeed Studio XIAO ESP32S3: Production-Ready... \- Flux AI, accessed November 24, 2025, [https://www.flux.ai/seeedstudio/seeed-studio-xiao-esp32s3](https://www.flux.ai/seeedstudio/seeed-studio-xiao-esp32s3)  
3. XIAO ESP32S3 \- Technical Documentation, accessed November 24, 2025, [https://docs.nordicsemi.com/bundle/ncs-2.5.2/page/zephyr/boards/xtensa/xiao\_esp32s3/doc/index.html](https://docs.nordicsemi.com/bundle/ncs-2.5.2/page/zephyr/boards/xtensa/xiao_esp32s3/doc/index.html)  
4. Getting Started with Seeed Studio XIAO ESP32S3 Series, accessed November 24, 2025, [https://wiki.seeedstudio.com/xiao\_esp32s3\_getting\_started/](https://wiki.seeedstudio.com/xiao_esp32s3_getting_started/)  
5. Stamp-S3 PIN1.27 \- m5-docs, accessed November 24, 2025, [https://docs.m5stack.com/en/core/M5StampS3%20PIN1.27](https://docs.m5stack.com/en/core/M5StampS3%20PIN1.27)  
6. M5StampS3, development board that stands out for features and size \- Luis Llamas, accessed November 24, 2025, [https://www.luisllamas.es/en/m5stamps3/](https://www.luisllamas.es/en/m5stamps3/)  
7. Stamp-S3 \- m5-docs, accessed November 24, 2025, [https://docs.m5stack.com/en/core/StampS3](https://docs.m5stack.com/en/core/StampS3)  
8. Thumby Color \- TinyCircuits, accessed November 24, 2025, [https://tinycircuits.com/products/thumby-color](https://tinycircuits.com/products/thumby-color)  
9. Raspberry Pi | Meshtastic, accessed November 24, 2025, [https://meshtastic.org/docs/hardware/devices/raspberrypi/](https://meshtastic.org/docs/hardware/devices/raspberrypi/)  
10. Meshtastic for pi pico 2 W (RP2350) \- Reddit, accessed November 24, 2025, [https://www.reddit.com/r/meshtastic/comments/1jgvliq/meshtastic\_for\_pi\_pico\_2\_w\_rp2350/](https://www.reddit.com/r/meshtastic/comments/1jgvliq/meshtastic_for_pi_pico_2_w_rp2350/)  
11. Getting Started | Meshtastic, accessed November 24, 2025, [https://meshtastic.org/docs/getting-started/](https://meshtastic.org/docs/getting-started/)  
12. Pico-LoRa-SX1262 \- Waveshare Wiki, accessed November 24, 2025, [https://www.waveshare.com/wiki/Pico-LoRa-SX1262](https://www.waveshare.com/wiki/Pico-LoRa-SX1262)  
13. High-end clicks: Comparing Box Navies, Box Jades, and \-stotles : r/MechanicalKeyboards, accessed November 24, 2025, [https://www.reddit.com/r/MechanicalKeyboards/comments/7nruc6/highend\_clicks\_comparing\_box\_navies\_box\_jades\_and/](https://www.reddit.com/r/MechanicalKeyboards/comments/7nruc6/highend_clicks_comparing_box_navies_box_jades_and/)  
14. Kailh Box Switches Buying Guide, accessed November 24, 2025, [https://www.kailh.net/blogs/news/kailh-box-switches-buying-guide](https://www.kailh.net/blogs/news/kailh-box-switches-buying-guide)  
15. Low profile mechanical switch Kailh Choc Brown tactile silent, accessed November 24, 2025, [https://splitted.space/en/mechanical-switches/kailh-choc-brown-tactile-low-profile-switches](https://splitted.space/en/mechanical-switches/kailh-choc-brown-tactile-low-profile-switches)  
16. I tried to measure the force curve of 17 types of Choc switches with \- Daily Craft Keyboard, accessed November 24, 2025, [https://shop.dailycraft.jp/en/blogs/dev/choc-forcecurve](https://shop.dailycraft.jp/en/blogs/dev/choc-forcecurve)  
17. Kailh Box Jade vs Kailh Choc (V2) Blue switch comparison \- Keyboard Builders' Digest, accessed November 24, 2025, [https://kbd.news/switch-comparison/Kailh-Box-Jade-vs-Kailh-Choc-V2-Blue-365-397.html](https://kbd.news/switch-comparison/Kailh-Box-Jade-vs-Kailh-Choc-V2-Blue-365-397.html)  
18. EC11 ROTARY ENCODER Resources \- EasyEDA, accessed November 24, 2025, [https://easyeda.com/components/EC11-ROTARY-ENCODER\_7f30cc0f36ec4e5aa9dbcb31fce0fc45](https://easyeda.com/components/EC11-ROTARY-ENCODER_7f30cc0f36ec4e5aa9dbcb31fce0fc45)  
19. Alps Alpine's Encoders | Products & Technologies, accessed November 24, 2025, [https://tech.alpsalpine.com/e/products/faq/encorder/features/](https://tech.alpsalpine.com/e/products/faq/encorder/features/)  
20. Alps Alpine EC11 Series Encoders \- Mouser Electronics, accessed November 24, 2025, [https://www.mouser.com/c/electromechanical/encoders/?m=Alps%20Alpine\&series=EC11](https://www.mouser.com/c/electromechanical/encoders/?m=Alps+Alpine&series=EC11)  
21. DRV2605L Resources \- EasyEDA, accessed November 24, 2025, [https://easyeda.com/component/DRV2605L-algH07tgG](https://easyeda.com/component/DRV2605L-algH07tgG)  
22. 7 Micro Vibrating Motors to Elevate Your Product Design \- ineedmotors.com, accessed November 24, 2025, [https://blog.ineedmotors.com/7-micro-vibrating-motors-product-design/](https://blog.ineedmotors.com/7-micro-vibrating-motors-product-design/)  
23. DRV2605L 2- to 5.2-V Haptic Driver for LRA and ERM with Effect Library and Smart-Loop Architecture datasheet (Rev. D) \- Texas Instruments, accessed November 24, 2025, [https://www.ti.com/lit/ds/symlink/drv2605l.pdf](https://www.ti.com/lit/ds/symlink/drv2605l.pdf)  
24. Adafruit DRV2605L Haptic Controller Breakout, accessed November 24, 2025, [https://learn.adafruit.com/adafruit-drv2605-haptic-controller-breakout/overview](https://learn.adafruit.com/adafruit-drv2605-haptic-controller-breakout/overview)  
25. HTIT-WB32LA(F)\_V3.1\_Schematic\_Diagram.pdf \- Resource, accessed November 24, 2025, [https://resource.heltec.cn/download/WiFi\_LoRa\_32\_V3/HTIT-WB32LA(F)\_V3.1\_Schematic\_Diagram.pdf](https://resource.heltec.cn/download/WiFi_LoRa_32_V3/HTIT-WB32LA\(F\)_V3.1_Schematic_Diagram.pdf)  
26. How to make | golden finger PCB \- RS Online, accessed November 24, 2025, [https://www.rs-online.com/designspark/how-to-make-golden-finger-pcb](https://www.rs-online.com/designspark/how-to-make-golden-finger-pcb)  
27. ENIG Surface Finish | Sierra Circuits, accessed November 24, 2025, [https://www.protoexpress.com/kb/enig/](https://www.protoexpress.com/kb/enig/)  
28. Creating Phyllotaxis Patterns with a Plugin in Kicad 8 \- Hackster.io, accessed November 24, 2025, [https://www.hackster.io/svdbor/creating-phyllotaxis-patterns-with-a-plugin-in-kicad-8-ccd719](https://www.hackster.io/svdbor/creating-phyllotaxis-patterns-with-a-plugin-in-kicad-8-ccd719)  
29. Noise Texture Generator v2.1, accessed November 24, 2025, [https://www.noisetexturegenerator.com/](https://www.noisetexturegenerator.com/)  
30. KiCad 6 \- Importing Complex Board Outlines as Vector Graphics \- element14 Community, accessed November 24, 2025, [https://community.element14.com/members-area/b/blog/posts/kicad-6---importing-complex-board-outlines-as-vector-graphics](https://community.element14.com/members-area/b/blog/posts/kicad-6---importing-complex-board-outlines-as-vector-graphics)  
31. Convert Inkscape SVG drawings to KiCad footprints \- OSH Park, accessed November 24, 2025, [https://blog.oshpark.com/2017/01/08/convert-inkscape-svg-drawings-to-kicad-footprints/](https://blog.oshpark.com/2017/01/08/convert-inkscape-svg-drawings-to-kicad-footprints/)  
32. SVG Import performs really bad \- EasyEDA, accessed November 24, 2025, [https://easyeda.com/forum/topic/SVG-Import-performs-really-bad-1eccada397514ed48b2567028f517ab6](https://easyeda.com/forum/topic/SVG-Import-performs-really-bad-1eccada397514ed48b2567028f517ab6)  
33. LoRa ESP32/ESP32-S3 Project with Web Interface \- GitHub, accessed November 24, 2025, [https://github.com/vpuhoff/lora-esp32](https://github.com/vpuhoff/lora-esp32)  
34. Raspberry Pi Pico | Meshtastic, accessed November 24, 2025, [https://meshtastic.org/docs/hardware/devices/raspberrypi/pico/](https://meshtastic.org/docs/hardware/devices/raspberrypi/pico/)  
35. Getting Started with an ESP32-S3 Supermini device connected to an ST7789 TFT display, accessed November 24, 2025, [https://medium.com/@androidcrypto/getting-started-with-an-esp32-s3-supermini-device-connected-to-an-st7789-tft-display-af76e0251c96](https://medium.com/@androidcrypto/getting-started-with-an-esp32-s3-supermini-device-connected-to-an-st7789-tft-display-af76e0251c96)  
36. LILYGO T-Deck, accessed November 24, 2025, [https://wiki.lilygo.cc/get\_started/en/Wearable/T-Deck-Plus/T-Deck-Plus.html](https://wiki.lilygo.cc/get_started/en/Wearable/T-Deck-Plus/T-Deck-Plus.html)  
37. T-Deck : 14 Steps (with Pictures) \- Instructables, accessed November 24, 2025, [https://www.instructables.com/T-Deck/](https://www.instructables.com/T-Deck/)  
38. Confused on button matrix design \- EEVblog, accessed November 24, 2025, [https://www.eevblog.com/forum/beginners/confused-on-button-matrix-design/](https://www.eevblog.com/forum/beginners/confused-on-button-matrix-design/)  
39. Table on the backside of cardputer \- Reddit, accessed November 24, 2025, [https://www.reddit.com/r/CardPuter/comments/1barckv/table\_on\_the\_backside\_of\_cardputer/](https://www.reddit.com/r/CardPuter/comments/1barckv/table_on_the_backside_of_cardputer/)  
40. Hardware design with RP2350: Using RP2350 microcontrollers to build boards and products. \- Raspberry Pi Datasheets, accessed November 24, 2025, [https://datasheets.raspberrypi.com/rp2350/hardware-design-with-rp2350.pdf](https://datasheets.raspberrypi.com/rp2350/hardware-design-with-rp2350.pdf)  
41. Libraries \- EasyEDA Std User Guide, accessed November 24, 2025, [https://docs.easyeda.com/en/Schematic/Libraries/](https://docs.easyeda.com/en/Schematic/Libraries/)  
42. ai03-2725/MX\_V2: Second generation KiCad Libraries of keyboard switch footprints \- GitHub, accessed November 24, 2025, [https://github.com/ai03-2725/MX\_V2](https://github.com/ai03-2725/MX_V2)  
43. Printed Circuit Board Assembly (PCBA): A Step-by-Step Guide \- JLCPCB, accessed November 24, 2025, [https://jlcpcb.com/blog/printed-circuit-board-assembly](https://jlcpcb.com/blog/printed-circuit-board-assembly)