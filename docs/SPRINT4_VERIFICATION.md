# Sprint 4 Verification Guide

This document provides step-by-step instructions to verify all Sprint 4 acceptance criteria.

## Prerequisites

Ensure you have completed the setup:

```bash
npm install
```

## Verification Steps

### 1. Boss Encounter System

**Objective**: Verify boss spawns deterministically, exhibits telegraphed attacks, and triggers win sequence on defeat.

**Steps**:

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Navigate through Menu → Game (press SPACE)

3. Play until score reaches 200 OR wait 90 seconds
   - **Expected**: Boss spawns at top center with pink/magenta color (0xff0088)
   - **Expected**: Regular enemy spawning pauses
   - **Expected**: Boss health bar appears at top showing "BOSS: 50/50"

4. Observe boss behavior:
   - **Expected**: Boss moves horizontally left-right across top of screen
   - **Expected**: Boss fires burst of 5 bullets in spread pattern every 2 seconds
   - **Expected**: Boss bullets are pink and move in telegraphed angles

5. Shoot the boss repeatedly (50 hits required):
   - **Expected**: Boss health bar decreases with each hit
   - **Expected**: Boss flashes white on damage (alpha feedback)
   - **Expected**: Explosion sound plays on each hit

6. Defeat the boss (reduce HP to 0):
   - **Expected**: Large explosion particle effect at boss position
   - **Expected**: Score increases by 500 points
   - **Expected**: Victory screen appears with "VICTORY!" in green
   - **Expected**: "Boss Defeated!" message displayed

**Pass Criteria**:
- ✅ Boss spawns at score ≥ 200 or time ≥ 90s
- ✅ Boss exhibits horizontal sweep pattern
- ✅ Boss fires telegraphed burst attacks
- ✅ Boss takes 50 hits to defeat
- ✅ Victory screen triggers on boss defeat
- ✅ No collision/overlap regressions

---

### 2. Difficulty Progression

**Objective**: Verify enemy speed and spawn rate increase over time with safe bounds.

**Steps**:

1. Start a new game (npm run dev → SPACE)

2. Observe initial enemy behavior (first 30 seconds):
   - Note enemy speed and spawn frequency
   - **Expected**: Enemies spawn every ~1.5 seconds
   - **Expected**: Basic enemies move at ~150 px/s

3. Continue playing for 60 seconds:
   - **Expected**: Enemies spawn more frequently (delay decreases)
   - **Expected**: Enemies move noticeably faster
   - **Expected**: Spawn delay does not go below 800ms (safe minimum)
   - **Expected**: Enemy speed increases up to 1.5x base speed

4. Verify wave spawning pauses during boss:
   - Reach boss trigger condition
   - **Expected**: No new regular enemies spawn while boss is active
   - **Expected**: Power-up spawning also pauses

**Pass Criteria**:
- ✅ Difficulty ramp is observable (faster enemies, more frequent spawns)
- ✅ Spawn delay capped at 800ms minimum
- ✅ Enemy speed capped at 1.5x base speed
- ✅ Wave spawning pauses during boss encounter
- ✅ No runaway spawns or performance issues

---

### 3. UI Polish - Boss Health Bar

**Objective**: Verify boss health bar displays correctly and updates in real-time.

**Steps**:

1. Start game and trigger boss spawn (score ≥ 200)

2. Observe boss health bar:
   - **Expected**: Health bar appears at top center (y=50)
   - **Expected**: Bar shows "BOSS: 50/50" text
   - **Expected**: Bar is 400px wide with pink fill (0xff0088)
   - **Expected**: Bar has white border

3. Shoot boss multiple times:
   - **Expected**: Health bar decreases proportionally
   - **Expected**: Text updates to show current HP (e.g., "BOSS: 45/50")
   - **Expected**: Bar color remains pink throughout

4. Defeat boss:
   - **Expected**: Health bar disappears on boss defeat

