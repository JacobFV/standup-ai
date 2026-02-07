import { CartesiaClient } from "@cartesia/cartesia-js";
import type { VoiceConfig } from "./types";
import { DEFAULT_VOICE_ID, DEFAULT_MODEL_ID } from "./types";

export class CartesiaVoice {
  private client: CartesiaClient;
  private voiceId: string;
  private modelId: string;

  constructor(config: VoiceConfig) {
    this.client = new CartesiaClient({ apiKey: config.apiKey });
    this.voiceId = config.voiceId || DEFAULT_VOICE_ID;
    this.modelId = config.modelId || DEFAULT_MODEL_ID;
  }

  async speak(text: string): Promise<Buffer> {
    const readable = await this.client.tts.bytes({
      modelId: this.modelId,
      transcript: text,
      voice: {
        mode: "id",
        id: this.voiceId,
      },
      outputFormat: {
        container: "wav",
        sampleRate: 44100,
        encoding: "pcm_f32le",
      },
    });

    const chunks: Buffer[] = [];
    for await (const chunk of readable) {
      chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  async *speakStream(
    text: string
  ): AsyncGenerator<Uint8Array> {
    const readable = await this.client.tts.bytes({
      modelId: this.modelId,
      transcript: text,
      voice: {
        mode: "id",
        id: this.voiceId,
      },
      outputFormat: {
        container: "raw",
        sampleRate: 24000,
        encoding: "pcm_f32le",
      },
    });

    for await (const chunk of readable) {
      yield new Uint8Array(chunk);
    }
  }

  async getVoices(): Promise<Array<{ id: string; name: string; description: string }>> {
    const voices = await this.client.voices.list();
    return voices.map((v: any) => ({
      id: v.id,
      name: v.name,
      description: v.description || "",
    }));
  }

  setVoice(voiceId: string) {
    this.voiceId = voiceId;
  }

  getClient(): CartesiaClient {
    return this.client;
  }
}
