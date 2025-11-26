"use client";

import React from "react";
import { LockVisual } from "@/components/tui/lock-visual";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
      {/* Test Case 1: Small container */}
      {/* <div className="flex items-center justify-center w-[220px] border border-blue-500">
        <LockVisual isLocked={true} />
      </div> */}
      <Card className="flex items-center w-[700px] h-[700px] justify-center rounded-2xl border border-2">
        <CardContent className="flex h-full w-full">
          <LockVisual isLocked={false} />
        </CardContent>
      </Card>
    </div>
  );
}
