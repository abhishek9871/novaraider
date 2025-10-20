# Space Fighter - Quick Start Guide

## Prerequisites

Ensure Node.js >= 22.12.0 is installed:

```bash
node --version
```

## Installation

```bash
npm install
```

## Development

Start the dev server (opens automatically at http://localhost:5173):

```bash
npm run dev
```

## Testing

### Unit Tests (Vitest)

```bash
npm run test
```

Expected: 10 tests pass in <1s

### E2E Tests (Playwright)

First time only - install browsers:

```bash
npx playwright install
```

Run tests:

```bash
npm run e2e
```

Expected: 4 tests pass on Chromium and WebKit

View HTML report:

```bash
npx playwright show-report
```

## Build

Create production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Code Quality

Lint code:

```bash
npm run lint
```

Format code:

```bash
npm run format
```

## Game Controls

- **Move**: Arrow Keys or WASD
- **Fire**: Space or Click
- **Pause**: P key
- **Mute**: Click 🔊 icon
- **Settings**: Click ⚙️ icon
- **Menu**: Space or Click to start
- **Retry**: Space on GameOver

## Sprint 3 Features to Test

1. **Explosions**: Shoot enemies to see particle bursts
2. **Damage Flash**: Hit magenta ZIGZAG enemies (2 HP) twice
3. **Shield Hit**: Collect yellow power-up, collide with enemy
4. **Scaling**: Resize browser window - game scales proportionally
5. **Settings**: Click ⚙️, drag volume slider (0-100%)
6. **Volume**: Adjust slider, fire bullets to hear volume change
7. **Persistence**: Change settings, trigger GameOver, restart - settings persist

## Verification Documents

- `SPRINT3_VERIFICATION.md` - Detailed step-by-step verification
- `SPRINT3_SUMMARY.md` - Implementation summary and acceptance criteria
- `README.md` - Full project documentation

## Troubleshooting

### Dev server won't start

- Check Node version: `node --version` (must be >= 22.12.0)
- Delete `node_modules` and run `npm install` again

### Tests fail

- Unit tests: Check `src/utils/GameUtils.ts` exists
- E2E tests: Run `npx playwright install` first
- E2E tests: Ensure dev server is not already running on port 5173

### Build errors

- Run `npm run lint` to check for code issues
- Check TypeScript errors: `npx tsc --noEmit`

### Game not loading

- Check browser console (F12) for errors
- Clear browser cache and reload
- Try different browser (Chrome, Firefox, Safari)

## Project Structure

```
src/
├── scenes/       # Game scenes (Boot, Preload, Menu, Game, UI, GameOver)
├── systems/      # Enemy and power-up configurations
├── utils/        # Testable utility functions
└── main.ts       # Phaser game config

tests/
├── unit/         # Vitest unit tests
└── e2e/          # Playwright E2E tests
```

## Next Steps

See `SpaceFighter-PRD-2025-10-19.md` for Sprint 4 roadmap:

- Boss encounters
- Difficulty progression
- Final polish
- Production optimization
