import { useEffect, lazy, Suspense } from "react";
import {
  generateDailyQuests,
  generateWeeklyQuests,
  toUTCDateString,
} from "@p31labs/game-engine";
import { useShelterStore } from "@/stores/shelter-store";
import { useGameAction } from "@/hooks/useGameAction";
import { hydrateStores, subscribeToPersistence } from "@/services/persistence";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TabBar from "@/components/layout/TabBar";
import ToastStack from "@/components/shared/ToastStack";
import BufferView from "@/views/BufferView";

const TandemView = lazy(() => import("@/views/TandemView"));
const BrainView = lazy(() => import("@/views/BrainView"));
const QuestsView = lazy(() => import("@/views/QuestsView"));
const StatsView = lazy(() => import("@/views/StatsView"));
const BreatheView = lazy(() => import("@/views/BreatheView"));
const SettingsView = lazy(() => import("@/views/SettingsView"));
const JitterbugView = lazy(() => import("@/views/JitterbugView"));
const QuantumClockView = lazy(() => import("@/views/QuantumClockView"));

const PLAYER_KEY = "p31_shelter_player";
const QUEST_KEY = "p31_shelter_quests";

function getWeekStart(date: Date): string {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return toUTCDateString(d.toISOString());
}

export default function App() {
  const { activeTab, setPlayer, setQuests, checkedInToday, setCheckedInToday, dailyDate } = useShelterStore();
  const gameAction = useGameAction();

  // Hydrate Dexie stores (buffer/spoon persistence — DO NOT TOUCH)
  useEffect(() => {
    hydrateStores();
    const unsub = subscribeToPersistence();
    return unsub;
  }, []);

  // Hydrate game state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PLAYER_KEY);
      if (raw) {
        setPlayer(JSON.parse(raw));
      }
    } catch { /* corrupt data — use defaults */ }

    const today = toUTCDateString(new Date().toISOString());
    const weekStart = getWeekStart(new Date());

    try {
      const raw = localStorage.getItem(QUEST_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.dailyDate === today && saved.weeklyDate === weekStart) {
          setQuests(saved.daily, saved.weekly, saved.dailyDate, saved.weeklyDate);
          return;
        }
      }
    } catch { /* corrupt data — regenerate */ }

    const daily = generateDailyQuests(today);
    const weekly = generateWeeklyQuests(weekStart);
    setQuests(daily, weekly, today, weekStart);

    try {
      localStorage.setItem(QUEST_KEY, JSON.stringify({
        daily, weekly, dailyDate: today, weeklyDate: weekStart,
      }));
    } catch { /* quota */ }
  }, [setPlayer, setQuests]);

  // Daily check-in (fires once per calendar day)
  useEffect(() => {
    const today = toUTCDateString(new Date().toISOString());
    if (!checkedInToday && dailyDate === today) {
      setCheckedInToday(true);
      gameAction("daily_checkin");
    }
  }, [checkedInToday, dailyDate, gameAction, setCheckedInToday]);

  const fallback = (
    <div className="flex-1 flex items-center justify-center text-txt-muted text-xs">Loading...</div>
  );

  return (
    <div className="min-h-dvh bg-void text-primary font-mono flex flex-col">
      <Header />
      <ToastStack />

      <main className="flex-1 overflow-y-auto flex flex-col">
        {activeTab === "buffer" && <BufferView />}
        <Suspense fallback={fallback}>
          {activeTab === "jitterbug" && <JitterbugView />}
          {activeTab === "clock" && <QuantumClockView />}
          {activeTab === "tandem" && <TandemView />}
          {activeTab === "brain" && <BrainView />}
          {activeTab === "quests" && <QuestsView />}
          {activeTab === "stats" && <StatsView />}
          {activeTab === "breathe" && <BreatheView />}
          {activeTab === "settings" && <SettingsView />}
        </Suspense>
      </main>

      <Footer />
      <TabBar />
    </div>
  );
}
