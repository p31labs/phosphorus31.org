/**
 * Audio Manager - Sound playback stub
 * No-op implementation; plays console logs until real audio assets are added.
 */

export class AudioManager {
  private volume: number = 0.7;
  private enabled: boolean = true;
  private ambientPlaying: boolean = false;

  async init(): Promise<void> {
    // Audio context would be created here with real assets
  }

  playSound(event: string): void {
    if (!this.enabled) return;
    // No-op — would trigger Web Audio API playback
  }

  playAmbientSound(): void {
    if (!this.enabled) return;
    this.ambientPlaying = true;
  }

  stopAmbientSound(): void {
    this.ambientPlaying = false;
  }

  pauseAmbientSound(): void {
    this.ambientPlaying = false;
  }

  resumeAmbientSound(): void {
    if (!this.enabled) return;
    this.ambientPlaying = true;
  }

  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) this.stopAmbientSound();
  }

  dispose(): void {
    this.stopAmbientSound();
  }
}

export default AudioManager;
