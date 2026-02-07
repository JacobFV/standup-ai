import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "./prompts.js";
import type { AgentConfig, ToolHandler } from "./tools.js";
import { AGENT_TOOLS } from "./tools.js";

interface Message {
  role: "user" | "assistant";
  content: string | Anthropic.ContentBlock[];
}

export class ScrumAgent {
  private client: Anthropic;
  private model: string;
  private tools: Anthropic.Tool[];
  private toolHandlers: Record<string, ToolHandler>;
  private conversationHistory: Message[] = [];
  private systemPrompt: string;

  constructor(config: AgentConfig) {
    this.client = new Anthropic({ apiKey: config.anthropicApiKey });
    this.model = config.model || "claude-sonnet-4-5-20250929";
    this.tools = (config.tools || AGENT_TOOLS) as Anthropic.Tool[];
    this.toolHandlers = config.toolHandlers || {};
    this.systemPrompt = SYSTEM_PROMPT;
  }

  setSystemPrompt(prompt: string) {
    this.systemPrompt = prompt;
  }

  appendSystemContext(context: string) {
    this.systemPrompt = `${SYSTEM_PROMPT}\n\n${context}`;
  }

  async chat(userMessage: string): Promise<string> {
    this.conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    let response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: this.systemPrompt,
      tools: this.tools,
      messages: this.conversationHistory as Anthropic.MessageParam[],
    });

    while (response.stop_reason === "tool_use") {
      const assistantContent = response.content;
      this.conversationHistory.push({
        role: "assistant",
        content: assistantContent,
      });

      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of assistantContent) {
        if (block.type === "tool_use") {
          const handler = this.toolHandlers[block.name];
          let result: string;
          if (handler) {
            try {
              result = await handler(block.input as Record<string, unknown>);
            } catch (error) {
              result = JSON.stringify({
                error: `Tool execution failed: ${error}`,
              });
            }
          } else {
            result = JSON.stringify({
              error: `No handler registered for tool: ${block.name}`,
            });
          }

          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: result,
          });
        }
      }

      this.conversationHistory.push({
        role: "user",
        content: toolResults,
      });

      response = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        system: this.systemPrompt,
        tools: this.tools,
        messages: this.conversationHistory as Anthropic.MessageParam[],
      });
    }

    const textContent = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    this.conversationHistory.push({
      role: "assistant",
      content: response.content,
    });

    return textContent;
  }

  async *chatStream(
    userMessage: string
  ): AsyncGenerator<{ type: "text" | "tool_use" | "tool_result"; content: string }> {
    this.conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    const stream = this.client.messages.stream({
      model: this.model,
      max_tokens: 4096,
      system: this.systemPrompt,
      tools: this.tools,
      messages: this.conversationHistory as Anthropic.MessageParam[],
    });

    let fullResponse = "";

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        fullResponse += event.delta.text;
        yield { type: "text", content: event.delta.text };
      }
    }

    const finalMessage = await stream.finalMessage();
    this.conversationHistory.push({
      role: "assistant",
      content: finalMessage.content,
    });

    if (finalMessage.stop_reason === "tool_use") {
      for (const block of finalMessage.content) {
        if (block.type === "tool_use") {
          yield {
            type: "tool_use",
            content: JSON.stringify({
              name: block.name,
              input: block.input,
            }),
          };

          const handler = this.toolHandlers[block.name];
          let result: string;
          if (handler) {
            try {
              result = await handler(block.input as Record<string, unknown>);
            } catch (error) {
              result = JSON.stringify({ error: String(error) });
            }
          } else {
            result = JSON.stringify({ error: `No handler for ${block.name}` });
          }

          yield { type: "tool_result", content: result };
        }
      }
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  getHistory(): Message[] {
    return [...this.conversationHistory];
  }
}
