import Anthropic from "@anthropic-ai/sdk";
import type { ComputerController } from "./computer-control";

const DESKTOP_SYSTEM_PROMPT = `You are a Scrum Lead AI assistant running in a desktop app with FULL COMPUTER CONTROL.

You can:
1. Click anywhere on screen, type text, press keyboard shortcuts
2. Take screenshots to see what's on screen
3. Navigate Notion and Linear directly by controlling the browser
4. Move tasks, update statuses, and manage standup items

When a user gives their standup update:
1. Parse it into yesterday/today/blockers
2. Open the relevant apps (Notion, Linear) using computer control
3. Move the tasks to the correct columns
4. Report back what you did

Be conversational and confirm before taking actions that modify data.

IMPORTANT: When using computer control, take screenshots frequently to verify what you see.`;

export class AgentHandler {
  private client: Anthropic;
  private controller: ComputerController;
  private history: Array<{ role: "user" | "assistant"; content: string | any[] }> = [];

  constructor(apiKey: string, controller: ComputerController) {
    this.client = new Anthropic({ apiKey });
    this.controller = controller;
  }

  async chat(message: string): Promise<string> {
    this.history.push({ role: "user", content: message });

    const tools: Anthropic.Tool[] = [
      {
        name: "computer_click",
        description: "Click at specific screen coordinates",
        input_schema: {
          type: "object" as const,
          properties: {
            x: { type: "number", description: "X coordinate" },
            y: { type: "number", description: "Y coordinate" },
          },
          required: ["x", "y"],
        },
      },
      {
        name: "computer_type",
        description: "Type text using the keyboard",
        input_schema: {
          type: "object" as const,
          properties: {
            text: { type: "string", description: "Text to type" },
          },
          required: ["text"],
        },
      },
      {
        name: "computer_key_press",
        description: "Press keyboard keys or shortcuts (e.g., ['cmd', 'c'] for copy)",
        input_schema: {
          type: "object" as const,
          properties: {
            keys: {
              type: "array",
              items: { type: "string" },
              description: "Keys to press simultaneously",
            },
          },
          required: ["keys"],
        },
      },
      {
        name: "computer_screenshot",
        description: "Take a screenshot to see what's currently on screen",
        input_schema: {
          type: "object" as const,
          properties: {},
        },
      },
      {
        name: "computer_move_mouse",
        description: "Move mouse to specific coordinates without clicking",
        input_schema: {
          type: "object" as const,
          properties: {
            x: { type: "number", description: "X coordinate" },
            y: { type: "number", description: "Y coordinate" },
          },
          required: ["x", "y"],
        },
      },
      {
        name: "computer_scroll",
        description: "Scroll at a specific position",
        input_schema: {
          type: "object" as const,
          properties: {
            x: { type: "number", description: "X coordinate" },
            y: { type: "number", description: "Y coordinate" },
            amount: { type: "number", description: "Scroll amount (positive = down)" },
          },
          required: ["x", "y", "amount"],
        },
      },
    ];

    let response = await this.client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4096,
      system: DESKTOP_SYSTEM_PROMPT,
      tools,
      messages: this.history as Anthropic.MessageParam[],
    });

    // Tool use loop
    while (response.stop_reason === "tool_use") {
      this.history.push({ role: "assistant", content: response.content });

      const toolResults: any[] = [];

      for (const block of response.content) {
        if (block.type === "tool_use") {
          const input = block.input as Record<string, any>;
          let result: string;

          switch (block.name) {
            case "computer_click":
              result = JSON.stringify(await this.controller.click(input.x, input.y));
              break;
            case "computer_type":
              result = JSON.stringify(await this.controller.type(input.text));
              break;
            case "computer_key_press":
              result = JSON.stringify(await this.controller.keyPress(input.keys));
              break;
            case "computer_screenshot":
              result = JSON.stringify(await this.controller.takeScreenshot());
              break;
            case "computer_move_mouse":
              result = JSON.stringify(await this.controller.moveMouse(input.x, input.y));
              break;
            case "computer_scroll":
              result = JSON.stringify(await this.controller.scroll(input.x, input.y, input.amount));
              break;
            default:
              result = JSON.stringify({ error: `Unknown tool: ${block.name}` });
          }

          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: result,
          });
        }
      }

      this.history.push({ role: "user", content: toolResults });

      response = await this.client.messages.create({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 4096,
        system: DESKTOP_SYSTEM_PROMPT,
        tools,
        messages: this.history as Anthropic.MessageParam[],
      });
    }

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    this.history.push({ role: "assistant", content: response.content });
    return text;
  }

  clearHistory() {
    this.history = [];
  }
}
