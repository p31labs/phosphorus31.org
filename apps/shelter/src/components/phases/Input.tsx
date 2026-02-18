import { useRef, useEffect } from "react";
import { useBufferStore } from "@/stores/buffer-store";
import { useSpoonStore } from "@/stores/spoon-store";
import { useKeyboard } from "@/hooks/useKeyboard";
import DeepLock from "@/components/panels/DeepLock";

interface InputProps {
  onScore: () => void;
  onBreathe: () => void;
}

export default function Input({ onScore, onBreathe }: InputProps) {
  const { input, setInput } = useBufferStore();
  const locked = useSpoonStore((s) => s.locked);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useKeyboard({
    onScore: () => { if (input.trim() && !locked) onScore(); },
  });

  useEffect(() => {
    if (!locked) textareaRef.current?.focus();
  }, [locked]);

  if (locked) return <DeepLock onBreathe={onBreathe} />;

  return (
    <div>
      <div className="text-[10px] text-white/30 mb-2.5 leading-relaxed">
        Paste a message. The Buffer scores its voltage and helps you process it safely.
      </div>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste a message here..."
        rows={7}
        className="w-full bg-white/[0.02] border border-white/[0.06] rounded-[7px] p-3.5
          text-primary text-xs leading-relaxed font-mono resize-y outline-none
          focus:border-phosphor/20 box-border"
      />
      <div className="flex justify-between items-center mt-2.5">
        <button
          onClick={onBreathe}
          className="bg-transparent border border-white/[0.06] text-white/25 rounded-[5px]
            px-3 py-1.5 text-[8px] tracking-wider cursor-pointer font-mono"
        >
          BREATHE FIRST
        </button>
        <button
          onClick={onScore}
          disabled={!input.trim()}
          className="rounded-[5px] px-5 py-2 text-[10px] font-bold tracking-[2px]
            cursor-pointer font-mono border-none disabled:cursor-default
            disabled:bg-white/[0.04] disabled:text-white/[0.12]
            enabled:bg-phosphor enabled:text-void"
        >
          SCORE ▸
        </button>
      </div>
      <div className="text-[8px] text-white/10 mt-2 text-right">Ctrl+Enter to score</div>
    </div>
  );
}
