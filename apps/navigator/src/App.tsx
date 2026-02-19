import { useRef, useEffect, useState } from "react";
import { useJitterbug } from "@/hooks/useJitterbug";
import { VectorEquilibrium } from "@/components/VectorEquilibrium";
import { JitterbugTransition } from "@/components/JitterbugTransition";
import { Tetrahedron } from "@/components/Tetrahedron";
import { InfoPanel } from "@/components/InfoPanel";
import { Mar10Star } from "@/components/Mar10Star";
import { VERTEX_LABELS } from "@/lib/constants";

function useViewport() {
  const [vp, setVp] = useState({ w: 400, h: 400 });
  useEffect(() => {
    const update = () =>
      setVp({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return vp;
}

export default function App() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { w, h } = useViewport();
  const centerX = w / 2;
  const centerY = h / 2;
  const scale = Math.min(w, h) * 0.2;

  const {
    state,
    transitionT,
    rotationTheta,
    breatheScale,
    infoVertex,
    startTransition,
    openInfo,
    closeInfo,
  } = useJitterbug();

  useEffect(() => {
    if (state === "navigate" && !infoVertex) {
      const ann = document.createElement("live-region");
      ann.setAttribute("aria-live", "polite");
      ann.textContent = "Navigator ready. Four products available.";
      document.body.appendChild(ann);
      const t = setTimeout(() => ann.remove(), 500);
      return () => clearTimeout(t);
    }
  }, [state, infoVertex]);

  return (
    <div
      className="min-h-screen bg-void text-white font-mono"
      style={{ backgroundColor: "#050508" }}
    >
      <svg
        ref={svgRef}
        width={w}
        height={h}
        className="block"
        aria-hidden="true"
      >
        {state === "breathe" && (
          <VectorEquilibrium
            centerX={centerX}
            centerY={centerY}
            scale={scale}
            rotationTheta={rotationTheta}
            breatheScale={breatheScale}
          />
        )}
        {state === "jitterbug" && (
          <JitterbugTransition
            centerX={centerX}
            centerY={centerY}
            scale={scale}
            rotationTheta={rotationTheta}
            t={transitionT}
          />
        )}
        {(state === "navigate" || state === "info") && (
          <>
            <Tetrahedron
              centerX={centerX}
              centerY={centerY}
              scale={scale}
              rotationTheta={rotationTheta}
              onVertexTap={openInfo}
            />
            <Mar10Star
              centerX={centerX}
              centerY={centerY}
              scale={scale}
              rotationTheta={rotationTheta}
            />
          </>
        )}
      </svg>

      {(state === "breathe" || state === "jitterbug") && (
        <button
          type="button"
          onClick={startTransition}
          className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-phosphor focus-visible:ring-inset"
          aria-label="Open navigator"
        />
      )}

      {state === "info" && infoVertex !== null && (
        <InfoPanel
          vertexIndex={infoVertex}
          color={VERTEX_LABELS[infoVertex].color}
          onClose={closeInfo}
        />
      )}

      {/* Escape to close info */}
      {state === "info" && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close"
          onKeyDown={(e) => {
            if (e.key === "Escape") closeInfo();
          }}
          className="sr-only"
        />
      )}
    </div>
  );
}
