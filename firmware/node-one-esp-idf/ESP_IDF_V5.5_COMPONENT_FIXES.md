# ESP-IDF v5.5 Component Fixes
**Node One Firmware - Component Migration Guide**

## Components Removed (Now Part of `driver`)

In ESP-IDF v5.5, several components have been merged into the `driver` component:

### ✅ Fixed Components

1. **`ledc`** → Part of `driver`
   - **Location**: `components/display/CMakeLists.txt`
   - **Status**: ✅ Removed
   - **Usage**: Still available via `#include "driver/ledc.h"`

2. **`i2c_master`** → Part of `driver`
   - **Location**: `components/audio_engine/CMakeLists.txt`
   - **Status**: ✅ Removed
   - **Usage**: Still available via `#include "driver/i2c_master.h"`

3. **`i2s`** → Part of `driver`
   - **Location**: `components/audio_engine/CMakeLists.txt`
   - **Status**: ✅ Removed
   - **Usage**: Still available via `#include "driver/i2s_std.h"`

4. **`spi_master`** → Part of `driver`
   - **Location**: `components/lora_radio/CMakeLists.txt`
   - **Status**: ✅ Removed
   - **Usage**: Still available via `#include "driver/spi_master.h"`

4. **`spiram`** → Built into heap system
   - **Locations**: `main/CMakeLists.txt`, `components/display/CMakeLists.txt`, `components/audio_engine/CMakeLists.txt`
   - **Status**: ✅ Removed
   - **Usage**: Still available via `heap_caps_malloc()` with `MALLOC_CAP_SPIRAM`

## Component Requirements Summary

### Components That Need `driver`
- `audio_engine` - Uses I2C and I2S (both in `driver`)
- `display` - Uses LEDC (in `driver`)
- `bsp` - Uses I2C (in `driver`)
- `button_input` - Uses I2C (in `driver`)

All these components already have `driver` in their `PRIV_REQUIRES`, so the functionality is still available.

## Migration Notes

### Before (ESP-IDF v5.4 and earlier)
```cmake
PRIV_REQUIRES
    driver
    i2c_master
    i2s
    ledc
    spiram
```

### After (ESP-IDF v5.5)
```cmake
PRIV_REQUIRES
    driver
    # i2c_master - Part of driver component
    # i2s - Part of driver component
    # ledc - Part of driver component
    # spiram - Built into heap system
```

## API Usage (Unchanged)

All APIs remain the same:
- `#include "driver/i2c_master.h"` ✅
- `#include "driver/i2s_std.h"` ✅
- `#include "driver/ledc.h"` ✅
- `heap_caps_malloc(size, MALLOC_CAP_SPIRAM)` ✅

## The Mesh Holds. 🔺

---

*Migration completed: February 14, 2026*
*ESP-IDF Version: v5.5.1*
