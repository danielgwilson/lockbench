/**
 * AgentDashboard - Full interactive dashboard with game engine integration.
 *
 * STATUS: Reference component - not currently used in the main UI.
 *
 * This component contains valuable patterns for:
 * - Connecting to AI via server actions (generateAgentMove)
 * - Auto-play loop for AI agents
 * - GameEngine state management
 * - Tool suggestion autocomplete
 *
 * When adding actual game logic to GameCard, reference this component
 * for patterns on wiring up the GameEngine and AI integration.
 *
 * For the current visual-only GameCard component, see game-card.tsx
 */
"use client";

import { Pause, Play } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { generateAgentMove } from "@/app/actions/agent";
import { ContextWindow } from "@/components/context-window";
import { DependencyGraph } from "@/components/dependency-graph";
import { PixelLock } from "@/components/pixel-lock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameEngine, type GameState, type Tool } from "@/lib/game-engine";

interface AgentDashboardProps {
  name: string;
  subtitle?: string;
  initialInput?: string;
}

export function AgentDashboard({
  name,
  subtitle,
  initialInput = "",
}: AgentDashboardProps) {
  const [engine] = useState(() => new GameEngine());
  const [gameState, setGameState] = useState<GameState>(engine.state);
  const [input, setInput] = useState(initialInput);
  const [suggestions, setSuggestions] = useState<Tool[]>([]);
  const [viewMode, setViewMode] = useState<"avatar" | "lock">("avatar");
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  // Auto-Play Loop
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const runAgentLoop = async () => {
      if (!isAutoPlaying || isThinking) return;

      // Check if game is won
      const allSolved = Object.values(gameState.locks).every((l) => l.solved);
      if (allSolved) {
        setIsAutoPlaying(false);
        return;
      }

      setIsThinking(true);
      try {
        // 1. Get move from AI
        const result = await generateAgentMove(
          gameState.history,
          name.toLowerCase().includes("sonnet")
            ? "claude-3-5-sonnet-latest"
            : "gpt-4o",
        );

        // 2. Parse result (simple heuristic: take the first line or the whole thing)
        // The AI might output "I will inspect..." but we want the command.
        // For now, let's assume the server action returns just the command or we treat the whole text as command
        // If it returns an error, we log it.
        const command = result.split("\n")[0].trim(); // Take first line

        if (command) {
          // Simulate typing delay
          await new Promise((r) => setTimeout(r, 1000));

          // Execute
          const parts = command.split(" ");
          const toolName = parts[0];
          const args = parts.slice(1);

          // Add to history manually if executeTool doesn't (it usually adds result, but maybe not the command echo?)
          // GameEngine.executeTool adds the result. We might want to echo the command too.
          // Let's rely on the engine's internal state update which we copy.

          // Actually, we need to update the engine state.
          engine.executeTool(toolName, args);
          setGameState({ ...engine.state });

          if (
            toolName.includes("inspect") ||
            toolName.includes("attempt") ||
            toolName.includes("peer")
          ) {
            setViewMode("lock");
          }
        }
      } catch (e) {
        console.error("Agent Loop Error", e);
        setIsAutoPlaying(false);
      } finally {
        setIsThinking(false);
        // Schedule next move
        if (isAutoPlaying) {
          timeout = setTimeout(() => {
            // Trigger next iteration via state change or just let the effect re-run?
            // Actually, this effect depends on isAutoPlaying.
            // We need a way to re-trigger.
            // Simplest is to just call runAgentLoop again recursively or rely on a dependency change.
            // But gameState changes, so the effect will re-run if we add gameState to deps.
          }, 2000);
        }
      }
    };

    if (isAutoPlaying && !isThinking) {
      runAgentLoop();
    }

    return () => clearTimeout(timeout);
  }, [isAutoPlaying, gameState, isThinking, engine, name]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const parts = input.trim().split(" ");
    const toolName = parts[0];
    const args = parts.slice(1);

    engine.executeTool(toolName, args);
    setGameState({ ...engine.state });
    setInput("");
    setSuggestions([]);

    if (
      toolName.includes("inspect") ||
      toolName.includes("attempt") ||
      toolName.includes("peer")
    ) {
      setViewMode("lock");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    if (val) {
      const matches = engine.tools.filter((t) =>
        t.name.toLowerCase().includes(val.toLowerCase()),
      );
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const activeLockId =
    Object.values(gameState.locks).find((l) => !l.solved)?.id || "vault";
  const activeLock = gameState.locks[activeLockId];
  const solvedCount = Object.values(gameState.locks).filter(
    (l) => l.solved,
  ).length;
  const totalLocks = Object.values(gameState.locks).length;

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a] relative p-2">
      {/* Main Outer Card - Solid Border, Rounded, Padding */}
      <Card className="w-full h-full border-2 border-[#444] bg-[#111] relative shadow-2xl flex flex-col p-2 rounded-2xl overflow-hidden">
        <CardHeader className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#1a1a1a] px-6 py-1 z-10 flex flex-row items-center gap-2 border-2 border-[#444] rounded-full h-10 shadow-lg">
          <CardTitle className="text-[#e5e5e5] font-serif text-xl font-normal flex items-center gap-2">
            {name}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`ml-1 p-0.5 rounded-full border ${isAutoPlaying ? "border-green-500 text-green-500" : "border-[#444] text-[#444] hover:text-[#888]"}`}
              title={isAutoPlaying ? "Pause Auto-Play" : "Start Auto-Play"}
            >
              {isAutoPlaying ? <Pause size={10} /> : <Play size={10} />}
            </button>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col h-full gap-6 p-6 pt-12">
          {/* Top Half: Split 50/50 */}
          <div className="flex h-[45%] gap-4">
            {/* Left Quadrant: Pixel Art */}
            <div
              className="w-1/2 dashed-border relative flex items-center justify-center bg-[#222]/20 cursor-pointer rounded-xl border-2 border-dashed border-[#555]"
              onClick={() =>
                setViewMode((prev) => (prev === "avatar" ? "lock" : "avatar"))
              }
            >
              {/* Header for Left Panel */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1a1a1a] px-2 text-[#e5e5e5] font-mono text-sm whitespace-nowrap">
                {viewMode === "avatar"
                  ? name
                  : `${activeLock.name} (${solvedCount + 1}/${totalLocks})`}
              </div>

              {/* Grid Background */}
              <div className="absolute inset-2 grid grid-cols-16 grid-rows-16 border border-[#333] opacity-20 pointer-events-none"></div>

              <div className="relative z-10">
                {viewMode === "avatar" ? (
                  <PixelLock
                    type="avatar"
                    className="scale-[3.0]"
                    color="#ff8c69"
                    showGrid={false}
                  />
                ) : (
                  <PixelLock
                    type={activeLockId}
                    className="scale-[1.5]"
                    showGrid={true}
                  />
                )}
              </div>
            </div>

            {/* Right Quadrant: Graph */}
            <div className="w-1/2 dashed-border relative flex items-center justify-center rounded-xl border-2 border-dashed border-[#555]">
              <div className="absolute -top-3 right-4 bg-[#1a1a1a] px-2 text-[#ff8c69] font-mono text-sm">
                Puzzle Room Challenge
              </div>
              <div className="scale-90 w-full flex justify-center">
                <DependencyGraph locks={gameState.locks} />
              </div>
            </div>
          </div>

          {/* Middle Section: Context Window */}
          <div className="dashed-border p-4 relative h-[15%] flex flex-col justify-center rounded-xl bg-[#1a1a1a]/50 border-2 border-dashed border-[#555]">
            <ContextWindow historyLength={gameState.history.length} />
          </div>

          {/* Bottom Section: Terminal */}
          <div className="flex-1 bg-[#0a0a0a] p-4 font-mono text-xs flex flex-col min-h-0 rounded-xl dashed-border shadow-inner border-2 border-dashed border-[#555]">
            <div
              className="flex-1 overflow-y-auto mb-2 space-y-1"
              ref={scrollRef}
            >
              <div className="text-[#888] mb-4 space-y-1">
                <p>
                  ⚠ IMPORTANT: When you call tools, their results appear
                  immediately in the conversation.
                </p>
                <p>
                  - Tool results like "Wheel 1 shows: 233" are directly visible
                  to you
                </p>
                <p>
                  - You DON'T need to print() tool results to see them - they're
                  already in the conversation!
                </p>
              </div>

              {gameState.history.map((line, i) => {
                if (line.includes("Welcome to the Puzzle Room")) return null;
                return (
                  <div
                    key={i}
                    className={`whitespace-pre-wrap ${line.startsWith(">") ? "text-[#888] mt-2" : "text-[#e5e5e5]"}`}
                  >
                    {line}
                  </div>
                );
              })}
            </div>

            <div className="relative shrink-0">
              {suggestions.length > 0 && (
                <div className="absolute bottom-full left-0 mb-1 bg-[#222] border border-[#444] w-full max-h-32 overflow-y-auto z-10">
                  {suggestions.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => {
                        setInput(`${s.name} `);
                        setSuggestions([]);
                        inputRef.current?.focus();
                      }}
                      className="block w-full text-left px-2 py-1 hover:bg-[#333] text-[#ccc]"
                    >
                      <span className="text-[#ff8c69]">{s.name}</span>
                    </button>
                  ))}
                </div>
              )}
              <form
                onSubmit={handleCommand}
                className="flex gap-2 items-center border-t border-[#333] pt-1"
              >
                <span className="text-[#555]">{">"}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent border-none outline-none text-[#e5e5e5] placeholder-[#444]"
                  placeholder="Enter command..."
                />
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