**Pass Criteria**:
- ✅ Boss health bar appears on boss spawn
- ✅ Health bar updates in real-time with accurate HP
- ✅ Health bar is responsive and readable
- ✅ Health bar disappears on boss defeat

---

### 4. UI Polish - Run Summary

**Objective**: Verify GameOver/Victory screen displays comprehensive run metrics.

**Steps**:

1. Start game and play until death OR boss defeat

2. Observe GameOver/Victory screen:
   - **Expected**: Title shows "GAME OVER" (red) or "VICTORY!" (green)
   - **Expected**: "Run Summary" heading displayed
   - **Expected**: "Final Score: X" displayed
   - **Expected**: "Time Survived: Xs" displayed
   - **Expected**: "Enemies Destroyed: X" displayed
   - **Expected**: "Power-Ups Collected: X" displayed

3. Verify metrics accuracy:
   - Note score, time, enemies killed, power-ups during gameplay
   - **Expected**: All metrics match actual gameplay values

4. Test navigation:
   - Press SPACE to retry
   - **Expected**: Returns to Game scene with reset metrics
   - Press M for menu
   - **Expected**: Returns to Menu scene

**Pass Criteria**:
- ✅ Summary displays all metrics (score, time, enemies, power-ups)
- ✅ Metrics are accurate and match gameplay
- ✅ Victory screen shows "Boss Defeated!" message
- ✅ HUD remains readable throughout
- ✅ Navigation works correctly (SPACE/M)

---

### 5. Audio and Visual Feedback

**Objective**: Verify boss-related audio and visual effects work correctly.

**Steps**:

1. Ensure audio is not muted (check speaker icon 🔊)

2. Trigger boss spawn:
   - **Expected**: Confirmation sound plays (600Hz tone)

3. Boss fires bullets:
   - **Expected**: Shoot sound plays (800Hz beep)

4. Hit boss with bullets:
   - **Expected**: Explosion sound plays on each hit
   - **Expected**: Boss flashes white (alpha tween)

5. Defeat boss:
   - **Expected**: Explosion sound plays
   - **Expected**: Particle burst with red/orange/yellow colors
   - **Expected**: 12 particles radiate outward from boss position

6. Boss bullet hits player shield:
   - Collect shield power-up first
   - Let boss bullet hit player
   - **Expected**: Explosion sound plays
   - **Expected**: Player scales up briefly (shield feedback)

**Pass Criteria**:
- ✅ Boss spawn plays confirmation SFX
- ✅ Boss attacks play shoot SFX
- ✅ Boss damage plays explosion SFX with alpha flash
- ✅ Boss defeat triggers particle explosion
- ✅ No audio/visual regressions from prior sprints

---

### 6. Unit Tests

**Objective**: Verify all utility functions pass unit tests.

**Steps**:

1. Run unit tests:
   ```bash
   npm run test
   ```

2. Verify test results:
   - **Expected**: All tests pass (0 failures)
   - **Expected**: Tests cover:
     - `calculateFireCooldown` (rapid fire logic)
     - `calculateSpawnDelay` (progression logic)
     - `calculateEnemySpeed` (progression logic)
     - `calculateScore` (including BOSS type)
     - `canFire` (cooldown validation)
     - `shouldSpawnBoss` (boss trigger conditions)

3. Check test coverage:
   - **Expected**: At least 18 tests total
   - **Expected**: All tests complete in <1 second

**Pass Criteria**:
- ✅ All unit tests pass
- ✅ New progression functions tested
- ✅ Boss spawn condition tested
- ✅ Tests run quickly (<1s)

---

### 7. E2E Tests

**Objective**: Verify end-to-end gameplay flows including boss encounter.

**Steps**:

1. Install Playwright browsers (first time only):
   ```bash
   npx playwright install
   ```

2. Start dev server in separate terminal:
   ```bash
   npm run dev
   ```

3. Run E2E tests:
   ```bash
   npm run e2e
   ```

