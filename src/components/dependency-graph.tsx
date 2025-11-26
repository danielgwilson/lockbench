import React from "react";
import { Lock, Unlock } from "lucide-react";
import { LockState } from "@/lib/game-engine";
import { PixelLock } from "./pixel-lock";

interface DependencyGraphProps {
  locks: Record<string, LockState>;
}

export function DependencyGraph({ locks }: DependencyGraphProps) {
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

    let border = "border-[#555]";
    let icon = <Lock className="w-4 h-4 text-[#777]" />;

    if (status === "solved") {
      border = "border-[#e5e5e5]";
      icon = <Unlock className="w-4 h-4 text-[#e5e5e5]" />;
    } else if (status === "active") {
      border = "border-[#e5e5e5]";
      icon = <Lock className="w-4 h-4 text-[#e5e5e5]" />;
    }

    return (
      <div
        className={`w-10 h-10 flex items-center justify-center border-2 ${border} bg-[#1a1a1a] relative`}
      >
        {icon}
        {isActive && (
          <div className="absolute -top-2 -left-2 z-10">
            <PixelLock type="avatar" className="scale-[0.5]" color="#ff8c69" />
          </div>
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

      {/* Row 3: L7 (Wide) */}
      <div className="flex w-full justify-start">
        <div
          className={`w-full h-10 flex items-center justify-center border-2 border-[#555] bg-[#1a1a1a] relative`}
        >
          <Lock className="w-4 h-4 text-[#777]" />
          {activeLockId === "vault" && (
            <div className="absolute -top-2 left-4 z-10">
              <PixelLock
                type="avatar"
                className="scale-[0.5]"
                color="#ff8c69"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
