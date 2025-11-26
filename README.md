# Product Spec: The Mathematical Locksmith's Vault

**Version:** 1.0  
**Target Runtime:** Python 3.10+ (Async)  
**UI Interface:** Terminal / CLI with Rich Text Support

## 1. Executive Summary

This project recreates the "Puzzle Room Challenge" used to benchmark Claude Opus 4.5. It is a **multi-stage logic puzzle game** designed for AI Agents. The game environment exposes a "Tool Use" API that allows the Agent to inspect virtual objects, run Python code to solve mathematical riddles, and traverse a dependency graph of locked doors.

**Core Loop:**

1. **Observe:** Agent calls inspection tools (e.g., `inspect_dial`).
2. **Compute:** Agent writes code to solve the derived math problem.
3. **Act:** Agent submits a solution (e.g., `enter_combination`).
4. **Unlock:** The game state updates, revealing new nodes in the graph.

---

## 2. System Architecture

### 2.1 The Dependency Graph

The game is a directed acyclic graph (DAG). Access to downstream nodes requires the "solved" state of upstream nodes.

- **Node 1 (Start):** `lock_victorian`
- **Node 2:** `lock_chinese_box` (Requires: Victorian)
- **Node 3:** `lock_medieval` (Requires: Victorian)
- **Node 4:** `lock_japanese` (Requires: Chinese Box) -> _Yields Item: Bell_
- **Node 5:** `lock_digital` (Requires: Medieval)
- **Node 6:** `lock_library` (Requires: Digital) -> _Yields Clue: Confirmation_
- **Node 7 (End):** `lock_vault` (Requires: All previous solved + Mathematical Synthesis)

### 2.2 The "Noise" Tool System

To simulate the difficulty of the original benchmark (209 tools), the system must generate **noise tools** alongside the **signal tools**.

- **Signal Tools:** Functional tools that return clues (approx. 20 total).
- **Noise Tools:** Interaction tools that return "Nothing happens" or flavor text (approx. 189 total).
- **Naming Convention:** `{namespace}_{action}_{object}` (e.g., `victorian_polish_brass`, `medieval_shout_at_guard`).

---

## 3. Detailed Level Design & Logic

### Level 1: The Victorian Lock

- **Visual:** Silver padlock, pixel art style.
- **Concept:** Fibonacci Sequence & Modulo Arithmetic.
- **Clue Data:**
  - Wheel 1: `233`
  - Wheel 2: `239`
  - Wheel 3: `251`
  - Plaque: "Positions mark the golden spiral's path... Sum reveals eternal truth... Masked by fourth power of ten."
- **The Logic:**
  $$Solution = (F_{233} + F_{239} + F_{251}) \pmod{10000}$$
- **Hardcoded Answer:** `3063`

### Level 2: The Chinese Puzzle Box

- **Visual:** Intricate wooden box with sliding tiles.
- **Concept:** Sequence Alignment.
- **Clue Data:**
  - `peer_inside()` -> "Four dragons guard the pearl. North, South, East, West."
  - `inspect_panels()` -> "Panels are numbered: 4, 4, 1, 1."
- **The Logic:** The puzzle box implies a specific sequence, but for the "Meta-Puzzle," the critical value extracted is the combination itself.
- **Hardcoded Answer:** `4411`

### Level 3: The Medieval Shield

- **Visual:** Heraldic shield with a cross.
- **Concept:** Prime Factors.
- **Clue Data:**
  - `measure_ward_angle()` -> "53 degrees."
  - `inspect_heraldry()` -> "The prime defender stands alone."
- **The Logic:** 53 is a prime number.
- **Hardcoded Answer:** `53`

### Level 4: The Antique Japanese Lock (Loot Drop)

- **Visual:** Iron mechanism.
- **Purpose:** This lock does not gate progress but provides a **Critical Item** for the final vault.
- **Clue Data:**
  - `inspect_shrine()` -> "A ceremonial bell rests here."
- **Action:** `unlock_with_code(773)` (Found via `scrutinize` tool).
- **Reward:** Adds `Bell (Value: 773)` to Inventory.

### Level 5: The Digital Keypad

- **Visual:** Modern 0-9 Keypad.
- **Concept:** Cultural Reference ("Hitchhiker's Guide").
- **Clue Data:**
  - `scan_fingerprint()` -> "Bio-residue suggests the user was thinking about 'Life, the Universe, and Everything'."
- **The Logic:** The answer to life, the universe, and everything.
- **Hardcoded Answer:** `42`

### Level 6: The Manuscript Library

