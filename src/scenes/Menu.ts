import Phaser from 'phaser';

export class Menu extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add
      .text(width / 2, height / 2 - 100, 'SPACE FIGHTER', {
        fontSize: '48px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const startText = this.add
      .text(width / 2, height / 2 + 50, 'Press SPACE to Start', {
        fontSize: '24px',
        color: '#00ff00',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    this.input.keyboard?.once('keydown-SPACE', () => {
      this.enableAudio();
      this.playSound('confirm');
      this.scene.start('Game');
    });

    this.input.once('pointerdown', () => {
      this.enableAudio();
      this.playSound('confirm');
      this.scene.start('Game');
    });
  }

  private enableAudio() {
    try {
      const audioContext = (this.sound as any).context;
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
      }
    } catch (e) {
      console.warn('Failed to enable audio:', e);
    }
  }

  private playSound(key: string) {
    try {
      if (this.cache.audio.exists(key)) {
        this.sound.play(key, { volume: 0.5 });
      }
    } catch (e) {
      console.warn('Failed to play sound:', key, e);
    }
  }
}
