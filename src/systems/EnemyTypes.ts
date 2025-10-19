export interface EnemyConfig {
  hp: number;
  speed: number;
  score: number;
  tint: number;
}

export const ENEMY_TYPES = {
  BASIC: { hp: 1, speed: 150, score: 10, tint: 0xff0000 },
  ZIGZAG: { hp: 2, speed: 120, score: 20, tint: 0xff00ff },
  FASTDIVER: { hp: 1, speed: 300, score: 15, tint: 0xff8800 },
};
