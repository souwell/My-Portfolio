"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, MoveUp, Keyboard } from "lucide-react";
import React from "react";
import { PiArrowFatLineUp } from "react-icons/pi";

type GameControlsProps = {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onJump: () => void;
  onStopMoving: () => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
};

export default function GameControls({
  onMoveLeft,
  onMoveRight,
  onJump,
  onStopMoving,
  containerRef,
}: GameControlsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleTouchStart = (action: "left" | "right" | "jump") => {
    setActiveButton(action);
    if (action === "left") onMoveLeft();
    else if (action === "right") onMoveRight();
    else if (action === "jump") onJump();
  };

  const handleTouchEnd = () => {
    setActiveButton(null);
    onStopMoving();
  };

  // Mobile controls - Joystick buttons
  if (isMobile) {
    return (
      <div className="absolute bottom-1.5 left-0 right-0 z-40 pointer-events-none">
        <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-end pointer-events-auto">
          {/* D-pad esquerdo */}
          <div className="flex gap-2">
            <button
              onTouchStart={() => handleTouchStart("left")}
              onTouchEnd={handleTouchEnd}
              onMouseDown={() => handleTouchStart("left")}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
              className={`w-10 h-10 rounded-md flex items-center justify-center
                         bg-background/80 backdrop-blur-sm border-2 border-border
                         transition-all duration-150 active:scale-95
                         ${activeButton === "left" ? "bg-primary/20 scale-95" : ""}
                         shadow-lg`}
              aria-label="Move left"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <button
              onTouchStart={() => handleTouchStart("right")}
              onTouchEnd={handleTouchEnd}
              onMouseDown={() => handleTouchStart("right")}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
              className={`w-10 h-10 rounded-md flex items-center justify-center
                         bg-background/80 backdrop-blur-sm border-2 border-border
                         transition-all duration-150 active:scale-95
                         ${activeButton === "right" ? "bg-primary/20 scale-95" : ""}
                         shadow-lg`}
              aria-label="Move right"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

          {/* Botão de pulo */}
          <button
            onTouchStart={() => handleTouchStart("jump")}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => handleTouchStart("jump")}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
            className={`w-10 h-10 rounded-md flex items-center justify-center
                       bg-primary/90 backdrop-blur-sm border-2 border-primary
                       transition-all duration-150 active:scale-95
                       ${activeButton === "jump" ? "bg-primary scale-95" : ""}
                       shadow-lg text-primary-foreground`}
            aria-label="Jump"
          >
            <PiArrowFatLineUp size="1.5rem" />
          </button>
        </div>
      </div>
    );
  }

  // Desktop controls - Visual indicators
  return (
    <div className="absolute bottom-4 right-4 2xl:right-[10%] z-40 pointer-events-none hidden md:block">
      <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Keyboard className="w-5 h-5" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                <kbd className="px-2 py-1 bg-muted rounded text-xs border border-border">←</kbd>
                <kbd className="px-2 py-1 bg-muted rounded text-xs border border-border">→</kbd>
              </div>
              <span className="text-xs">Mover</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-muted rounded text-xs border border-border min-w-[48px] text-center">
                Space
              </kbd>
              <span className="text-xs">Pular</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
