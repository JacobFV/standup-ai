export interface VoiceConfig {
  apiKey: string;
  voiceId?: string;
  modelId?: string;
  language?: string;
  sampleRate?: number;
}

export type VoiceEventHandler = {
  onTranscript?: (text: string, isFinal: boolean) => void;
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
  onError?: (error: Error) => void;
};

export const DEFAULT_VOICE_ID = "a0e99841-438c-4a64-b679-ae501e7d6091"; // Cartesia "Barbershop Man"
export const DEFAULT_MODEL_ID = "sonic-2";