4. Verify test results:
   - **Expected**: All tests pass on Chromium and WebKit
   - **Expected**: Tests cover:
     - Menu → Game → GameOver flow
     - HUD score display
     - Pause functionality
     - Settings menu
     - Boss health bar appearance
     - Victory screen with run summary
     - Run summary metrics display

5. Review test report:
   ```bash
   npx playwright show-report
   ```

**Pass Criteria**:
- ✅ All E2E tests pass on Chromium
- ✅ All E2E tests pass on WebKit
- ✅ Boss spawn test verifies health bar
- ✅ Summary test verifies all metrics
- ✅ No test flakiness or timeouts

---

### 8. Production Build

**Objective**: Verify production build runs without errors.

**Steps**:

1. Create production build:
   ```bash
   npm run build
   ```

2. Verify build output:
   - **Expected**: Build completes successfully
   - **Expected**: No TypeScript errors
   - **Expected**: No console warnings
   - **Expected**: `dist/` folder created with assets

3. Preview production build:
   ```bash
   npm run preview
   ```

4. Test in preview mode:
   - Navigate to http://localhost:4173
   - **Expected**: Game loads without errors
   - **Expected**: No console errors in browser DevTools
   - **Expected**: All features work (menu, game, boss, victory)
   - **Expected**: Audio plays correctly
   - **Expected**: Settings persist across scenes

5. Check performance:
   - **Expected**: Smooth 60 FPS gameplay
   - **Expected**: No frame drops during boss fight
   - **Expected**: Fast initial load time (<2s)

**Pass Criteria**:
- ✅ Build completes without errors
- ✅ Preview runs without runtime errors
- ✅ No console warnings or errors
- ✅ All gameplay features functional
- ✅ Performance is acceptable (60 FPS)

---

## Sprint 4 Acceptance Criteria Summary

### Boss System
- [x] Boss appears at score ≥ 200 or time ≥ 90s
- [x] Boss exhibits horizontal sweep pattern
- [x] Boss fires telegraphed burst attacks (5 bullets, spread pattern)
- [x] Boss has 50 HP and takes multiple hits to defeat
- [x] Boss defeat triggers victory sequence with summary
- [x] No collision/overlap regressions

### Difficulty Progression
- [x] Enemy speed increases over time (up to 1.5x)
- [x] Spawn rate increases over time (down to 800ms minimum)
- [x] Progression is observable and bounded
- [x] Wave spawning pauses during boss
- [x] No runaway spawns or performance issues

### UI Polish
- [x] Boss health bar displays at top with HP counter
- [x] Health bar updates in real-time
- [x] GameOver/Victory screen shows comprehensive summary
- [x] Summary includes: score, time, enemies, power-ups
- [x] Victory screen shows "Boss Defeated!" message
- [x] HUD remains readable at all times

### Testing
- [x] Unit tests pass for all utility functions
- [x] Unit tests cover progression and boss logic
- [x] E2E tests pass on Chromium and WebKit
- [x] E2E tests cover boss spawn and victory flow
- [x] E2E tests verify run summary metrics

### Production Build
- [x] Build completes without errors
- [x] Preview runs without runtime errors
- [x] No console warnings
- [x] All features functional in production
- [x] Performance is acceptable (60 FPS)

---

## Known Issues / Notes

- Boss spawn is deterministic (score OR time threshold)
- Boss bullets use dedicated Group for clean collision handling
- Difficulty progression uses safe caps to prevent performance issues
- All Sprint 1-3 features preserved without regressions
- Audio uses programmatic generation (no external assets)

---

## Next Steps

If all verification steps pass:
1. ✅ Sprint 4 is complete
2. ✅ Game is production-ready
3. ✅ Ready for deployment/distribution

If issues found:
1. Document specific failure in issue tracker
2. Reference this verification guide for reproduction steps
3. Fix and re-verify affected acceptance criteria
