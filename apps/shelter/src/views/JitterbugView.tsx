import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useShelterStore } from "@/stores/shelter-store";
import {
  ROOT_GRAPH,
  FEELING_GRAPH,
  ROOT_NODE_ID,
  getNodesAt,
  getParentId,
  type JitterbugNode,
  type NodeAction,
} from "@/lib/jitterbug-graph";
import JitterbugScene from "./JitterbugScene";

const HOLD_MS = 550;
const TRANSITION_MS = 500;

export default function JitterbugView() {
  const setActiveTab = useShelterStore((s) => s.setActiveTab);
  const [expanded, setExpanded] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(ROOT_NODE_ID);
  const [graphMode, setGraphMode] = useState<"main" | "kids">("main");
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionRef = useRef<{ start: number; id: number } | null>(null);

  const graph = graphMode === "kids" ? FEELING_GRAPH : ROOT_GRAPH;
  const nodes = getNodesAt(graph, currentNodeId);
  const parentId = getParentId(graph, currentNodeId);

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  const handlePointerDown = useCallback(() => {
    if (expanded) return;
    clearHoldTimer();
    holdTimerRef.current = setTimeout(() => {
      holdTimerRef.current = null;
      setExpanded(true);
    }, HOLD_MS);
  }, [expanded, clearHoldTimer]);

  // Animate VE → tetrahedron when expanded becomes true
  useEffect(() => {
    if (!expanded) {
      setTransitionProgress(0);
      return;
    }
    const start = performance.now();
    const tick = () => {
      const t = Math.min((performance.now() - start) / TRANSITION_MS, 1);
      setTransitionProgress(t);
      if (t < 1) transitionRef.current = { start, id: requestAnimationFrame(tick) };
      else transitionRef.current = null;
    };
    transitionRef.current = { start, id: requestAnimationFrame(tick) };
    return () => {
      if (transitionRef.current) cancelAnimationFrame(transitionRef.current.id);
    };
  }, [expanded]);

  const handlePointerUp = useCallback(() => clearHoldTimer(), [clearHoldTimer]);
  const handlePointerLeave = useCallback(() => clearHoldTimer(), [clearHoldTimer]);

  const runAction = useCallback(
    (action: NodeAction | undefined) => {
      if (!action) return;
      if (action.type === "tab") setActiveTab(action.tab);
    },
    [setActiveTab]
  );

  const handleNodeSelect = useCallback(
    (node: JitterbugNode) => {
      if (node.children.length > 0) {
        setCurrentNodeId(node.id);
      } else {
        runAction(node.action);
      }
    },
    [runAction]
  );

  const switchToKidsMode = useCallback(() => {
    setGraphMode("kids");
    setCurrentNodeId(ROOT_NODE_ID);
  }, []);
  const switchToMainMode = useCallback(() => {
    setGraphMode("main");
    setCurrentNodeId(ROOT_NODE_ID);
  }, []);

  return (
    <div
      className="flex-1 relative min-h-0 bg-void"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerUp}
    >
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-2 border-phosphor/60 animate-jitterbug-breathe" />
          </div>
        }
      >
        <JitterbugScene
          expanded={expanded}
          transitionProgress={transitionProgress}
          nodes={nodes}
          onNodeSelect={handleNodeSelect}
        />
      </Suspense>
      {!expanded && (
        <p className="absolute bottom-8 left-0 right-0 text-center text-txt-muted text-xs font-mono pointer-events-none">
          Press and hold
        </p>
      )}
      {expanded && parentId !== null && (
        <button
          type="button"
          onClick={() => setCurrentNodeId(parentId)}
          className="absolute top-4 left-4 z-10 text-txt-muted hover:text-primary font-mono text-xs"
        >
          ← Back
        </button>
      )}
      {expanded && parentId === null && graphMode === "main" && (
        <button
          type="button"
          onClick={switchToKidsMode}
          className="absolute bottom-8 left-0 right-0 text-center text-phosphor/80 hover:text-phosphor font-mono text-xs z-10"
        >
          Show me your shape
        </button>
      )}
      {expanded && graphMode === "kids" && parentId === null && (
        <button
          type="button"
          onClick={switchToMainMode}
          className="absolute top-4 right-4 z-10 text-txt-muted hover:text-primary font-mono text-xs"
        >
          ← Main
        </button>
      )}
    </div>
  );
}
