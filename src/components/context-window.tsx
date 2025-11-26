import React from "react";

export function ContextWindow({ historyLength }: { historyLength: number }) {
  const maxTokens = 200000; // 200k context
  const currentTokens = Math.min(historyLength * 50, maxTokens);
  const percentage = (currentTokens / maxTokens) * 100;

  const segments = 60;
  const filledSegments = Math.floor((percentage / 100) * segments);

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1 font-mono text-[#e5e5e5] font-bold">
        <span>Context window:</span>
        <span>{percentage.toFixed(1)}%</span>
      </div>

      {/* Equalizer Style Bar */}
      <div className="flex gap-[2px] h-4 w-full items-end">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-full ${i < filledSegments ? "bg-[#4caf50]" : "bg-[#333]"}`}
          />
        ))}
        {/* Add the little green cursor at the start if empty? Screenshot shows a green bar at start */}
        {filledSegments === 0 && <div className="w-1 h-full bg-[#4caf50]" />}
      </div>

      <div className="flex justify-between text-sm mt-1 font-mono text-[#e5e5e5] font-bold">
        <span>Total billed tokens:</span>
        <span>{currentTokens}</span>
      </div>
    </div>
  );
}
