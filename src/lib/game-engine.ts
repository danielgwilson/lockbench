export type ToolCallback = (args: string[]) => string;

export interface Tool {
  name: string;
  description: string;
  func: ToolCallback;
}

export interface LockState {
  id: string;
  name: string;
  solved: boolean;
  answer: string;
  requires: string[]; // IDs of locks that must be solved first
  description: string;
}

export interface GameState {
  locks: Record<string, LockState>;
  inventory: string[];
  history: string[];
}

export class GameEngine {
  state: GameState;
  tools: Tool[];

  constructor() {
    this.state = this.initializeState();
    this.tools = this.initializeTools();
  }

  private initializeState(): GameState {
    return {
      locks: {
        victorian: {
          id: "victorian",
          name: "Victorian Lock",
          solved: false,
          answer: "3063",
          requires: [],
          description: "A heavy brass padlock with three spinning wheels.",
        },
        chinese: {
          id: "chinese",
          name: "Chinese Puzzle Box",
          solved: false,
          answer: "4411",
          requires: ["victorian"],
          description:
            "An intricate wooden box with sliding tiles and dragon carvings.",
        },
        medieval: {
          id: "medieval",
          name: "Medieval Shield",
          solved: false,
          answer: "53",
          requires: ["victorian"],
          description: "A weathered heraldic shield mounted on the wall.",
        },
        japanese: {
          id: "japanese",
          name: "Antique Japanese Lock",
          solved: false,
          answer: "773",
          requires: ["chinese"],
          description: "A rusted iron mechanism protecting a small shrine.",
        },
        digital: {
          id: "digital",
          name: "Digital Keypad",
          solved: false,
          answer: "42",
          requires: ["medieval"],
          description: "A modern 0-9 keypad glowing with a faint blue light.",
        },
        library: {
          id: "library",
          name: "Manuscript Library",
          solved: false, // Not really a lock, but a gate for info
          answer: "OPEN", // Auto-opens or just provides info
          requires: ["digital"],
          description: "Rows of dusty bookshelves.",
        },
        vault: {
          id: "vault",
          name: "The Final Vault",
          solved: false,
          answer: "979",
          requires: ["library", "japanese"], // Needs bell from Japanese lock path effectively
          description: "A massive circular bank vault door.",
        },
      },
      inventory: [],
      history: ["Welcome to the Puzzle Room Challenge. You have 60 minutes."],
    };
  }

