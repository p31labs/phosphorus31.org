import { useEffect } from "react";
import { useShelterStore, type Toast } from "@/stores/shelter-store";

const TOAST_DURATION = 3500;

const RARITY_COLORS: Record<string, string> = {
  common: "#d4d4d4",
  uncommon: "#22c55e",
  rare: "#3b82f6",
  epic: "#8B5CF6",
  legendary: "#F59E0B",
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (toast.type === "xp") {
    return (
      <div
        className="rounded-lg px-3 py-2 bg-violet/20 border border-violet/30 text-violet text-xs font-bold
          animate-[toastSlideIn_300ms_ease-out]"
      >
        +{toast.data.xp as number} XP
      </div>
    );
  }

  if (toast.type === "level") {
    return (
      <div
        className="rounded-lg px-4 py-3 bg-amber/20 border border-amber/30 text-center
          animate-[toastSlideIn_300ms_ease-out]"
      >
        <p className="text-amber text-sm font-bold">Level Up!</p>
        <p className="text-[10px] text-txt-dim mt-0.5">
          Level {toast.data.level as number} — {toast.data.title as string}
        </p>
      </div>
    );
  }

  if (toast.type === "achievement") {
    const rarityColor = RARITY_COLORS[(toast.data.rarity as string) ?? "common"];
    return (
      <div
        className="rounded-lg px-4 py-3 border animate-[toastSlideIn_300ms_ease-out]"
        style={{
          background: `${rarityColor}15`,
          borderColor: `${rarityColor}40`,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{toast.data.icon as string}</span>
          <div>
            <p className="text-xs font-bold" style={{ color: rarityColor }}>
              {toast.data.name as string}
            </p>
            <p className="text-[9px] text-txt-muted uppercase tracking-wider">
              Achievement Unlocked
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (toast.type === "quest") {
    return (
      <div
        className="rounded-lg px-4 py-3 bg-phosphor/10 border border-phosphor/30
          animate-[toastSlideIn_300ms_ease-out]"
      >
        <p className="text-phosphor text-xs font-bold">Quest Complete!</p>
        <p className="text-[10px] text-txt-dim mt-0.5">
          {toast.data.title as string} · +{toast.data.xp as number} XP · +{toast.data.love as number} 💜
        </p>
      </div>
    );
  }

  return null;
}

export default function ToastStack() {
  const { toasts, removeToast } = useShelterStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-16 right-3 z-50 flex flex-col gap-2 max-w-[280px] pointer-events-none"
      aria-live="polite"
    >
      {toasts.slice(-5).map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={() => removeToast(t.id)} />
        </div>
      ))}
    </div>
  );
}
