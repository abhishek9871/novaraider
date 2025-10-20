import Phaser from 'phaser';
import { POWERUP_TYPES } from '../systems/PowerUpTypes.js';

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
  private uiWidth: number = 800;
  private uiHeight: number = 600;
  private touchEnabled: boolean = false;
  private joystickBase!: Phaser.GameObjects.Graphics;
  private joystickThumb!: Phaser.GameObjects.Graphics;
  private joystickActive: boolean = false;
  private joystickMaxRadius: number = 50;
  private joystickCenter: Phaser.Math.Vector2 = new Phaser.Math.Vector2(80, 520);
  private powerButtonsContainer!: Phaser.GameObjects.Container;
  private bankedList: string[] = [];

  constructor() {
    super('UI');
  }

  create() {
    this.loadSettings();

    this.touchEnabled = this.sys.game.device.input.touch;
    const controlMode = this.registry.get('controlMode') as string | undefined;

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
    this.muteButton.setOrigin(1, 0);
    this.muteButton.setInteractive({ useHandCursor: true });
    this.muteButton.on('pointerdown', () => this.toggleMute());

    this.settingsButton = this.add.text(700, 16, '⚙️', {
      fontSize: '24px',
      color: '#ffffff',
    });
    this.settingsButton.setOrigin(1, 0);
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

    if (this.touchEnabled && controlMode !== 'relativeTouch') {
      this.setupJoystick();
    }

    gameScene.events.on('bankUpdate', (list: string[]) => {
      this.bankedList = list;
      this.renderPowerButtons();
    });

    this.setupPowerButtons();

    this.layoutUI(this.scale.gameSize.width, this.scale.gameSize.height);
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.layoutUI(gameSize.width, gameSize.height);
    });
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
    const x = (this.uiWidth - barWidth) / 2;
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
    this.bossHealthText.setPosition(this.uiWidth / 2, 30);
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

  private layoutUI(width: number, height: number) {
    this.uiWidth = width;
    this.uiHeight = height;
    this.scoreText.setPosition(16, 16);
    this.powerUpText.setPosition(16, 50);
    this.muteButton.setPosition(this.uiWidth - 16, 16);
    this.settingsButton.setPosition(this.uiWidth - 56, 16);
    this.pauseText.setPosition(this.uiWidth / 2, this.uiHeight / 2);
    if (this.settingsPanel) {
      this.settingsPanel.setPosition(this.uiWidth / 2 - 150, this.uiHeight / 2 - 100);
    }
    if (this.bossHealthText) {
      this.bossHealthText.setPosition(this.uiWidth / 2, 30);
    }
    this.joystickCenter.set(80, this.uiHeight - 80);
    if (this.joystickBase) {
      this.joystickBase.setPosition(this.joystickCenter.x, this.joystickCenter.y);
    }
    if (this.joystickThumb && !this.joystickActive) {
      this.joystickThumb.setPosition(this.joystickCenter.x, this.joystickCenter.y);
    }
    if (this.powerButtonsContainer && this.touchEnabled) {
      this.renderPowerButtons();
    }
  }

  private setupJoystick() {
    if (!this.touchEnabled) {
      return;
    }

    this.joystickBase = this.add.graphics();
    this.joystickBase.fillStyle(0xffffff, 0.1);
    this.joystickBase.lineStyle(2, 0xffffff, 0.3);
    this.joystickBase.fillCircle(0, 0, this.joystickMaxRadius);
    this.joystickBase.strokeCircle(0, 0, this.joystickMaxRadius);

    this.joystickThumb = this.add.graphics();
    this.joystickThumb.fillStyle(0xffffff, 0.5);
    this.joystickThumb.fillCircle(0, 0, 18);

    this.joystickBase.setPosition(this.joystickCenter.x, this.joystickCenter.y);
    this.joystickThumb.setPosition(this.joystickCenter.x, this.joystickCenter.y);

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (p.x <= this.uiWidth * 0.5) {
        this.joystickActive = true;
        this.updateJoystick(p.x, p.y);
      }
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (!this.joystickActive) return;
      this.updateJoystick(p.x, p.y);
    });
    this.input.on('pointerup', () => {
      this.joystickActive = false;
      this.joystickThumb.setPosition(this.joystickCenter.x, this.joystickCenter.y);
      const gameScene = this.scene.get('Game');
      gameScene.events.emit('joystickMove', { x: 0, y: 0 });
    });
  }


private updateJoystick(px: number, py: number) {
const dx = px - this.joystickCenter.x;
const dy = py - this.joystickCenter.y;
const len = Math.hypot(dx, dy);
const clamped = Math.min(len, this.joystickMaxRadius);
const angle = Math.atan2(dy, dx);
const nx = Math.cos(angle);
const ny = Math.sin(angle);
const tx = this.joystickCenter.x + nx * clamped;
const ty = this.joystickCenter.y + ny * clamped;
this.joystickThumb.setPosition(tx, ty);
const vx = (clamped / this.joystickMaxRadius) * nx;
const vy = (clamped / this.joystickMaxRadius) * ny;
const gameScene = this.scene.get('Game');
gameScene.events.emit('joystickMove', { x: vx, y: vy });
}

private setupPowerButtons() {
if (!this.touchEnabled) return;
this.powerButtonsContainer = this.add.container(0, 0);
this.powerButtonsContainer.setVisible(true);
this.renderPowerButtons();
}

private renderPowerButtons() {
if (!this.touchEnabled || !this.powerButtonsContainer) return;
this.powerButtonsContainer.removeAll(true);

const radius = 20;
const gap = 10;
const margin = 16;
const baseY = this.uiHeight - 80;

const gameScene = this.scene.get('Game');

this.bankedList.forEach((type, i) => {
const tint = type === 'RAPIDFIRE' ? POWERUP_TYPES.RAPIDFIRE.tint : POWERUP_TYPES.SHIELD.tint;
const x = this.uiWidth - (margin + radius) - i * ((radius * 2) + gap);
const y = baseY;
const circle = this.add.circle(x, y, radius, tint, 0.6).setStrokeStyle(2, 0xffffff, 0.6);
circle.setInteractive({ useHandCursor: true });
circle.on('pointerdown', (_p: any, _lx: any, _ly: any, event: any) => {
if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
gameScene.events.emit('usePowerUp', type);
});
this.powerButtonsContainer.add(circle);
});
}

}
