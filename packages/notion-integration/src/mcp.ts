// MCP tool definitions for Notion integration
// These can be used with Claude's tool_use to interact with Notion

export const notionMcpTools = [
  {
    name: "notion_query_database",
    description: "Query a Notion database to get tasks/pages",
    input_schema: {
      type: "object",
      properties: {
        database_id: { type: "string", description: "Notion database ID" },
        filter: {
          type: "object",
          description: "Optional Notion filter object",
        },
      },
      required: ["database_id"],
    },
  },
  {
    name: "notion_update_page",
    description: "Update a Notion page's properties (e.g., move task status)",
    input_schema: {
      type: "object",
      properties: {
        page_id: { type: "string", description: "Notion page ID" },
        properties: {
          type: "object",
          description: "Properties to update",
        },
      },
      required: ["page_id", "properties"],
    },
  },
  {
    name: "notion_create_page",
    description: "Create a new page in a Notion database",
    input_schema: {
      type: "object",
      properties: {
        database_id: { type: "string", description: "Parent database ID" },
        properties: { type: "object", description: "Page properties" },
        content: { type: "string", description: "Page content as markdown" },
      },
      required: ["database_id", "properties"],
    },
  },
  {
    name: "notion_add_comment",
    description: "Add a comment to a Notion page",
    input_schema: {
      type: "object",
      properties: {
        page_id: { type: "string", description: "Notion page ID" },
        comment: { type: "string", description: "Comment text" },
      },
      required: ["page_id", "comment"],
    },
  },
];

export async function handleNotionMcpTool(
  client: any,
  toolName: string,
  input: Record<string, unknown>
): Promise<string> {
  switch (toolName) {
    case "notion_query_database": {
      const response = await client.databases.query({
        database_id: input.database_id as string,
        filter: input.filter as any,
      });
      return JSON.stringify(
        response.results.map((page: any) => ({
          id: page.id,
          properties: page.properties,
          url: page.url,
        }))
      );
    }
    case "notion_update_page": {
      await client.pages.update({
        page_id: input.page_id as string,
        properties: input.properties as any,
      });
      return JSON.stringify({ success: true });
    }
    case "notion_create_page": {
      const page = await client.pages.create({
        parent: { database_id: input.database_id as string },
        properties: input.properties as any,
      });
      return JSON.stringify({ id: page.id, url: page.url });
    }
    case "notion_add_comment": {
      await client.comments.create({
        parent: { page_id: input.page_id as string },
        rich_text: [
          { type: "text", text: { content: input.comment as string } },
        ],
      });
      return JSON.stringify({ success: true });
    }
    default:
      return JSON.stringify({ error: `Unknown tool: ${toolName}` });
  }
}
