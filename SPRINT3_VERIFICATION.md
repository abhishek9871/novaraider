# Sprint 3 Verification Guide

## Visual Polish: Explosion Animations and Damage Feedback

### Enemy Destruction Explosions

1. Run `npm run dev`
2. Start game (press SPACE or click)
3. Shoot enemies with SPACE or click
4. **Expected**: When enemy is destroyed, see particle burst with red/orange/yellow colors radiating outward
5. **Verify**: Particles fade out over ~400ms, no collision issues

### Damage Feedback on Multi-HP Enemies

1. In game, shoot a ZIGZAG enemy (magenta, moves side-to-side)
2. **Expected**: First hit causes enemy to flash (alpha blink), second hit destroys with explosion
3. **Verify**: Flash animation is quick (~100ms) and doesn't interfere with gameplay

### Shield Hit Feedback

1. Collect a yellow power-up (Shield)
2. Collide with an enemy while shield is active
3. **Expected**: Player sprite scales up briefly (~150ms) and shield deactivates
4. **Verify**: Scale animation is smooth, player returns to normal size

### Player Death Explosion

1. Collide with enemy without shield
2. **Expected**: Explosion particles appear at player position before GameOver screen
3. **Verify**: Smooth transition to GameOver scene

## Responsive Scaling: ScaleManager FIT with Auto-Centering

### Desktop Resolutions

1. Run `npm run dev`
2. Resize browser window to various sizes (e.g., 1920x1080, 1366x768, 1024x768)
3. **Expected**: Game canvas scales proportionally, maintains 800x600 aspect ratio, centers in viewport
4. **Verify**: No stretching or distortion, HUD remains readable, playfield boundaries correct

### Simulated Mobile Resolutions

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on iPhone SE (375x667), iPad (768x1024), Pixel 5 (393x851)
4. **Expected**: Game scales to fit screen, preserves aspect ratio, controls remain functional
5. **Verify**: Touch/click input works, HUD text is legible

## Settings Menu: Volume and Mute Controls

### Opening Settings

1. Run `npm run dev`, start game
2. Click ⚙️ icon in top-right corner
3. **Expected**: Settings panel appears with "Settings" title, volume slider, and Close button
4. **Verify**: Panel is centered and readable

### Volume Slider

1. In Settings panel, drag the white circle on the volume slider
2. **Expected**: Volume changes immediately (test by firing bullets or collecting power-ups)
3. **Verify**: Volume percentage updates below slider (0%-100%)
4. Move slider to 0% - all sounds muted
5. Move slider to 100% - full volume

### Mute Toggle

1. Click 🔊 icon in top-right
2. **Expected**: Icon changes to 🔇, all sounds stop
3. Click again
4. **Expected**: Icon changes back to 🔊, sounds resume

### Session Persistence

1. Adjust volume to 50% and close settings
2. Trigger GameOver and restart game
3. **Expected**: Volume remains at 50%
4. **Verify**: Settings persist across scene transitions within same browser session
5. Close browser tab and reopen - settings reset (session-only, no localStorage)

## Unit Tests: Vitest

### Running Tests

```bash
npm run test
```

### Expected Output

- All tests in `tests/unit/GameUtils.test.ts` pass
- Tests cover:
  - `calculateFireCooldown`: Rapid fire (100ms) vs base rate (250ms)
  - `calculateSpawnDelay`: Returns base delay
  - `calculateScore`: BASIC (10), ZIGZAG (20), FASTDIVER (15), unknown (10)
  - `canFire`: Cooldown logic with edge cases

### Verification

- ✅ 12 tests pass
- ✅ No errors or warnings
- ✅ Fast execution (<1s)

## E2E Tests: Playwright

### Installing Browsers

```bash
npx playwright install
```

### Running Tests

```bash
npm run e2e
```

### Test Coverage

1. **Menu → Game → GameOver flow**
   - Loads game, presses SPACE to start
   - Verifies canvas visible
   - Checks score HUD appears
   - Tests keyboard input (arrows, space)

2. **HUD and Score Display**
   - Starts game
   - Verifies "Score: 0" text visible

3. **Pause Functionality**
   - Starts game
   - Presses P key
   - Verifies "PAUSED" text appears
   - Resumes with P key

4. **Settings Menu**
   - Starts game
   - Clicks ⚙️ button
   - Verifies "Settings" title appears

### Expected Results

- ✅ All 4 tests pass on Chromium
- ✅ All 4 tests pass on WebKit
- ✅ HTML report generated in `playwright-report/`
- ✅ Videos/traces captured on failure

### Manual Verification

1. Check `playwright-report/index.html` for detailed results
2. Verify no console errors during test runs
3. Confirm tests complete in <30s total

## Performance and Stability

### Frame Rate

1. Run game and play for 2-3 minutes
2. **Expected**: Smooth 60 fps, no stuttering
3. **Verify**: Explosions and animations don't cause frame drops

### Memory Leaks

1. Play multiple rounds (GameOver → retry 5+ times)
2. **Expected**: No increasing lag or slowdown
3. **Verify**: Particles and tweens clean up properly

### Collision Integrity

1. Test all collision scenarios:
   - Bullet hits enemy
   - Player hits enemy (with/without shield)
   - Power-up collection
2. **Expected**: All collisions work as in Sprint 2
3. **Verify**: Animations don't interfere with physics

## Acceptance Criteria Checklist

- [ ] Explosion particles appear on enemy death with no collision regressions
- [ ] Damage feedback (flash) on multi-HP enemies
- [ ] Shield hit feedback (scale animation) on player
- [ ] ScaleManager FIT preserves aspect ratio across resolutions
- [ ] Game centers properly in viewport at various window sizes
- [ ] Settings menu accessible via ⚙️ button
- [ ] Volume slider adjusts sound immediately (0-100%)
- [ ] Mute toggle works (🔊/🔇)
- [ ] Settings persist across scenes in current session
- [ ] Vitest unit tests pass (12/12)
- [ ] Playwright E2E tests pass on Chromium and WebKit (4/4 each)
- [ ] No performance degradation from animations
- [ ] All Sprint 1 and Sprint 2 features remain functional

## Known Limitations

- Settings persist only for current browser session (sessionStorage)
- Particle system uses simple graphics (no sprite textures)
- E2E tests use fixed timeouts (may need adjustment on slower systems)
- Volume slider requires mouse drag (no keyboard control)

## Next Steps (Sprint 4)

- Boss encounters with telegraphed attacks
- Difficulty progression (speed/spawn rate increase)
- Expanded E2E tests for boss mechanics
- Production build optimization
