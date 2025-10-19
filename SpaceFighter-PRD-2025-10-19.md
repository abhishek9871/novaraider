### Product overview

Build a fast, responsive, arcade-style space shooter playable in modern desktop and mobile browsers using Phaser 3, with smooth controls, waves of enemies, score tracking, SFX/music, and a complete gameplay loop from menu to game over, packaged with Vite and TypeScript for a modern developer experience.[^3][^4]

### Why this stack

- Phaser 3 is a mature, performant HTML5 2D framework with robust Scenes, Arcade Physics, audio, scaling, and input systems well-suited to a classic space shooter.[^5][^4]
- Vite 7 provides a fast dev server and optimized builds and requires Node.js 20.19+ or 22.12+, which ensures a modern runtime baseline for the toolchain.[^6][^7]
- TypeScript 5.9 offers strong typing and editor tooling, and Phaser’s package ships TypeScript definitions that integrate cleanly without separate @types packages.[^8][^9]
- Vitest 3 integrates tightly with Vite for unit tests, and Playwright 1.55 runs realistic cross-browser E2E tests to validate the final gameplay loop and UI.[^10][^11]

### Target platform and constraints

- Target modern Chromium, Firefox, and WebKit browsers on desktop and mobile, leveraging Phaser’s WebGL with Canvas fallback as provided by the framework.[^4][^10]
- Ensure Node.js runtime is 22.12+ (recommended) to satisfy Vite 7 requirements and to align with current ecosystem expectations for tooling.[^7][^6]

### Tech stack and exact versions

- Runtime: Node.js >= 22.12.0 (Active LTS baseline suitable for Vite 7).[^6][^7]
- Bundler/Dev tool: Vite 7.1.10.[^12][^6]
- Language: TypeScript 5.9.3.[^13][^8]
- Game framework: Phaser 3.90.0 “Tsugumi” (stable).[^14][^3]
- Unit testing: Vitest 3.2.x (pin 3.2.4).[^15][^16]
- E2E testing: @playwright/test 1.55.0.[^17][^18]
- Linting: ESLint 9.38.0.[^19][^20]
- Formatting: Prettier 3.6.2.[^21][^22]

### Project structure

- Root: vite + TypeScript app with a “phaser” game source folder, separating Scenes, assets, and core systems for clarity in a vibe-coding flow.[^7][^4]
- src/scenes: Boot, Preload, Menu, Game, UI, GameOver scenes following Phaser’s Scene architecture to manage lifecycle and transitions cleanly.[^23][^24]
- src/systems: Input, Audio, Spawning, and HUD managers using Phaser’s plugins and managers for keyboard, pointer, sound, physics, and scale.[^25][^5]
- assets: Static sprites, audio, and fonts loaded through Phaser’s Loader in Preload, including optional native FontFile usage introduced in Phaser 3.87+.[^26][^27]

### npm metadata and scripts

- Engines: { "node": ">=22.12.0" } to match Vite 7 requirements and ensure dev parity.[^6][^7]
- Scripts: dev (vite), build (vite build), preview (vite preview), test (vitest run), test:ui (vitest --ui), e2e (playwright test), lint (eslint), format (prettier) to support a complete local DX.[^28][^7]

```json
{
  "name": "space-fighter-phaser",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --strictPort",
    "test": "vitest run",
    "test:ui": "vitest --ui",
    "e2e": "playwright test",
    "lint": "eslint \"src/**/*.{ts,tsx}\"",
    "format": "prettier --write ."
  },
  "dependencies": {
    "phaser": "3.90.0"
  },
  "devDependencies": {
    "@playwright/test": "1.55.0",
    "eslint": "9.38.0",
    "prettier": "3.6.2",
    "typescript": "5.9.3",
    "vite": "7.1.10",
    "vitest": "3.2.4"
  }
}
```

### Vite and TypeScript config

- Use Vite defaults with TypeScript strict mode and module resolution NodeNext to align with modern ESM and editor tooling.[^13][^7]

