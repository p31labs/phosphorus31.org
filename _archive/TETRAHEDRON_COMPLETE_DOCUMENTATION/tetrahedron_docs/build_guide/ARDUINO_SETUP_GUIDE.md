# Arduino IDE Setup Guide
## Get Your Computer Ready to Program the Tetrahedron

**Time Required:** 30 minutes  
**Do This:** The night BEFORE Sunday #1  
**Why:** So you're not troubleshooting software when your kid wants to build

---

## 📥 STEP 1: Download Arduino IDE

### For Windows:
1. Go to: https://www.arduino.cc/en/software
2. Click the **Windows** button (blue)
3. Choose "Windows Win 10 and newer, 64 bits"
4. Click "JUST DOWNLOAD"
5. Run the installer (arduino-ide_X.X.X_Windows_64bit.exe)
6. Follow prompts (default options are fine)

### For Mac:
1. Go to: https://www.arduino.cc/en/software
2. Click the **macOS** button (blue)
3. Choose the appropriate version for your Mac
4. Download the .dmg file
5. Open .dmg and drag Arduino IDE to Applications folder
6. First time: Right-click → Open (to bypass security)

### For Linux:
1. Go to: https://www.arduino.cc/en/software
2. Click the **Linux** button
3. Choose your architecture (usually AppImage 64 bit)
4. Download and make executable:
   ```bash
   chmod +x arduino-ide_X.X.X_Linux_64bit.AppImage
   ./arduino-ide_X.X.X_Linux_64bit.AppImage
   ```

**Version Note:** Get Arduino IDE 2.x (the new one with dark theme), not the old 1.8.x version.

---

## 🔧 STEP 2: Add ESP32 Board Support

### Why?
The Arduino IDE doesn't know about ESP32 chips by default. We need to teach it.

### How:

1. **Open Arduino IDE**
2. **Add ESP32 URL:**
   - Click: `File → Preferences`
   - Find: "Additional boards manager URLs"
   - Paste this URL:
     ```
     https://espressif.github.io/arduino-esp32/package_esp32_index.json
     ```
   - Click: OK

3. **Install ESP32 Board Package:**
   - Click: `Tools → Board → Boards Manager`
   - In the search box, type: `esp32`
   - Find: "esp32 by Espressif Systems"
   - Click: INSTALL (this takes 2-3 minutes)
   - Wait for "INSTALLED" to appear
   - Close Boards Manager

4. **Select Your Board:**
   - Click: `Tools → Board → esp32`
   - Scroll down to: "Adafruit Feather ESP32-S3 No PSRAM"
   - Click it

**Checkpoint:** The bottom of your Arduino IDE should now say "Adafruit Feather ESP32-S3 No PSRAM"

---

## 📚 STEP 3: Install Required Libraries

### What are libraries?
Pre-written code that makes your life easier. Instead of writing screen control from scratch, we use a library that already knows how.

### Installation Process:

1. **Open Library Manager:**
   - Click: `Tools → Manage Libraries`
   - Or: `Sketch → Include Library → Manage Libraries`

2. **Install these libraries ONE BY ONE:**

   Type in search box → Click INSTALL on the right one:

   **For the Screen:**
   ```
   Search: "Adafruit GFX"
   Install: "Adafruit GFX Library" by Adafruit
   Version: Latest
   ```

   ```
   Search: "Adafruit ILI9341"
   Install: "Adafruit ILI9341" by Adafruit
   Version: Latest
   (It may ask to install dependencies - click INSTALL ALL)
   ```

   **For the LEDs:**
   ```
   Search: "Adafruit NeoPixel"
   Install: "Adafruit NeoPixel" by Adafruit
   Version: Latest
   ```

   **For the Radio:**
   ```
   Search: "RadioHead"
   Install: "RadioHead" by Mike McCauley
   Version: Latest
   ```

   **Supporting Libraries:**
   ```
   Search: "Adafruit BusIO"
   Install: "Adafruit BusIO" by Adafruit
   Version: Latest
   ```

