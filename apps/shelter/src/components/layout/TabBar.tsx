import { useShelterStore, type Tab } from "@/stores/shelter-store";

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: "jitterbug", icon: "◆", label: "Home" },
  { id: "clock", icon: "◷", label: "Clock" },
  { id: "tandem", icon: ">>", label: "Tandem" },
  { id: "buffer", icon: "⬡", label: "Buffer" },
  { id: "brain", icon: "🧠", label: "Brain" },
  { id: "quests", icon: "📋", label: "Quests" },
  { id: "stats", icon: "📊", label: "Stats" },
  { id: "breathe", icon: "🌊", label: "Breathe" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

export default function TabBar() {
  const { activeTab, setActiveTab } = useShelterStore();

  return (
    <nav
      className="flex justify-around items-center border-t border-white/[0.06] bg-void-1 px-1"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      role="tablist"
    >
      {TABS.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-0.5 py-2 px-2 text-[9px] tracking-wide transition-colors ${
              active ? "text-phosphor" : "text-txt-muted hover:text-txt-dim"
            }`}
          >
            <span className="text-sm leading-none">{tab.icon}</span>
            <span className="font-bold uppercase">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
