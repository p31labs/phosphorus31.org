import { useShelterStore } from "@/stores/shelter-store";
import type { Quest } from "@p31labs/game-engine";

function QuestCard({ quest }: { quest: Quest }) {
  const { objective } = quest;
  const done = objective.current >= objective.count;
  const pct = Math.min(100, (objective.current / objective.count) * 100);

  return (
    <div
      className={`rounded-lg border p-3 transition-colors ${
        done
          ? "border-phosphor/30 bg-phosphor/[0.04]"
          : "border-white/[0.06] bg-void-1"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className={`text-xs font-bold tracking-wide ${done ? "text-phosphor" : "text-txt"}`}>
            {done ? "✓ " : ""}{quest.title}
          </h3>
          <p className="text-[10px] text-txt-dim mt-0.5">{quest.description}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-[9px] text-violet font-bold">+{quest.xpReward} XP</span>
          <br />
          <span className="text-[9px] text-rose font-bold">+{quest.loveReward} 💜</span>
        </div>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${pct}%`,
            background: done ? "#39FF14" : "#8B5CF6",
          }}
        />
      </div>
      <span className="text-[9px] text-txt-muted mt-1 block">
        {objective.current}/{objective.count}
      </span>
    </div>
  );
}

export default function QuestsView() {
  const { dailyQuests, weeklyQuests } = useShelterStore();

  return (
    <div className="px-5 py-4 max-w-[600px] mx-auto w-full space-y-6">
      <section>
        <h2 className="text-[11px] font-bold tracking-[2px] text-phosphor uppercase mb-3">
          Daily Quests
        </h2>
        <div className="space-y-2">
          {dailyQuests.length === 0 ? (
            <p className="text-[10px] text-txt-muted">No quests available today.</p>
          ) : (
            dailyQuests.map((q) => <QuestCard key={q.id} quest={q} />)
          )}
        </div>
      </section>

      <section>
        <h2 className="text-[11px] font-bold tracking-[2px] text-amber uppercase mb-3">
          Weekly Quests
        </h2>
        <div className="space-y-2">
          {weeklyQuests.length === 0 ? (
            <p className="text-[10px] text-txt-muted">No weekly quests active.</p>
          ) : (
            weeklyQuests.map((q) => <QuestCard key={q.id} quest={q} />)
          )}
        </div>
      </section>
    </div>
  );
}
