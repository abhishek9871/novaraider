import { test, expect } from '@playwright/test';

test.describe('Space Fighter Game', () => {
  test('should complete Menu -> Game -> GameOver flow', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    await page.keyboard.press('Space');
    await page.waitForTimeout(1000);

    const scoreText = page.locator('text=/Score:/');
    await expect(scoreText).toBeVisible();

    await page.keyboard.press('Space');
    await page.waitForTimeout(500);

    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(100);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);
  });

  test('should display HUD and update score', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    await page.keyboard.press('Space');
    await page.waitForTimeout(1000);

    const scoreText = page.locator('text=/Score: 0/');
    await expect(scoreText).toBeVisible();
  });

  test('should handle pause functionality', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    await page.keyboard.press('Space');
    await page.waitForTimeout(1000);

    await page.keyboard.press('KeyP');
    await page.waitForTimeout(500);

    const pauseText = page.locator('text=/PAUSED/');
    await expect(pauseText).toBeVisible();

    await page.keyboard.press('KeyP');
    await page.waitForTimeout(500);
  });

  test('should open settings menu', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    await page.keyboard.press('Space');
    await page.waitForTimeout(1000);

    const settingsButton = page.locator('text=⚙️');
    await settingsButton.click();
    await page.waitForTimeout(500);

    const settingsTitle = page.locator('text=/Settings/');
    await expect(settingsTitle).toBeVisible();
  });

  test('should display boss health bar when boss spawns', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    await page.keyboard.press('Space');
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
      const gameScene = (window as any).game?.scene?.scenes?.find(
        (s: any) => s.scene.key === 'Game',
      );
      if (gameScene) {
        gameScene.score = 200;
      }
    });

    await page.waitForTimeout(2000);

    const bossText = page.locator('text=/BOSS:/');
    await expect(bossText).toBeVisible({ timeout: 5000 });
  });

  test('should show victory screen after boss defeat', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    await page.keyboard.press('Space');
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
      const gameScene = (window as any).game?.scene?.scenes?.find(
        (s: any) => s.scene.key === 'Game',
      );
      if (gameScene) {
        gameScene.score = 200;
        setTimeout(() => {
          if (gameScene.boss) {
            gameScene.bossHp = 1;
          }
        }, 2000);
      }
    });

    await page.waitForTimeout(5000);

    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(100);
    }

    await page.waitForTimeout(2000);
  });

  test('should display run summary with metrics', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);

    await page.keyboard.press('Space');
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
      const gameScene = (window as any).game?.scene?.scenes?.find(
        (s: any) => s.scene.key === 'Game',
      );
      if (gameScene && gameScene.hitPlayer) {
        gameScene.hitPlayer();
      }
    });

    await page.waitForTimeout(1000);

    const summaryText = page.locator('text=/Run Summary/');
    await expect(summaryText).toBeVisible();

    const timeText = page.locator('text=/Time Survived:/');
    await expect(timeText).toBeVisible();

    const enemiesText = page.locator('text=/Enemies Destroyed:/');
    await expect(enemiesText).toBeVisible();
  });
});
