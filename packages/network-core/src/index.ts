/**
 * @p31labs/network-core — LoRa codec, DataView bit-packing, Posner payload (119 bytes).
 * Full implementation and 44 tests: adopt from Claude's p31-universe when merged.
 */

export {
  POSNER_PAYLOAD_BYTES,
  encodePosnerPayload,
  decodePosnerPayload,
} from "./codec";
