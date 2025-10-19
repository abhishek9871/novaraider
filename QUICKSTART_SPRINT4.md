# Sprint 4 Quick Start Guide

## 🚀 Quick Commands

```bash
# Install dependencies (first time only)
npm install

# Run development server
npm run dev

# Run unit tests
npm run test

# Install E2E browsers (first time only)
npx playwright install

# Run E2E tests (requires dev server running)
npm run e2e

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 How to Trigger Boss

### Method 1: Score Threshold
- Play the game and destroy enemies
- Boss spawns when score reaches **200 points**
- Basic enemies: 10 points
- ZigZag enemies: 20 points
- FastDiver enemies: 15 points

### Method 2: Time Threshold
- Play the game for **90 seconds**
- Boss spawns automatically after 90 seconds
- Even if score is below 200

## 🎯 Boss Fight Guide

### Boss Stats
- **HP**: 50 (requires 50 bullet hits)
- **Color**: Pink/Magenta (0xff0088)
- **Size**: 80x80 pixels
- **Score Bonus**: 500 points on defeat

### Boss Behavior
- **Movement**: Horizontal sweep across top of screen
- **Attack**: Burst-fire pattern every 2 seconds
- **Bullets**: 5 bullets in spread formation
- **Bullet Color**: Pink (matches boss)

### How to Defeat
1. Shoot the boss 50 times with your bullets
2. Watch the health bar at top center decrease
3. Avoid boss bullets (they move in spread pattern)
4. Use shield power-up to absorb one boss bullet hit
5. Use rapid fire power-up to shoot faster

### Victory
- Boss explodes with particle effect
- +500 points added to score
- Victory screen appears with "VICTORY!" message
- Run summary shows all your stats

## 📊 Run Summary Metrics

After each game (death or victory), you'll see:
- **Final Score**: Total points earned
- **Time Survived**: How many seconds you lasted
- **Enemies Destroyed**: Total enemy kills (including boss)
- **Power-Ups Collected**: Total power-ups picked up

## 🎨 Visual Indicators

### Boss Health Bar
- Appears at top center when boss spawns
- Shows "BOSS: X/50" text
- Pink bar decreases with each hit
- Disappears when boss is defeated

### Difficulty Progression
- Enemies get faster over time (up to 1.5x speed)
- Enemies spawn more frequently (down to 800ms intervals)
- Observable after 30-60 seconds of gameplay

## 🎵 Audio Cues

- **Boss Spawn**: Confirmation tone (600Hz)
- **Boss Fire**: Shoot beep (800Hz)
- **Boss Hit**: Explosion burst
- **Boss Defeat**: Explosion burst + particle effect

## ⌨️ Controls

### Gameplay
- **Move**: Arrow Keys or WASD
- **Fire**: Space Bar or Mouse Click
- **Pause**: P key

### UI
- **Mute**: Click speaker icon (🔊/🔇)
- **Settings**: Click gear icon (⚙️)
- **Volume**: Drag slider in settings

### Menus
- **Start Game**: Space or Click
- **Retry**: Space (on GameOver/Victory)
- **Menu**: M key (on GameOver/Victory)

## 🧪 Testing

### Unit Tests
```bash
npm run test
```
Expected: 19 tests pass in <1 second

### E2E Tests
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run E2E tests
npm run e2e
```
Expected: 7 tests pass on Chromium and WebKit

## 🏗️ Production Build

```bash
# Build
npm run build

# Preview
npm run preview
```
Navigate to http://localhost:4173

Expected:
- No console errors
- Smooth 60 FPS gameplay
- All features working
- Boss encounter functional

## 🐛 Troubleshooting

### Boss Not Spawning
- Check score (must be ≥ 200)
- Check time (must be ≥ 90 seconds)
- Boss only spawns once per session

### Health Bar Not Showing
- Boss must be spawned first
- Check browser console for errors
- Refresh page and try again

### Tests Failing
- Ensure dev server is running for E2E tests
- Run `npm install` to ensure dependencies
- Check Node version (must be ≥ 22.12.0)

### Build Errors
- Run `npm install` to ensure dependencies
- Check TypeScript version (5.9.3)
- Clear `dist/` folder and rebuild

## 📚 Documentation

- **README.md**: Full game documentation
- **SPRINT4_VERIFICATION.md**: Detailed verification steps
- **SPRINT4_COMPLETE.md**: Implementation details
- **SPRINT4_IMPLEMENTATION_SUMMARY.md**: Technical summary

## ✅ Quick Verification

1. ✅ Run `npm run dev` - Game loads
2. ✅ Play until score 200 - Boss spawns
3. ✅ Boss health bar appears - UI working
4. ✅ Shoot boss 50 times - Boss defeated
5. ✅ Victory screen shows - Win sequence working
6. ✅ Run `npm run test` - All tests pass
7. ✅ Run `npm run build` - Build succeeds

## 🎉 Sprint 4 Features

- ✅ Boss encounter with 50 HP
- ✅ Telegraphed burst-fire attacks
- ✅ Difficulty progression (speed + spawn rate)
- ✅ Boss health bar UI
- ✅ Run summary with metrics
- ✅ Victory/defeat distinction
- ✅ Extended tests (19 unit, 7 E2E)
- ✅ Production build ready

---

**Status**: Sprint 4 Complete ✅
**Ready for**: Production Deployment 🚀
