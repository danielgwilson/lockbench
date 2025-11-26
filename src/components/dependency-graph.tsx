import { Lock, Unlock } from "lucide-react";
import type { LockState } from "@/lib/game-engine";

/**
 * Mini pixel avatar for the active lock indicator - Claude's crab mascot.
 * Designed to match the size of Lucide icons (w-4 h-4 = 16x16).
 * Pattern: 1 = fill color, 2 = dark (eyes), 0 = transparent
 */
function MiniAvatar({ color = "#ff8c69" }: { color?: string }) {
  // 7x6 Claude crab pattern: body, eyes, arms, and 4 feet
  const pattern = [
    [0, 0, 1, 1, 1, 0, 0], // top of head
    [0, 1, 1, 1, 1, 1, 0], // head
    [0, 1, 2, 1, 2, 1, 0], // eyes (2 = dark)
    [1, 1, 1, 1, 1, 1, 1], // body with arms
    [0, 1, 0, 1, 0, 1, 0], // lower body
    [0, 1, 0, 0, 0, 1, 0], // feet
  ];

  return (
    <div className="w-4 h-4 flex flex-col justify-center items-center">
      {pattern.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={x}
              className="w-[2px] h-[2px]"
              style={{
                backgroundColor:
                  cell === 1 ? color : cell === 2 ? "#1a1a1a" : "transparent",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface DependencyGraphProps {
  locks: Record<string, LockState>;
  avatarColor?: string; // Customizable color for avatar (e.g., "#ff8c69" for Claude, "#0053D6" for Gemini)
  highlightColor?: string; // Color for unlocked/solved locks
}

export function DependencyGraph({
  locks,
  avatarColor = "#ff8c69", // Default coral/orange for Claude
  highlightColor = "#D98368", // Default highlight color
}: DependencyGraphProps) {
  const activeLockId =
    Object.values(locks).find((l) => !l.solved)?.id || "vault";

  const getNodeStatus = (id: string) => {
    const lock = locks[id];
    if (lock.solved) return "solved";
    const accessible = lock.requires.every((req) => locks[req].solved);
    return accessible ? "active" : "locked";
  };

  const Node = ({ id }: { id: string }) => {
    const status = getNodeStatus(id);
    const isActive = id === activeLockId;

    // Three states:
    // 1. locked: gray border, gray lock icon
    // 2. solved: highlight border, highlight unlock icon
    // 3. active: highlight border, shows avatar instead of lock icon
    let borderColor = "#555"; // locked (gray)
    let iconColor = "#777"; // locked (gray)
    let showUnlock = false;

    if (status === "solved") {
      borderColor = highlightColor;
      iconColor = highlightColor;
      showUnlock = true;
    } else if (status === "active") {
      borderColor = highlightColor;
      iconColor = highlightColor;
    }

    return (
      <div
        className="w-10 h-10 flex items-center justify-center border-2 bg-[#1a1a1a] relative"
        style={{ borderColor }}
      >
        {isActive ? (
          // Show mini avatar for active lock
          <MiniAvatar color={avatarColor} />
        ) : showUnlock ? (
          <Unlock className="w-4 h-4" style={{ color: iconColor }} />
        ) : (
          <Lock className="w-4 h-4" style={{ color: iconColor }} />
        )}
      </div>
    );
  };

  const Connector = ({
    vertical = false,
    horizontal = false,
  }: {
    vertical?: boolean;
    horizontal?: boolean;
  }) => (
    <div className={`${vertical ? "w-[2px] h-6" : "w-6 h-[2px]"} bg-[#555]`} />
  );

  return (
    <div className="flex flex-col items-center p-2">
      {/* Row 1: L1 -> L2 -> L3 */}
      <div className="flex items-center">
        <Node id="victorian" />
        <Connector />
        <Node id="chinese" />
        <Connector />
        <Node id="medieval" />
      </div>

      {/* Drop down from L3 to L4 */}
      <div className="flex w-full justify-end pr-[19px]">
        <Connector vertical />
      </div>

      {/* Row 2: L4 <- L5 <- L6 (Visually reversed) */}
      {/* Wait, the user said "top left, top middle, top right, bottom right, bottom middle, bottom left" */}
      {/* So L4 is Bottom Right? No, L4 is the next one. */}
      {/* L1(TL) -> L2(TM) -> L3(TR) */}
      {/*                    | */}
      {/*                    v */}
      {/* L6(BL) <- L5(BM) <- L4(BR) */}

      <div className="flex items-center justify-end w-full">
        <div className="flex items-center flex-row-reverse">
          <Node id="japanese" /> {/* L4 (BR) */}
          <Connector />
          <Node id="digital" /> {/* L5 (BM) */}
          <Connector />
          <Node id="library" /> {/* L6 (BL) */}
        </div>
      </div>

      {/* Drop down from L6 to L7 */}
      <div className="flex w-full justify-start pl-[19px]">
        <Connector vertical />
      </div>

      {/* Row 3: Vault (Wide) */}
      <div className="flex w-full justify-start">
        {(() => {
          const vaultStatus = getNodeStatus("vault");
          const isVaultActive = activeLockId === "vault";
          let vaultBorderColor = "#555";
          let vaultIconColor = "#777";
          let showVaultUnlock = false;

          if (vaultStatus === "solved") {
            vaultBorderColor = highlightColor;
            vaultIconColor = highlightColor;
            showVaultUnlock = true;
          } else if (vaultStatus === "active") {
            vaultBorderColor = highlightColor;
            vaultIconColor = highlightColor;
          }

          return (
            <div
              className="w-full h-10 flex items-center justify-center border-2 bg-[#1a1a1a] relative"
              style={{ borderColor: vaultBorderColor }}
            >
              {isVaultActive ? (
                <MiniAvatar color={avatarColor} />
              ) : showVaultUnlock ? (
                <Unlock className="w-4 h-4" style={{ color: vaultIconColor }} />
              ) : (
                <Lock className="w-4 h-4" style={{ color: vaultIconColor }} />
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
