import type { VoiceConfig, VoiceEventHandler } from "./types.js";
import { CartesiaVoice } from "./cartesia.js";
import type { VoiceState } from "@repo/shared-types";

export class VoiceManager {
  private voice: CartesiaVoice;
  private handlers: VoiceEventHandler;
  private _state: VoiceState = "idle";
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;

  constructor(config: VoiceConfig, handlers: VoiceEventHandler = {}) {
    this.voice = new CartesiaVoice(config);
    this.handlers = handlers;
  }

  get state(): VoiceState {
    return this._state;
  }

  private setState(state: VoiceState) {
    this._state = state;
  }

  async speak(text: string): Promise<void> {
    this.setState("speaking");
    this.handlers.onAudioStart?.();

    try {
      const audioBuffer = await this.voice.speak(text);
      await this.playAudio(audioBuffer.buffer.slice(audioBuffer.byteOffset, audioBuffer.byteOffset + audioBuffer.byteLength));
    } catch (error) {
      this.handlers.onError?.(error as Error);
    } finally {
      this.setState("idle");
      this.handlers.onAudioEnd?.();
    }
  }

  private async playAudio(buffer: ArrayBuffer): Promise<void> {
    if (typeof window === "undefined") return;

    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    const audioBuffer = await this.audioContext.decodeAudioData(buffer.slice(0));
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);

    return new Promise((resolve) => {
      source.onended = () => resolve();
      source.start();
    });
  }

  async startListening(): Promise<void> {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) {
      throw new Error("Media devices not available");
    }

    this.setState("listening");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    this.mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    this.mediaRecorder.onstop = async () => {
      this.setState("processing");
      const audioBlob = new Blob(chunks, { type: "audio/webm" });
      // Send to transcription service
      await this.transcribeAudio(audioBlob);
    };

    this.mediaRecorder.start();
  }

  stopListening(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach((t) => t.stop());
    }
  }

  private async transcribeAudio(blob: Blob): Promise<void> {
    // Convert blob to base64 and send to API for transcription
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    // This will be handled by the API route
    this.handlers.onTranscript?.(base64, true);
    this.setState("idle");
  }

  destroy(): void {
    this.stopListening();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
