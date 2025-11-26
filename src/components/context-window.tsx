export interface ContextWindowProps {
  historyLength?: number;
  percentage?: number;
  totalTokens?: number;
}

export function ContextWindow({
  historyLength,
  percentage: directPercentage,
  totalTokens: directTokens,
}: ContextWindowProps) {
  const maxTokens = 200000; // 200k context

  // Use direct values if provided, otherwise calculate from historyLength
  const currentTokens =
    directTokens ?? Math.min((historyLength ?? 0) * 50, maxTokens);
  const percentage = directPercentage ?? (currentTokens / maxTokens) * 100;

  const segments = 60;
  const filledSegments = Math.floor((percentage / 100) * segments);

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1 font-mono text-[#e5e5e5] font-bold">
        <span>Context window:</span>
        <span>{percentage.toFixed(1)}%</span>
      </div>

      {/* Segmented Equalizer Bar */}
      <div
        style={{
          display: "flex",
          gap: "2px",
          height: "16px",
          width: "100%",
          marginTop: "8px",
          marginBottom: "8px",
        }}
      >
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "100%",
              backgroundColor: i < filledSegments ? "#4caf50" : "#333",
              borderRadius: "1px",
            }}
          />
        ))}
      </div>

      <div className="flex justify-between text-sm mt-1 font-mono text-[#e5e5e5] font-bold">
        <span>Total billed tokens:</span>
        <span>{currentTokens}</span>
      </div>
    </div>
  );
}
