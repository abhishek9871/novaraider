# Space Fighter - Phaser 3 Game

A fast-paced arcade-style space shooter built with Phaser 3, TypeScript, and Vite.

## Tech Stack

- **Runtime**: Node.js >= 22.12.0
- **Bundler**: Vite 7.1.10
- **Language**: TypeScript 5.9.3
- **Game Framework**: Phaser 3.90.0
- **Testing**: Vitest 3.2.4, Playwright 1.55.0
- **Linting**: ESLint 9.38.0, Prettier 3.6.2

## Getting Started

### Prerequisites

Ensure you have Node.js >= 22.12.0 installed.

### Installation

```bash
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The game will open automatically at http://localhost:5173

### Build

Create an optimized production build:

```bash
npm run build
```

### Preview

Serve the production build locally:

```bash
npm run preview
```

### Testing

Run unit tests:

```bash
npm run test
```

Run E2E tests:

```bash
npm run e2e
```

### Code Quality

Lint code:

```bash
npm run lint
```

Format code:

```bash
npm run format
```

## Sprint 4 Acceptance Criteria Verification

### ✅ Boss Encounter System

- **Criterion**: Boss spawns deterministically, exhibits telegraphed attacks, takes multiple hits, triggers win sequence
- **Status**: PASS - Boss spawns at score ≥ 200 or time ≥ 90s with 50 HP, horizontal sweep pattern, burst-fire attacks
- **How to verify**: Play until score reaches 200 or 90 seconds elapsed; boss appears with health bar; defeat boss to see victory screen

### ✅ Difficulty Progression

- **Criterion**: Enemy speed and spawn rate increase over time with safe bounds, wave spawning pauses during boss
- **Status**: PASS - Enemy speed scales up to 1.5x, spawn delay decreases to 800ms minimum, progression observable
- **How to verify**: Play for 60+ seconds and observe faster enemies and more frequent spawns; boss pauses regular waves

### ✅ Boss Health Bar UI

- **Criterion**: Boss health bar displays at top with real-time HP updates
- **Status**: PASS - Health bar appears on boss spawn showing "BOSS: X/50", updates with each hit, disappears on defeat
- **How to verify**: Trigger boss spawn and observe health bar at top center; shoot boss to see bar decrease

### ✅ Run Summary Screen

- **Criterion**: GameOver/Victory screen shows comprehensive metrics (score, time, enemies, power-ups)
- **Status**: PASS - Summary displays all run statistics with victory/defeat distinction
- **How to verify**: Complete a run (death or boss defeat); observe summary with all metrics displayed

### ✅ Extended Unit Tests

- **Criterion**: Tests cover difficulty progression and boss spawn logic
- **Status**: PASS - 18+ tests including calculateEnemySpeed, calculateSpawnDelay, shouldSpawnBoss
- **How to verify**: Run `npm run test`; all tests pass including new progression tests

### ✅ Extended E2E Tests

- **Criterion**: E2E tests cover boss spawn, defeat, and victory flow
- **Status**: PASS - 7 tests covering boss health bar, victory screen, and run summary
- **How to verify**: Run `npm run e2e`; all tests pass on Chromium and WebKit

### ✅ Production Build

- **Criterion**: Build completes and runs in preview without errors
- **Status**: PASS - Vite build produces optimized output, preview serves without runtime errors
- **How to verify**: Run `npm run build` then `npm run preview`; game loads and plays correctly

## Sprint 1 Acceptance Criteria Verification

### ✅ Scene Transitions

- **Criterion**: Dev server starts and game loads to Menu, then transitions to Game on input
- **Status**: PASS - Boot → Preload → Menu → Game flow implemented with Scene Manager
- **How to verify**: Run `npm run dev`, press SPACE or click to start game

### ✅ Player Controls

- **Criterion**: Player moves with arrows/WASD and fires bullets with Space at 60 fps
- **Status**: PASS - Keyboard controls (arrows/WASD) and Space firing implemented with Arcade Physics
- **How to verify**: In game, use arrow keys or WASD to move, Space or click to fire

### ✅ Enemy Spawning & Scoring

- **Criterion**: Enemies spawn at fixed cadence, destroyed by bullets, score increments in UI
- **Status**: PASS - Enemies spawn every 1.5s from top, bullet-enemy overlap destroys enemy and adds 10 points
- **How to verify**: Watch enemies spawn and shoot them to see score increase in top-left HUD

### ✅ GameOver Transition

- **Criterion**: GameOver reachable by colliding with enemy, transitions back to Menu or Game
- **Status**: PASS - Player-enemy collision triggers GameOver with score display, SPACE retries, M returns to Menu
- **How to verify**: Collide with an enemy to trigger GameOver, press SPACE to retry or M for menu

## Sprint 3 Acceptance Criteria Verification

### ✅ Explosion Animations and Damage Feedback

- **Criterion**: Lightweight animations/particles on enemy death and player damage with stable frame pacing
- **Status**: PASS - Particle emitters for explosions, alpha flash for damage, scale tween for shield hits
- **How to verify**: Shoot enemies to see particle bursts; hit ZIGZAG enemies twice to see flash; collect shield and collide to see scale feedback

### ✅ Responsive Scaling

- **Criterion**: ScaleManager FIT with auto-centering preserves aspect ratio across resolutions
- **Status**: PASS - Configured in main.ts, tested on desktop (1920x1080, 1366x768) and mobile (375x667, 768x1024)
- **How to verify**: Resize browser window or use DevTools device toolbar; game scales proportionally and centers

### ✅ Settings Menu

- **Criterion**: Volume slider (0-1) and mute toggle with immediate effect and session persistence
- **Status**: PASS - Settings panel accessible via ⚙️ button, volume slider adjusts Sound Manager, sessionStorage persistence
- **How to verify**: Click ⚙️ in top-right, drag volume slider, toggle mute; settings persist across scene transitions

### ✅ Unit Tests (Vitest)

- **Criterion**: Tests for spawn timing, cooldown, and scoring utilities
- **Status**: PASS - 12 tests in tests/unit/GameUtils.test.ts covering all utility functions
- **How to verify**: Run `npm run test`; all tests pass in <1s

### ✅ E2E Tests (Playwright)

- **Criterion**: Smoke tests for Menu → Game → GameOver flow and HUD/input on Chromium and WebKit
- **Status**: PASS - 4 tests covering scene transitions, score display, pause, and settings menu
- **How to verify**: Run `npx playwright install` then `npm run e2e`; all tests pass on both browsers

## Sprint 2 Acceptance Criteria Verification

### ✅ Enemy Variety

- **Criterion**: At least two enemy types with distinct movement/HP/speed patterns integrate with collision and scoring
- **Status**: PASS - Three enemy types implemented:
  - **Basic** (red): 1 HP, 150 speed, straight down, 10 points
  - **ZigZag** (magenta): 2 HP, 120 speed, sinusoidal horizontal movement, 20 points
  - **FastDiver** (orange): 1 HP, 300 speed, straight down fast, 15 points
- **How to verify**: Play game and observe different colored enemies with distinct behaviors; ZigZag enemies move side-to-side and require 2 hits

### ✅ Power-Ups with Timed Effects

- **Criterion**: Power-ups spawn, apply timed effects, show HUD indicator with duration, expire cleanly
- **Status**: PASS - Two power-up types implemented:
  - **Rapid Fire** (cyan): Reduces fire cooldown from 250ms to 100ms for 5 seconds
  - **Shield** (yellow): Absorbs one enemy collision for 8 seconds, player turns yellow
- **How to verify**: Collect power-ups (small colored squares falling slowly); HUD shows active effects with icons (⚡ Rapid Fire, 🛡️ Shield); effects expire after duration

### ✅ Audio System with SFX and Controls

- **Criterion**: SFX for shoot, explosion, pickup, menu confirm; global mute/volume controls in UI
- **Status**: PASS - Programmatic audio implemented:
  - **Shoot**: 800Hz beep on bullet fire
  - **Explosion**: Noise burst on enemy destruction or shield hit
  - **Pickup**: 1200Hz chime on power-up collection
  - **Confirm**: 600Hz tone on menu/GameOver selections
  - **Mute toggle**: Speaker icon (🔊/🔇) in top-right corner
- **How to verify**: Listen for sounds during gameplay; click speaker icon to toggle mute; all sounds stop/resume immediately

### ✅ Enhanced Parallax Background

- **Criterion**: Multi-layer parallax visible without interfering with collisions or HUD
- **Status**: PASS - Two-layer starfield:
  - **Back layer**: Darker (0x111111), scrolls at 0.5 px/frame
  - **Front layer**: Lighter (0x222222), scrolls at 1.5 px/frame
- **How to verify**: Observe depth effect in background during gameplay; no impact on collision detection or HUD readability

### ✅ Pause/Resume System

- **Criterion**: Pause toggle halts and restores physics, timers, spawners, audio without duplication or drift
- **Status**: PASS - P key pauses/resumes:
  - Physics paused/resumed via scene.physics.pause/resume
  - Enemy and power-up spawn timers paused
  - Audio paused/resumed via sound.pauseAll/resumeAll
  - "PAUSED" overlay displayed in center
  - Input blocked during pause
- **How to verify**: Press P during gameplay; observe "PAUSED" text, all movement stops, sounds pause; press P again to resume seamlessly

## Game Features

### Sprint 4 Features

- **Boss Encounter**: Boss spawns at score ≥ 200 or time ≥ 90s with 50 HP, pink/magenta color (0xff0088)
- **Boss Movement**: Horizontal sweep pattern across top of screen, changes direction at boundaries
- **Boss Attacks**: Telegraphed burst-fire pattern, 5 bullets in spread formation every 2 seconds
- **Boss Health Bar**: Real-time HP display at top center, shows "BOSS: X/50" with visual bar
- **Victory Sequence**: Boss defeat triggers victory screen with "Boss Defeated!" message and 500 point bonus
- **Difficulty Progression**: Enemy speed increases up to 1.5x base speed over 60 seconds
- **Spawn Rate Scaling**: Enemy spawn delay decreases from 1500ms to 800ms minimum over time
- **Wave Pause**: Regular enemy and power-up spawning pauses during boss encounter
- **Run Summary**: Comprehensive metrics display including score, time survived, enemies destroyed, power-ups collected
- **Victory/Defeat Distinction**: Different screen colors and messages for boss victory vs player death
- **Boss Audio**: Confirmation sound on spawn, shoot/explosion sounds during battle
- **Boss Visual Feedback**: Particle explosion on defeat, alpha flash on damage
- **Extended Tests**: 18+ unit tests covering progression logic, 7 E2E tests covering boss flow

### Sprint 3 Features

- **Explosion Animations**: Particle emitters on enemy death with red/orange/yellow colors, 12 particles radiating outward
- **Damage Feedback**: Alpha flash on multi-HP enemies when hit but not destroyed
- **Shield Hit Feedback**: Scale tween on player when shield absorbs collision
- **Player Death Explosion**: Particle burst at player position before GameOver transition
- **Responsive Scaling**: ScaleManager FIT mode with CENTER_BOTH maintains 800x600 aspect across resolutions
- **Settings Menu**: Accessible via ⚙️ button with volume slider (0-100%) and visual feedback
- **Volume Control**: Drag slider to adjust Sound Manager volume immediately, affects all SFX
- **Session Persistence**: Settings stored in sessionStorage, persist across scenes but not browser sessions
- **Unit Tests**: Vitest tests for calculateFireCooldown, calculateSpawnDelay, calculateScore, canFire
- **E2E Tests**: Playwright smoke tests for Menu→Game→GameOver, HUD updates, pause, settings on Chromium/WebKit

### Sprint 1 Features

- **Player Ship**: Moves in 4 directions with world bounds clamping
- **Bullet System**: Fire rate cooldown (250ms base), bullets destroyed on world bounds
- **Enemy Spawner**: Enemies spawn from top at 1.5s intervals with random X position
- **Collision Detection**: Bullet-enemy overlap for scoring, player-enemy collision for game over
- **HUD Overlay**: Score display in UI scene layered above Game scene
- **Starfield Background**: Scrolling parallax effect for visual depth
- **Responsive Scaling**: ScaleManager FIT mode with auto-centering

### Sprint 2 Features

- **Enemy Variety**: Three enemy types with distinct HP, speed, and movement patterns
  - Basic (red, 1 HP, straight), ZigZag (magenta, 2 HP, sinusoidal), FastDiver (orange, 1 HP, fast)
- **Power-Up System**: Two timed power-ups with visual feedback
  - Rapid Fire (cyan, 5s, reduces cooldown to 100ms)
  - Shield (yellow, 8s, absorbs one hit, player glows yellow)
- **Power-Up HUD**: Active effects displayed with icons and auto-clear on expiry
- **Audio System**: Programmatic SFX for shoot, explosion, pickup, confirm
- **Audio Controls**: Mute toggle button (🔊/🔇) in top-right, affects all sounds immediately
- **Enhanced Parallax**: Two-layer starfield with different scroll speeds (0.5x and 1.5x)
- **Pause/Resume**: P key pauses physics, timers, spawners, audio; overlay shows pause state
- **Safe State Management**: Pause prevents input, timers, and physics updates; resume restores cleanly

## Controls

- **Movement**: Arrow Keys or WASD
- **Fire**: Space Bar or Mouse Click/Tap
- **Pause/Resume**: P key (during gameplay)
- **Mute Audio**: Click speaker icon (🔊/🔇) in top-right corner
- **Settings**: Click ⚙️ icon to open settings menu
- **Volume**: Drag slider in settings menu (0-100%)
- **Menu**: Space or Click to start
- **GameOver/Victory**: Space to retry, M for menu

## Project Structure

```
space-fighter-phaser/
├── src/
│   ├── scenes/
│   │   ├── Boot.ts          # Initial boot scene
│   │   ├── Preload.ts       # Asset loading with programmatic audio generation
│   │   ├── Menu.ts          # Main menu with confirm SFX
│   │   ├── Game.ts          # Core gameplay loop with enemies, power-ups, pause, animations
│   │   ├── UI.ts            # HUD overlay with power-up indicators, audio controls, settings menu
│   │   └── GameOver.ts      # Game over screen with confirm SFX
│   ├── systems/
│   │   ├── EnemyTypes.ts    # Enemy variant configurations (HP, speed, score)
│   │   ├── PowerUpTypes.ts  # Power-up configurations (duration, effects)
│   │   └── BossConfig.ts    # Boss configuration (HP, attacks, movement)
│   ├── utils/
│   │   └── GameUtils.ts     # Pure utility functions for game logic (testable)
│   └── main.ts              # Phaser game configuration with ScaleManager FIT
├── tests/
│   ├── unit/
│   │   └── GameUtils.test.ts # Vitest unit tests for utility functions
│   └── e2e/
│       └── game.spec.ts      # Playwright E2E smoke tests
├── public/
│   └── assets/
│       └── audio/           # Audio placeholder documentation
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration
├── vitest.config.ts         # Vitest configuration
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
├── README.md                # This file
├── SPRINT3_VERIFICATION.md  # Sprint 3 step-by-step verification guide
└── SPRINT4_VERIFICATION.md  # Sprint 4 step-by-step verification guide
```

## Testing

### Unit Tests (Vitest)

Run unit tests for utility functions:

```bash
npm run test
```

Tests cover:

- Fire cooldown calculations (base rate vs rapid fire)
- Spawn delay logic with difficulty progression
- Enemy speed scaling with difficulty progression
- Score calculations for enemy types (including boss)
- Fire timing validation
- Boss spawn condition logic

### E2E Tests (Playwright)

Install browsers (first time only):

```bash
npx playwright install
```

Run end-to-end smoke tests:

```bash
npm run e2e
```

Tests verify:

- Menu → Game → GameOver flow
- HUD score display
- Pause/resume functionality
- Settings menu interaction
- Boss health bar appearance
- Victory screen with boss defeat
- Run summary with all metrics

Tests run on Chromium and WebKit. HTML report generated in `playwright-report/`.

## Production Ready

All four sprints completed:
- ✅ Sprint 1: Core gameplay loop
- ✅ Sprint 2: Enemy variety, power-ups, audio
- ✅ Sprint 3: Polish, responsiveness, tests
- ✅ Sprint 4: Boss encounters, difficulty progression, final QA

The game is production-ready and can be deployed to any static hosting service.

## License

Private project - All rights reserved
