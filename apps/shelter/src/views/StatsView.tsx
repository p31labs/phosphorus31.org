import { useShelterStore } from "@/stores/shelter-store";
import { useSpoonStore } from "@/stores/spoon-store";
import { levelProgress, xpToNextLevel, ACHIEVEMENTS } from "@p31labs/game-engine";
import SpoonGauge from "@/components/shared/SpoonGauge";

function StatRow({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-white/[0.04]">
      <span className="text-[10px] text-txt-dim uppercase tracking-wider">{label}</span>
      <span className="text-xs font-bold font-mono" style={{ color: color ?? "#e8e8f0" }}>
        {value}
      </span>
    </div>
  );
}

export default function StatsView() {
  const { player } = useShelterStore();
  const { tier } = useSpoonStore();
  const xpPct = levelProgress(player);
  const xpNeeded = xpToNextLevel(player);
  const earnedAchievements = ACHIEVEMENTS.filter((a) => player.achievements.includes(a.id));

  return (
    <div className="px-5 py-4 max-w-[600px] mx-auto w-full space-y-6">
      {/* Energy Gauge */}
      <section>
        <SpoonGauge />
      </section>

      {/* Level & XP */}
      <section className="rounded-lg border border-white/[0.06] bg-void-1 p-4 space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] font-bold tracking-[2px] text-violet uppercase">
            {player.title}
          </span>
          <span className="text-xs font-mono text-txt-dim">Level {player.level}</span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
          <div
            className="h-full rounded-full bg-violet transition-all duration-500"
            style={{ width: `${xpPct}%` }}
          />
        </div>
        <span className="text-[9px] text-txt-muted">
          {player.xp} XP · {xpNeeded} to next level
        </span>
      </section>

      {/* Key Stats */}
      <section className="rounded-lg border border-white/[0.06] bg-void-1 p-4">
        <StatRow label="Total XP Earned" value={player.totalXpEarned.toLocaleString()} color="#8B5CF6" />
        <StatRow label="Messages Scored" value={player.messagesScored} />
        <StatRow label="Quests Completed" value={player.questsCompleted} />
        <StatRow label="L.O.V.E. Balance" value={`${player.love.balance.toFixed(1)} 💜`} color="#F43F5E" />
        <StatRow label="Total L.O.V.E. Mined" value={player.love.totalMined.toFixed(1)} color="#F43F5E" />
        <StatRow label="Prestige" value={player.prestige} color="#F59E0B" />
      </section>

      {/* Streaks */}
      <section>
        <h2 className="text-[11px] font-bold tracking-[2px] text-phosphor uppercase mb-3">
          Streaks
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(player.streaks) as [string, { current: number; longest: number }][]).map(
            ([key, streak]) => (
              <div
                key={key}
                className="rounded-lg border border-white/[0.06] bg-void-1 p-3 text-center"
              >
                <span className="text-lg font-bold text-phosphor">{streak.current}</span>
                <p className="text-[9px] text-txt-dim mt-1 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                <p className="text-[8px] text-txt-muted">Best: {streak.longest}</p>
              </div>
            ),
          )}
        </div>
      </section>

      {/* Achievements */}
      <section>
        <h2 className="text-[11px] font-bold tracking-[2px] text-amber uppercase mb-3">
          Achievements ({earnedAchievements.length}/{ACHIEVEMENTS.filter((a) => !a.hidden).length})
        </h2>
        <div className="space-y-1.5">
          {earnedAchievements.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-2 rounded border border-phosphor/20 bg-phosphor/[0.04] px-3 py-2"
            >
              <span className="text-base">{a.icon}</span>
              <div>
                <span className="text-[10px] font-bold text-phosphor">{a.name}</span>
                <p className="text-[9px] text-txt-dim">{a.description}</p>
              </div>
            </div>
          ))}
          {earnedAchievements.length === 0 && (
            <p className="text-[10px] text-txt-muted">No achievements unlocked yet. Keep going.</p>
          )}
        </div>
      </section>
    </div>
  );
}
