"use client";

import { GameCard } from "@/components/game-card";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[#0a0a0a]">
      <GameCard
        agentName="Claude Opus 4.5"
        lockState="unlocked"
        lockName="Victorian"
        contextPercentage={5.9}
        totalTokens={146000}
        className="w-[800px] h-[700px]"
      />
    </div>
  );
}
