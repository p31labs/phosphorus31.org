# TETRAHEDRON PROTOCOL - Dad's Master Build Guide
## Technical Documentation & Teaching Strategy

**Project Timeline**: 4 Sundays (December 1, 8, 15, 22)  
**Deployment**: Christmas Morning, December 25  
**Builder Age**: 9 years old  
**Primary Educational Goals**: Electronics fundamentals, programming basics, problem-solving, father-son bonding

---

## 🎯 EDUCATIONAL PHILOSOPHY

### What We're Really Teaching:

This isn't just about building devices. You're teaching:

1. **Resilience**: When something doesn't work, we debug, not quit
2. **Systems Thinking**: How parts work together to create something bigger
3. **Self-Efficacy**: "I can build things that seem impossible"
4. **Problem-Solving**: Break big problems into small, solvable steps

### The Meta-Lesson:

The tetrahedron shape is intentional. It teaches: **Structures can change and still be strong.**

When Node 4's status changes (divorce, friend moves, whatever), the triangle remains. This is the real lesson—resilience through adaptation.

---

## 🗓️ SUNDAY #1: FIRST CONTACT (December 1st)

### Duration: 2-3 hours
### Difficulty: ⭐☆☆☆☆

### Objectives:
1. Unbox and inventory all parts
2. Install Arduino IDE and libraries
3. Upload "Hello World" firmware
4. See his name on screen
5. Make LEDs respond to button presses

### Pre-Session Preparation (DO THIS THE NIGHT BEFORE):

#### 1. Install Arduino IDE:
```
Download from: https://www.arduino.cc/en/software
Version: Latest (2.3.x or higher)
```

#### 2. Add ESP32 Board Support:
- Open Arduino IDE
- File → Preferences
- Add to "Additional Board Manager URLs":
  ```
  https://espressif.github.io/arduino-esp32/package_esp32_index.json
  ```
- Tools → Board → Boards Manager
- Search "ESP32"
- Install "esp32 by Espressif Systems"

#### 3. Install Required Libraries:
Go to Tools → Manage Libraries, search and install:
- Adafruit GFX Library
- Adafruit ILI9341
- Adafruit NeoPixel
- RH_RF95 (RadioHead)
- Adafruit BusIO

#### 4. Test Your Setup:
- Plug in ONE Feather board
- Select Tools → Board → ESP32 Arduino → Adafruit Feather ESP32-S3
- Select the correct COM port
- Upload a blank sketch to verify it works

**Why do this ahead?** Installation can be frustrating. Get the technical hurdles out of the way so Sunday is pure fun.

---

### Session Flow:

#### Part 1: The Unboxing (30 minutes)

**Make it special:**
- Clear the dining room table
- Lay out a big white poster board
- Have him open each package
- Let him hold each part

**For each component, explain:**

**ESP32 Feather:**
- "This is the brain. It runs the programs we write."
- "It has WiFi and Bluetooth built in, but we're going to use LoRa radio instead."
- Point out the pins, the USB port, the battery connector

**LoRa Module:**
- "This is the radio. It can send messages over 2 miles without WiFi!"
- "See this antenna? It makes the radio waves bigger and stronger."
- Let him screw the antenna on (satisfying mechanical connection)

**Screen:**
- "This is like a tiny TV. It's called TFT, which means it can show any color."
- "It even has a touch sensor, but we're using buttons instead."

**LED Strip:**
- "These are called NeoPixels. Each one can be a different color."
- "The computer can control ALL of them individually—like a tiny light show."

**Battery:**
- "This stores electricity like a water tank stores water."
- "One charge lasts all day. When it's empty, we plug it in and fill it back up."
- **SAFETY NOTE:** "Never squeeze it, puncture it, or get it wet."

#### Part 2: The First Program (45 minutes)

**Open the hello_world.ino file together.**

Sit side-by-side at the computer. Walk through the code:

```cpp
const char* BUILDER_NAME = "CONNOR";  // ← CHANGE THIS
```

**You say:** "See this line? This is called a variable. It's like a label on a box. We're going to put YOUR name in this box."

**Let him type his name** (all caps, no spaces).

**Explain the upload process:**
1. "First, the computer checks our code for mistakes (that's called 'compiling')"
2. "Then it converts it into a language the chip understands (ones and zeros)"
3. "Finally, it sends it through the USB cable into the brain"

