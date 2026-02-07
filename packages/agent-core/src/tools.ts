export interface AgentTool {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

export type ToolHandler = (input: Record<string, unknown>) => Promise<string>;

export interface AgentConfig {
  anthropicApiKey: string;
  model?: string;
  tools?: AgentTool[];
  toolHandlers?: Record<string, ToolHandler>;
}

export const AGENT_TOOLS: AgentTool[] = [
  {
    name: "move_notion_task",
    description:
      "Move a Notion task/page to a different status column. Use this when a team member reports progress on a task.",
    input_schema: {
      type: "object",
      properties: {
        pageId: {
          type: "string",
          description: "The Notion page ID to update",
        },
        newStatus: {
          type: "string",
          description:
            'The new status to set (e.g., "In Progress", "Done", "Blocked")',
        },
      },
      required: ["pageId", "newStatus"],
    },
  },
  {
    name: "update_linear_issue",
    description:
      "Update a Linear issue's state. Use this when a team member reports progress on a Linear issue.",
    input_schema: {
      type: "object",
      properties: {
        issueId: {
          type: "string",
          description: "The Linear issue ID to update",
        },
        stateId: {
          type: "string",
          description: "The new state ID to transition to",
        },
        comment: {
          type: "string",
          description: "Optional comment to add to the issue",
        },
      },
      required: ["issueId", "stateId"],
    },
  },
  {
    name: "get_notion_tasks",
    description:
      "Get all tasks from the Notion standup board for a specific user or the whole team.",
    input_schema: {
      type: "object",
      properties: {
        userId: {
          type: "string",
          description:
            "Optional user ID to filter tasks. Omit to get all tasks.",
        },
      },
    },
  },
  {
    name: "get_linear_issues",
    description:
      "Get active Linear issues for a specific user or the whole team.",
    input_schema: {
      type: "object",
      properties: {
        userId: {
          type: "string",
          description:
            "Optional user ID to filter issues. Omit to get all issues.",
        },
        teamId: {
          type: "string",
          description: "The Linear team ID",
        },
      },
    },
  },
  {
    name: "browse_with_browserbase",
    description:
      "Open a browser session via Browserbase to interact with a web application (Notion, Linear, etc). Use for login flows or complex interactions.",
    input_schema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL to navigate to",
        },
        action: {
          type: "string",
          description:
            'What action to perform (e.g., "login", "navigate", "click", "extract")',
        },
        selector: {
          type: "string",
          description: "CSS selector for the target element (if applicable)",
        },
      },
      required: ["url", "action"],
    },
  },
  {
    name: "summarize_standup",
    description:
      "Generate a summary of the current standup session with key takeaways, blockers, and action items.",
    input_schema: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
          description: "The standup session ID to summarize",
        },
      },
      required: ["sessionId"],
    },
  },
];

export function createToolHandlers(
  handlers: Partial<Record<string, ToolHandler>>
): Record<string, ToolHandler> {
  const defaultHandler: ToolHandler = async (input) => {
    return JSON.stringify({
      error: "Tool handler not implemented",
      input,
    });
  };

  const result: Record<string, ToolHandler> = {};
  for (const tool of AGENT_TOOLS) {
    result[tool.name] = handlers[tool.name] || defaultHandler;
  }
  return result;
}
