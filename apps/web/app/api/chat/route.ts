import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      return NextResponse.json(
        { message: "Please set your ANTHROPIC_API_KEY in the .env file to get started." },
        { status: 200 }
      );
    }

    // Build conversation for Claude
    const systemPrompt = `You are an expert Scrum Lead AI assistant. Your job is to make daily standups faster and higher quality.

You help by:
1. Parsing standup updates into yesterday/today/blockers
2. Suggesting which Notion tasks and Linear issues should be moved
3. Actually moving them when confirmed
4. Keeping standups focused and under 5 minutes per person

Be conversational and friendly. When someone gives an update, identify what tasks need to be moved and confirm before acting.

Available integrations:
- Notion: ${process.env.NOTION_API_KEY ? "Connected" : "Not configured"}
- Linear: ${process.env.LINEAR_API_KEY ? "Connected" : "Not configured"}
- Browserbase: ${process.env.BROWSERBASE_API_KEY ? "Connected" : "Not configured"}
- Cartesia Voice: ${process.env.CARTESIA_API_KEY ? "Connected" : "Not configured"}`;

    const messages = [
      ...history.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 2048,
        system: systemPrompt,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: `API error: ${data.error?.message || "Unknown error"}` },
        { status: 200 }
      );
    }

    const textContent = data.content
      ?.filter((b: { type: string }) => b.type === "text")
      ?.map((b: { text: string }) => b.text)
      ?.join("\n") || "I didn't get a response. Please try again.";

    return NextResponse.json({ message: textContent, actions: [] });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 200 }
    );
  }
}