```ts
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 5173, open: true },
  build: { sourcemap: true },
});
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "types": [],
    "resolveJsonModule": true,
    "sourceMap": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

### Linting and formatting

- ESLint 9.38.0 with eslint:recommended for TypeScript-checked code, plus Prettier 3.6.2 formatting in a simple configuration to minimize tool drift during vibe coding.[^22][^19]

```json
// .eslintrc.json
{
  "root": true,
  "env": { "browser": true, "es2023": true },
  "extends": ["eslint:recommended"],
  "parserOptions": { "ecmaVersion": "latest", "sourceType": "module" },
  "ignorePatterns": ["dist", "node_modules"],
  "rules": {}
}
```

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "trailingComma": "all"
}
```

### Game architecture

- Scenes: Boot (minimal), Preload (assets), Menu (start screen), Game (core loop), UI (HUD overlay), GameOver (results); Scenes isolate lifecycle, input, and resource management as recommended in Phaser 3.[^24][^23]
- Physics: Arcade Physics configured in game config for collision and movement, as Arcade is ideal for classic 2D shooters and simple overlap/velocity systems.[^29][^5]
- Input: Keyboard arrows/WASD and Space for fire using KeyboardPlugin, plus pointer/tap support for mobile-friendly controls.[^30][^25]
- Audio: Use Phaser Sound Manager with WebAudio first and HTML5 Audio fallback, exposing global mute and volume controls via the Sound Manager API.[^31][^32]
- Scale: Use ScaleManager FIT with auto-centering for responsive gameplay on different resolutions while preserving aspect ratio.[^33][^34]

### Core gameplay requirements

- Player ship movement with acceleration/clamp and default three-direction or four-direction controls implemented via Arcade sprites and Keyboard input.[^35][^25]
- Firing primary bullets on a cooldown timer with Arcade overlap to damage enemies and destroy bullets on world bounds.[^36][^5]
- Enemy spawners emitting waves from the top with varying speeds and patterns using Groups and timed events in Scene update.[^37][^23]
- Score system increasing per enemy destroyed and HUD display using Phaser Text objects in a UI scene layered above the Game scene.[^38][^23]
- Simple health/lives with GameOver scene on death, with restart to Menu or direct retry from GameOver.[^39][^23]

### Assets and loading

- Load texture atlases or images and audio in Preload using Phaser Loader, including optional FontFile loader for TTF/OTF custom fonts introduced in Phaser 3.87+.[^27][^26]
- Use sprite-based explosions and a looping background starfield or a parallax background implemented via tile sprites or repeated images.[^23][^4]

### Testing

- Unit tests in Vitest for utility functions like spawning math, cooldown logic, and score calculations, running on Node with simulated values rather than rendering.[^11][^28]
- E2E tests in Playwright verifying the menu-to-game-to-gameover flow, HUD updates, and basic keyboard input, running chromium/webkit/firefox in CI as supported by Playwright.[^40][^10]

### Build and run commands

- Development: npm run dev to launch Vite dev server with HMR for rapid iteration during vibe coding sessions.[^28][^7]
- Production: npm run build to produce an optimized build, then npm run preview to serve the dist output for manual verification.[^41][^7]

---

## Sprint plan

### Sprint 1: Project setup and core loop

Scope

- Initialize Vite + TypeScript project with the exact package versions and configs listed above to guarantee compatibility with Node 22.12+ and Vite 7.[^12][^7]
- Add Phaser 3.90.0 and scaffold Scenes: Boot, Preload, Menu, Game, UI, GameOver, wiring Scene transitions via the Scene Manager.[^3][^23]
- Implement player ship sprite with Arcade Physics body, keyboard controls via KeyboardPlugin, and camera/world bounds clamping.[^5][^25]
- Implement primary bullet firing with a cooldown and overlap collision with enemies and bullet destruction on impact or on leaving bounds.[^36][^5]
- Add a simple enemy type spawning from top at intervals using an Arcade Physics Group and timed callbacks in the Game scene.[^37][^23]
- Create a basic HUD in the UI scene with score text rendered via Phaser Text and updated from Game events.[^38][^23]

Acceptance criteria

- Dev server starts and game loads to Menu, then transitions to Game on input, confirming Scene wiring.[^7][^23]
- Player moves with arrows/WASD and fires bullets with Space reliably at 60 fps on a mid-tier desktop browser using Arcade Physics defaults.[^25][^5]
- Enemies spawn at a fixed cadence, can be destroyed by bullets, and the score increments in the UI overlay on each kill.[^37][^38]
- GameOver is reachable by colliding with an enemy and transitions properly back to Menu or Game.[^39][^23]

