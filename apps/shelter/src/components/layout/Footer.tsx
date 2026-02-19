import { MARK1 } from "@p31labs/buffer-core";
import { useShelterStore } from "@/stores/shelter-store";

export default function Footer() {
  const { player } = useShelterStore();

  return (
    <footer className="flex justify-between px-4 py-1.5 border-t border-white/[0.03] text-[7px] text-white/[0.08] tracking-wider">
      <span>P31 LABS · SHELTER v2.0 · AGPL-3.0</span>
      <span>
        ON-DEVICE · ZERO RETENTION · Lv{player.level} · {player.love.balance.toFixed(0)} 💜 · H≈{MARK1.toFixed(3)}
      </span>
    </footer>
  );
}