- **Visual:** Bookshelves.
- **Purpose:** Narrative confirmation.
- **Clue Data:**
  - `read_journal()` -> "The final vault requires the sum of our history, minus the ringing of the bell."

### Level 7: The Final Vault (Meta-Puzzle)

- **Visual:** Massive circular bank vault door.
- **Concept:** Variable Integration.
- **The Formula:**
  $$(Victorian^2 + (Chinese \times Medieval) - Bell) \pmod{1000}$$
- **Calculation Values:**
  - Victorian: `3063`
  - Chinese: `4411`
  - Medieval: `53`
  - Bell: `773`
- **Step-by-Step Math:**
  1. $3063^2 = 9,381,969$
  2. $4411 \times 53 = 233,783$
  3. $Sum = 9,615,752$
  4. $Subtract Bell (773) = 9,614,979$
  5. $Modulo 1000 = 979$
- **Final Answer:** `979`

---

## 4. Implementation Specifications

### 4.1 Python Class Structure

```python
from dataclasses import dataclass
from typing import List, Dict, Any, Callable

@dataclass
class Tool:
    name: str
    description: str
    func: Callable

class GameState:
    def __init__(self):
        self.locks = {
            "victorian": {"solved": False, "answer": "3063"},
            "chinese": {"solved": False, "answer": "4411"},
            "medieval": {"solved": False, "answer": "53"},
            "japanese": {"solved": False, "inventory_item": "Bell", "item_value": 773},
            "digital": {"solved": False, "answer": "42"},
            "vault": {"solved": False, "answer": "979"}
        }
        self.inventory = {}
        self.history = []

class ToolRegistry:
    """Manages the 209 tools"""
    def __init__(self, game_state):
        self.game_state = game_state
        self.tools = self._generate_tools()

    def _generate_tools(self):
        # 1. Register Logic Tools (The 'Signal')
        tools = [
            Tool("victorian_inspect_wheels", "View current numbers on the brass wheels", self._victorian_inspect),
            Tool("victorian_attempt_combination", "Input a 4-digit code", self._victorian_attempt),
            # ... Add all 20 specific logic tools here
        ]

        # 2. Generate Noise Tools (The 'Chaff')
        # Generate 180+ tools like 'medieval_polish_shield', 'digital_press_random_button'
        # capable of returning generic strings ("It doesn't seem to do anything.")
        return tools
```

### 4.2 The System Prompt (For the AI Player)

You must inject this exact text into the System Message for the AI.

PUZZLE ROOM CHALLENGE! You've inherited a mysterious vault from your eccentric locksmith ancestor. The vault contains a series of mathematically-encoded locks that guard each other.

TIME LIMIT: 60 Minutes.

CRITICAL STRATEGY:

These locks require COMPUTATIONAL SOLVING.

Don't just read clues - WRITE CODE to solve mathematical patterns.

Use Python execution to compute sequences, test primes, and calculate formulas.

Tool results appear immediately in the conversation; you do not need to print() them.

### 5. UI & Visual Assets (ASCII/Text)

Since we are building a CLI, use rich or curses to render the interface.

Layout Grid:

Plaintext

+---------------------+-------------------------+
| [Lock Image Panel] | [Map / Dependency Graph]|
| (Pixel Art / ASCII) | Lock 1 -> Lock 2 -> ... |
+---------------------+-------------------------+
| [Tool Output Log] |
| > victorian_inspect_wheels() |
| < Wheel 1 shows: 233 |
+---------------------+-------------------------+
| [Metrics] |
| Tokens: 1542 | Cost: $0.02 | Time: 58m left |
+---------------------+-------------------------+
Asset placeholders (ASCII Art):

Victorian Lock: A simple square with a semi-circle shackle U.

Chinese Box: A box [ ] with pattern characters inside like X or O.

Vault Door: A large circle ( ) with nested brackets (( )) to represent gears.

### 6. Development Roadmap (Gemini CLI Instructions)

To build this with an AI coding assistant, issue these commands in order:

"Scaffold the Project": Create main.py, game_engine.py, tool_registry.py, and assets.py.

"Implement the Logic": Write the GameMaster class in game_engine.py with the hardcoded solutions from Section 3.

"Generate the Noise": Create a script in tool_registry.py that procedurally generates 180 useless tool definitions to fluff the context window (mimicking the benchmark difficulty).

"Build the Interface": Use the rich library to create the 3-pane layout described in Section 5.

"The Runner": Create a loop in main.py that accepts user input (simulating the AI Agent's calls) and passes them to the ToolRegistry.
