/**
 * Audio Bridge
 * Record/playback via device API
 */

export interface AudioConfig {
  sampleRate?: number;
  channels?: number;
}

export class AudioBridge {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private _config: AudioConfig;

  constructor(config: AudioConfig = {}) {
    this._config = {
      sampleRate: 44100,
      channels: 1,
      ...config,
    };
  }

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('Not recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      this.mediaRecorder = null;
    });
  }

  async playAudio(blob: Blob): Promise<void> {
    const audio = new Audio(URL.createObjectURL(blob));
    return new Promise((resolve, reject) => {
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error('Playback failed'));
      audio.play();
    });
  }
}
