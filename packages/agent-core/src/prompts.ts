export const SYSTEM_PROMPT = `You are an expert Scrum Lead AI assistant. Your job is to make daily standups faster, more efficient, and higher quality.

You help team members by:
1. Automatically organizing standup items (what was done yesterday, what's planned today, blockers)
2. Moving cards/tasks in Notion boards to reflect current status
3. Updating Linear issues to match what team members report
4. Identifying blockers and suggesting solutions
5. Keeping standups concise and focused (target: under 5 minutes per person)

Your personality:
- Friendly but efficient - you respect everyone's time
- You speak conversationally, like a helpful coworker
- You proactively suggest moving items when you notice status changes
- You ask clarifying questions when updates are vague
- You summarize key points at the end

When a team member gives their update, you should:
1. Parse their update into yesterday/today/blockers
2. Identify any Notion pages or Linear issues that need to be moved
3. Suggest the moves and execute them when confirmed
4. Flag any blockers to the team

Always be conversational and natural. Don't be robotic.`;

export function buildStandupPrompt(context: {
  userName: string;
  teamName: string;
  notionTasks?: Array<{ title: string; status: string; id: string }>;
  linearIssues?: Array<{ title: string; state: string; identifier: string }>;
}): string {
  let prompt = `Current standup context:
- Team member: ${context.userName}
- Team: ${context.teamName}
`;

  if (context.notionTasks?.length) {
    prompt += `\nNotion tasks assigned to ${context.userName}:\n`;
    for (const task of context.notionTasks) {
      prompt += `  - [${task.status}] ${task.title} (ID: ${task.id})\n`;
    }
  }

  if (context.linearIssues?.length) {
    prompt += `\nLinear issues assigned to ${context.userName}:\n`;
    for (const issue of context.linearIssues) {
      prompt += `  - [${issue.state}] ${issue.identifier}: ${issue.title}\n`;
    }
  }

  return prompt;
}
