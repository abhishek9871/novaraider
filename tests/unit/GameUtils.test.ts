import { describe, it, expect } from 'vitest';
import {
  calculateFireCooldown,
  calculateSpawnDelay,
  calculateEnemySpeed,
  calculateScore,
  canFire,
  shouldSpawnBoss,
} from '../../src/utils/GameUtils.js';

describe('GameUtils', () => {
  describe('calculateFireCooldown', () => {
    it('returns 100 when rapid fire is active', () => {
      expect(calculateFireCooldown(250, true)).toBe(100);
    });

    it('returns base rate when rapid fire is inactive', () => {
      expect(calculateFireCooldown(250, false)).toBe(250);
    });
  });

  describe('calculateSpawnDelay', () => {
    it('returns the base delay at start', () => {
      expect(calculateSpawnDelay(1500, 0)).toBe(1500);
    });

    it('reduces delay with progression', () => {
      const result = calculateSpawnDelay(1500, 30000);
      expect(result).toBeLessThan(1500);
      expect(result).toBeGreaterThanOrEqual(800);
    });

    it('caps at minimum delay', () => {
      const result = calculateSpawnDelay(1500, 120000);
      expect(result).toBe(800);
    });
  });

  describe('calculateEnemySpeed', () => {
    it('returns base speed at start', () => {
      expect(calculateEnemySpeed(150, 0)).toBe(150);
    });

    it('increases speed with progression', () => {
      const result = calculateEnemySpeed(150, 30000);
      expect(result).toBeGreaterThan(150);
    });

    it('caps at max multiplier', () => {
      const result = calculateEnemySpeed(150, 120000);
      expect(result).toBe(225);
    });
  });

  describe('calculateScore', () => {
    it('returns 10 for BASIC enemy', () => {
      expect(calculateScore('BASIC')).toBe(10);
    });

    it('returns 20 for ZIGZAG enemy', () => {
      expect(calculateScore('ZIGZAG')).toBe(20);
    });

    it('returns 15 for FASTDIVER enemy', () => {
      expect(calculateScore('FASTDIVER')).toBe(15);
    });

    it('returns 500 for BOSS enemy', () => {
      expect(calculateScore('BOSS')).toBe(500);
    });

    it('returns 10 for unknown enemy type', () => {
      expect(calculateScore('UNKNOWN')).toBe(10);
    });
  });

  describe('shouldSpawnBoss', () => {
    it('returns true when score threshold is met', () => {
      expect(shouldSpawnBoss(200, 0)).toBe(true);
      expect(shouldSpawnBoss(250, 0)).toBe(true);
    });

    it('returns true when time threshold is met', () => {
      expect(shouldSpawnBoss(0, 90000)).toBe(true);
      expect(shouldSpawnBoss(100, 95000)).toBe(true);
    });

    it('returns false when neither threshold is met', () => {
      expect(shouldSpawnBoss(100, 60000)).toBe(false);
      expect(shouldSpawnBoss(0, 0)).toBe(false);
    });
  });

  describe('canFire', () => {
    it('returns true when enough time has passed', () => {
      expect(canFire(1000, 500, 250)).toBe(true);
    });

    it('returns false when not enough time has passed', () => {
      expect(canFire(600, 500, 250)).toBe(false);
    });

    it('returns true when exactly at cooldown threshold', () => {
      expect(canFire(750, 500, 250)).toBe(true);
    });
  });
});
