import Phaser from 'phaser';

export class Preload extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: { font: '20px Arial', color: '#ffffff' },
    });
    loadingText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });
  }

  create() {
    // Create a simple texture for sprites since we're using empty keys
    this.add.graphics()
      .fillStyle(0xffffff)
      .fillRect(0, 0, 1, 1)
      .generateTexture('pixel', 1, 1);
    
    this.createProgrammaticSounds();
    this.scene.start('Menu');
  }

  private createProgrammaticSounds() {
    try {
      const audioContext = (this.sound as any).context;
      if (!audioContext) {
        console.warn('Audio context not available');
        return;
      }

      const createBeep = (freq: number, duration: number) => {
        try {
          const sampleRate = audioContext.sampleRate;
          const numSamples = Math.floor(sampleRate * duration);
          const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < numSamples; i++) {
            data[i] = Math.sin((2 * Math.PI * freq * i) / sampleRate) * Math.exp((-3 * i) / numSamples);
          }
          return buffer;
        } catch (e) {
          console.warn('Failed to create beep:', e);
          return null;
        }
      };

      const createNoise = (duration: number) => {
        try {
          const sampleRate = audioContext.sampleRate;
          const numSamples = Math.floor(sampleRate * duration);
          const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < numSamples; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp((-5 * i) / numSamples);
          }
          return buffer;
        } catch (e) {
          console.warn('Failed to create noise:', e);
          return null;
        }
      };

      const addSound = (key: string, buffer: AudioBuffer | null) => {
        if (buffer) {
          try {
            this.cache.audio.add(key, buffer);
          } catch (e) {
            console.warn(`Failed to add sound ${key}:`, e);
          }
        }
      };

      addSound('shoot', createBeep(800, 0.1));
      addSound('explosion', createNoise(0.3));
      addSound('pickup', createBeep(1200, 0.15));
      addSound('confirm', createBeep(600, 0.2));
      
    } catch (e) {
      console.warn('Audio generation failed:', e);
    }
  }
}
