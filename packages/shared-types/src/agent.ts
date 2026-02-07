export interface AgentMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface AgentAction {
  type: "notion_move" | "linear_update" | "browser_action" | "voice_response";
  description: string;
  payload: Record<string, unknown>;
  status: "pending" | "executing" | "completed" | "failed";
  result?: unknown;
}

export interface AgentContext {
  sessionId: string;
  userId: string;
  standupSession?: string;
  messages: AgentMessage[];
  pendingActions: AgentAction[];
}

export type VoiceState = "idle" | "listening" | "processing" | "speaking";
