import Browserbase from "browserbase";
import type { BrowserbaseSession } from "@repo/shared-types";

export class BrowserbaseClient {
  private client: Browserbase;
  private projectId: string;

  constructor(apiKey: string, projectId: string) {
    this.client = new Browserbase({ apiKey });
    this.projectId = projectId;
  }

  async createSession(): Promise<BrowserbaseSession> {
    const session = await this.client.sessions.create({
      projectId: this.projectId,
    });

    return {
      id: session.id,
      status: "active",
      connectUrl: session.connectUrl,
    };
  }

  async getSession(sessionId: string): Promise<BrowserbaseSession> {
    const session = await this.client.sessions.retrieve(sessionId);
    return {
      id: session.id,
      status: session.status === "RUNNING" ? "active" : "completed",
    };
  }

  async getSessionDebugUrl(sessionId: string): Promise<string> {
    const debug = await this.client.sessions.debug(sessionId);
    return debug.debuggerFullscreenUrl;
  }

  getClient(): Browserbase {
    return this.client;
  }

  getProjectId(): string {
    return this.projectId;
  }
}
