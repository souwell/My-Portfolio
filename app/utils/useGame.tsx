import React, { useEffect, useState, useRef } from "react";

type UseGameProps = {
  canvasContainerRef?: React.RefObject<HTMLDivElement | null>;
  scale: number;
};

type ControlFunctions = {
  moveLeft: () => void;
  moveRight: () => void;
  jump: () => void;
  stopMoving: () => void;
};

export default function useGame({ canvasContainerRef, scale: SCALE }: UseGameProps): ControlFunctions {
  const playerRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const movingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const getWidth = () => {
    return window.innerWidth > 768 ? Math.min(Math.floor(window.innerWidth * 0.9), 1935) : window.innerWidth;
  };

  useEffect(() => {
    let observer: MutationObserver | null = null;

    const scrollSmoothTo = (hash: string) => {
      const element = document.getElementById(hash);
      if (element) {
        element.click();
        element.focus();
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const handleBlock = (i: number) => {
      switch (i) {
        case 0: scrollSmoothTo("profile"); break;
        case 1: scrollSmoothTo("projects"); break;
        case 2: window.location.href = "/game"; break;
        default: break;
      }
    }

    async function init(widthSize: number = window.innerWidth) {
      if (!canvasContainerRef) return;

      const kaplay = (await import("kaplay")).default;

      canvasContainerRef.current.innerHTML = "";

      const newCanvas = document.createElement("canvas");
      newCanvas.style.width = `${174 * (widthSize / SCALE / 174)}px`;
      newCanvas.style.height = `135px`;
      newCanvas.style.imageRendering = "pixelated";

      const canvas = canvasContainerRef.current.appendChild(newCanvas);
      canvasRef.current = canvas as HTMLCanvasElement;
      canvasContainerRef.current.style.filter = "";

      const k = kaplay({
        global: true,
        width: 174 * (widthSize / SCALE / 174),
        height: 107,
        crisp: true,
        scale: SCALE,
        canvas,
        letterbox: true,
      });

      const {
        loadSprite,
        add,
        sprite,
        pos,
        setGravity,
        rect,
        area,
        body,
        outline,
        rgb,
        onKeyDown,
        onKeyRelease,
        onKeyPress,
        opacity,
        scale,
        anchor,
        width,
        height,
        get,
      } = k;

      loadSprite("player", "/assets/well_sprites_v2.webp", {
        sliceX: 11,
        sliceY: 2,
        anims: {
          idle: { from: 0, to: 10, loop: true, speed: 6 },
          walking: { from: 11, to: 15, loop: true, speed: 12 },
          jumping: { from: 21, to: 21 },
        },
      });

      loadSprite("button-1", "/assets/p_projects.png", {
        sliceX: 27,
        anims: {
          idle: { from: 0, to: 26, loop: true, speed: 15 },
        },
      });
      loadSprite("button-2", "/assets/b_projects.png", {
        sliceX: 27,
        anims: {
          idle: { from: 0, to: 26, loop: true, speed: 15 },
        },
      });
      loadSprite("button-3", "/assets/b_game.png", {
        sliceX: 27,
        anims: {
          idle: { from: 0, to: 26, loop: true, speed: 15 },
        },
      });

      // Load both backgrounds
      loadSprite("bg-light", "/assets/bg-light.png");
      loadSprite("bg-dark", "/assets/bg-dark.png");

      const isInitiallyDark = document.documentElement.classList.contains("dark");
      const initialBg = isInitiallyDark ? "bg-dark" : "bg-light";

      for (let i = 0; i < window.innerWidth / 2 / 352; i++) {
        add([
          sprite(initialBg),
          pos(i * 352, 0),
          "game-bg"
        ]);
      }

      // Observer to swap sprites
      const updateBackground = () => {
        const isDark = document.documentElement.classList.contains("dark");
        const currentSprite = isDark ? "bg-dark" : "bg-light";

        get("game-bg").forEach((bg) => {
          bg.use(sprite(currentSprite));
        });
      };

      observer = new MutationObserver(updateBackground);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

      setGravity(1200);

      add([
        rect(width(), 13),
        pos(0, height() - 13),
        area(),
        body({ isStatic: true }),
        opacity(0),
      ]);

      add([
        rect(2, height()),
        pos(0, 0),
        area(),
        body({ isStatic: true }),
        opacity(0),
      ]);
      add([
        rect(2, height()),
        pos(width() - 2, 0),
        area(),
        body({ isStatic: true }),
        opacity(0),
      ]);

      const buttonCount = 3;
      const idealSpacing = width() / (buttonCount + 1);
      const spacing = Math.min(idealSpacing, 50);
      const totalWidth = spacing * (buttonCount - 1);
      const startX = (width() - totalWidth) / 2;
      const buttonY = height() / 5.5;

      for (let i = 0; i < buttonCount; i++) {
        const x = startX + spacing * i;

        const button = add([
          outline(2, rgb(0, 0, 0)),
          pos(x, buttonY),
          area({ scale: 0.8 }),
          sprite(`button-${i + 1}`),
          scale(1),
          anchor("center"),
          "menu-button",
          { index: i }
        ]);

        button.play?.("idle");
        button.onHover(() => button.scaleTo(1.15));
        button.onHoverEnd(() => button.scaleTo(1));
        button.onClick(() => handleBlock(i));
      }

      const player = add([
        pos(10, height() - 50),
        area(),
        body(),
        outline(2, rgb(255, 255, 255)),
        sprite("player"),
        "player",
      ]);

      player.play("idle");
      player.flipX = true;

      playerRef.current = player;

      onKeyDown("left", () => {
        player.move(-80, 0);
        player.flipX = false;
        if (player.isGrounded() && player.curAnim() !== "walking")
          player.play("walking");
      });

      onKeyDown("right", () => {
        player.move(80, 0);
        player.flipX = true;
        if (player.isGrounded() && player.curAnim() !== "walking")
          player.play("walking");
      });

      onKeyRelease("left", () => {
        if (player.isGrounded()) player.play("idle");
      });

      onKeyRelease("right", () => {
        if (player.isGrounded()) player.play("idle");
      });

      onKeyPress("space", () => {
        if (player.isGrounded()) {
          player.jump(350);
          player.play("jumping");
        }
      });

      player.onGround(() => player.play("idle"));

      player.onCollide("menu-button", (block) => {
        handleBlock(block.index);
      });
    }

    init(getWidth());

    const handleScroll = () => {
      if (window.scrollY === 0 && canvasRef?.current) {
        canvasRef.current.focus();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      if (observer) observer.disconnect();
      if (movingIntervalRef.current) {
        clearInterval(movingIntervalRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Control functions for external use (mobile buttons)
  const moveLeft = () => {
    if (!playerRef.current) return;

    if (movingIntervalRef.current) {
      clearInterval(movingIntervalRef.current);
    }

    movingIntervalRef.current = setInterval(() => {
      if (playerRef.current) {
        playerRef.current.move(-80, 0);
        playerRef.current.flipX = false;
        if (playerRef.current.isGrounded() && playerRef.current.curAnim() !== "walking") {
          playerRef.current.play("walking");
        }
      }
    }, 16);
  };

  const moveRight = () => {
    if (!playerRef.current) return;

    if (movingIntervalRef.current) {
      clearInterval(movingIntervalRef.current);
    }

    movingIntervalRef.current = setInterval(() => {
      if (playerRef.current) {
        playerRef.current.move(80, 0);
        playerRef.current.flipX = true;
        if (playerRef.current.isGrounded() && playerRef.current.curAnim() !== "walking") {
          playerRef.current.play("walking");
        }
      }
    }, 16);
  };

  const jump = () => {
    if (!playerRef.current) return;

    if (playerRef.current.isGrounded()) {
      playerRef.current.jump(350);
      playerRef.current.play("jumping");
    }
  };

  const stopMoving = () => {
    if (movingIntervalRef.current) {
      clearInterval(movingIntervalRef.current);
      movingIntervalRef.current = null;
    }

    if (playerRef.current && playerRef.current.isGrounded()) {
      playerRef.current.play("idle");
    }
  };

  return {
    moveLeft,
    moveRight,
    jump,
    stopMoving,
  };
}