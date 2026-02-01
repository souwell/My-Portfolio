"use client";

import { Pointer } from "@/components/ui/pointer";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import React, { useEffect } from "react";

export default function useGame() {
  const canvasContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    let k: any = null;

    async function init() {

      const kaplay = (await import("kaplay")).default;

      const BASE_SIZE = 174;

      function computeScale() {
        const tilesX = Math.floor(window.innerWidth / BASE_SIZE);
        const tilesY = Math.floor(window.innerHeight / BASE_SIZE);
        return Math.max(1, Math.min(tilesX, tilesY));
      }

      const SCALE = computeScale();

      k = kaplay({
        global: true,
        root: canvasContainerRef.current || document.body,
        width: BASE_SIZE,
        height: BASE_SIZE,
        crisp: true,
        scale: SCALE,
        touchToMouse: true,
        background: [0, 0, 0, 0],
      });

      const {
        loadSprite,
        add,
        sprite,
        pos,
        scale,
        width,
        height,
        vec2,
        rand,
        anchor,
        loop,
        wait,
        get,
        area,
        addKaboom,
        color,
        rgb,
        text,
        dt,
        choose,
        shake,
        z,
        scene,
        go,
        rect,
        outline,
        onUpdate,
        center,
        onKeyPress,
        wave,
        time,
        opacity,
        fixed,
        play,
        loadSound,
        onClick,
        tween,
        easings,
        loadFont,
      } = k;

      // --- ASSETS ---
      loadSprite("background", "/assets/square.png", {
        sliceX: 19,
        anims: {
          idle: { from: 0, to: 18, loop: true, speed: 12 },
        },
      });

      loadSprite("spike", "/assets/spike.png", {
        sliceX: 4,
        anims: {
          idle: { from: 0, to: 3, loop: true, speed: 12 },
        },
      });

      loadSprite("cloud", "/assets/cloud_spr.png", {
        sliceX: 8,
        anims: {
          idle: { from: 0, to: 7, loop: false, speed: 20 },
        },
      });

      loadSprite("bug", "/assets/bug_spr.png", {
        sliceX: 4,
        anims: {
          idle: { from: 0, to: 3, loop: true, speed: 24 },
        },
      });

      loadSprite("bug_circle", "/assets/bug_circ_spr.png", {
        sliceX: 5,
        anims: {
          idle: { from: 0, to: 4, loop: true, speed: 12 },
        },
      });

      loadSprite("bug_splash", "/assets/bug_splash.png", {
        sliceX: 4,
        anims: {
          idle: { from: 0, to: 3, loop: true, speed: 12 },
        },
      });

      loadSprite("bug_bomb", "/assets/bug_bomb_spr.png", {
        sliceX: 6,
        anims: {
          idle: { from: 0, to: 4, loop: true, speed: 12 },
        },
      });

      loadSprite("ink_splat", "/assets/splash.png");
      loadSprite("title", "/assets/title.png", {
        sliceX: 5,
        anims: {
          idle: { from: 0, to: 4, loop: true, speed: 7 },
        },
      });

      loadSprite("title_bg", "/assets/back-teste.png");
      loadFont("Press Start 2P", "/assets/fonts/PressStart2P-Regular.ttf");

      loadSound("score", "/assets/audio/score_increment.wav");
      loadSound("mosquito_spawn", "/assets/audio/mosquito_spawn.wav");
      loadSound("mosquito_spawn_2", "/assets/audio/mosquito_spawn_2.wav");
      loadSound("mosquito_1", "/assets/audio/mosquito_1.wav");
      loadSound("mosquito_2", "/assets/audio/mosquito_2.wav");
      loadSound("mosquito_3", "/assets/audio/mosquito_3.wav");
      loadSound("mosquito_4", "/assets/audio/mosquito_4.wav");
      loadSound("mosquito_5", "/assets/audio/mosquito_5.wav");
      loadSound("mosquito_6", "/assets/audio/mosquito_6.wav");
      loadSound("bomb_mosquito", "/assets/audio/bomb_mosquito.wav");
      loadSound("bomb_explode", "/assets/audio/bomb_explode.wav");
      loadSound("bomb_spawn", "/assets/audio/bomb_spawn.wav");


      loadSprite("error-bg", "/assets/error.png", {
        sliceX: 51,
        anims: {
          idle: { from: 0, to: 50, loop: true, speed: 24 },
        }
      });


      loadSprite("error-bg-2", "/assets/error.jpg");

      scene("game", () => {
        const bg = add([
          sprite("background"),
          scale(0.7),
          opacity(0.3),
          z(-10),
        ]);
        bg.play("idle");

        let maxHealth = 100;
        let curHealth = 1;
        let score = 0;
        let startTime = time();

        // UI
        add([
          rect(60, 6, { radius: 1 }),
          pos(width() - 65, 5),
          color(0, 0, 0),
          outline(1, rgb(255, 255, 255)),
          z(100),
          fixed()
        ]);

        const healthBar = add([
          rect(58, 4, { radius: 1 }),
          pos(width() - 64, 6),
          color(0, 255, 0),
          z(101),
          fixed()
        ]);

        const scoreLabel = add([
          text("0", { size: 10, font: "Press Start 2P" }),
          pos(5, 5),
          color(255, 255, 255),
          z(100),
          fixed()
        ]);

        // --- BUG CONFIG ---
        const BUG_TYPES = [
          {
            name: "standard",
            scale: 0.9,
            speedMin: 40,
            speedMax: 120,
            chance: 0.40,
            sprite: "bug",
          },
          {
            name: "heavy",
            scale: 1.2,
            speedMin: 20,
            speedMax: 50,
            chance: 0.15,
            sprite: "bug",
          },
          {
            name: "spinner",
            scale: 0.9,
            speedMin: 100,
            speedMax: 100,
            chance: 0.15,
            sprite: "bug_circle",
          },
          {
            name: "square",
            scale: 0.9,
            speedMin: 60,
            speedMax: 80,
            chance: 0.15,
            sprite: "bug_circle",
            color: rgb(250, 250, 255)
          },
          {
            name: "splasher",
            scale: 1.1,
            speedMin: 30, // Move slower to give player time
            speedMax: 40,
            chance: 0.15,
            sprite: "bug_splash",
            // tint: true
          }
        ];

        function getOffscreenPos(margin = 40) {
          const side = choose(["top", "bottom", "left", "right"]);
          const w = width();
          const h = height();
          switch (side) {
            case "top": return vec2(rand(0, w), -margin);
            case "bottom": return vec2(rand(0, w), h + margin);
            case "left": return vec2(-margin, rand(0, h));
            case "right": return vec2(w + margin, rand(0, h));
            default: return vec2(-margin, -margin);
          }
        }

        function pickBugType(hasCustomPos: boolean) {
          const r = rand(0, 1);
          let cumulative = 0;
          for (const type of BUG_TYPES) {
            if (type.name === "splasher" && hasCustomPos) continue; // Don't pick splasher if custom pos
            cumulative += type.chance;
            if (r <= cumulative) return type;
          }
          return BUG_TYPES[0];
        }

        // --- SPLASH EFFECT ---
        function triggerSquidInk() {
          play("bomb_explode", { volume: 0.3, detune: -200 }); // Low thud

          // Random offset for visual variety
          const offset = vec2(rand(-20, 20), rand(-20, 20));
          const spawnPos = center().add(offset);

          // Scale 1.3 to 1.6 relative to 100px base SVG on 174px screen -> ~30% coverage
          const targetScale = rand(4, 5);

          const ink = add([
            sprite("ink_splat"),
            pos(spawnPos),
            anchor("center"),
            scale(1),
            opacity(1),
            fixed(),
            z(200), // Very top
            "ink_overlay",
            {
              lifeTime: 5.0,
              state: "grow" // grow, stay, fade
            }
          ]);

          // State Machine for Ink
          ink.onUpdate(() => {
            if (ink.state === "grow") {
              ink.scaleTo(ink.scale.x + dt() * 10);
              if (ink.scale.x >= targetScale) {
                ink.scaleTo(targetScale);
                ink.state = "stay";
              }
            } else if (ink.state === "stay") {
              ink.lifeTime -= dt();
              ink.scale.y += dt() * 0.003; // Slight vertical stretch
              ink.pos.y += dt() * 2; // Slight downward drift
              if (ink.lifeTime <= 0) {
                ink.state = "fade";
              }
            } else if (ink.state === "fade") {
              ink.pos.y += dt() * 5; // Faster downward drift
              ink.scale.y += dt() * 0.003; // Slight vertical stretch
              ink.opacity -= dt(); // Fade out over 1 sec
              if (ink.opacity <= 0) ink.destroy();
            }
          });
        }

        function spawnBug(customPos: any = null, forceType: any = null) {
          const difficulty = 1 + (time() - startTime) / 60;
          const type = forceType || pickBugType(!!customPos);

          let startPos = customPos;

          // Override spawn for Splasher (Always Top)
          if (!startPos) {
            if (type.name === "splasher") {
              startPos = vec2(rand(20, width() - 20), -30);
            } else {
              startPos = getOffscreenPos(30);
            }
          }

          let speedMult = difficulty;
          if (type.name === "spinner") speedMult = 1 + (difficulty - 1) * 0.4;

          const bug = add([
            "bug",
            pos(startPos),
            scale(type.scale),
            anchor("center"),
            area(),
            sprite(type.sprite),
            type.color ? color(type.color) : color(255, 255, 255),
            {
              dest: vec2(width() / 2, height() / 2),
              speed: rand(type.speedMin, type.speedMax) * speedMult,
              typeData: type,
              // Orbit Props
              isOrbiting: false,
              orbitAngle: 0,
              orbitRadius: rand(40, 60),
              orbitCenter: vec2(width() / 2, height() / 2),
              orbitSpeed: (rand(1, 2.5) * (rand() < 0.5 ? 1 : -1)) * speedMult,
              // Square Props
              squareState: 0,
              squareTimer: 0,
              squareSide: rand(40, 70),
              squareCenter: vec2(rand(40, width() - 40), rand(40, height() - 40)),
              isSquaring: false,
              // Splasher Props
              splasherTimer: 3.0,
            }
          ]);

          bug.play("idle");

          bug.onClick(() => {
            const c = add([
              sprite("cloud"),
              pos(bug.pos),
              anchor("center"),
              scale(0.4),
              z(150),
            ]);
            c.play("idle");
            c.onAnimEnd(() => c.destroy());

            score++;
            if (score % 50 === 0) play("score");

            play(`mosquito_${Math.floor(rand(1, 7))}`, {
              volume: 0.3,
              speed: type.name === "splasher" ? 0.7 : 1.0
            });

            scoreLabel.text = score.toString();
            curHealth = Math.min(curHealth + 2, maxHealth);
            bug.destroy();
          });

          // --- BEHAVIOR SWITCH ---
          if (type.name === "splasher") {
            // Linear descent & Timer
            bug.onUpdate(() => {
              bug.move(0, bug.speed); // Straight down

              if (bug.pos.y > height()) {
                triggerSquidInk();
                bug.destroy();
              }

              // If it goes off screen bottom without splashing (unlikely with timer, but safe)
              if (bug.pos.y > height() + 50) bug.destroy();
            });

          } else if (type.name === "spinner") {
            play("mosquito_spawn", { volume: 0.2 });
            bug.onUpdate(() => {
              if (bug.isOrbiting) {
                bug.orbitAngle += dt() * bug.orbitSpeed;
                bug.pos = bug.orbitCenter.add(
                  vec2(Math.cos(bug.orbitAngle), Math.sin(bug.orbitAngle)).scale(bug.orbitRadius)
                );
                bug.flipX = bug.pos.x >= bug.orbitCenter.x;
              } else {
                const distToCenter = bug.pos.dist(bug.orbitCenter);
                if (distToCenter <= bug.orbitRadius) {
                  bug.isOrbiting = true;
                  bug.orbitAngle = bug.pos.sub(bug.orbitCenter).angle() * (Math.PI / 180);
                } else {
                  const dir = bug.orbitCenter.sub(bug.pos).unit();
                  bug.move(dir.scale(bug.speed));
                  bug.flipX = dir.x >= 0;
                }
              }
            });
          } else if (type.name === "square") {
            play("bomb_spawn", { volume: 0.05, speed: 1.5, detune: 30 });
            bug.onUpdate(() => {
              if (bug.isSquaring) {
                bug.squareTimer -= dt();
                if (bug.squareTimer <= 0) {
                  bug.squareState = (bug.squareState + 1) % 4;
                  bug.squareTimer = bug.squareSide / bug.speed;
                }
                let dir = vec2(0, 0);
                if (bug.squareState === 0) dir = vec2(1, 0);
                else if (bug.squareState === 1) dir = vec2(0, 1);
                else if (bug.squareState === 2) dir = vec2(-1, 0);
                else if (bug.squareState === 3) dir = vec2(0, -1);
                bug.move(dir.scale(bug.speed));
                if (dir.x !== 0) bug.flipX = dir.x > 0;
              } else {
                const dist = bug.pos.dist(bug.squareCenter);
                if (dist < 5) {
                  bug.isSquaring = true;
                  bug.squareTimer = bug.squareSide / bug.speed;
                } else {
                  const dir = bug.squareCenter.sub(bug.pos).unit();
                  bug.move(dir.scale(bug.speed));
                  if (dir.x !== 0) bug.flipX = dir.x > 0;
                }
              }
            });
          } else {
            // Standard Logic
            const pickNewSpot = () => {
              if (!bug.exists()) return;
              bug.dest = vec2(rand(0, width()), rand(0, height()));
              const currentDiff = 1 + (time() - startTime) / 60;
              bug.speed = rand(bug.typeData.speedMin, bug.typeData.speedMax) * currentDiff;
              wait(rand(0.5, 1.5) / currentDiff, pickNewSpot);
            };
            pickNewSpot();
            bug.onUpdate(() => {
              const distance = bug.pos.dist(bug.dest);
              if (distance < 5) {
                bug.flipX = false;
                return;
              }
              const dir = bug.dest.sub(bug.pos).unit();
              bug.move(dir.scale(bug.speed));
              bug.flipX = dir.x >= 0;
            });
          }
        }

        function spawnSpike() {
          // Random position with padding
          const posX = rand(30, width() - 30);
          const posY = rand(30, height() - 30);

          const s = add([
            sprite("spike"),
            pos(posX, posY),
            anchor("center"),
            area(),
            scale(0), // Start invisible for pop-in
            z(50),    // Draw above background but below bugs
            "spike",
            {
              lifeTime: rand(2.5, 4.5), // Disappear after a few seconds
            }
          ]);

          s.play("idle");

          // Pop-in and Lifecycle animation
          s.onUpdate(() => {
            // Pop in
            if (s.scale.x < 1) s.scaleTo(s.scale.x + dt() * 6);

            // Timer logic
            s.lifeTime -= dt();
            if (s.lifeTime < 0.5) {
              s.opacity = wave(0, 1, time() * 15); // Flicker before vanishing
            }
            if (s.lifeTime <= 0) s.destroy();
          });

          // Penalty on click
          s.onClick(() => {
            addKaboom(s.pos, { scale: 0.8 });
            shake(10);
            play("bomb_explode", { speed: 2, volume: 0.5 }); // Sharp explosion sound

            // Decrement health directly
            curHealth = Math.max(0, curHealth - 15);

            // Visual feedback text
            add([
              text("-15", { size: 12, font: "Press Start 2P" }),
              pos(s.pos),
              color(255, 0, 0),
              anchor("center"),
              z(200),
              opacity(1),
              "damage_text"
            ]);

            s.destroy();
          });
        }

        // Handle damage text movement
        onUpdate("damage_text", (t) => {
          t.pos.y -= dt() * 30;
          t.opacity -= dt();
          if (t.opacity <= 0) t.destroy();
        });

        // Spawn loop for spikes (less frequent than bugs)
        loop(2.5, () => {
          if (rand() < 0.5) spawnSpike(); // 50% chance every 2.5s
        });

        // --- BOSS LOGIC ---
        function spawnBoss() {
          const difficulty = 1 + (time() - startTime) / 60;
          const startPos = getOffscreenPos(60);

          const boss = add([
            sprite("bug_bomb"),
            pos(startPos),
            scale(1),
            area(),
            anchor("center"),
            "boss",
            {
              dest: vec2(width() / 2, height() / 2),
              speed: 50 * difficulty,
              timer: difficulty < 2 ? 5 : 3,
            }
          ]);
          boss.play("idle");
          play("bomb_spawn", { volume: 0.1, speed: 0.5, detune: -50 });


          boss.onClick(() => {
            const c = add([
              sprite("cloud"),
              pos(boss.pos),
              anchor("center"),
              scale(0.5),
              z(150),
            ]);
            c.play("idle");
            c.onAnimEnd(() => c.destroy());

            score += 10;
            if (score % 50 === 0) play("score");
            play("bomb_mosquito", { volume: 0.4 });
            scoreLabel.text = score.toString();
            curHealth = Math.min(curHealth + 20, maxHealth);
            boss.destroy();
          });

          const pickNewSpot = () => {
            if (!boss.exists()) return;
            boss.dest = vec2(rand(0, width()), rand(0, height()));
            wait(2.0, pickNewSpot);
          };
          pickNewSpot();

          boss.onUpdate(() => {
            const dir = boss.dest.sub(boss.pos).unit();
            boss.move(dir.scale(boss.speed));
            boss.timer -= dt();

            if (boss.timer <= 0) {
              addKaboom(boss.pos, { scale: 2 });
              shake();
              curHealth -= 30;
              play("bomb_explode", { volume: 0.6 });
              for (let i = 0; i < 20; i++) spawnBug(boss.pos);
              boss.destroy();
            }
          });
        }

        spawnBug();

        // --- SPAWN LOOP ---
        function runSpawnLoop() {
          const difficulty = 1 + (time() - startTime) / 60;
          if (get("bug").length < 25) spawnBug();
          const nextSpawnTime = Math.max(0.4, 2.5 / difficulty);
          wait(nextSpawnTime, runSpawnLoop);
        }
        runSpawnLoop();

        // --- BOSS LOOP ---
        let canSpawnBoss = false;
        loop(15, () => {
          if (get("bug").length < 30 && canSpawnBoss) {
            const difficulty = 1 + (time() - startTime) / 60;
            const bossCount = Math.floor(difficulty);
            for (let i = 0; i < bossCount; i++) wait(i * 0.5, () => spawnBoss());
          } else {
            canSpawnBoss = true;
          }
        });

        // --- HEALTH DRAIN ---
        onUpdate(() => {
          const difficulty = 1 + (time() - startTime) / 60;
          const bugs = get("bug").length;
          const bosses = get("boss").length;
          const drain = ((bugs * 0.30) + (bosses * 3.5)) * Math.sqrt(difficulty);

          curHealth -= drain * dt();
          if (curHealth < 0) curHealth = 0;

          const ratio = curHealth / maxHealth;
          healthBar.width = 58 * ratio;
          healthBar.color = ratio < 0.3 ? rgb(255, 0, 0) : ratio < 0.6 ? rgb(255, 200, 0) : rgb(0, 255, 0);

          if (curHealth <= 0) go("lose", { score: score });
        });
      });

      scene("lose", ({ score }: { score: number }) => {
        add([
          rect(width(), height()),
          color(35, 0, 0),
          opacity(0.8)
        ]);

        const gameOverBG = add([
          opacity(1),
          sprite("error-bg"),
          pos(center().sub(0, 30)),
          anchor("center"),
        ]);

        gameOverBG.play("idle");

        // add([
        //   text("GAME OVER", { size: 16 }),
        //   pos(center().sub(0, 20)),
        //   anchor("center"),
        //   color(255, 0, 0)
        // ]);
        add([
          text(`BUG_FIXED_COUNT=${score}`, { size: 8, font: "Press Start 2P" }),
          pos(center().add(0, 30)),
          anchor("center"),
          color(255, 255, 255)
        ]);

        onUpdate("blink", (t) => { t.opacity = wave(0.2, 1, time() * 4); });

        wait(2, () => {
          const tryAgain = add([
            text("Clique para \ntentar novamente", { size: 6, align: "center", font: "Press Start 2P" }),
            pos(center().add(0, 60)),
            anchor("center"),
            color(200, 200, 200),
            "blink",
            area()
          ]);
          tryAgain.onClick(() => go("game"));
        });
      });

      scene("title", () => {
        add([
          rect(width(), height()),
          color(0, 0, 0),
        ]);

        add([
          sprite("title_bg"),
          pos(center()),
          anchor("center"),
          scale(1),
        ]);
        const titleSpr = add([
          sprite("title"),
          pos(center().x, center().y - 45),
          anchor("center"),
          scale(1.5),
        ]);
        titleSpr.play("idle");


        // ---------- MONITOR (LIGANDO) ----------
        const monitor = add([
          rect(120, 40),
          pos(center().x, center().y + 20),
          anchor("center"),
          color(20, 20, 20),
          outline(2, rgb(60, 60, 60)),
          scale(1, 0),
          opacity(0.5),
        ]);

        // animação de ligar (efeito CRT)
        tween(
          vec2(1, 0),
          vec2(1, 1),
          0.4,
          (v) => {
            monitor.scale = v;
          },
          easings.easeOutExpo
        );

        add([
          text("Feito por SouWell (2026)", { size: 4, font: "Press Start 2P" }),
          pos(center().x, height() - 10),
          anchor("center"),
          opacity(0.8)
        ]);

        // ---------- TEXTO TYPEWRITER ----------
        function typeText(txt, posY, size, tag) {
          let index = 0;
          const label = add([
            text("", { size, font: "Press Start 2P" }),
            pos(center().x - width() / 3.5, posY + 20),
            anchor("left"),
            area(),
            tag,
          ]);

          loop(0.04, () => {
            if (index < txt.length) {
              label.text += txt[index];
              index++;
            }
          });

          return label;
        }

        wait(0.5, () => {
          typeText("- Começar o jogo", center().y - 7, 6, "start_btn");
          typeText("- Como jogar?", center().y + 8, 6, "how_btn");
        });

        // ---------- INTERAÇÃO ----------
        wait(1.15, () => {
          onUpdate("start_btn", (b) => {
            b.opacity = b.isHovering() ? 1 : 0.7;
            b.text = b.isHovering() ? "> Começar o jogo" : "- Começar o jogo";
          });

          onUpdate("how_btn", (b) => {
            b.opacity = b.isHovering() ? 1 : 0.6;
            b.text = b.isHovering() ? "> Como jogar?" : "- Como jogar?";
          });
        })

        onClick("start_btn", () => go("game"));
        onClick("how_btn", () => go("howto"));

        onKeyPress("space", () => go("game"));
      });


      scene("howto", () => {
        add([
          rect(width(), height()),
          color(8, 8, 12),
        ]);

        // Título
        add([
          text("SOLUCIONANDO BUGS", { size: 9, font: "Press Start 2P" }),
          pos(center().x, 14),
          anchor("top"),
          color(255, 255, 255),
        ]);

        // Texto principal (resumido)
        add([
          text("Clique nos bugs para resolver os problemas do código", { size: 6, width: width() - 20, align: "center" }),
          pos(12, 28),
          color(255, 255, 255),
        ]);

        add([
          text("Insetos vivos drenam sua vida", { size: 6, width: width() - 20, align: "center" }),
          pos(12, 42),
          color(200, 200, 200),
        ]);

        add([
          text("Espinhos causam dano ao tocar", { size: 6, width: width() - 20, align: "center" }),
          pos(12, 50),
          color(255, 120, 120),
        ]);

        const bugs = [
          { sprite: "bug", desc: "Se move de forma imprevísivel" },
          { sprite: "bug_circle", desc: "Gira em torno do centro" },
          { sprite: "bug_splash", desc: "Se escapar, suja a tela" },
          { sprite: "bug_bomb", desc: "Explode se não for parado" },
        ];

        // Config do grid
        const cols = 2;
        const cellW = 60;
        const cellH = 42;

        const gridStartX = center().x - cellW / 2;
        const gridStartY = height() - 95;

        bugs.forEach((b, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);

          const x = gridStartX + col * cellW;
          const y = gridStartY + row * cellH - 5;

          const spr = add([
            sprite(b.sprite),
            pos(x, y),
            anchor("center"),
            scale(0.6),
          ]);
          spr.play("idle");

          add([
            text(b.desc, {
              size: 4,
              width: cellW - 10,
              align: "center",
            }),
            pos(x, y + 14),
            anchor("top"),
            color(170, 170, 170),
          ]);
        });

        // Voltar
        const backBtn = add([
          text("> Clique para voltar <", { size: 5, font: "Press Start 2P", align: "center" }),
          pos(center().x + 2.5, height() - 18),
          anchor("center"),
          area(),
          opacity(0.7),
          "blink",
        ]);

        onUpdate("blink", (t) => {
          t.opacity = wave(0.3, 1, time() * 4);
        });

        onKeyPress("escape", () => go("title"));
        backBtn.onClick(() => go("title"));
      });



      go("title");
    }

    init();

    return () => {
      if (k && k.destroy) k.destroy();
    }
  }, []);

  return (<div className="w-dvw h-dvh bg-black flex items-center justify-center">
    <div className="gnat-game-container" ref={canvasContainerRef}>
    </div>
    <SmoothCursor />
  </div>);
}