Deliverables

- Committed project with package.json, Vite/TS configs, scenes scaffolded, and a playable loop with a single enemy type and score HUD.[^12][^23]

### Sprint 2: Enemy variety, power-ups, and audio

Scope

- Add enemy variants with different HP/speed and simple movement patterns, maintaining Groups and Arcade colliders for consistent overlap behavior.[^5][^37]
- Introduce simple power-ups (e.g., rate-of-fire boost, temporary shield) spawned at intervals with overlap to apply effects and timers.[^36][^5]
- Add SFX for shooting, explosion, power-up pickup, and menu confirm using Phaser Sound Manager with volume control and mute toggle in UI.[^32][^31]
- Add a simple parallax background using tile sprites or layered images for visual depth without heavy performance cost.[^4][^23]
- Implement a pause/resume UI toggle and ensure input states and timers resume safely per Scene lifecycle rules.[^23][^39]

Acceptance criteria

- At least two enemy types function with distinct behavior and correct collision and scoring, without frame stutter on desktop.[^5][^37]
- Power-ups spawn, can be collected, and apply visible, timed effects with a HUD indicator and revert after timeout.[^38][^5]
- SFX respond to actions and a global mute/volume control is exposed from the UI scene using Sound Manager APIs.[^31][^32]
- Background parallax is visible and does not interfere with collisions or HUD readability.[^23][^38]

Deliverables

- Updated Game and UI scenes, audio assets loaded in Preload, and stable gameplay with richer feedback loop.[^32][^23]

### Sprint 3: Polish, responsiveness, and tests

Scope

- Add explosion animations and damage feedback using tweens/animations and particle bursts to improve hit feel without heavy CPU load.[^5][^23]
- Implement ScaleManager FIT with centering and verify layouts across typical desktop and mobile resolutions for responsive rendering.[^34][^33]
- Introduce a Settings menu for SFX volume and mute, and persist settings in-memory for the session to avoid external storage dependencies.[^32][^23]
- Unit tests with Vitest for utility logic (spawn math, cooldowns, scoring) and run in CI scripts locally to validate game math correctness.[^11][^28]
- Add Playwright smoke tests that navigate Menu → Game → GameOver and assert HUD updates and input handling across Chromium and WebKit locally.[^40][^10]

Acceptance criteria

- Animations and particles play on events with no collision regressions and stable frame pacing on a mid-tier laptop GPU.[^23][^5]
- Game scales to multiple resolutions with preserved aspect and correctly centered playfield via ScaleManager configuration.[^33][^34]
- Vitest unit tests pass locally and cover at least spawn logic, cooldowns, and scoring utility functions.[^28][^11]
- Playwright smoke tests pass locally on at least one Chromium and one WebKit run, capturing a video or trace as needed.[^10][^40]

Deliverables

- Polished visual feedback, responsive scaling, and a minimal but working test suite for confidence in core loops.[^11][^33]

### Sprint 4: Boss, progression, final QA and packaging

Scope

- Implement a mid-boss or boss wave with higher HP, attack pattern, and telegraphed behavior to cap each session’s difficulty arc using Arcade overlap/colliders.[^37][^5]
- Add simple progression: increase enemy speed and spawn rates over time, culminating in boss entry, then recycle or end with GameOver and summary.[^5][^23]
- Final UI polish: game over summary with best run metrics from the session, improved menu flow, and key rebind hints or on-screen prompts.[^38][^23]
- Expand Playwright E2E to include boss appearance, defeating the boss via scripted inputs, and asserting score growth and transitions across browsers.[^17][^10]
- Production build with Vite and verification via preview, ensuring sourcemaps and output cleanliness for easy hosting and distribution.[^41][^7]

Acceptance criteria

- Boss spawns deterministically under defined conditions and can be defeated within a reasonable time frame, triggering win or looped waves.[^37][^5]
- Difficulty ramp is observable and stable with no runaway spawn bugs or soft locks, and all scene transitions remain reliable.[^39][^23]
- E2E tests cover start-to-boss-to-end flow and pass locally on Chromium and WebKit, validating cross-engine playability.[^40][^10]
- Production build is generated and served via preview without runtime errors, and initial load time is acceptable with preloading cues.[^41][^7]

