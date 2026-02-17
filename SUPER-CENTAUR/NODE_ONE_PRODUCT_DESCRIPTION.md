# Node One: Technical Product Description

## Overview

Node One is a handheld assistive communication device designed for neurodivergent individuals who experience sensory overload, executive function challenges, and episodic nonverbal states. Unlike clinical AAC devices that cost $3,000–$15,000 and require stable internet connectivity, Node One operates entirely offline using LoRa mesh networking—enabling communication during power outages, in rural areas, or when cellular networks fail.

## Hardware Architecture

**Microcontroller:** ESP32-S3 dual-core processor provides Wi-Fi and Bluetooth Low Energy capabilities, though the device's primary communication pathway bypasses both in favor of LoRa mesh networking. The ESP32-S3 runs ESP-IDF v5.5 firmware written in C/C++, with 39 modular components handling everything from power management to haptic feedback.

**Communication:** LoRa (Long Range) radio operating at 915MHz implements the Meshtastic protocol, creating a peer-to-peer mesh network with no cellular or internet dependency. Messages hop between devices within range, extending communication range far beyond direct line-of-sight. This "Whale Channel" enables emergency messaging when traditional infrastructure fails—critical for users who may need to communicate "I am having a meltdown" or "I need calcium—low levels" during sensory overload episodes.

**Display:** E-ink screen provides low-power, sunlight-readable status information without blue light emission that can trigger sensory sensitivity. The display shows medication reminders, message confirmations, and system status without draining battery life.

**Haptic Feedback:** DRV2605L haptic driver generates programmable vibration patterns called "The Thick Click"—tactile feedback sequences that serve multiple functions. During sensory overload, haptic patterns can replace stimming behaviors or provide grounding sequences. Medication reminders use distinct vibration patterns that don't require visual attention. Breathing guides can be communicated through rhythmic haptic pulses, bypassing the need for screen interaction during nonverbal episodes.

**Power:** USB-C rechargeable battery targets multi-day operation through aggressive power management. The AXP2101 power management IC handles voltage regulation and sleep modes, ensuring the device remains available during extended offline periods.

## Software Ecosystem

Node One operates as the hardware layer of a three-component system:

**The Buffer** (85% complete) is a communication triage system that processes incoming messages before they reach the user. It assesses "voltage"—a 0–10 scale measuring emotional intensity, coercion patterns, urgency, and stress triggers. Messages scoring ≥6 are automatically held for review when the user has processing capacity. Messages ≥8 trigger critical alerts. The Buffer generates accommodation documentation for ADA compliance and legal evidence, detecting patterns like false authority, emotional leverage, and threats. This prevents communication overload during episodes when cognitive capacity is already depleted.

**The Scope** (70% complete) is a cognitive dashboard tracking energy levels (spoon economy), medication timing, and pattern recognition over time. It manages complex medication interactions—for example, calcium supplements and stimulants must be separated by 4 hours or absorption fails, creating cascading executive function failures. The Scope provides haptic medication reminders through Node One, with interaction warnings that prevent biochemical conflicts.

## Technical Differentiation

**Mesh-First Architecture:** While most assistive technology assumes cloud connectivity, Node One's LoRa mesh network operates independently of infrastructure. This addresses a critical gap: when an autistic adult experiences a meltdown in a grocery store, a $12,000 speech-generating device requiring Wi-Fi is useless. Node One works anywhere devices are within range, creating resilient communication networks in rural areas, during natural disasters, or in dead zones.

**Haptic-First Interaction Design:** Traditional assistive technology relies on visual menus and complex navigation hierarchies that fail during sensory overload. Node One's haptic patterns provide information and control without requiring screen interaction, making the device usable during episodes when visual processing is compromised.

**Local-First Philosophy:** All data processing occurs on-device or within the user's local network. The Buffer runs on local infrastructure (Redis, SQLite), not cloud services. This ensures privacy, eliminates vendor lock-in, and maintains functionality during internet outages. The system is designed for departure—users can export all data and operate independently of P31 Labs infrastructure.

**Multi-Condition Complexity:** Unlike single-purpose tools, Node One's ecosystem accounts for medication interactions across multiple conditions (autism, ADHD, hypoparathyroidism). The Scope tracks timing windows, interaction cascades, and biochemical conflicts that single-purpose medication apps cannot handle.

## Development Status

**Node One Hardware:** 65% complete. ESP-IDF firmware architecture is established with 39 components operational. LoRa mesh integration is in progress, with battery optimization and haptic feedback refinement remaining. Hardware abstraction layer enables development and testing without physical devices.

**The Buffer:** 85% complete and production-ready. Voltage assessment algorithms are implemented and tested. Integration with Node One for message routing is in progress.

**The Scope:** 70% complete. Core medication tracking and energy monitoring are operational. Pattern recognition and advanced analytics are in development.

## Regulatory Pathway

Node One targets Class II medical device classification (FDA 510(k)) as an assistive communication device. P31 Labs is pursuing defensive publication via Zenodo to establish prior art and prevent corporate patenting of these innovations. The Georgia Tech Tools for Life partnership, facilitated by Hunter McFeron, provides regulatory guidance and assistive technology ecosystem integration.

**License:** Apache 2.0 open-source hardware and software, ensuring freedom to operate for anyone who forks the design.

---

**Word count: 600**
