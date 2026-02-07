import { Client } from "@notionhq/client";
import type { NotionTask } from "@repo/shared-types";

export class NotionClient {
  private client: Client;
  private standupDatabaseId: string;

  constructor(apiKey: string, standupDatabaseId: string) {
    this.client = new Client({ auth: apiKey });
    this.standupDatabaseId = standupDatabaseId;
  }

  async getTasks(assigneeFilter?: string): Promise<NotionTask[]> {
    const response = await this.client.databases.query({
      database_id: this.standupDatabaseId,
      filter: assigneeFilter
        ? {
            property: "Assignee",
            people: { contains: assigneeFilter },
          }
        : undefined,
    });

    return response.results.map((page: any) => ({
      id: page.id,
      title: page.properties?.Name?.title?.[0]?.plain_text || "Untitled",
      status: page.properties?.Status?.status?.name || "No Status",
      assignee: page.properties?.Assignee?.people?.[0]?.name,
      dueDate: page.properties?.["Due Date"]?.date?.start,
      url: page.url,
      properties: page.properties,
    }));
  }

  async moveTask(pageId: string, newStatus: string): Promise<void> {
    await this.client.pages.update({
      page_id: pageId,
      properties: {
        Status: {
          status: { name: newStatus },
        },
      },
    });
  }

  async addComment(pageId: string, comment: string): Promise<void> {
    await this.client.comments.create({
      parent: { page_id: pageId },
      rich_text: [
        {
          type: "text",
          text: { content: comment },
        },
      ],
    });
  }

  async createStandupEntry(data: {
    title: string;
    type: "yesterday" | "today" | "blocker";
    assignee?: string;
    content: string;
  }): Promise<string> {
    const response = await this.client.pages.create({
      parent: { database_id: this.standupDatabaseId },
      properties: {
        Name: {
          title: [{ text: { content: data.title } }],
        },
        Type: {
          select: { name: data.type },
        },
        Status: {
          status: { name: "Not Started" },
        },
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [{ type: "text", text: { content: data.content } }],
          },
        },
      ],
    });

    return response.id;
  }

  async getDatabase(): Promise<any> {
    return this.client.databases.retrieve({
      database_id: this.standupDatabaseId,
    });
  }
}
