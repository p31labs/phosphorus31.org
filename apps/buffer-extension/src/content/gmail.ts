import { computeVoltage, GATES, type GateName } from "@p31labs/buffer-core";

function scoreRow(row: Element) {
  if (row.getAttribute("data-p31-scored")) return;

  const subjectEl = row.querySelector(".bog span, .bqe");
  const snippetEl = row.querySelector(".y2");
  if (!subjectEl) return;

  const text = `${subjectEl.textContent || ""} ${snippetEl?.textContent || ""}`.trim();
  if (!text) return;

  const score = computeVoltage(text);
  const gc = GATES[score.gate as GateName];

  const badge = document.createElement("span");
  badge.textContent = `V:${score.voltage.toFixed(1)}`;
  Object.assign(badge.style, {
    display: "inline-block",
    padding: "1px 5px",
    borderRadius: "3px",
    fontSize: "10px",
    fontWeight: "700",
    fontFamily: "monospace",
    marginLeft: "6px",
    color: gc.color,
    background: `${gc.color}15`,
    border: `1px solid ${gc.color}33`,
  });

  subjectEl.parentElement?.appendChild(badge);
  (row as HTMLElement).style.borderLeft = `3px solid ${gc.color}`;
  row.setAttribute("data-p31-scored", "true");
}

function scanRows() {
  const rows = document.querySelectorAll("tr.zA:not([data-p31-scored])");
  rows.forEach(scoreRow);
}

const observer = new MutationObserver(() => scanRows());
observer.observe(document.body, { childList: true, subtree: true });

scanRows();
