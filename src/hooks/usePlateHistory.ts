import { useState, useCallback, useMemo } from "react";
import { PlateResult } from "@/types/plate";

export function usePlateHistory() {
  const [history, setHistory] = useState<PlateResult[]>([]);

  const addResult = useCallback((result: Omit<PlateResult, "id" | "timestamp">) => {
    const newResult: PlateResult = {
      ...result,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setHistory((prev) => [newResult, ...prev]);
    return newResult;
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const averageConfidence = useMemo(() => {
    if (history.length === 0) return 0;
    return history.reduce((sum, r) => sum + r.confidence, 0) / history.length;
  }, [history]);

  const confidenceData = useMemo(() => {
    return [...history].reverse().map((r, i) => ({
      name: `#${i + 1}`,
      confidence: Math.round(r.confidence * 100),
      plate: r.plate,
    }));
  }, [history]);

  return { history, addResult, clearHistory, averageConfidence, confidenceData };
}
