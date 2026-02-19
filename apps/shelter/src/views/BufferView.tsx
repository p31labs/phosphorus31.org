import { useState, useCallback } from "react";
import { SpoonTracker } from "@p31labs/buffer-core";
import { useBufferStore } from "@/stores/buffer-store";
import { useSpoonStore } from "@/stores/spoon-store";
import { useSamson } from "@/hooks/useSamson";
import { useBreathing } from "@/hooks/useBreathing";
import { useGameAction } from "@/hooks/useGameAction";
import { rewriteMessage } from "@/services/ai-rewrite";

import Calibrate from "@/components/phases/Calibrate";
import Input from "@/components/phases/Input";
import Scored from "@/components/phases/Scored";
import Rewritten from "@/components/phases/Rewritten";
import Original from "@/components/phases/Original";
import SamsonPanel from "@/components/panels/SamsonPanel";
import QueuePanel from "@/components/panels/QueuePanel";
import Breathe from "@/components/overlays/Breathe";

export default function BufferView() {
  const {
    phase, score, input, aiResult,
    setPhase, scoreMessage, setAIResult, setAILoading,
    deferMessage, markDone,
  } = useBufferStore();
  const { spend, recover } = useSpoonStore();
  const samson = useSamson();
  const gameAction = useGameAction();

  const [showSamson, setShowSamson] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const breathing = useBreathing(() => recover(0.5));

  const handleScore = useCallback(() => {
    const result = scoreMessage();
    if (result) {
      samson.addScore(result.voltage);
      spend(SpoonTracker.readCost(result.voltage));
      gameAction("message_scored", { voltage: result.voltage });
    }
  }, [scoreMessage, samson, spend, gameAction]);

  const handleRewrite = useCallback(async () => {
    if (!score) return;
    setAILoading(true);
    spend(0.5);
    const result = await rewriteMessage(input, score, samson.aiTemp);
    setAIResult(result);
    setAILoading(false);
    if (result) {
      setPhase("rewritten");
      gameAction("message_rewritten");
    }
  }, [score, input, samson.aiTemp, spend, setAILoading, setAIResult, setPhase, gameAction]);

  const handleViewOriginal = useCallback(() => {
    spend(1.5);
    setPhase("original");
  }, [spend, setPhase]);

  const handleDefer = useCallback(() => {
    deferMessage();
    samson.controller.recordDeferred();
    gameAction("message_deferred", { voltage: score?.voltage });
  }, [deferMessage, samson.controller, gameAction, score]);

  const handleDone = useCallback(() => {
    markDone();
    samson.controller.recordProcessed();
  }, [markDone, samson.controller]);

  if (phase === "calibrate") {
    return (
      <div className="px-5 py-4 max-w-[600px] mx-auto w-full">
        <Calibrate />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Toggleable panels */}
      <div className="flex gap-2 px-4 pt-2">
        <button
          onClick={() => setShowSamson(!showSamson)}
          className="text-[9px] tracking-wider font-bold px-2 py-1 rounded border border-white/[0.08]
            bg-white/[0.02] text-txt-dim hover:text-phosphor transition-colors"
        >
          H:{samson.H.toFixed(2)}
        </button>
        <button
          onClick={() => setShowQueue(!showQueue)}
          className="text-[9px] tracking-wider font-bold px-2 py-1 rounded border border-white/[0.08]
            bg-white/[0.02] text-txt-dim hover:text-phosphor transition-colors"
        >
          Queue
        </button>
      </div>

      {showSamson && <SamsonPanel state={samson} />}
      {showQueue && <QueuePanel />}

      {breathing.active && (
        <Breathe
          label={breathing.label}
          progress={breathing.progress}
          cycles={breathing.cycles}
          onSkip={breathing.stop}
        />
      )}

      <div className="flex-1 px-5 py-4 max-w-[600px] mx-auto w-full">
        {phase === "input" && <Input onScore={handleScore} onBreathe={breathing.start} />}
        {phase === "scored" && (
          <Scored
            samsonTemp={samson.aiTemp}
            onRewrite={handleRewrite}
            onViewOriginal={handleViewOriginal}
            onDefer={handleDefer}
            onDone={handleDone}
          />
        )}
        {phase === "rewritten" && (
          <Rewritten
            samsonTemp={samson.aiTemp}
            onViewOriginal={handleViewOriginal}
            onDefer={handleDefer}
            onDone={handleDone}
          />
        )}
        {phase === "original" && (
          <Original
            onBack={() => setPhase(aiResult ? "rewritten" : "scored")}
            onDone={handleDone}
          />
        )}
      </div>
    </div>
  );
}
