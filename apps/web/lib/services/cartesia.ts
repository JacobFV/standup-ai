import { Cartesia } from '@cartesia-ai/line';

// Initialize Cartesia client
const apiKey = process.env.NEXT_PUBLIC_CARTESIA_API_KEY;
if (!apiKey) {
  console.warn('Cartesia API key not found. Voice features will be disabled.');
}

const cartesia = apiKey ? new Cartesia({
  apiKey,
  baseUrl: 'https://api.cartesia.ai/v1',
}) : null;

export class CartesiaService {
  private static instance: CartesiaService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): CartesiaService {
    if (!CartesiaService.instance) {
      CartesiaService.instance = new CartesiaService();
    }
    return CartesiaService.instance;
  }

  public async initialize() {
    if (this.isInitialized || !cartesia) return;
    
    try {
      // Initialize any required resources
      this.isInitialized = true;
      console.log('Cartesia service initialized');
    } catch (error) {
      console.error('Failed to initialize Cartesia:', error);
      throw error;
    }
  }

  public async textToSpeech(text: string, voiceId: string = 'default') {
    if (!cartesia) throw new Error('Cartesia not initialized');
    
    try {
      const response = await cartesia.tts.synthesize({
        text,
        voice: {
          id: voiceId,
          // You can customize voice parameters here
          // pitch: 1.0,
          // speed: 1.0,
          // style: 'neutral'
        }
      });

      return response.audio;
    } catch (error) {
      console.error('Text-to-speech error:', error);
      throw error;
    }
  }

  public async speechToText(audioBlob: Blob): Promise<string> {
    if (!cartesia) throw new Error('Cartesia not initialized');
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('model', 'sonic-2'); // Use the appropriate model

      const response = await fetch('https://api.cartesia.ai/v1/transcribe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CARTESIA_API_KEY}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Transcription failed: ${error}`);
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Speech-to-text error:', error);
      throw error;
    }
  }

  // Add more methods as needed for your application
}

export const cartesiaService = CartesiaService.getInstance();
