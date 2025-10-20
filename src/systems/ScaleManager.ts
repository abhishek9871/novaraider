import Phaser from 'phaser';

export const BASE_WIDTH = 800;
export const BASE_HEIGHT = 600;

export type ScaleResult = {
  zoom: number;
  worldWidth: number;
  worldHeight: number;
  orientation: 'portrait' | 'landscape';
};

export function computeScale(viewWidth: number, viewHeight: number): ScaleResult {
  if (viewHeight > viewWidth) {
    const zoom = viewWidth / BASE_WIDTH;
    const worldWidth = BASE_WIDTH;
    const worldHeight = viewHeight / zoom;
    return { zoom, worldWidth, worldHeight, orientation: 'portrait' };
  } else {
    const zoom = viewHeight / BASE_HEIGHT;
    const worldHeight = BASE_HEIGHT;
    const worldWidth = viewWidth / zoom;
    return { zoom, worldWidth, worldHeight, orientation: 'landscape' };
  }
}

export function applyScale(
  scene: Phaser.Scene,
  physicsWorld: Phaser.Physics.Arcade.World,
  camera: Phaser.Cameras.Scene2D.Camera,
  viewWidth: number,
  viewHeight: number,
): ScaleResult {
  const result = computeScale(viewWidth, viewHeight);
  camera.setZoom(result.zoom);
  camera.setBounds(0, 0, result.worldWidth, result.worldHeight);
  physicsWorld.setBounds(0, 0, result.worldWidth, result.worldHeight);
  return result;
}