3. **Close Library Manager**

**Checkpoint:** All libraries should show "INSTALLED" in green next to them.

---

## 🔌 STEP 4: Test USB Connection

### Connect Your Feather:

1. **Plug in USB-C cable** to Feather board
2. **Plug other end** into your computer
3. **Wait 10 seconds** for drivers to install
4. **Look for LED** on Feather - should show it's powered

### Select the Port:

1. **In Arduino IDE, click:** `Tools → Port`
2. **Look for something like:**
   - **Windows:** COM3, COM4, COM5, etc.
   - **Mac:** /dev/cu.usbserial-XXXXX
   - **Linux:** /dev/ttyUSB0 or /dev/ttyACM0

3. **Which one is it?**
   - Unplug the Feather
   - Check the Port menu again - one disappeared
   - Plug it back in
   - The one that reappears is YOUR board
   - Click on it to select it

**Checkpoint:** Bottom of Arduino IDE should show the selected port.

---

## ✅ STEP 5: Upload Test Sketch

Let's make sure everything works!

### The Blink Test:

1. **Open Example Sketch:**
   - Click: `File → Examples → 01.Basics → Blink`
   - A new window opens with code

2. **Upload it:**
   - Click the **→ (arrow)** button at top left
   - Or: `Sketch → Upload`
   - Watch the status bar at bottom

3. **What you'll see:**
   ```
   Compiling sketch...
   [Progress bar]
   Uploading...
   [More progress]
   Done uploading.
   ```

4. **Success?**
   - The little red LED on your Feather should blink!
   - On for 1 second, off for 1 second, repeat
   - **This means EVERYTHING is working!**

**If it doesn't work:**
- Check the USB cable (try a different one)
- Check the Port is selected correctly
- Try pressing the RESET button on Feather
- See troubleshooting section below

---

## 🎨 STEP 6: Configure TFT_eSPI (For Screen)

**UPDATE:** We're using Adafruit_ILI9341, so this step isn't needed for our project. Skip to Step 7.

---

## 📂 STEP 7: Organize Your Files

### Create Project Folder:

**Windows:**
```
C:\Users\YourName\Documents\Arduino\Tetrahedron\
```

**Mac:**
```
/Users/YourName/Documents/Arduino/Tetrahedron/
```

**Linux:**
```
/home/yourname/Arduino/Tetrahedron/
```

### Inside, create subfolders:
```
Tetrahedron/
├── hello_world/
├── walkie_talkie/
├── tetrahedron/
└── reference/
```

### Download firmware files:
- Extract the TETRAHEDRON_PROTOCOL_COMPLETE.tar.gz
- Copy the firmware folders here
- You're ready to go!

---

## 🔍 TROUBLESHOOTING ARDUINO IDE

### Problem: Board not showing up in Tools → Board menu

**Solution:**
1. Close Arduino IDE completely
2. Reopen it
3. Go to Boards Manager again
4. Verify ESP32 package says "INSTALLED"
5. If not, click INSTALL again

---

### Problem: Port not showing up / "No ports discovered"

**Windows:**
- Install CP210x USB driver from Silicon Labs website
- Or CH340 driver if that's your USB chip
- Device Manager → Ports → Should show USB Serial Port

**Mac:**
- Usually works automatically
- If not, install CP210x driver for Mac
- Check System Preferences → Security if driver blocked

**Linux:**
- Add yourself to dialout group:
  ```bash
  sudo usermod -a -G dialout $USER
  ```
- Log out and back in
- Check permissions: `ls -l /dev/ttyUSB0`

---

### Problem: Upload fails with "Failed to connect"

**Try these in order:**

1. **Press and hold BOOT button** while clicking Upload
2. **Press RESET** right before uploading
3. **Try slower upload speed:**
   - `Tools → Upload Speed → 115200`
   - (Default is 921600 which can be flaky)
