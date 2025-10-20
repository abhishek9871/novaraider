export class HapticManager {
  static vibrate(pattern: number | number[]) {
    try {
      if (typeof navigator !== 'undefined' && (navigator as any).vibrate) {
        (navigator as any).vibrate(pattern);
      }
    } catch (_e) {}
  }

  static damage() {
    this.vibrate(150);
  }

  static specialFire() {
    this.vibrate(50);
  }

  static powerUp() {
    this.vibrate([57, 57, 57]);
  }
}
