export interface BossConfig {
  hp: number;
  speed: number;
  score: number;
  tint: number;
  fireRate: number;
  burstCount: number;
}

export const BOSS_CONFIG: BossConfig = {
  hp: 50,
  speed: 100,
  score: 500,
  tint: 0xff0088,
  fireRate: 2000,
  burstCount: 5,
};
