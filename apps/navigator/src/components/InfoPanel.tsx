import { VERTEX_LABELS } from "@/lib/constants";

const PANEL_CONTENT: Record<
  number,
  { title: string; status: string; description: string; buttons?: { label: string; href: string }[] }
> = {
  1: {
    title: "NODE ONE — The Phosphorus Nucleus",
    status: "DESIGNED — Hardware prototype in development",
    description:
      'A handheld ESP32-S3 device with haptic feedback, LoRa mesh radio, and biometric sensors. The "Thick Click" provides proprioceptive input that costs zero spoons.',
    buttons: [{ label: "Learn More", href: "https://phosphorus31.org/docs" }],
  },
  2: {
    title: "THE FOLD — The Oxygen Bonds",
    status: "COMING 2027",
    description:
      "Encrypted mesh network between trusted nodes. Four people. Mutual consent. No central authority. Trust the geometry.",
    buttons: [{ label: "Constructor's Challenge", href: "https://phosphorus31.org" }],
  },
  3: {
    title: "GENESIS GATE — The Geometry",
    status: "BUILDING",
    description:
      "Infrastructure and governance. The substrate that makes everything else work.",
    buttons: [
      { label: "Donate USD (tax-deductible)", href: "https://hcb.hackclub.com" },
      { label: "Documentation", href: "https://phosphorus31.org/docs" },
    ],
  },
};

interface Props {
  vertexIndex: number;
  color: string;
  onClose: () => void;
}

export function InfoPanel({ vertexIndex, color, onClose }: Props) {
  const content = PANEL_CONTENT[vertexIndex];
  if (!content) return null;
  const { title, status, description, buttons } = content;

  return (
    <div
      role="dialog"
      aria-label={`Info: ${VERTEX_LABELS[vertexIndex].label}`}
      className="fixed inset-4 top-auto left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 rounded-xl border border-phosphor/10 bg-[rgba(15,15,20,0.95)] backdrop-blur-xl p-5 shadow-xl"
      style={{ borderColor: "rgba(57, 255, 20, 0.1)" }}
    >
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded text-txt-dim hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-phosphor"
      >
        <span className="text-lg leading-none">×</span>
      </button>
      <h2
        className="text-xs font-mono uppercase tracking-[0.2em] mb-2"
        style={{ color }}
      >
        {title}
      </h2>
      <p className="text-[10px] text-phosphor/80 mb-3">{status}</p>
      <p className="text-[10px] text-txt-dim leading-relaxed mb-4">{description}</p>
      {buttons?.map((b) => (
        <a
          key={b.label}
          href={b.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-2 px-3 mb-2 text-center text-xs font-mono rounded border border-phosphor/30 text-phosphor hover:bg-phosphor/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-phosphor"
        >
          {b.label}
        </a>
      ))}
    </div>
  );
}
