import { useEffect, useState, useCallback } from "react";
import { SpoonTracker } from "@p31labs/buffer-core";
import { useBufferStore } from "@/stores/buffer-store";
import { useSpoonStore } from "@/stores/spoon-store";
import { useSamson } from "@/hooks/useSamson";
import { useBreathing } from "@/hooks/useBreathing";
import { hydrateStores, subscribeToPersistence } from "@/services/persistence";
import { rewriteMessage } from "@/services/ai-rewrite";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Calibrate from "@/components/phases/Calibrate";
import Input from "@/components/phases/Input";
import Scored from "@/components/phases/Scored";
import Rewritten from "@/components/phases/Rewritten";
import Original from "@/components/phases/Original";
import SamsonPanel from "@/components/panels/SamsonPanel";
import QueuePanel from "@/components/panels/QueuePanel";
import Breathe from "@/components/overlays/Breathe";

export default function App() {
  const { phase, score, input, aiResult, setPhase, scoreMessage, setAIResult, setAILoading, deferMessage, markDone } = useBufferStore();
  const { spend, recover } = useSpoonStore();
  const samson = useSamson();

  const [showSamson, setShowSamson] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const breathing = useBreathing(() => recover(0.5));

  useEffect(() => {
    hydrateStores();
    const unsub = subscribeToPersistence();
    return unsub;
  }, []);

  const handleScore = useCallback(() => {
    const result = scoreMessage();
    if (result) {
      samson.addScore(result.voltage);
      spend(SpoonTracker.readCost(result.voltage));
    }
  }, [scoreMessage, samson, spend]);

  const handleRewrite = useCallback(async () => {
    if (!score) return;
    setAILoading(true);
    spend(0.5);
    const result = await rewriteMessage(input, score, samson.aiTemp);
    setAIResult(result);
    setAILoading(false);
    if (result) setPhase("rewritten");
  }, [score, input, samson.aiTemp, spend, setAILoading, setAIResult, setPhase]);

  const handleViewOriginal = useCallback(() => {
    spend(1.5);
    setPhase("original");
  }, [spend, setPhase]);

  const handleDefer = useCallback(() => {
    deferMessage();
    samson.controller.recordDeferred();
  }, [deferMessage, samson.controller]);

  const handleDone = useCallback(() => {
    markDone();
    samson.controller.recordProcessed();
  }, [markDone, samson.controller]);

  if (phase === "calibrate") return <Calibrate />;

  return (
    <div className="min-h-dvh bg-void text-primary font-mono flex flex-col">
      <Header
        samsonH={samson.H}
        onToggleSamson={() => setShowSamson(!showSamson)}
        onToggleQueue={() => setShowQueue(!showQueue)}
      />

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

      <main className="flex-1 px-5 py-4 max-w-[600px] mx-auto w-full">
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
      </main>

      <Footer />
    </div>
  );
}