4. **Different USB cable:**
   - Some cables are charge-only, not data
   - Use the cable that came with the Feather
5. **Different USB port:**
   - Try a different port on your computer
   - USB 2.0 sometimes works better than USB 3.0

---

### Problem: Compilation errors about missing files

**Check these:**

1. **Library installed?**
   - `Tools → Manage Libraries`
   - Search for the library mentioned in error
   - Make sure it says INSTALLED

2. **Correct board selected?**
   - `Tools → Board` should show "Adafruit Feather ESP32-S3"
   - Not "ESP32 Dev Module" or other variants

3. **Code in correct folder?**
   - The .ino file should be in a folder with THE SAME NAME
   - Example: `hello_world.ino` must be in `hello_world/` folder

---

### Problem: Libraries conflict / duplicate definitions

**Solution:**
```
1. Close Arduino IDE
2. Navigate to your libraries folder:
   - Windows: Documents\Arduino\libraries\
   - Mac: ~/Documents/Arduino/libraries/
   - Linux: ~/Arduino/libraries/
3. Delete any duplicate or old versions of libraries
4. Reopen Arduino IDE
5. Reinstall libraries from Library Manager
```

---

## 🎯 VERIFY YOUR SETUP

Before Sunday #1, make sure:

- [ ] Arduino IDE opens without errors
- [ ] ESP32 board package installed
- [ ] All required libraries installed
- [ ] Feather board connects and shows up in Ports
- [ ] Blink sketch uploads and runs successfully
- [ ] Serial Monitor works (Tools → Serial Monitor, 115200 baud)

**If all checkboxes are checked, you're READY!** 🎉

---

## 🚀 QUICK REFERENCE CARD

**For Sunday #1, you'll need:**

1. Open Arduino IDE
2. File → Open → hello_world.ino
3. Change `BUILDER_NAME` to his name
4. Tools → Board → Adafruit Feather ESP32-S3
5. Tools → Port → Select your Feather
6. Click Upload (→ button)
7. Wait for "Done uploading"
8. Press RESET on Feather
9. Watch the magic happen!

---

## 📞 GETTING HELP

**If you get stuck:**

**Adafruit Forums:**
https://forums.adafruit.com/viewforum.php?f=57
(Very friendly, very helpful)

**Arduino Forums:**
https://forum.arduino.cc/
(Huge community, search first)

**ESP32 Reddit:**
https://www.reddit.com/r/esp32/
(Fast responses, very active)

**When asking for help, include:**
- Your operating system (Windows/Mac/Linux)
- Arduino IDE version (Help → About)
- Exact error message (copy/paste)
- What you've already tried

---

## 💾 BACKUP CHECKLIST

**Save yourself future headaches:**

- [ ] Bookmark the Arduino download page
- [ ] Save the ESP32 board URL somewhere safe
- [ ] Export your current settings:
      `File → Preferences → Export`
- [ ] Keep a list of installed libraries
- [ ] Take a screenshot of working configuration

**Why?** If you need to reinstall or use a different computer, you can get back up and running in 10 minutes instead of 2 hours.

---

## 🎓 UNDERSTANDING WHAT YOU JUST INSTALLED

**For your own knowledge:**

**Arduino IDE** = The program you write code in (like Microsoft Word, but for code)

**ESP32 Board Package** = Teaches Arduino how to talk to ESP32 chips

**Libraries** = Pre-written code that handles complex tasks (like TV remotes for your electronics)

**Upload Process:**
```
Your Code (human-readable)
    ↓ [Compile]
Machine Code (ones and zeros)
    ↓ [Upload via USB]
ESP32 Flash Memory (permanent storage)
    ↓ [Run]
Your device does stuff!
```

**Serial Monitor** = A window into your device's "thoughts" - it can print debug messages back to your computer

---

**You're all set! See you Sunday!** ▲
