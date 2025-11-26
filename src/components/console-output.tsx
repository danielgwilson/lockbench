"use client";

import { useEffect, useRef } from "react";

export interface ConsoleLine {
  type: "tool-call" | "tool-result" | "text" | "success" | "error" | "thinking";
  content: string;
  timestamp?: Date;
}

export interface ConsoleOutputProps {
  lines: ConsoleLine[];
  className?: string;
}

const lineStyles: Record<ConsoleLine["type"], string> = {
  "tool-call": "text-[#D98368]", // Orange
  "tool-result": "text-[#888] pl-4", // Gray, indented
  text: "text-[#e5e5e5]", // Default white
  success: "text-[#4caf50]", // Green
  error: "text-[#ef4444]", // Red
  thinking: "text-[#555] animate-pulse", // Dim pulsing
};

const linePrefix: Record<ConsoleLine["type"], string> = {
  "tool-call": "-> ",
  "tool-result": "",
  text: "",
  success: "Result: ",
  error: "Error: ",
  thinking: "... ",
};

export function ConsoleOutput({ lines, className = "" }: ConsoleOutputProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new lines are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <div
      ref={scrollRef}
      className={`font-mono text-xs overflow-y-auto ${className}`}
    >
      {lines.map((line, i) => (
        <div key={i} className={`whitespace-pre-wrap ${lineStyles[line.type]}`}>
          {linePrefix[line.type]}
          {line.content}
        </div>
      ))}
    </div>
  );
}
