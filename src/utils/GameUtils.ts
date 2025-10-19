export function calculateFireCooldown(baseRate: number, isRapidFire: boolean): number {
  return isRapidFire ? 100 : baseRate;
}

export function calculateSpawnDelay(baseDelay: number, elapsedTime: number = 0): number {
  const progressionFactor = Math.min(elapsedTime / 60000, 1);
  const minDelay = 800;
  return Math.max(baseDelay - progressionFactor * (baseDelay - minDelay), minDelay);
}

export function calculateEnemySpeed(baseSpeed: number, elapsedTime: number = 0): number {
  const progressionFactor = Math.min(elapsedTime / 60000, 1);
  const maxSpeedMultiplier = 1.5;
  return baseSpeed * (1 + progressionFactor * (maxSpeedMultiplier - 1));
}

export function calculateScore(enemyType: string): number {
  const scores: Record<string, number> = {
    BASIC: 10,
    ZIGZAG: 20,
    FASTDIVER: 15,
    BOSS: 500,
  };
  return scores[enemyType] || 10;
}

export function canFire(currentTime: number, lastFired: number, cooldown: number): boolean {
  return currentTime >= lastFired + cooldown;
}

export function shouldSpawnBoss(score: number, elapsedTime: number): boolean {
  return score >= 200 || elapsedTime >= 90000;
}
