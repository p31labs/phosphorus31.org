import { describe, it, expect } from "vitest";
import {
  POSNER_PAYLOAD_BYTES,
  encodePosnerPayload,
  decodePosnerPayload,
} from "../src/codec";

describe("network-core codec", () => {
  it("exposes Posner payload size as 119 bytes", () => {
    expect(POSNER_PAYLOAD_BYTES).toBe(119);
  });

  it("encodePosnerPayload reserves 119 bytes and returns next offset", () => {
    const buf = new ArrayBuffer(256);
    const view = new DataView(buf);
    const next = encodePosnerPayload(view, 0, {});
    expect(next).toBe(119);
  });

  it("decodePosnerPayload reads 119 bytes and returns bytesRead", () => {
    const buf = new ArrayBuffer(256);
    const view = new DataView(buf);
    const { bytesRead, payload } = decodePosnerPayload(view, 0);
    expect(bytesRead).toBe(119);
    expect(payload).toEqual({});
  });

  it("throws when buffer too small for encode", () => {
    const buf = new ArrayBuffer(50);
    const view = new DataView(buf);
    expect(() => encodePosnerPayload(view, 0, {})).toThrow(RangeError);
  });

  it("throws when buffer too small for decode", () => {
    const buf = new ArrayBuffer(50);
    const view = new DataView(buf);
    expect(() => decodePosnerPayload(view, 0)).toThrow(RangeError);
  });
});