---

## Detailed implementation notes

### Game configuration and bootstrapping

- Configure Phaser.Game with physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } } to suit a top-down shooter and avoid unnecessary gravity.[^42][^5]
- Establish a fixed virtual resolution and apply Scale FIT with auto-centering to ensure consistent gameplay area across devices.[^34][^33]
- Use Scene order: Boot → Preload → Menu → Game (+ UI as overlay) → GameOver with transitions via Scene Manager events.[^39][^23]

### Input handling

- Create keyboard mappings with addKeys for WASD and arrows and a Key for Space using KeyboardPlugin, and gate input in pause/resume states.[^43][^25]
- Add pointer down as an alternative fire input and simple drag/virtual joystick optionality for mobile responsiveness as needed.[^30][^25]

### Physics and collisions

- Use Arcade Physics Groups for enemies and bullets, with enableBody on sprites, overlap callbacks for bullet-enemy hits, and collider for player-enemy impacts.[^37][^5]
- Apply setVelocity and world bounds checks on bullets to clean up offscreen projectiles and maintain performance.[^29][^5]

### HUD and UI

- Render score, lives, and effect indicators in a UI scene with Phaser Text, keeping UI decoupled from gameplay and updated via simple events or shared refs.[^38][^23]
- Provide a pause overlay and a settings subview to control SFX volume/mute via Sound Manager APIs, reflecting changes immediately.[^31][^32]

### Audio

- Load and play SFX with this.sound.add/play and expose global volume/mute toggles; rely on WebAudioSoundManager by default with HTML5Audio fallback per device.[^31][^32]
- Stop or lower SFX during pause and resume cleanly to avoid overlapping or stuck sounds across scene transitions.[^44][^45]

### Fonts and visuals

- Optionally load TTF/OTF via Loader font file to standardize typography across platforms without third-party web font loaders in Phaser 3.87+.[^26][^27]
- Use tweened alpha or scale for damage feedback and lightweight particles for explosions to balance clarity with performance.[^23][^5]

---

## Testing plan

Unit tests (Vitest)

- Validate cooldown logic, spawn timing, difficulty ramp functions, and score arithmetic as pure utilities, executed in Node for speed.[^28][^11]
- Run with npm run test and optionally vitest --ui for interactive runs during development.[^15][^28]

E2E tests (Playwright)

- Start server, navigate to Menu, start Game, simulate inputs to destroy an enemy, verify score updates, intentionally collide to trigger GameOver, and assert transition.[^10][^40]
- Run npm run e2e after npm run build and npm run preview or via dev server, installing browsers via npx playwright install as needed.[^46][^40]

---

## Definition of Done (overall)

- The game builds with Vite and runs without console errors on current Chromium and WebKit with smooth input, collisions, audio, scaling, and a complete loop from Menu to GameOver including a boss encounter by Sprint 4.[^7][^10]
- Unit tests for core utilities pass in Vitest, and Playwright E2E tests pass across at least two browser engines locally, validating essential flows.[^10][^11]
- Settings for mute/volume and gameplay pause behave consistently across scenes and state changes, with no stuck audio or input listeners.[^32][^39]

---

## Notes on Windsurf vibe-coding fit

- This PRD uses clear scene- and system-level tasks and acceptance criteria that align with AI-native IDE workflows where the editor maintains project-wide context and can iteratively implement and refine code to spec.[^2][^1]
- The chosen stack and versions are mainstream, current, and compatible, minimizing friction for automated code generation, testing, and debugging loops in an AI-native IDE.[^3][^12]

---

## References for implementation

- Windsurf overview and AI-native IDE positioning.[^1][^2]
- Phaser framework capabilities and stable version stream.[^4][^3]
- Vite 7 and Node version requirements.[^6][^7]
- TypeScript 5.9 announcement and NPM package latest.[^8][^13]
- Vitest 3 docs and releases.[^15][^11]
- Playwright cross-browser testing docs.[^40][^10]
- Phaser docs for Scenes, Arcade Physics, Keyboard, Sound, Scale, Groups, Text, and events.
