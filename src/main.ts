import Phaser from 'phaser';
import { Boot } from './scenes/Boot.js';
import { Preload } from './scenes/Preload.js';
import { Menu } from './scenes/Menu.js';
import { Game } from './scenes/Game.js';
import { UI } from './scenes/UI.js';
import { GameOver } from './scenes/GameOver.js';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: document.getElementById('game') || undefined,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Boot, Preload, Menu, Game, UI, GameOver],
};

const game = new Phaser.Game(config);

if (typeof window !== 'undefined') {
  (window as any).game = game;
  
  // Initialize audio on first user interaction
  const initAudio = () => {
    try {
      const audioContext = (game.sound as any).context;
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
      }
    } catch (e) {
      console.warn('Failed to initialize audio:', e);
    }
    document.removeEventListener('click', initAudio);
    document.removeEventListener('keydown', initAudio);
  };
  
  document.addEventListener('click', initAudio);
  document.addEventListener('keydown', initAudio);
}