**Press Upload.**

**While it uploads (30 seconds):**
- "Watch the little lights on the board blink. That's the data going in."
- "If you see errors, don't worry—we'll fix them together. Even NASA engineers get errors."

**When it succeeds:**
- Let him press the RESET button
- **THE MOMENT:** His name appears on the screen
- "YOU DID THAT. You just programmed a computer."

#### Part 3: The LED Magic (45 minutes)

Now plug in the LED strip:
- Red wire → 5V pin
- Black wire → GND pin
- Yellow wire → Pin 5

**Safety first:** "These are low voltage and totally safe, but we still need to connect them correctly. Red is always power, black is always ground."

**Re-upload the code.**

**Watch the LEDs come alive.**

- Rainbow effects
- Pulsing animations
- Bouncing ball game

**The teaching moment:**
"These LEDs don't know what to do on their own. They need instructions. The code we wrote is those instructions."

**Let him experiment:**
```cpp
strip.setBrightness(50);  // Try changing this number
```

"What happens if you make it bigger? Smaller? Try 100. Try 10."

#### Part 4: Wrap-Up (15 minutes)

**What we accomplished today:**
- ✅ Built our first circuit
- ✅ Uploaded our first program
- ✅ Saw our name on a screen WE programmed
- ✅ Controlled LEDs with code

