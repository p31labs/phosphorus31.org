# 4-WEEK BUILD SCHEDULE
## December 2024: Tetrahedron Protocol Construction

**Networks:** Alpha (your family) + Beta (friend's family)  
**Total Nodes:** 8 (4 per network)  
**Build Sessions:** 4 Sundays × 2-4 hours each  
**Deployment:** Christmas Day (Dec 25)

---

## 📅 SUNDAY #1: December 8 - "FIRST CONTACT"

**Duration:** 2-3 hours  
**Location:** Your workspace  
**Participants:** You + your kids (Node 1 & 2 minimum)

### **Objectives:**
- [ ] Unbox and inventory all parts
- [ ] Learn Arduino IDE basics
- [ ] Upload first firmware (hello_world.ino)
- [ ] See name displayed on screen
- [ ] Watch LEDs animate
- [ ] **Success metric:** Working display + LEDs on at least 2 nodes

---

### **Session Plan:**

**Part 1: The Unboxing (30 min)**

**Activity:**
- Open parts shipment together
- Let kids identify components
- Check everything against BOM
- Organize workspace

**Teaching moments:**
- "This is the brain" (ESP32)
- "This is the voice" (LoRa module)
- "These are the eyes" (LEDs)
- "This is the screen" (TFT)

**What kids do:**
- Handle components (gently)
- Sort parts into bins
- Take inventory photos
- Start build journal

---

**Part 2: The First Stack (45 min)**

**Activity:**
- Stack Feather + LoRa wing (no soldering yet)
- Connect battery
- Power on
- See if it boots

**Teaching moments:**
- "Electricity flows like water"
- "The battery is like a tank that holds energy"
- "We're building the skeleton first"

**What kids do:**
- Insert stacking headers (with supervision)
- Align the boards
- Connect battery (careful with polarity!)
- Press power button

**Safety:**
- No soldering this session
- Battery awareness (don't short the wires)
- Gentle handling

---

**Part 3: The Awakening (45 min)**

**Activity:**
- Connect to computer via USB
- Open Arduino IDE
- Upload hello_world.ino firmware
- Watch screen light up with their name
- See LED animations

**Teaching moments:**
- "Programming is giving instructions to the brain"
- "The computer talks to the device through this cable"
- "Code is just words that tell it what to do"

**What kids do:**
- Click "Upload" button (supervised)
- Watch progress bar
- Celebrate when it works!
- Choose LED animation mode

**Troubleshooting prep:**
- USB driver may need install
- Port selection confusion common
- First upload often slow

---

**Part 4: Experimentation (30 min)**

**Activity:**
- Change their name in the code
- Upload again
- See new name on screen
- Try different LED patterns
- Take photos/videos

**Teaching moments:**
- "You can change how this works anytime"
- "Making mistakes is how we learn"
- "This is YOUR device"

**Documentation:**
- Photos of first boot
- Video of LED animations
- Kids' reactions
- Any problems encountered

---

### **Homework (Optional):**

**For kids:**
- Draw what you want your device case to look like
- Think of messages you want to send
- Name your device

**For you:**
- Prep for soldering session
- Watch soldering tutorial videos
- Set up ventilation for next Sunday

---

### **Success Criteria:**

**Minimum:** 2 nodes boot and show display  
**Target:** All 4 nodes functional  
**Stretch:** Kids understand what each component does

**If problems:**
- Document what went wrong
- Take photos of error messages
- Reference troubleshooting guide
- Don't force it—better to stop and research

---

## 📅 SUNDAY #2: December 15 - "FORGING THE CONNECTIONS"

**Duration:** 3-4 hours  
**Location:** Your workspace (ventilated)  
**Participants:** You + kids

### **Objectives:**
- [ ] Learn soldering basics
- [ ] Solder LED strip wires (kids' task)
- [ ] Solder screen headers (you assist)
- [ ] Test complete circuit
- [ ] **Success metric:** Fully assembled Node 1 & 2

---

### **Session Plan:**

**Part 1: Soldering Safety Briefing (30 min)**

**Activity:**
- Safety equipment demo
- Hot zone rules
- Practice soldering on scrap wire
- Test solder sucker (for mistakes)

**Teaching moments:**
- "This gets as hot as an oven"
- "We respect tools that can hurt us"
- "Taking our time keeps us safe"

**Safety gear:**
- Eye protection MANDATORY
- Ventilation running
- Fire extinguisher nearby
- First aid kit ready

**Kid-appropriate tasks:**
- Simple wire connections
- Pre-tinning wires
- Helping hands operation
- You handle complex joints

---

**Part 2: LED Strip Soldering (90 min)**

**Activity:**
- Cut LED strips (20 LEDs each)
- Strip wire ends
- Kids solder wires to strip pads (supervised)
- Test LEDs before moving on

**Teaching moments:**
- "Heat the metal, not the solder"
- "Count to 3, then add solder"
- "A good joint looks like a shiny volcano"

**What kids do:**
- Apply flux to pads
- Position wire with helping hands
- Hold iron (with supervision)
- Add solder
- Inspect joint

**What you do:**
- Monitor closely
- Guide their hands
- Check every joint
- Fix cold joints
- Celebrate successes

---

**Part 3: Screen Assembly (60 min)**

**Activity:**
- Solder headers to TFT shield
- Stack TFT on Feather assembly
- Connect LED strip
- Test full stack

**Teaching moments:**
- "These pins carry information"
- "Each pin has a job"
- "Everything needs to line up perfectly"

**Division of labor:**
- You: Precision soldering (screen headers)
- Kids: Testing, documentation, quality control
- Together: Assembly and testing

---

**Part 4: The First Complete Node (30 min)**

**Activity:**
- Upload firmware to Node 1
- Mount in temporary case
- Full power-on test
- LED strip working
- Screen displaying
- Ready for radio next week

**Celebration:**
- Photos of completed node
- Kids explain what they built
- Update build journal
- Plan next session

---

### **Success Criteria:**

**Minimum:** Node 1 fully assembled and functional  
**Target:** Nodes 1 & 2 complete  
**Stretch:** Started Nodes 3 & 4

**Common problems:**
- Cold solder joints (reheat and add flux)
- Incorrect polarity (LEDs won't light)
- Bridged connections (use solder sucker)

---

## 📅 SUNDAY #3: December 22 - "THE VOICE AWAKENS"

**Duration:** 2-3 hours  
**Location:** Your workspace  
**Participants:** You + kids + friend's family (optional parallel build)

### **Objectives:**
- [ ] Install LoRa modules
- [ ] Upload walkie_talkie.ino firmware
- [ ] Send first radio message
- [ ] Range testing
- [ ] **Success metric:** 2-node network functional

---

### **Session Plan:**

**Part 1: Radio Theory (20 min)**

**Activity:**
- Explain radio waves
- Antenna importance
- "Whale vs Mouse" analogy
- Frequency awareness

**Teaching moments:**
- "This sends invisible light"
- "The antenna makes the light stronger"
- "We can talk miles away with no internet"

**What kids learn:**
- LoRa = long range, low speed
- WiFi = short range, high speed
- Trade-offs in engineering

---

**Part 2: Radio Installation (45 min)**

**Activity:**
- Verify LoRa wing orientation
- Attach antenna (critical!)
- Stack LoRa on Feather
- Upload walkie_talkie.ino

**Teaching moments:**
- "The antenna is like the device's ears"
- "Without it, the device is deaf"
- "Never power on without antenna attached"

**Safety:**
- Check antenna connection 3 times
- Never transmit without antenna
- Verify correct frequency (915MHz USA)

---

**Part 3: First Contact (30 min)**

**Activity:**
- Node 1 sends message
- Node 2 receives
- Kids see message appear
- RSSI display shows signal strength
- Celebrate first successful transmission

**Teaching moments:**
- "Your voice just traveled through walls"
- "No internet, no cell towers, just us"
- "This is how astronauts talk to mission control"

**Documentation:**
- Screenshot of first message
- RSSI readings
- Kids' reactions
- Range testing data

---

**Part 4: Range Experiments (45 min)**

**Activity:**
- Start 5 feet apart (very strong signal)
- Move to opposite ends of house
- Try from yard to house
- Test through walls
- Document RSSI at each distance

**Teaching moments:**
- "Signals get weaker with distance"
- "Walls make them even weaker"
- "But we can still talk pretty far"

**Science experiment:**
- Measure distance
- Record RSSI
- Plot on graph
- Predict maximum range

---

### **Friend Family Integration (if applicable):**

**If building simultaneously:**
- Video call between houses
- Send messages between families
- Compare RSSI readings
- Share troubleshooting tips
- Build excitement for final network

---

### **Success Criteria:**

**Minimum:** 2 nodes exchanging messages reliably  
**Target:** 4 nodes in your network working  
**Stretch:** Communication with friend's network (8 nodes total)

---

## 📅 SUNDAY #4: December 22 (continued into evening)

### "TETRAHEDRON FORMATION"

**Duration:** 3-4 hours  
**Location:** Both your place and friend's place  
**Participants:** Both families

### **Objectives:**
- [ ] Complete all 8 nodes
- [ ] Upload tetrahedron.ino to all devices
- [ ] Test full mesh network
- [ ] Install in cases
- [ ] Charge overnight
- [ ] **Success metric:** Both tetrahedrons ready for Christmas deployment

---

### **Session Plan:**

**Part 1: Final Assembly (2 hours)**

**Activity:**
- Complete Nodes 3, 4, 7, 8
- Test each individually
- Install buttons (if adding)
- Mount in cases
- Label each node

**Teaching moments:**
- "We're building two tetrahedrons"
- "Each one is a complete network"
- "When all 4 corners connect, the structure is whole"

---

**Part 2: Firmware Upload (30 min)**

**Activity:**
- Upload tetrahedron.ino to all 8 nodes
- Configure Node IDs (1-4 for each network)
- Set network parameters
- Verify firmware versions match

**Critical:**
- All nodes must have same firmware version
- SECRET_KEY must match within each network
- Node IDs must be unique within network

---

**Part 3: Network Formation Test (45 min)**

**Activity:**
- Power on all 4 nodes (your network)
- Watch "SEARCHING FOR NETWORK..." message
- Wait for nodes to discover each other
- See "TETRAHEDRON COMPLETE" animation
- Test message sending to each node

**Teaching moments:**
- "They're finding each other"
- "No one is in charge—it's equal"
- "This is what 'mesh' means"

**Documentation:**
- Video of network formation
- Screenshot of complete tetrahedron
- Kids explaining what they built

---

**Part 4: The Resilience Test (30 min)**

**Activity:**
- All 4 nodes online
- Turn off Node 4
- Watch network adapt
- "▽ Structure adapting..."
- Messages still work through remaining 3
- **This is the lesson**

**Teaching moments:**
- "See? One corner went dark..."
- "But we can still communicate"
- "The triangle remains"
- "This is resilience"

**Does the kid GET it?**
- Watch their face
- Listen to their questions
- Document their understanding
- This is your validation data

---

### **Final Prep:**

**Before Christmas:**
- [ ] All nodes charged fully
- [ ] Cases completed/decorated
- [ ] Wrapping planned
- [ ] Deployment location chosen
- [ ] Camera ready for Christmas morning

---

## 🎄 DECEMBER 25: CHRISTMAS DEPLOYMENT

**Timeline:** Morning, before other presents  
**Duration:** 30-60 minutes  
**Participants:** Your family + friend's family (video call?)

---

### **The Deployment:**

**Setup:**
- 4 wrapped boxes under tree
- Arranged in pyramid/tetrahedron shape
- Each box labeled with node color

**Sequence:**
1. Kids open boxes simultaneously
2. Find their devices inside
3. Power on together (countdown)
4. Screens show "SEARCHING FOR NETWORK..."
5. Nodes discover each other one by one:
   - "● Blue (Dad) - ONLINE"
   - "● Green (Son) - ONLINE"
   - "● Yellow (Daughter) - ONLINE"
   - "● Purple (Fourth) - ONLINE"
6. "TETRAHEDRON COMPLETE" animation
7. Synchronized LED pulse
8. First message sent: "Merry Christmas. The network is complete."

---

### **Documentation:**

**Must capture:**
- Unboxing reactions
- First power-on
- Network formation moment
- "TETRAHEDRON COMPLETE" screen
- First message sent
- Kids' understanding of what they built

**This is your proof of concept.**

---

### **The Lesson Delivered:**

**What you say (or don't say):**

"You just built something that teaches an important lesson.

When all four corners are connected, the structure is complete. That's our family right now.

But structures can change. Life changes. Sometimes people can't be there. Sometimes corners go dark.

And when that happens... watch this."

[Turn off Node 4]

"See? The network adapted. Three points still make a triangle. Messages still go through. The structure still works.

It's different. But it's still whole.

That's resilience.

That's what you built."

---

## 📊 POST-BUILD ASSESSMENT

**After Christmas, document:**

### **Technical Metrics:**
- How many nodes fully functional? (Target: 8/8)
- Network formation time? (Target: <60 seconds)
- Message success rate? (Target: >95%)
- Battery life achieved? (Target: 6-8 hours)
- Build time per node? (Target: <6 hours)

### **Educational Metrics:**
- Did kids stay engaged? (Y/N)
- Did they understand each component? (Y/N)
- Could they explain what they built? (Y/N)
- Did the resilience lesson land? (Y/N)
- Would they recommend to other families? (Y/N)

### **Emotional Impact:**
- How did Node 1 (dad) feel during build?
- How did Node 2 (son) respond to the lesson?
- How did Node 3 (daughter) engage?
- What happened with Node 4?
- Did the geometry teach the lesson?

---

## ✅ FINAL SUCCESS CRITERIA

**The build was successful if:**

- ✅ At least 6 of 8 nodes fully operational
- ✅ Both networks formed successfully
- ✅ Kids engaged positively throughout
- ✅ At least one kid "got" the resilience lesson
- ✅ Technical problems were surmountable
- ✅ You remained mentally stable
- ✅ Documentation is complete

**The build revealed problems if:**

- ❌ Multiple nodes failed permanently
- ❌ Kids were frustrated/disengaged
- ❌ Lesson didn't translate at all
- ❌ Your mental state deteriorated
- ❌ Technical complexity was overwhelming
- ❌ Families wish they hadn't done it

---

## 📁 DELIVERABLES FOR VALIDATION

**By December 26, compile:**

1. **Photo/Video Archive**
   - All build sessions
   - First power-on
   - Network formation
   - Christmas morning

2. **Build Log**
   - Time spent per session
   - Problems encountered
   - Solutions implemented
   - Kids' questions/comments

3. **Technical Documentation**
   - Final firmware versions
   - Network configurations
   - RSSI data from testing
   - Battery performance

4. **Assessment Report** (1-2 pages)
   - Did the framework work?
   - Did the geometry teach the lesson?
   - Would it transfer to other families?
   - What needs refinement?
   - Recommendation: Scale or stop?

---

**This is your 4-week validation experiment.**

**Build carefully.**  
**Document everything.**  
**Trust the process.**

**In 4 weeks, you'll know if this is real.**

▲
