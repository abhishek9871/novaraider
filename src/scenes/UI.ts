import Phaser from 'phaser';

export class UI extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;
  private powerUpText!: Phaser.GameObjects.Text;
  private pauseText!: Phaser.GameObjects.Text;
  private muteButton!: Phaser.GameObjects.Text;
  private volumeText!: Phaser.GameObjects.Text;
  private settingsButton!: Phaser.GameObjects.Text;
  private settingsPanel!: Phaser.GameObjects.Container;
  private volumeSlider!: Phaser.GameObjects.Graphics;
  private volumeHandle!: Phaser.GameObjects.Graphics;
  private isDragging = false;
  private rapidFireTimer: number = 0;
  private shieldTimer: number = 0;
  private bossHealthBar!: Phaser.GameObjects.Graphics;
  private bossHealthBarBg!: Phaser.GameObjects.Graphics;
  private bossHealthText!: Phaser.GameObjects.Text;
  private bossHealthContainer!: Phaser.GameObjects.Container;

  constructor() {
    super('UI');
  }

  create() {
    this.loadSettings();

    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
    });

    this.powerUpText = this.add.text(16, 50, '', {
      fontSize: '18px',
      color: '#00ffff',
    });

    this.pauseText = this.add.text(400, 300, 'PAUSED\nPress P to Resume', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center',
    });
    this.pauseText.setOrigin(0.5);
    this.pauseText.setVisible(false);

    this.muteButton = this.add.text(750, 16, this.sound.mute ? '🔇' : '🔊', {
      fontSize: '24px',
      color: '#ffffff',
    });
    this.muteButton.setInteractive({ useHandCursor: true });
    this.muteButton.on('pointerdown', () => this.toggleMute());

    this.settingsButton = this.add.text(700, 16, '⚙️', {
      fontSize: '24px',
      color: '#ffffff',
    });
    this.settingsButton.setInteractive({ useHandCursor: true });
    this.settingsButton.on('pointerdown', () => this.toggleSettings());

    this.createSettingsPanel();
    this.updateVolumeDisplay();

    const gameScene = this.scene.get('Game');
    gameScene.events.on('scoreUpdate', (score: number) => {
      this.scoreText.setText(`Score: ${score}`);
    });

    gameScene.events.on('powerUpUpdate', (data: { rapidFire: boolean; shield: boolean }) => {
      this.updatePowerUpDisplay(data);
    });

    gameScene.events.on('gamePaused', (paused: boolean) => {
      this.pauseText.setVisible(paused);
    });

    gameScene.events.on('bossSpawned', (data: { hp: number; maxHp: number }) => {
      this.showBossHealthBar(data.hp, data.maxHp);
    });

    gameScene.events.on('bossHpUpdate', (data: { hp: number; maxHp: number }) => {
      this.updateBossHealthBar(data.hp, data.maxHp);
    });

    gameScene.events.on('bossDefeated', () => {
      this.hideBossHealthBar();
    });

    this.createBossHealthBar();
  }

  private createBossHealthBar() {
    this.bossHealthBarBg = this.add.graphics();
    this.bossHealthBar = this.add.graphics();
    this.bossHealthText = this.add.text(400, 30, '', {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    this.bossHealthText.setOrigin(0.5);

    this.bossHealthContainer = this.add.container(0, 0, [
      this.bossHealthBarBg,
      this.bossHealthBar,
      this.bossHealthText,
    ]);
    this.bossHealthContainer.setVisible(false);
  }

  private showBossHealthBar(hp: number, maxHp: number) {
    this.bossHealthContainer.setVisible(true);
    this.updateBossHealthBar(hp, maxHp);
  }

  private updateBossHealthBar(hp: number, maxHp: number) {
    const barWidth = 400;
    const barHeight = 20;
    const x = 200;
    const y = 50;

    this.bossHealthBarBg.clear();
    this.bossHealthBarBg.fillStyle(0x333333);
    this.bossHealthBarBg.fillRect(x, y, barWidth, barHeight);
    this.bossHealthBarBg.lineStyle(2, 0xffffff);
    this.bossHealthBarBg.strokeRect(x, y, barWidth, barHeight);

    this.bossHealthBar.clear();
    const healthPercent = hp / maxHp;
    const currentWidth = barWidth * healthPercent;
    this.bossHealthBar.fillStyle(0xff0088);
    this.bossHealthBar.fillRect(x, y, currentWidth, barHeight);

    this.bossHealthText.setText(`BOSS: ${hp}/${maxHp}`);
  }

  private hideBossHealthBar() {
    this.bossHealthContainer.setVisible(false);
  }

  update() {
    if (this.rapidFireTimer > 0) {
      this.rapidFireTimer -= this.game.loop.delta;
    }
    if (this.shieldTimer > 0) {
      this.shieldTimer -= this.game.loop.delta;
    }
  }

  private updatePowerUpDisplay(data: { rapidFire: boolean; shield: boolean }) {
    if (!this.powerUpText) return;
    
    const lines: string[] = [];
    if (data.rapidFire) {
      this.rapidFireTimer = 5000;
      lines.push('Rapid Fire');
    } else {
      this.rapidFireTimer = 0;
    }
    if (data.shield) {
      this.shieldTimer = 8000;
      lines.push('Shield');
    } else {
      this.shieldTimer = 0;
    }
    
    try {
      this.powerUpText.setText(lines.join('\n'));
    } catch (e) {
      console.warn('Failed to update power-up text:', e);
    }
  }

  private toggleMute() {
    this.sound.mute = !this.sound.mute;
    this.muteButton.setText(this.sound.mute ? '🔇' : '🔊');
    this.saveSettings();
  }

  private createSettingsPanel() {
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.9);
    bg.fillRect(0, 0, 300, 200);
    bg.lineStyle(2, 0xffffff);
    bg.strokeRect(0, 0, 300, 200);

    const title = this.add.text(150, 20, 'Settings', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    const volumeLabel = this.add.text(30, 70, 'Volume:', {
      fontSize: '18px',
      color: '#ffffff',
    });

    this.volumeSlider = this.add.graphics();
    this.volumeSlider.fillStyle(0x444444);
    this.volumeSlider.fillRect(30, 100, 240, 10);

    this.volumeHandle = this.add.graphics();
    this.volumeHandle.fillStyle(0xffffff);
    this.volumeHandle.fillCircle(0, 0, 8);
    this.volumeHandle.setPosition(30 + 240 * this.sound.volume, 105);
    
    // Create an invisible rectangle for interaction instead of using the graphics object directly
    const handleHitArea = this.add.rectangle(0, 0, 24, 24, 0x000000, 0);
    handleHitArea.setPosition(30 + 240 * this.sound.volume, 105);
    handleHitArea.setInteractive({ useHandCursor: true });
    this.input.setDraggable(handleHitArea);

    this.input.on('drag', (_pointer: any, gameObject: any, dragX: number) => {
      if (gameObject === handleHitArea) {
        const clampedX = Phaser.Math.Clamp(dragX, 30, 270);
        this.volumeHandle.setPosition(clampedX, 105);
        handleHitArea.setPosition(clampedX, 105);
        const volume = (clampedX - 30) / 240;
        this.sound.volume = volume;
        this.updateVolumeDisplay();
        this.saveSettings();
      }
    });

    this.volumeText = this.add.text(150, 130, '', {
      fontSize: '16px',
      color: '#aaaaaa',
    });
    this.volumeText.setOrigin(0.5);

    const closeBtn = this.add.text(150, 170, 'Close', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 20, y: 10 },
    });
    closeBtn.setOrigin(0.5);
    closeBtn.setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.toggleSettings());

    this.settingsPanel = this.add.container(250, 200, [
      bg,
      title,
      volumeLabel,
      this.volumeSlider,
      this.volumeHandle,
      handleHitArea,
      this.volumeText,
      closeBtn,
    ]);
    this.settingsPanel.setVisible(false);
  }

  private toggleSettings() {
    this.settingsPanel.setVisible(!this.settingsPanel.visible);
  }

  private updateVolumeDisplay() {
    const vol = Math.round(this.sound.volume * 100);
    this.volumeText.setText(`${vol}%`);
  }

  private saveSettings() {
    sessionStorage.setItem('sfVolume', this.sound.volume.toString());
    sessionStorage.setItem('sfMute', this.sound.mute.toString());
  }

  private loadSettings() {
    const volume = sessionStorage.getItem('sfVolume');
    const mute = sessionStorage.getItem('sfMute');
    if (volume) this.sound.volume = parseFloat(volume);
    if (mute) this.sound.mute = mute === 'true';
  }
}
