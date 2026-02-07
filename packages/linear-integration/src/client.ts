import { LinearClient as LinearSDK } from "@linear/sdk";
import type { LinearIssue } from "@repo/shared-types";

export class LinearClient {
  private client: LinearSDK;

  constructor(apiKey: string) {
    this.client = new LinearSDK({ apiKey });
  }

  async getMyIssues(): Promise<LinearIssue[]> {
    const me = await this.client.viewer;
    const issues = await me.assignedIssues({
      filter: {
        state: { type: { nin: ["completed", "canceled"] } },
      },
    });

    return issues.nodes.map((issue) => ({
      id: issue.id,
      identifier: issue.identifier,
      title: issue.title,
      description: issue.description,
      state: "",
      priority: issue.priority,
      url: issue.url,
      teamId: "",
    }));
  }

  async getTeamIssues(teamId: string): Promise<LinearIssue[]> {
    const team = await this.client.team(teamId);
    const issues = await team.issues({
      filter: {
        state: { type: { nin: ["completed", "canceled"] } },
      },
    });

    return issues.nodes.map((issue) => ({
      id: issue.id,
      identifier: issue.identifier,
      title: issue.title,
      description: issue.description,
      state: "",
      priority: issue.priority,
      url: issue.url,
      teamId,
    }));
  }

  async updateIssueState(issueId: string, stateId: string): Promise<void> {
    await this.client.updateIssue(issueId, { stateId });
  }

  async addComment(issueId: string, body: string): Promise<void> {
    await this.client.createComment({ issueId, body });
  }

  async getTeams(): Promise<Array<{ id: string; name: string; key: string }>> {
    const teams = await this.client.teams();
    return teams.nodes.map((team) => ({
      id: team.id,
      name: team.name,
      key: team.key,
    }));
  }

  async getWorkflowStates(
    teamId: string
  ): Promise<Array<{ id: string; name: string; type: string }>> {
    const team = await this.client.team(teamId);
    const states = await team.states();
    return states.nodes.map((state) => ({
      id: state.id,
      name: state.name,
      type: state.type,
    }));
  }
}
