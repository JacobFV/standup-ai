export interface NotionTask {
  id: string;
  title: string;
  status: string;
  assignee?: string;
  dueDate?: string;
  url: string;
  properties: Record<string, unknown>;
}

export interface LinearIssue {
  id: string;
  identifier: string;
  title: string;
  description?: string;
  state: string;
  assignee?: string;
  priority: number;
  url: string;
  teamId: string;
}

export interface BrowserbaseSession {
  id: string;
  status: "active" | "completed" | "failed";
  connectUrl?: string;
  debugUrl?: string;
}

export interface CartesiaVoiceConfig {
  voiceId: string;
  modelId: string;
  language: string;
  speed?: number;
  emotion?: string[];
}
