export interface StandupItem {
  id: string;
  userId: string;
  type: "yesterday" | "today" | "blocker";
  content: string;
  status: "pending" | "in_progress" | "done";
  notionPageId?: string;
  linearIssueId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StandupSession {
  id: string;
  teamId: string;
  date: Date;
  status: "scheduled" | "in_progress" | "completed";
  items: StandupItem[];
  summary?: string;
  createdAt: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  notionUserId?: string;
  linearUserId?: string;
  avatarUrl?: string;
}
