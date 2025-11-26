import React from "react";

// 0 = off, 1 = silver/grey, 2 = dark/black (outline), 3 = highlight
type PixelGrid = number[][];

const LOCK_PATTERNS: Record<string, PixelGrid> = {
  // Updated to ~16x16 grid to match screenshot better
  victorian: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 1, 0, 0, 0, 0, 1, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 1, 0, 0, 0, 0, 1, 1, 2, 0, 0, 0],
    [0, 0, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 2, 0, 0],
    [0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0],
    [0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0],
    [0, 0, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 0, 0],
    [0, 0, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 0, 0],
    [0, 0, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 0, 0],
    [0, 0, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 0, 0],
    [0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0],
    [0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0],
    [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  // Keep others simple for now or update as needed
  chinese: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  avatar: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
};

export function PixelLock({
  type,
  className,
  color,
  showGrid = false,
}: {
  type: string;
  className?: string;
  color?: string;
  showGrid?: boolean;
}) {
  const grid = LOCK_PATTERNS[type] || LOCK_PATTERNS["victorian"];
  const activeColor = color || "#e5e5e5";

  // Create a larger grid background if requested (e.g. 24x20)
  // For now, just render the pattern on top of a grid

  return (
    <div className={`relative inline-flex flex-col ${className}`}>
      {/* Grid Background */}
      {showGrid && (
        <div className="absolute inset-0 grid grid-cols-16 grid-rows-16 pointer-events-none">
          {Array.from({ length: 256 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-[#333] bg-[#222]" />
          ))}
        </div>
      )}

      {/* Pattern */}
      <div className="relative z-10 flex flex-col gap-[1px]">
        {grid.map((row, y) => (
          <div key={y} className="flex gap-[1px]">
            {row.map((cell, x) => {
              let bg = "transparent";
              if (cell === 1) bg = activeColor;
              if (cell === 2) bg = "#111"; // Outline/Dark

              // If showing grid, we want the "off" pixels to be transparent to show the grid
              // But the component uses "gap" for spacing, so we need to be careful.
              // Actually, let's just use the cell color directly.

              if (showGrid) {
                // In grid mode, we render squares that fit the grid
                // This is a bit hacky to mix the two modes.
                // Let's just render the cells.
                return (
                  <div
                    key={x}
                    className={`w-4 h-4 ${cell === 0 ? "bg-transparent" : ""}`}
                    style={{ backgroundColor: cell !== 0 ? bg : undefined }}
                  />
                );
              }

              return (
                <div
                  key={x}
                  className={`w-2 h-2 sm:w-3 sm:h-3`}
                  style={{ backgroundColor: cell !== 0 ? bg : "#333" }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
