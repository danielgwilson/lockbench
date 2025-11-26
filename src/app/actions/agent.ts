"use server";

import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

const SYSTEM_PROMPT = `
PUZZLE ROOM CHALLENGE! You've inherited a mysterious vault from your eccentric locksmith ancestor. The vault contains a series of mathematically-encoded locks that guard each other.

TIME LIMIT: 60 Minutes.

CRITICAL STRATEGY:

These locks require COMPUTATIONAL SOLVING.

Don't just read clues - WRITE CODE to solve mathematical patterns.

Use Python execution to compute sequences, test primes, and calculate formulas.

Tool results appear immediately in the conversation; you do not need to print() them.
`;

export async function generateAgentMove(
  history: string[],
  modelName: string = "claude-3-5-sonnet-latest",
) {
  try {
    const model = modelName.includes("gpt")
      ? openai(modelName)
      : anthropic(modelName);

    // Filter out the "Welcome" message if it's just noise, but keep the history clean
    // The history array comes from the UI which has lines like "> command" or "output"
    // We need to format this into a conversation for the LLM if we were using chat mode,
    // but here we are just sending a prompt with the history appended.
    // However, the AI SDK `generateText` is stateless, so we construct the messages.

    // Actually, let's just dump the history as a user message for simplicity,
    // or try to parse it. Given the "Terminal" nature, sending the transcript is often easiest.

    const transcript = history.join("\n");

    const { text } = await generateText({
      model,
      system: SYSTEM_PROMPT,
      prompt: `Current Terminal History:\n\n${transcript}\n\nYour next move (output ONLY the tool call, e.g. "victorian_inspect_wheels" or a python script):`,
      temperature: 0.1, // Low temp for deterministic solving
    });

    return text.trim();
  } catch (error) {
    console.error("Error generating agent move:", error);
    return `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
}