  private initializeTools(): Tool[] {
    const tools: Tool[] = [];

    // --- Victorian Lock Tools ---
    tools.push({
      name: "victorian_inspect_wheels",
      description: "View current numbers on the brass wheels",
      func: () => "Wheel 1: 233\nWheel 2: 239\nWheel 3: 251",
    });
    tools.push({
      name: "victorian_read_plaque",
      description: "Read the inscription on the lock",
      func: () =>
        '"Positions mark the golden spiral\'s path... Sum reveals eternal truth... Masked by fourth power of ten."',
    });
    tools.push({
      name: "victorian_attempt_combination",
      description:
        "Input a 4-digit code. Usage: victorian_attempt_combination <code_number>",
      func: (args) => this.attemptLock("victorian", args[0]),
    });

    // --- Chinese Box Tools ---
    tools.push({
      name: "chinese_peer_inside",
      description: "Look through the gaps in the tiles",
      func: () => '"Four dragons guard the pearl. North, South, East, West."',
    });
    tools.push({
      name: "chinese_inspect_panels",
      description: "Examine the sliding panels",
      func: () => "The panels are numbered: 4, 4, 1, 1.",
    });
    tools.push({
      name: "chinese_attempt_alignment",
      description:
        "Align the tiles. Usage: chinese_attempt_alignment <code_number>",
      func: (args) => this.attemptLock("chinese", args[0]),
    });

    // --- Medieval Shield Tools ---
    tools.push({
      name: "medieval_measure_ward_angle",
      description: "Measure the angle of the shield's ward",
      func: () => "The angle is exactly 53 degrees.",
    });
    tools.push({
      name: "medieval_inspect_heraldry",
      description: "Examine the shield's coat of arms",
      func: () => '"The prime defender stands alone."',
    });
    tools.push({
      name: "medieval_shout_password",
      description:
        "Shout a password at the shield. Usage: medieval_shout_password <number>",
      func: (args) => this.attemptLock("medieval", args[0]),
    });

    // --- Japanese Lock Tools ---
    tools.push({
      name: "japanese_inspect_shrine",
      description: "Look at what the lock is protecting",
      func: () => "A ceremonial bell rests here.",
    });
    tools.push({
      name: "japanese_scrutinize_mechanism",
      description: "Closely examine the rust patterns",
      func: () => 'You find a faint etching: "773".',
    });
    tools.push({
      name: "japanese_unlock_with_code",
      description:
        "Enter the code. Usage: japanese_unlock_with_code <code_number>",
      func: (args) => {
        const result = this.attemptLock("japanese", args[0]);
        if (
          this.state.locks.japanese.solved &&
          !this.state.inventory.includes("Bell")
        ) {
          this.state.inventory.push("Bell");
          return result + "\n[LOOT DROP] You obtained: Bell (Value: 773)";
        }
        return result;
      },
    });

    // --- Digital Keypad Tools ---
    tools.push({
      name: "digital_scan_fingerprint",
      description: "Scan for latent fingerprints",
      func: () =>
        'Bio-residue suggests the user was thinking about "Life, the Universe, and Everything".',
    });
    tools.push({
      name: "digital_enter_pin",
      description: "Enter the PIN. Usage: digital_enter_pin <number>",
      func: (args) => this.attemptLock("digital", args[0]),
    });

    // --- Library Tools ---
    tools.push({
      name: "library_read_journal",
      description: "Read the open journal on the desk",
      func: () => {
        // Auto-solve library if accessed
        if (!this.state.locks.library.solved) {
          this.state.locks.library.solved = true;
        }
        return '"The final vault requires the sum of our history, minus the ringing of the bell."';
      },
    });

    // --- Vault Tools ---
    tools.push({
      name: "vault_inspect_door",
      description: "Examine the massive vault door",
      func: () =>
        "It requires a final calculation based on all previous challenges.",
    });
    tools.push({
      name: "vault_turn_wheel",
      description:
        "Turn the vault wheel to a number. Usage: vault_turn_wheel <number>",
      func: (args) => this.attemptLock("vault", args[0]),
    });

    // --- Noise Tools ---
    this.generateNoiseTools(tools);

    return tools;
  }

  private attemptLock(lockId: string, input: string): string {
    const lock = this.state.locks[lockId];
    if (!lock) return "Error: Unknown lock.";

    // Check dependencies
    for (const reqId of lock.requires) {
      if (!this.state.locks[reqId].solved) {
        return `Action failed: The ${this.state.locks[reqId].name} must be solved first.`;
      }
    }

    if (lock.solved) {
      return `The ${lock.name} is already solved.`;
    }

    if (input === lock.answer) {
      lock.solved = true;
      return `SUCCESS! The ${lock.name} unlocks with a satisfying click.`;
    } else {
      return `FAILURE. The ${lock.name} does not respond to "${input}".`;
    }
  }

  private generateNoiseTools(tools: Tool[]) {
    const namespaces = [
      "victorian",
      "chinese",
      "medieval",
      "japanese",
      "digital",
      "library",
      "vault",
    ];
    const actions = [
      "polish",
      "kick",
      "yell_at",
      "caress",
      "lick",
      "blow_on",
      "admire",
      "poke",
    ];
    const objects = [
      "brass",
      "wood",
      "stone",
      "dust",
      "hinge",
      "floor",
      "ceiling",
      "darkness",
    ];

    // Generate ~50 noise tools (reduced from 189 for web performance/usability, but enough for flavor)
    for (let i = 0; i < 50; i++) {
      const ns = namespaces[Math.floor(Math.random() * namespaces.length)];
      const act = actions[Math.floor(Math.random() * actions.length)];
      const obj = objects[Math.floor(Math.random() * objects.length)];
      const name = `${ns}_${act}_${obj}`;

      // Avoid duplicates
      if (!tools.find((t) => t.name === name)) {
        tools.push({
          name: name,
          description: "A generic interaction.",
          func: () => "Nothing happens.",
        });
      }
    }
  }

  public executeTool(toolName: string, args: string[]): string {
    const tool = this.tools.find((t) => t.name === toolName);
    if (!tool) {
      return `Error: Tool "${toolName}" not found.`;
    }

    const result = tool.func(args);
    this.state.history.push(`> ${toolName}(${args.join(", ")})`);
    this.state.history.push(result);
    return result;
  }
}
