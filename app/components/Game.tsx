"use client";

import StarSeparator from "@/app/components/StarSeparator";
import GameControls from "@/app/components/GameControls";
import useGame from "@/app/utils/useGame";
import React from "react";

const SCALE = 4;

export default function Game() {
  const canvasContainerRef = React.useRef<HTMLDivElement | null>(null);
  const controls = useGame({ canvasContainerRef, scale: SCALE });

  return (
    <>
      <section className="game-section overflow-hidden relative">
        <div
          className="overflow-hidden mx-auto"
          style={{
            minHeight: 106 * SCALE,
          }}
          ref={canvasContainerRef}
        >

        </div>
        <GameControls
          onMoveLeft={controls.moveLeft}
          onMoveRight={controls.moveRight}
          onJump={controls.jump}
          onStopMoving={controls.stopMoving}
          containerRef={canvasContainerRef}
        />
      </section>
      <StarSeparator id="profile" />
    </>
  );
}
