# buffer.gs and medical.gs — Additions for v8

Keep your existing **buffer.gs** and **medical.gs**; add the following.

---

## buffer.gs

At the **end of `bufferScan()`**, after `save(s)` and any existing `log(...)` for the scan, add:

```javascript
  // Push intercept summary to Shelter
  if (intercepted > 0 && typeof shelterPush === "function") {
    shelterPush("buffer_intercept", {
      count: intercepted,
      totalBlocked: s.blocked,
      timestamp: new Date().toISOString()
    });
    logAccommodation("buffer_intercept", null, null, null, "brain", "communication_buffer");
  }
```

(Use your actual variable name for the number of messages intercepted in that run — e.g. `intercepted` or `heldCount` — so the condition and payload match your logic.)

---

## medical.gs

Inside **`drainSpoons()`**, after you update state and call `save(s)` and **after** any safe-mode / meltdown check, add:

```javascript
  if (typeof logAccommodation === "function") {
    logAccommodation("spoon_drain", null, (s.spoons + cost).toString(), s.spoons.toString(), activity, "sensory_regulation");
  }
```

(Adjust if your local variable for “spoons before” is different; pass the before and after spoon counts so the accommodation log is accurate.)

---

After patching, run `runTests()` and confirm all green.
