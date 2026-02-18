import { computeVoltage, GATES, type GateName } from "@p31labs/buffer-core";

function scoreMessage(el: Element) {
  if (el.getAttribute("data-p31-scored")) return;

  const textEl = el.querySelector(".p-rich_text_section, .c-message_kit__text");
  if (!textEl) return;

  const text = textEl.textContent?.trim() || "";
  if (!text) return;

  const score = computeVoltage(text);
  const gc = GATES[score.gate as GateName];

  const badge = document.createElement("span");
  badge.textContent = `V:${score.voltage.toFixed(1)}`;
  Object.assign(badge.style, {
    display: "inline-block",
    padding: "0 4px",
    borderRadius: "3px",
    fontSize: "9px",
    fontWeight: "700",
    fontFamily: "monospace",
    marginLeft: "6px",
    color: gc.color,
    background: `${gc.color}15`,
    border: `1px solid ${gc.color}33`,
    verticalAlign: "middle",
  });

  el.appendChild(badge);
  el.setAttribute("data-p31-scored", "true");
}

function scanMessages() {
  const messages = document.querySelectorAll(".c-message_kit__blocks:not([data-p31-scored])");
  messages.forEach(scoreMessage);
}

const observer = new MutationObserver(() => scanMessages());
observer.observe(document.body, { childList: true, subtree: true });

scanMessages();
