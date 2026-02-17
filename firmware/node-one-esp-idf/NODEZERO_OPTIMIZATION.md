# P31 NodeZero (NODE ONE) Firmware Optimizations

**Updated:** 2026-02-16 · Applied in `firmware/node-one-esp-idf`.

Optimizations follow the Node One firmware rules: memory-constrained ESP32-S3, non-blocking code, watchdog awareness, and 30%+ free heap for WiFi/LoRa stability.

---

## 1. Memory (RAM)

- **Stored audio cap:** Incoming mesh audio is capped at `MAX_STORED_AUDIO_SAMPLES` (8192 = 0.5 s at 16 kHz) per message. Reduces peak RAM from ~96 KB to ~16 KB per stored message.
- **Heap guard:** Before allocating for an audio message, firmware checks `esp_get_free_heap_size() >= MIN_FREE_HEAP_FOR_AUDIO` (32 KB). If below, the store is skipped and a warning is logged so WiFi/LoRa stay stable.
- **Message queue leak fix:** When the queue is full and the oldest message is dropped, the last slot’s `audio_data` is freed before overwriting, avoiding a leak after the shift.

## 2. Non-blocking / Responsiveness

- **Splash:** Splash delay reduced from 2 s to 500 ms so the device feels responsive after boot.
- **Main loop:** Existing logic remains non-blocking (e.g. `display_update()`, periodic status updates). Optional task watchdog feed added in the main loop when `CONFIG_ESP_TASK_WDT` is set.

## 3. Energy Recovery Bug Fix

- **Spoon recovery:** A single `static uint32_t last_energy_recovery` is used for the 5-minute energy recovery. The inner `static` that shadowed the outer variable was removed so recovery runs correctly.

## 4. Mesh Protocol (Whale Channel)

- **Lazy duplicate cleanup:** Duplicate table cleanup (entries older than 60 s) runs every `DUPLICATE_CLEANUP_INTERVAL` (16) packets instead of every packet, cutting CPU work in dense traffic.

## 5. Config Additions (`node_one_config.h`)

- `MAX_STORED_AUDIO_SAMPLES` — 8192 (0.5 s at 16 kHz).
- `MIN_FREE_HEAP_FOR_AUDIO` — 32768 (32 KB) minimum free heap before skipping audio store.

---

## Checklist (from firmware rules)

- [x] Monitor free heap before large allocations.
- [x] Keep 30%+ free heap for WiFi/LoRa (skip store when below 32 KB).
- [x] Non-blocking: no new long `delay()`; splash shortened.
- [x] Watchdog: feed in main loop when task WDT enabled.
- [x] Message queue: no leak on “queue full, drop oldest”.

---

*The mesh holds. 🔺*
