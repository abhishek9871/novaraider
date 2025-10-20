import Phaser from 'phaser';
import { ENEMY_TYPES } from '../systems/EnemyTypes.js';
import { POWERUP_TYPES } from '../systems/PowerUpTypes.js';
import { BOSS_CONFIG } from '../systems/BossConfig.js';
import {
  calculateSpawnDelay,
  calculateEnemySpeed,
  shouldSpawnBoss,
} from '../utils/GameUtils.js';
import { applyScale } from '../systems/ScaleManager.js';
import { HapticManager } from '../systems/HapticManager.js';

export class Game extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private bullets!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private zigzagEnemies!: Phaser.Physics.Arcade.Group;
  private fastEnemies!: Phaser.Physics.Arcade.Group;
  private powerUps!: Phaser.Physics.Arcade.Group;
  private lastFired = 0;
  private fireRate = 250;
  private baseFireRate = 250;
  private score = 0;
  private stars!: Phaser.GameObjects.TileSprite;
  private starsBack!: Phaser.GameObjects.TileSprite;
  private enemySpawnEvent!: Phaser.Time.TimerEvent;
  private powerUpSpawnEvent!: Phaser.Time.TimerEvent;
  private rapidFireActive = false;
  private shieldActive = false;
  private pauseKey!: Phaser.Input.Keyboard.Key;
  private isPaused = false;
  private enemyData = new Map<Phaser.Physics.Arcade.Sprite, { hp: number; type: string }>();
  private boss: Phaser.Physics.Arcade.Sprite | null = null;
  private bossHp = 0;
  private bossBullets!: Phaser.Physics.Arcade.Group;
  private bossActive = false;
  private bossLastFired = 0;
  private bossDirection = 1;
  private gameStartTime = 0;
  private enemiesDestroyed = 0;
  private powerUpsCollected = 0;
  private touchEnabled = false;
  private worldWidth = 800;
  private worldHeight = 600;
  private joystickVector: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
  private aimActive = false;
  private aimPointerId: number | null = null;
  private aimLine?: Phaser.GameObjects.Graphics;
  private bankedPowerUps: string[] = [];
  // Relative touch controls (mobile-only)
  private useRelativeTouchControls = false;
  private activeTouchId: number | null = null;
  private touchActive = false;
  private relTouchCurrX = 0;
  private relTouchCurrY = 0;
  private relTouchLastX = 0;
  private relTouchLastY = 0;
  private rtSensitivityX = 12; // tuning: pixels/frame -> velocity scale
  private rtSensitivityY = 0; // 0 => horizontal-only
  private rtMaxSpeedX = 400;
  private rtMaxSpeedY = 0;
  private rtDeadZone = 3;
  private rtLerp = 0.25;
  private mobileAutoFireMode: 'whileTouching' | 'always' | 'enemyAware' = 'whileTouching';

  constructor() {
    super('Game');
  }

  private handleResize(gameSize: Phaser.Structs.Size) {
    const { width, height } = gameSize;
    const res = applyScale(this, this.physics.world, this.cameras.main, width, height);
    this.worldWidth = res.worldWidth;
    this.worldHeight = res.worldHeight;

    // Resize and re-center starfields
    this.starsBack.setDisplaySize(this.worldWidth, this.worldHeight);
    this.starsBack.setPosition(this.worldWidth / 2, this.worldHeight / 2);
    this.stars.setDisplaySize(this.worldWidth, this.worldHeight);
    this.stars.setPosition(this.worldWidth / 2, this.worldHeight / 2);

    // Clamp player within new bounds
    if (this.player) {
      this.player.x = Phaser.Math.Clamp(this.player.x, 16, this.worldWidth - 16);
      this.player.y = Phaser.Math.Clamp(this.player.y, 16, this.worldHeight - 16);
    }

    // Clamp boss if active
    if (this.boss) {
      this.boss.x = Phaser.Math.Clamp(this.boss.x, 80, this.worldWidth - 80);
    }
  }

  create() {
    this.score = 0;
    this.rapidFireActive = false;
    this.shieldActive = false;
    this.isPaused = false;
    this.enemyData.clear();
    this.boss = null;
    this.bossHp = 0;
    this.bossActive = false;
    this.bossLastFired = 0;
    this.bossDirection = 1;
    this.gameStartTime = this.time.now;
    this.enemiesDestroyed = 0;
    this.powerUpsCollected = 0;

    this.touchEnabled = this.sys.game.device.input.touch;
    // Enable relative touch control scheme by default on touch devices
    this.useRelativeTouchControls = !!this.touchEnabled;

    this.starsBack = this.add.tileSprite(400, 300, 800, 600, 'pixel');
    this.starsBack.setTint(0x111111);

    this.stars = this.add.tileSprite(400, 300, 800, 600, 'pixel');
    this.stars.setTint(0x222222);

    const scaleRes = applyScale(
      this,
      this.physics.world,
      this.cameras.main,
      this.scale.gameSize.width,
      this.scale.gameSize.height,
    );
    this.worldWidth = scaleRes.worldWidth;
    this.worldHeight = scaleRes.worldHeight;

    // Fit background to current world
    this.starsBack.setDisplaySize(this.worldWidth, this.worldHeight);
    this.starsBack.setPosition(this.worldWidth / 2, this.worldHeight / 2);
    this.stars.setDisplaySize(this.worldWidth, this.worldHeight);
    this.stars.setPosition(this.worldWidth / 2, this.worldHeight / 2);

    this.player = this.physics.add.sprite(this.worldWidth / 2, this.worldHeight - 100, 'pixel').setTint(0x00ff00);
    this.player.setDisplaySize(32, 32);
    this.player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys('W,A,S,D') as any;
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.pauseKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.P);

    this.bullets = this.physics.add.group({
      defaultKey: 'pixel',
      maxSize: 30,
    });

    this.bossBullets = this.physics.add.group({
      defaultKey: 'pixel',
      maxSize: 50,
    });

    this.enemies = this.physics.add.group();
    this.zigzagEnemies = this.physics.add.group();
    this.fastEnemies = this.physics.add.group();
    this.powerUps = this.physics.add.group();

    this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy as any, undefined, this);
    this.physics.add.overlap(
      this.bullets,
      this.zigzagEnemies,
      this.hitEnemy as any,
      undefined,
      this,
    );
    this.physics.add.overlap(this.bullets, this.fastEnemies, this.hitEnemy as any, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitPlayer as any, undefined, this);
    this.physics.add.overlap(
      this.player,
      this.zigzagEnemies,
      this.hitPlayer as any,
      undefined,
      this,
    );
    this.physics.add.overlap(this.player, this.fastEnemies, this.hitPlayer as any, undefined, this);
    this.physics.add.overlap(
      this.player,
      this.powerUps,
      this.collectPowerUp as any,
      undefined,
      this,
    );
    this.physics.add.overlap(
      this.player,
      this.bossBullets,
      this.hitPlayerByBossBullet as any,
      undefined,
      this,
    );

    this.enemySpawnEvent = this.time.addEvent({
      delay: 1500,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 100,
      callback: this.updateDifficulty,
      callbackScope: this,
      loop: true,
    });

    this.powerUpSpawnEvent = this.time.addEvent({
      delay: 8000,
      callback: this.spawnPowerUp,
      callbackScope: this,
      loop: true,
    });

    // Announce control mode for UI scene (used to hide joystick on mobile)
    this.registry.set(
      'controlMode',
      this.touchEnabled && this.useRelativeTouchControls ? 'relativeTouch' : 'default',
    );

    this.scene.launch('UI');

    if (this.touchEnabled && this.useRelativeTouchControls) {
      // Relative touch: one-finger drag anywhere to move ship horizontally following finger in world space
      this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        this.enableAudio();
        if (!this.isPaused && this.activeTouchId === null) {
          this.activeTouchId = pointer.id;
          this.touchActive = true;
          this.relTouchCurrX = this.relTouchLastX = pointer.worldX;
          this.relTouchCurrY = this.relTouchLastY = pointer.worldY;
        }
      });
      this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
        if (this.activeTouchId === pointer.id && this.touchActive && !this.isPaused) {
          this.relTouchCurrX = pointer.worldX;
          this.relTouchCurrY = pointer.worldY;
        }
      });
      this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
        if (this.activeTouchId === pointer.id) {
          this.activeTouchId = null;
          this.touchActive = false;
        }
      });
    }

    // Drag-to-aim handlers (only when relative touch is disabled)
    if (this.touchEnabled && !this.useRelativeTouchControls) {
      this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        this.enableAudio();
        const screenW = this.scale.gameSize.width;
        if (!this.isPaused && pointer.x > screenW * 0.5 && !this.aimActive) {
          this.aimActive = true;
          this.aimPointerId = pointer.id;
          if (!this.aimLine) {
            this.aimLine = this.add.graphics();
          }
          this.aimLine.clear();
          this.aimLine.lineStyle(2, 0xffffff, 0.3);
          this.updateAim(pointer);
        }
      });

      this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
        if (this.aimActive && this.aimPointerId === pointer.id && !this.isPaused) {
          this.updateAim(pointer);
        }
      });

      this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
        if (this.aimActive && this.aimPointerId === pointer.id) {
          this.endAim(pointer);
        }
      });
    }

    if (!this.touchEnabled) {
      this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        this.enableAudio();
        const screenW = this.scale.gameSize.width;
        const canFireHere = true;
        if (!this.isPaused && canFireHere) {
          this.fireBullet();
        }
      });
    }

    // Wait for UI scene to be ready before emitting events
    this.time.delayedCall(100, () => {
      this.events.emit('powerUpUpdate', { rapidFire: false, shield: false });
      this.events.emit('bankUpdate', [...this.bankedPowerUps]);
    });

    // Listen for joystick updates from UI scene
    this.events.on('joystickMove', (vec: { x: number; y: number }) => {
      this.joystickVector.set(vec.x, vec.y);
    });

    // Handle dynamic resizing
    this.scale.on('resize', this.handleResize, this);

    // Listen for UI activations of banked power-ups (mobile only)
    this.events.on('usePowerUp', (type: string) => {
      if (!this.touchEnabled) return;
      const idx = this.bankedPowerUps.indexOf(type);
      if (idx !== -1) {
        this.bankedPowerUps.splice(idx, 1);
        this.events.emit('bankUpdate', [...this.bankedPowerUps]);
        if (type === 'RAPIDFIRE') {
          this.activateRapidFire();
        } else if (type === 'SHIELD') {
          this.activateShield();
        }
      }
    });
  }

  update(time: number) {
    if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.togglePause();
    }

    if (this.isPaused) return;

    const elapsed = time - this.gameStartTime;
    if (!this.bossActive && shouldSpawnBoss(this.score, elapsed)) {
      this.spawnBoss();
    }

    this.starsBack.tilePositionY -= 0.5;
    this.stars.tilePositionY -= 1.5;

    this.bullets.children.entries.forEach((bullet) => {
      const b = bullet as Phaser.Physics.Arcade.Sprite;
      const wb = this.physics.world.bounds;
      if (
        b.active &&
        (b.y < -20 || b.y > wb.height + 20 || b.x < -20 || b.x > wb.width + 20)
      ) {
        b.setActive(false);
        b.setVisible(false);
      }
    });

    const speed = 300;
    let vx = 0;
    let vy = 0;

    // Keyboard input
    if (this.cursors.left.isDown || this.wasd.A.isDown) vx -= 1;
    if (this.cursors.right.isDown || this.wasd.D.isDown) vx += 1;
    if (this.cursors.up.isDown || this.wasd.W.isDown) vy -= 1;
    if (this.cursors.down.isDown || this.wasd.S.isDown) vy += 1;

    // Joystick input overrides on touch devices
    if (this.touchEnabled && this.joystickVector.lengthSq() > 0.01) {
      vx = this.joystickVector.x;
      vy = this.joystickVector.y;
    }

    const len = Math.hypot(vx, vy) || 1;
    this.player.setVelocity((vx / len) * speed, (vy / len) * speed);

    // Relative touch overrides (mobile-only)
    if (this.touchEnabled && this.useRelativeTouchControls) {
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      if (this.touchActive) {
        const dx = this.relTouchCurrX - this.relTouchLastX;
        const adx = Math.abs(dx) >= this.rtDeadZone ? dx : 0;

        // Directly move the ship by the same horizontal delta as the finger
        if (adx !== 0) {
          const margin = 16;
          const newX = Phaser.Math.Clamp(this.player.x + adx, margin, this.worldWidth - margin);
          this.player.setX(newX);
        }

        // Zero out velocities while using direct positional control
        body.setVelocity(0, 0);

        // Update last pointer position for next frame
        this.relTouchLastX = this.relTouchCurrX;
        this.relTouchLastY = this.relTouchCurrY;
      } else {
        // Ensure no residual velocity when touch ends
        body.setVelocity(0, 0);
      }
    }

    if (this.spaceKey.isDown && time > this.lastFired) {
      this.fireBullet();
      this.lastFired = time + this.fireRate;
    }

    // Mobile auto-fire selection
    if (this.touchEnabled) {
      if (this.useRelativeTouchControls) {
        if (this.mobileAutoFireMode === 'whileTouching') {
          if (this.touchActive && time > this.lastFired) {
            this.fireBullet();
            this.lastFired = time + this.fireRate;
          }
        } else if (this.mobileAutoFireMode === 'always') {
          if (time > this.lastFired) {
            this.fireBullet();
            this.lastFired = time + this.fireRate;
          }
        } else if (this.mobileAutoFireMode === 'enemyAware') {
          this.autoFireMobile(time);
        }
      } else if (!this.aimActive) {
        this.autoFireMobile(time);
      }
    }

    this.updateZigZagEnemies();
    this.updateBoss(time);
    this.updateBossBullets();
  }

  private updateDifficulty() {
    if (this.bossActive) return;
    const elapsed = this.time.now - this.gameStartTime;
    const newDelay = calculateSpawnDelay(1500, elapsed);
    this.enemySpawnEvent.delay = newDelay;
  }

  private spawnBoss() {
    this.bossActive = true;
    this.enemySpawnEvent.paused = true;
    this.powerUpSpawnEvent.paused = true;

    this.boss = this.physics.add.sprite(this.worldWidth / 2, 100, 'pixel');
    this.boss.setTint(BOSS_CONFIG.tint);
    this.boss.setDisplaySize(80, 80);
    this.bossHp = BOSS_CONFIG.hp;
    this.bossDirection = 1;

    this.physics.add.overlap(this.bullets, this.boss, this.hitBoss as any, undefined, this);
    this.physics.add.overlap(this.player, this.boss, this.hitPlayer as any, undefined, this);

    this.events.emit('bossSpawned', { hp: this.bossHp, maxHp: BOSS_CONFIG.hp });
    this.playSound('confirm');
  }

  private updateBoss(time: number) {
    if (!this.boss || !this.boss.active) return;

    const body = this.boss.body as Phaser.Physics.Arcade.Body;
    body.velocity.x = this.bossDirection * BOSS_CONFIG.speed;

    if (this.boss.x <= 100 || this.boss.x >= this.worldWidth - 100) {
      this.bossDirection *= -1;
    }

    if (time > this.bossLastFired + BOSS_CONFIG.fireRate) {
      this.bossFire();
      this.bossLastFired = time;
    }
  }

  private bossFire() {
    if (!this.boss) return;

    this.playSound('shoot');
    const angleStep = 30;
    const startAngle = -60;

    for (let i = 0; i < BOSS_CONFIG.burstCount; i++) {
      const angle = startAngle + i * angleStep;
      const bullet = this.bossBullets.get(
        this.boss.x,
        this.boss.y + 40,
      ) as Phaser.Physics.Arcade.Sprite;
      if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.setTint(0xff0088);
        bullet.setDisplaySize(12, 12);
        const body = bullet.body as Phaser.Physics.Arcade.Body;
        const rad = Phaser.Math.DegToRad(angle);
        body.velocity.x = Math.sin(rad) * 200;
        body.velocity.y = Math.cos(rad) * 200;
      }
    }
  }

  private updateBossBullets() {
    this.bossBullets.children.entries.forEach((bullet) => {
      const b = bullet as Phaser.Physics.Arcade.Sprite;
      const wb = this.physics.world.bounds;
      if (
        b.active &&
        (b.y < -20 || b.y > wb.height + 20 || b.x < -20 || b.x > wb.width + 20)
      ) {
        b.setActive(false);
        b.setVisible(false);
      }
    });
  }

  private hitBoss(bullet: Phaser.Physics.Arcade.Sprite, boss: Phaser.Physics.Arcade.Sprite) {
    bullet.setActive(false);
    bullet.setVisible(false);
    const body = bullet.body as Phaser.Physics.Arcade.Body;
    body.stop();

    const dmg = (bullet.getData('damage') as number) || 1;
    this.bossHp -= dmg;
    this.events.emit('bossHpUpdate', { hp: this.bossHp, maxHp: BOSS_CONFIG.hp });

    if (this.bossHp <= 0) {
      this.defeatBoss();
    } else {
      this.createDamageFeedback(boss);
      this.playSound('explosion');
    }
  }

  private defeatBoss() {
    if (!this.boss) return;

    this.createExplosion(this.boss.x, this.boss.y);
    this.boss.destroy();
    this.boss = null;
    this.bossActive = false;

    this.score += BOSS_CONFIG.score;
    this.enemiesDestroyed += 1;
    this.events.emit('scoreUpdate', this.score);
    this.events.emit('bossDefeated');
    this.playSound('explosion');

    const elapsed = this.time.now - this.gameStartTime;
    const timeSurvived = Math.floor(elapsed / 1000);

    this.scene.stop('UI');
    this.scene.start('GameOver', {
      score: this.score,
      timeSurvived,
      enemiesDestroyed: this.enemiesDestroyed,
      powerUpsCollected: this.powerUpsCollected,
      victory: true,
    });
  }

  private hitPlayerByBossBullet(
    player: Phaser.Physics.Arcade.Sprite,
    bullet: Phaser.Physics.Arcade.Sprite,
  ) {
    bullet.setActive(false);
    bullet.setVisible(false);
    this.hitPlayer();
  }

  private togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.physics.pause();
      this.enemySpawnEvent.paused = true;
      this.powerUpSpawnEvent.paused = true;
      this.sound.pauseAll();
      this.events.emit('gamePaused', true);
      // Clear relative touch state to avoid sticky motion on resume
      if (this.touchEnabled && this.useRelativeTouchControls) {
        this.activeTouchId = null;
        this.touchActive = false;
        this.relTouchLastX = this.player.x;
        this.relTouchCurrX = this.player.x;
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0, 0);
      }
    } else {
      this.physics.resume();
      this.enemySpawnEvent.paused = false;
      this.powerUpSpawnEvent.paused = false;
      this.sound.resumeAll();
      this.events.emit('gamePaused', false);
    }
  }

  private updateZigZagEnemies() {
    this.zigzagEnemies.children.entries.forEach((enemy) => {
      const e = enemy as Phaser.Physics.Arcade.Sprite;
      if (e.active) {
        const body = e.body as Phaser.Physics.Arcade.Body;
        body.velocity.x = Math.sin(e.y * 0.02) * 150;
      }
    });
  }

  private fireBullet() {
    const bullet = this.bullets.get(
      this.player.x,
      this.player.y - 20,
    ) as Phaser.Physics.Arcade.Sprite;
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.setTint(0xffff00);
      bullet.setDisplaySize(8, 16);
      const body = bullet.body as Phaser.Physics.Arcade.Body;
      body.velocity.y = -400;
      bullet.setData('damage', 1);
      this.playSound('shoot');
    }
  }

  private fireAimedBullet(angleRad: number, damage: number = 2) {
    const bullet = this.bullets.get(
      this.player.x,
      this.player.y - 20,
    ) as Phaser.Physics.Arcade.Sprite;
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.setTint(0x00aaff);
      bullet.setDisplaySize(10, 18);
      const body = bullet.body as Phaser.Physics.Arcade.Body;
      const speed = 500;
      body.velocity.x = Math.cos(angleRad) * speed;
      body.velocity.y = Math.sin(angleRad) * speed;
      bullet.setData('damage', damage);
      this.playSound('shoot');
      if (this.touchEnabled) {
        HapticManager.specialFire();
      }
    }
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
        this.sound.play(key, { volume: 0.3 });
      }
    } catch (e) {
      console.warn('Failed to play sound:', key, e);
    }
  }

  private spawnEnemy() {
    const elapsed = this.time.now - this.gameStartTime;
    const worldW = this.physics.world.bounds.width;
    const x = Phaser.Math.Between(50, Math.max(55, worldW - 50));
    const roll = Math.random();
    let enemy: Phaser.Physics.Arcade.Sprite;
    let type: string;

    if (roll < 0.5) {
      enemy = this.enemies.create(x, -50, 'pixel') as Phaser.Physics.Arcade.Sprite;
      type = 'BASIC';
      enemy.setTint(ENEMY_TYPES.BASIC.tint);
      const speed = calculateEnemySpeed(ENEMY_TYPES.BASIC.speed, elapsed);
      (enemy.body as Phaser.Physics.Arcade.Body).velocity.y = speed;
      this.enemyData.set(enemy, { hp: ENEMY_TYPES.BASIC.hp, type });
    } else if (roll < 0.8) {
      enemy = this.zigzagEnemies.create(x, -50, 'pixel') as Phaser.Physics.Arcade.Sprite;
      type = 'ZIGZAG';
      enemy.setTint(ENEMY_TYPES.ZIGZAG.tint);
      const speed = calculateEnemySpeed(ENEMY_TYPES.ZIGZAG.speed, elapsed);
      (enemy.body as Phaser.Physics.Arcade.Body).velocity.y = speed;
      this.enemyData.set(enemy, { hp: ENEMY_TYPES.ZIGZAG.hp, type });
    } else {
      enemy = this.fastEnemies.create(x, -50, 'pixel') as Phaser.Physics.Arcade.Sprite;
      type = 'FASTDIVER';
      enemy.setTint(ENEMY_TYPES.FASTDIVER.tint);
      const speed = calculateEnemySpeed(ENEMY_TYPES.FASTDIVER.speed, elapsed);
      (enemy.body as Phaser.Physics.Arcade.Body).velocity.y = speed;
      this.enemyData.set(enemy, { hp: ENEMY_TYPES.FASTDIVER.hp, type });
    }

    if (enemy) {
      enemy.setDisplaySize(32, 32);
    }
  }

  private spawnPowerUp() {
    const worldW2 = this.physics.world.bounds.width;
    const x = Phaser.Math.Between(100, Math.max(105, worldW2 - 100));
    const powerUp = this.powerUps.create(x, -50, 'pixel') as Phaser.Physics.Arcade.Sprite;
    if (powerUp) {
      const type = Math.random() < 0.5 ? 'RAPIDFIRE' : 'SHIELD';
      powerUp.setData('type', type);
      powerUp.setTint(
        type === 'RAPIDFIRE' ? POWERUP_TYPES.RAPIDFIRE.tint : POWERUP_TYPES.SHIELD.tint,
      );
      powerUp.setDisplaySize(24, 24);
      (powerUp.body as Phaser.Physics.Arcade.Body).velocity.y = 100;
    }
  }

  private collectPowerUp(
    player: Phaser.Physics.Arcade.Sprite,
    powerUp: Phaser.Physics.Arcade.Sprite,
  ) {
    const type = powerUp.getData('type') as string;
    powerUp.destroy();
    this.playSound('pickup');
    this.powerUpsCollected += 1;

    if (this.touchEnabled) {
      this.bankedPowerUps.push(type);
      this.events.emit('bankUpdate', [...this.bankedPowerUps]);
    } else {
      if (type === 'RAPIDFIRE') {
        this.activateRapidFire();
      } else if (type === 'SHIELD') {
        this.activateShield();
      }
    }
  }

  private activateRapidFire() {
    this.rapidFireActive = true;
    this.fireRate = 100;
    this.events.emit('powerUpUpdate', { rapidFire: true, shield: this.shieldActive });

    this.time.delayedCall(POWERUP_TYPES.RAPIDFIRE.duration, () => {
      this.rapidFireActive = false;
      this.fireRate = this.baseFireRate;
      this.events.emit('powerUpUpdate', { rapidFire: false, shield: this.shieldActive });
    });
    if (this.touchEnabled) {
      HapticManager.powerUp();
    }
  }

  private activateShield() {
    this.shieldActive = true;
    this.player.setTint(0xffff00);
    this.events.emit('powerUpUpdate', { rapidFire: this.rapidFireActive, shield: true });

    this.time.delayedCall(POWERUP_TYPES.SHIELD.duration, () => {
      this.shieldActive = false;
      this.player.clearTint();
      this.player.setTint(0x00ff00);
      this.events.emit('powerUpUpdate', { rapidFire: this.rapidFireActive, shield: false });
    });
    HapticManager.powerUp();
  }

  private hitEnemy(bullet: Phaser.Physics.Arcade.Sprite, enemy: Phaser.Physics.Arcade.Sprite) {
    bullet.setActive(false);
    bullet.setVisible(false);
    const body = bullet.body as Phaser.Physics.Arcade.Body;
    body.stop();

    const damage = (bullet.getData('damage') as number) || 1;
    const data = this.enemyData.get(enemy);
    if (data) {
      data.hp -= damage;
      if (data.hp <= 0) {
        this.enemyData.delete(enemy);
        this.createExplosion(enemy.x, enemy.y);
        enemy.destroy();
        const scoreValue = ENEMY_TYPES[data.type as keyof typeof ENEMY_TYPES]?.score || 10;
        this.score += scoreValue;
        this.enemiesDestroyed += 1;
        this.events.emit('scoreUpdate', this.score);
        this.playSound('explosion');
      } else {
        this.createDamageFeedback(enemy);
      }
    } else {
      this.createExplosion(enemy.x, enemy.y);
      enemy.destroy();
      this.score += 10;
      this.enemiesDestroyed += 1;
      this.events.emit('scoreUpdate', this.score);
      this.playSound('explosion');
    }
  }

  private hitPlayer() {
    if (this.shieldActive) {
      this.shieldActive = false;
      this.player.clearTint();
      this.player.setTint(0x00ff00);
      this.events.emit('powerUpUpdate', { rapidFire: this.rapidFireActive, shield: false });
      this.playSound('explosion');
      this.createShieldHitFeedback();
      return;
    }

    this.playSound('explosion');
    this.createExplosion(this.player.x, this.player.y);
    if (this.touchEnabled) {
      HapticManager.damage();
    }

    const elapsed = this.time.now - this.gameStartTime;
    const timeSurvived = Math.floor(elapsed / 1000);

    this.scene.stop('UI');
    this.scene.start('GameOver', {
      score: this.score,
      timeSurvived,
      enemiesDestroyed: this.enemiesDestroyed,
      powerUpsCollected: this.powerUpsCollected,
      victory: false,
    });
  }

  private createExplosion(x: number, y: number) {
    const particles = this.add.particles(x, y, 'pixel', {
      speed: { min: 50, max: 150 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      tint: [0xff0000, 0xff8800, 0xffff00],
      lifespan: 400,
      quantity: 12,
    });
    this.time.delayedCall(500, () => particles.destroy());
  }

  private createDamageFeedback(enemy: Phaser.Physics.Arcade.Sprite) {
    this.tweens.add({
      targets: enemy,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
    });
  }

  private createShieldHitFeedback() {
    this.tweens.add({
      targets: this.player,
      scale: 1.3,
      duration: 150,
      yoyo: true,
    });
  }

  private updateAim(pointer: Phaser.Input.Pointer) {
    if (!this.aimLine) return;
    this.aimLine.clear();
    this.aimLine.lineStyle(2, 0xffffff, 0.3);
    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.x, pointer.y);
    const length = 80;
    const ex = this.player.x + Math.cos(angle) * length;
    const ey = this.player.y + Math.sin(angle) * length;
    this.aimLine.strokeLineShape(new Phaser.Geom.Line(this.player.x, this.player.y, ex, ey));
  }

  private endAim(pointer: Phaser.Input.Pointer) {
    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.x, pointer.y);
    if (this.aimLine) {
      this.aimLine.clear();
    }
    this.aimActive = false;
    this.aimPointerId = null;
    this.fireAimedBullet(angle, 2);
    this.lastFired = this.time.now + this.fireRate; // small cooldown after special shot
  }

  private autoFireMobile(time: number) {
    if (time <= this.lastFired) return;
    const px = this.player.x;
    const py = this.player.y;
    const maxDist = 400;
    const coneDeg = 45;

    const checkGroup = (grp: Phaser.Physics.Arcade.Group) => {
      for (const ch of grp.children.entries) {
        const e = ch as Phaser.Physics.Arcade.Sprite;
        if (!e.active) continue;
        const dx = e.x - px;
        const dy = e.y - py;
        const dist = Math.hypot(dx, dy);
        if (dist > maxDist) continue;
        if (dy >= 0) continue; // only forward (up)
        const dot = Phaser.Math.Clamp(-dy / dist, -1, 1);
        const ang = Phaser.Math.RadToDeg(Math.acos(dot));
        if (ang <= coneDeg) {
          this.fireBullet();
          this.lastFired = time + this.fireRate;
          return true;
        }
      }
      return false;
    };

    if (checkGroup(this.enemies)) return;
    if (checkGroup(this.zigzagEnemies)) return;
    checkGroup(this.fastEnemies);
  }
}
