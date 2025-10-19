export interface PowerUpConfig {
  duration: number;
  tint: number;
  name: string;
}

export const POWERUP_TYPES = {
  RAPIDFIRE: { duration: 5000, tint: 0x00ffff, name: 'Rapid Fire' },
  SHIELD: { duration: 8000, tint: 0xffff00, name: 'Shield' },
};
