import { MARK1 } from "@p31labs/buffer-core";

export default function Footer() {
  return (
    <footer className="flex justify-between px-4 py-1.5 border-t border-white/[0.03] text-[7px] text-white/[0.08] tracking-wider">
      <span>P31 LABS · THE BUFFER v2.0 · AGPL-3.0</span>
      <span>ON-DEVICE SCORING · ZERO RETENTION · H≈{MARK1.toFixed(3)}</span>
    </footer>
  );
}
