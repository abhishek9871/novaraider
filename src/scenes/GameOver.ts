import Phaser from 'phaser';

export class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create(data: {
    score: number;
    timeSurvived?: number;
    enemiesDestroyed?: number;
    powerUpsCollected?: number;
    victory?: boolean;
  }) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const isVictory = data.victory || false;

    this.add
      .text(width / 2, 80, isVictory ? 'VICTORY!' : 'GAME OVER', {
        fontSize: '48px',
        color: isVictory ? '#00ff00' : '#ff0000',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    if (isVictory) {
      this.add
        .text(width / 2, 130, 'Boss Defeated!', {
          fontSize: '24px',
          color: '#ffff00',
        })
        .setOrigin(0.5);
    }

    this.add
      .text(width / 2, 200, 'Run Summary', {
        fontSize: '28px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const summaryY = 250;
    const lineHeight = 35;

    this.add
      .text(width / 2, summaryY, `Final Score: ${data.score}`, {
        fontSize: '24px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    if (data.timeSurvived !== undefined) {
      this.add
        .text(width / 2, summaryY + lineHeight, `Time Survived: ${data.timeSurvived}s`, {
          fontSize: '20px',
          color: '#aaaaaa',
        })
        .setOrigin(0.5);
    }

    if (data.enemiesDestroyed !== undefined) {
      this.add
        .text(width / 2, summaryY + lineHeight * 2, `Enemies Destroyed: ${data.enemiesDestroyed}`, {
          fontSize: '20px',
          color: '#aaaaaa',
        })
        .setOrigin(0.5);
    }

    if (data.powerUpsCollected !== undefined) {
      this.add
        .text(
          width / 2,
          summaryY + lineHeight * 3,
          `Power-Ups Collected: ${data.powerUpsCollected}`,
          {
            fontSize: '20px',
            color: '#aaaaaa',
          },
        )
        .setOrigin(0.5);
    }

    const retryText = this.add
      .text(width / 2, 480, 'Press SPACE to Retry', {
        fontSize: '20px',
        color: '#00ff00',
      })
      .setOrigin(0.5);

    const menuText = this.add
      .text(width / 2, 520, 'Press M for Menu', {
        fontSize: '20px',
        color: '#00ffff',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: [retryText, menuText],
      alpha: 0.5,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    this.input.keyboard?.on('keydown-SPACE', () => {
      this.enableAudio();
      this.playSound('confirm');
      this.scene.start('Game');
    });

    this.input.keyboard?.on('keydown-M', () => {
      this.enableAudio();
      this.playSound('confirm');
      this.scene.start('Menu');
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
