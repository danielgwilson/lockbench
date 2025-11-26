/**
 * GameCard - Main reusable card component for displaying agent progress.
 *
 * Visual-only component designed for side-by-side agent comparison.
 * Uses CSS Grid layout: 2-column top row, full-width stats and console.
 *
 * To add game logic, reference agent-dashboard.tsx for patterns.
 *
 * @example
 * // Claude agent
 * <GameCard
 *   agentName="Claude Opus 4.5"
 *   avatarColor="#ff8c69"
 *   highlightColor="#D98368"
 *   locks={gameState.locks}
 *   consoleLines={consoleLines}
 * />
 *
 * // Gemini agent
 * <GameCard
 *   agentName="Gemini 2.5 Pro"
 *   avatarColor="#0053D6"
 *   highlightColor="#4285F4"
 * />
 */
"use client";

import { type ConsoleLine, ConsoleOutput } from "@/components/console-output";
import { ContextWindow } from "@/components/context-window";
import { DependencyGraph } from "@/components/dependency-graph";
import { LockVisual } from "@/components/tui/lock-visual";
import type { LockState } from "@/lib/game-engine";

export interface GameCardProps {
  agentName?: string;
  lockState?: "locked" | "unlocked";
  lockName?: string;
  contextPercentage?: number;
  totalTokens?: number;
  consoleLines?: ConsoleLine[];
  locks?: Record<string, LockState>;
  className?: string;
  /** Avatar color for the active lock indicator (e.g., "#ff8c69" for Claude, "#0053D6" for Gemini) */
  avatarColor?: string;
  /** Highlight color for solved/active locks */
  highlightColor?: string;
}

// Default locks for demo/preview
const defaultLocks: Record<string, LockState> = {
  victorian: {
    id: "victorian",
    name: "Victorian Lock",
    solved: true,
    answer: "3063",
    requires: [],
    description: "",
  },
  chinese: {
    id: "chinese",
    name: "Chinese Box",
    solved: false,
    answer: "4411",
    requires: ["victorian"],
    description: "",
  },
  medieval: {
    id: "medieval",
    name: "Medieval Shield",
    solved: false,
    answer: "53",
    requires: ["victorian"],
    description: "",
  },
  japanese: {
    id: "japanese",
    name: "Japanese Lock",
    solved: false,
    answer: "773",
    requires: ["chinese"],
    description: "",
  },
  digital: {
    id: "digital",
    name: "Digital Keypad",
    solved: false,
    answer: "42",
    requires: ["medieval"],
    description: "",
  },
  library: {
    id: "library",
    name: "Manuscript Library",
    solved: false,
    answer: "OPEN",
    requires: ["digital"],
    description: "",
  },
  vault: {
    id: "vault",
    name: "Final Vault",
    solved: false,
    answer: "979",
    requires: [
      "victorian",
      "chinese",
      "medieval",
      "japanese",
      "digital",
      "library",
    ],
    description: "",
  },
};

// Default console lines for demo
const defaultConsoleLines: ConsoleLine[] = [
  { type: "text", content: 'print(f"F(233) has {len(str(f233))} digits")' },
  { type: "text", content: 'print(f"F(239) has {len(str(f239))} digits")' },
  { type: "text", content: 'print(f"F(251) has {l...' },
  { type: "tool-result", content: "[Code Output] []" },
  { type: "text", content: "" },
  { type: "text", content: "[Executing Code with PTC]" },
  { type: "text", content: "import asyncio" },
  { type: "text", content: "" },
  { type: "text", content: "async def main():" },
  {
    type: "text",
    content:
      "    # Try the combination 3063 (last 4 digits of F(233) + F(239) + F(251))",
  },
  {
    type: "text",
    content:
      "    result = await victorian_attempt_combination({'combination': '3063'})",
  },
  { type: "text", content: "    print(result)" },
  { type: "text", content: "" },
  { type: "text", content: "asyncio.run(main())" },
  { type: "text", content: "" },
  {
    type: "tool-call",
    content: "PTC tools called: victorian_attempt_combination",
  },
  {
    type: "tool-call",
    content: 'PTC Tool: victorian_attempt_combination({"combination": "3063"})',
  },
  { type: "text", content: "" },
  {
    type: "success",
    content: "SUCCESS! The Victorian lock opens with combination 3063!",
  },
];

export function GameCard({
  agentName = "Agent",
  lockState = "unlocked",
  lockName = "Victorian",
  contextPercentage = 5.9,
  totalTokens = 146000,
  consoleLines = defaultConsoleLines,
  locks = defaultLocks,
  className = "",
  avatarColor = "#ff8c69", // Default coral for Claude
  highlightColor = "#D98368", // Default orange highlight
}: GameCardProps) {
  return (
    <div
      className={`bg-[#131313] rounded-xl border border-[#333] p-2 ${className}`}
    >
      {/* CSS Grid: 2 cols top row, full width for stats and console */}
      <div
        className="grid h-full gap-2"
        style={{
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "minmax(280px, 1.2fr) auto minmax(200px, 1fr)",
        }}
      >
        {/* Row 1, Col 1: Lock Visual */}
        <section className="relative border border-dashed border-[#D98368] rounded-lg p-4">
          {/* Floating label overlapping border */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#131313] px-3 z-10">
            <span className="text-[#e5e5e5] font-mono text-sm whitespace-nowrap">
              {lockName} lock {lockState === "unlocked" ? "opened" : "locked"}!
            </span>
          </div>
          <div className="h-full flex items-center justify-center rounded overflow-hidden">
            <LockVisual isLocked={lockState === "locked"} />
          </div>
        </section>

        {/* Row 1, Col 2: Dependency Graph */}
        <section className="relative border border-dashed border-[#D98368] rounded-lg p-4">
          {/* Floating label - centered, overlapping border */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#131313] px-3 z-10">
            <span className="text-[#D98368] font-mono text-sm whitespace-nowrap">
              Puzzle Room Challenge
            </span>
          </div>
          <div className="h-full flex items-center justify-center overflow-hidden pt-2">
            <DependencyGraph
              locks={locks}
              avatarColor={avatarColor}
              highlightColor={highlightColor}
            />
          </div>
        </section>

        {/* Row 2: Stats (full width) - solid border */}
        <section
          className="relative border border-[#444] rounded-lg p-4 bg-[#0d0d0d]"
          style={{ gridColumn: "1 / -1" }}
        >
          <ContextWindow
            percentage={contextPercentage}
            totalTokens={totalTokens}
          />
        </section>

        {/* Row 3: Console (full width) - solid border */}
        <section
          className="relative border border-[#444] rounded-lg bg-[#0d0d0d] overflow-hidden"
          style={{ gridColumn: "1 / -1" }}
        >
          <ConsoleOutput lines={consoleLines} className="h-full p-4" />
        </section>
      </div>
    </div>
  );
}
