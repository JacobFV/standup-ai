import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text, action } = await request.json();
    const cartesiaKey = process.env.CARTESIA_API_KEY;

    if (!cartesiaKey) {
      return NextResponse.json(
        { error: "Cartesia API key not configured" },
        { status: 400 }
      );
    }

    if (action === "tts") {
      // Text-to-Speech via Cartesia Sonic
      const response = await fetch("https://api.cartesia.ai/tts/bytes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": cartesiaKey,
          "Cartesia-Version": "2024-06-10",
        },
        body: JSON.stringify({
          model_id: "sonic-2",
          transcript: text,
          voice: {
            mode: "id",
            id: "a0e99841-438c-4a64-b679-ae501e7d6091",
          },
          output_format: {
            container: "wav",
            sample_rate: 44100,
            encoding: "pcm_f32le",
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return NextResponse.json({ error }, { status: response.status });
      }

      const audioBuffer = await response.arrayBuffer();
      return new NextResponse(audioBuffer, {
        headers: {
          "Content-Type": "audio/wav",
        },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Voice API error:", error);
    return NextResponse.json(
      { error: "Voice processing failed" },
      { status: 500 }
    );
  }
}