**Fill out the build log together** (in the kid's guide).

**Next week preview:**
"Next time, you're going to learn to SOLDER. That's how real engineers connect electronics permanently."

---

## 🗓️ SUNDAY #2: SOLDERING DAY (December 8th)

### Duration: 3-4 hours
### Difficulty: ⭐⭐⭐☆☆

### Objectives:
1. Learn safe soldering technique
2. Solder LED strip wires
3. Solder screen headers (Dad does this if needed)
4. Test the complete circuit
5. Understand how electrical connections work

### Pre-Session Preparation:

#### Safety Setup:
- [ ] Clear, well-lit workspace
- [ ] Ventilation (open window or fan)
- [ ] Fire extinguisher nearby (seriously)
- [ ] Damp sponge for cleaning iron
- [ ] Safety glasses for both of you
- [ ] First aid kit (just in case)

#### Materials Check:
- [ ] Soldering iron (PINECIL or equivalent)
- [ ] Lead-free solder
- [ ] Helping hands / PCB holder
- [ ] Wire strippers
- [ ] Diagonal cutters
- [ ] Multimeter (for testing connections)

#### Pre-Cut Wires:
Cut three 6-inch sections from the LED strip's connector cable:
- Red (power)
- Black (ground)
- Yellow (data)

Strip 1/4" from each end.

---

### Session Flow:

#### Part 1: Soldering Safety & Demo (30 minutes)

**The Safety Talk:**
"Soldering irons get to 700°F. That's hot enough to burn you instantly. We're going to follow some rules to stay safe."

**Safety Rules (write these on a poster):**
1. Always use safety glasses
2. Never touch the tip
3. Work in a ventilated area
4. Tell me immediately if something smells burnt
5. Turn it off when not in use
6. Wash hands after (lead-free solder still has flux)

**The Demo:**
Using scrap wire, show him:
1. "Tinning" the soldering iron tip
2. Heating BOTH the pad and the wire
3. Applying solder to the joint (not the iron)
4. Removing heat and letting it cool
5. Inspecting the joint (shiny = good, dull/blobby = cold joint)

**Let him practice** on scrap wire and perfboard first. 5-10 practice joints before moving to the real board.

#### Part 2: The LED Strip Connection (60 minutes)

**This is his work. Your job is to guide, not do it for him.**

**Step-by-step:**

1. **Secure the Feather in helping hands**
   - "We need it stable so we can use both hands for soldering."

2. **Identify the pins:**
   - Show him the Pin 5, 5V, and GND labels

3. **His first real solder joint:**
   - "Okay, let's connect the yellow wire to Pin 5."
   - "Hold the wire in place with tweezers."
   - "Touch the iron to BOTH the pin and the wire for 2 seconds."
   - "Now touch the solder to the joint—not the iron!"
   - "See it melt and flow? That's perfect. Now remove the iron."

4. **Repeat for power and ground**

5. **Test with multimeter:**
   - "Let's make sure electricity can flow through our joints."
   - Show him continuity testing
   - Beep = good connection!

**Celebrate each successful joint.** This is hard. He's learning a skill most adults don't have.

#### Part 3: The Screen (60 minutes)

**Decision point:** Can he solder 20 pins in a row? 

**If YES (he's doing great):**
- Let him solder the screen header
- Dad supervises closely
- This will take 30-40 minutes

**If NO (getting tired/frustrated):**
- "I'm going to do the screen headers because there are so many. But you did the hard part already!"
- He can help by handing you solder, holding the helping hands, counting pins

**Critical:** Don't let this become discouraging. The goal is confidence, not perfection.

#### Part 4: The Big Test (30 minutes)

**Stack it all together:**
1. Feather on bottom
2. Screen on top
3. LED strip connected
4. Battery plugged in

**Power it on.**

**Upload the hello_world program again.**

**WHEN IT WORKS:**
- His name on screen ✓
- LEDs responding ✓
- Everything he built ✓

"You just built a real electronic device. From scratch. This is YOURS."

**If it doesn't work:**
- "Debugging is part of engineering. Let's figure it out together."
- Check connections with multimeter
- Look for cold solder joints
- Re-flow any suspicious connections
- **Stay calm and positive.** This is a learning moment.

---

## 🗓️ SUNDAY #3: RADIO DAY (December 15th)

### Duration: 2-3 hours
### Difficulty: ⭐⭐⭐⭐☆

### Objectives:
1. Add LoRa radio module
2. Build Dad's device (Node 1)
3. Upload walkie-talkie firmware
4. Send first radio message
5. Test range and signal strength

### Pre-Session Preparation:

#### Build Node 1 (Your device) ahead of time:
- Solder it during the week
- Test it thoroughly
- This way, you have a known-good device for testing

#### Charge both batteries overnight

#### Have a range-testing plan:
- Start in same room
- Move to different rooms
- Go outside
- Mark distances on a map

---

### Session Flow:

#### Part 1: The Radio Module (30 minutes)

**Stack the LoRa FeatherWing on Node 2:**
- "This just clicks on top like LEGO. See how the pins line up?"
- Let him align and press it down
- Screw in the antenna (satisfying click)

**Explain how it works:**
"This radio is special. It's called LoRa, which means 'Long Range.' It can send messages over 2 miles!"

**Compare to WiFi:**
- WiFi: Strong signal, short distance (300 feet)
- LoRa: Weak signal, long distance (2+ miles)
- "It's like whispering vs. shouting—sometimes quiet goes farther if you say it right."

#### Part 2: The Walkie-Talkie Program (30 minutes)

**Open walkie_talkie.ino**

**Key section to show him:**
```cpp
#define DEVICE_ID 1  // 1 = DAD, 2 = SON

const char* MY_NAME = (DEVICE_ID == 1) ? "DAD" : "SON";
```

"See this? This tells the device WHO it is. Your device is Node 2, so we set it to 2."

**Upload to his device:** DEVICE_ID = 2  
**Your device already has:** DEVICE_ID = 1

**Explain the protocol:**
"When you press a button, your device makes a packet—like an envelope. It puts your message inside, writes the address on the front, and sends it into the air. My device catches it and opens the envelope!"

#### Part 3: First Contact (45 minutes)

**The moment:**
1. Both devices powered on
2. Screens show "SEARCHING FOR NETWORK..."
3. They find each other
4. "CONNECTED"

**Send the first message:**
- "Press the blue button (that's my button)"
- His screen: "[SON→DAD] Hi! 👋"
- Your screen lights up with the message
- Your LEDs flash green (his color)

**"That message just traveled through the air as invisible radio waves. No wires. No WiFi. Just you and me."**

#### Part 4: Range Testing (45 minutes)

**Make it a game:**

**Level 1:** Same room (10 feet)
- Both devices on table
- Send messages back and forth
- Note the RSSI: probably around -40 dBm

**Level 2:** Different rooms (30 feet)
- He goes to his bedroom
- You stay in the living room
- RSSI: around -60 to -80 dBm

**Level 3:** Different floors (if applicable)
- RSSI: -80 to -100 dBm

**Level 4:** Outside (100+ feet)
- Walk to opposite ends of the yard
- RSSI: -90 to -110 dBm

**Level 5:** Challenge mode
- How far can you go before you lose connection?
- Does the signal go through walls? Trees? Cars?

**Teaching moment:**
"The RSSI number tells you how weak the signal is. Bigger negative number = weaker signal. When it gets below -120, you'll lose connection."

**Document it:**
- Draw a map
- Mark where you tested
- Write down RSSI values
- Find the maximum range

#### Part 5: Achievement Unlocked (15 minutes)

**Celebrate:**
- ✅ Built two complete devices
- ✅ Sent first radio message
- ✅ Tested real-world performance
- ✅ Learned about signal propagation

**Next week:**
"We're going to build the other two nodes and form the TETRAHEDRON. That's when it gets REALLY cool."

---

## 🗓️ SUNDAY #4: THE TETRAHEDRON FORMS (December 22nd)

### Duration: 3-4 hours
### Difficulty: ⭐⭐⭐☆☆

### Objectives:
1. Build Nodes 3 and 4
2. Upload Tetrahedron Protocol firmware to all devices
3. Test 4-node mesh network
4. Install in cases
5. Prepare for Christmas deployment

### Pre-Session Preparation:

#### Node 3 Strategy:
- His sister should participate if possible
- She can do simple tasks (pressing buttons, labeling)
- Make her feel included in "the network"

#### Node 4 Strategy:
- Build it together, but don't reveal who it's for yet
- Keep it mysterious: "This is for someone special"
- Wrap it separately

#### Case Preparation:
- Pre-drill holes for buttons, screen, charging port
- Test-fit components
- Have hot glue gun ready

---

### Session Flow:

#### Part 1: Assembly Line (90 minutes)

**Build Nodes 3 and 4:**

Now he's the expert. Let him lead:
- "Okay, show me how to solder the LED strip."
- "What comes next?"
- "How do we test if it's working?"

**Your role:** Quality control and encouragement

**His sister helps:**
- Organizing parts
- Reading out the next steps
- Pressing buttons during tests
- Picking her color theme

#### Part 2: The Tetrahedron Protocol (45 minutes)

**Upload the final firmware to all 4 devices:**
- Node 1: DEVICE_ID = 1 (Dad/Blue)
- Node 2: DEVICE_ID = 2 (Son/Green)
- Node 3: DEVICE_ID = 3 (Daughter/Yellow)
- Node 4: DEVICE_ID = 4 (The Fourth/Purple)

**The moment of truth:**
1. Power on all 4 devices at once
2. Watch them find each other
3. Each screen shows 4 dots connecting
4. "TETRAHEDRON COMPLETE"
5. All LED strips pulse in sync

**"This is it. This is the structure. Four corners, all connected."**

#### Part 3: Enclosures (60 minutes)

**Make them special:**

**Node 1 (Yours):**
- Clean, professional
- Blue accent stickers

**Node 2 (His):**
- Let him decorate
- Green theme
- Maybe add "Builder: [His Name]" label

**Node 3 (Sister):**
- Yellow theme
- Her choice of stickers
- Her name on it

**Node 4:**
- Purple theme
- Leave it more neutral/mysterious

**Assembly tips:**
- Use double-sided foam tape for battery
- Hot glue for screen bezel
- Velcro for components you might need to access

#### Part 4: Final Testing & Charging (30 minutes)

**Complete system test:**
1. All 4 nodes powered
2. Send messages to each node individually
3. Send a group broadcast
4. Test range (spread out around house)
5. Verify battery levels

**Charge overnight:**
- All 4 devices on chargers
- Test that charging indicators work
- Full charge by morning = ready for wrapping

---

## 🎄 CHRISTMAS MORNING DEPLOYMENT

### The Setup:

**Under the tree:**
- Four wrapped boxes
- Arranged in pyramid formation
- Note on top: "Don't open until everyone's together"

**The Reveal Sequence:**
1. Everyone opens at the same time
2. Power on together (you show them the button)
3. Screens light up
4. "SEARCHING FOR NETWORK..."
5. One by one, nodes appear
6. Blue dot (Dad) ✓
7. Green dot (Son) ✓
8. Yellow dot (Daughter) ✓
9. Purple dot (?) ✓
10. Lines connect them
11. **"TETRAHEDRON COMPLETE"**
12. All LEDs flash in sync

**First family message:**
You send: "[DAD→ALL] Merry Christmas! I love you all. ▲"

---

## 🛠️ TROUBLESHOOTING GUIDE

### Problem: Device won't turn on
**Check:**
- Battery plugged in?
- Battery charged?
- Power switch in ON position?

**Test:**
- Plug in USB cable - does it work?
- Check battery voltage with multimeter (should be 3.7-4.2V)

### Problem: Screen stays black
**Check:**
- Screen header soldered correctly?
- Pins not bent?
- Screen's backlight connector plugged in?

**Test:**
- Shine flashlight at screen - can you see faint image?
- Re-upload firmware with Serial Monitor open - any errors?

### Problem: LEDs don't light up
**Check:**
- Data wire soldered to correct pin (Pin 5)?
- Power and ground connected?
- LED strip orientation (arrows point AWAY from controller)?

**Test:**
- Check continuity with multimeter
- Try different LED_COUNT in code

### Problem: Radio won't connect
**Check:**
- Antenna screwed in tight?
- Both devices have matching firmware?
- Both devices set to same frequency (915 MHz)?

**Test:**
- Check Serial Monitor for LoRa init success message
- Try increasing TX power
- Move devices closer (start at 3 feet)

### Problem: Short battery life
**Possible causes:**
- LEDs too bright (reduce brightness in code)
- Screen brightness too high
- Sending messages too frequently (heartbeat every 5 sec is good)

**Solutions:**
- Adjust strip.setBrightness(50) to lower value
- Add sleep mode when idle
- Consider bigger battery

### Problem: Messages aren't received
**Check:**
- Are devices on the same network (same firmware version)?
- Is RSSI below -120 dBm? (too far apart)
- Are there obstacles (metal, concrete)?

**Test:**
- Send from 5 feet away
- Check Serial Monitor for actual RSSI values
- Try different locations

---

## 📚 TEACHING MOMENTS

### When Something Goes Wrong:

**DON'T SAY:**
- "You broke it"
- "I told you to be careful"
- "This is too complicated for you"

**DO SAY:**
- "Interesting! Let's figure out what happened"
- "Even NASA engineers debug stuff all day"
- "This is a learning moment - what do you think we should check first?"

### Building Frustration Tolerance:

If he's getting frustrated:
1. **Take a break** - Get snacks, go outside, play for 10 minutes
2. **Celebrate what's working** - "Look how much you've already done!"
3. **Break it down** - "Let's just solve this ONE little part"
4. **Share your own failures** - "When I was learning, I once..."

### The Growth Mindset Messages:

Sprinkle these throughout:
- "You're getting better at soldering each time"
- "That's a great question - that shows you're thinking like an engineer"
- "Making mistakes is how we learn what NOT to do next time"
- "I'm proud of how you didn't give up"

---

## 🎯 THE REAL GOAL

Yes, you're building communication devices.

But you're really building:
- **Confidence** - "I can figure hard things out"
- **Persistence** - "I don't quit when it's difficult"
- **Father-son bond** - "Dad and I built this together"
- **Self-reliance** - "I made this with my own hands"

**The tetrahedron is just the excuse.**

The real project is showing him: **"When things change, we adapt and build something new that still works."**

---

## 📝 FINAL CHECKLIST

### Before Sunday #1:
- [ ] All parts arrived and inventoried
- [ ] Arduino IDE installed and tested
- [ ] Libraries installed
- [ ] Workspace cleared
- [ ] Coffee made ☕

### Before Sunday #2:
- [ ] Soldering iron tested
- [ ] Ventilation set up
- [ ] Safety glasses ready
- [ ] Practice joints done
- [ ] First aid kit nearby

### Before Sunday #3:
- [ ] Your device (Node 1) fully built and tested
- [ ] Both batteries charged
- [ ] Range testing route planned
- [ ] Backup firmware ready

### Before Sunday #4:
- [ ] Cases drilled and ready
- [ ] Hot glue gun working
- [ ] All decorations gathered
- [ ] Sister knows she's participating
- [ ] Node 4 recipient decided

### Before Christmas:
- [ ] All 4 devices fully charged
- [ ] Wrapped individually
- [ ] Pyramid arrangement under tree
- [ ] Camera ready for the moment
- [ ] You're ready to be present and watch their faces

---

**You've got this, Dad.**

**Build something they'll remember forever.**

▲
