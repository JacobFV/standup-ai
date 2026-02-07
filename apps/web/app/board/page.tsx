"use client";

import { useState } from "react";

interface Task {
  id: string;
  title: string;
  status: string;
  assignee?: string;
  source: "notion" | "linear";
  identifier?: string;
}

const COLUMNS = ["Not Started", "In Progress", "In Review", "Done"];

const MOCK_TASKS: Task[] = [
  { id: "1", title: "Set up CI/CD pipeline", status: "In Progress", assignee: "You", source: "linear", identifier: "ENG-123" },
  { id: "2", title: "Design standup dashboard", status: "In Review", assignee: "You", source: "notion" },
  { id: "3", title: "Fix auth redirect bug", status: "Not Started", assignee: "You", source: "linear", identifier: "ENG-456" },
  { id: "4", title: "Write API documentation", status: "Done", assignee: "You", source: "notion" },
  { id: "5", title: "Review PR #42", status: "In Progress", assignee: "You", source: "linear", identifier: "ENG-789" },
];

export default function BoardPage() {
  const [tasks] = useState<Task[]>(MOCK_TASKS);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-800 px-6 py-4">
        <h2 className="text-lg font-semibold">Board View</h2>
        <p className="text-sm text-gray-400">Your tasks from Notion and Linear</p>
      </div>

      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 min-w-max">
          {COLUMNS.map((column) => (
            <div key={column} className="w-72 flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-medium text-gray-300">{column}</h3>
                <span className="text-xs bg-gray-800 px-2 py-0.5 rounded-full text-gray-400">
                  {tasks.filter((t) => t.status === column).length}
                </span>
              </div>
              <div className="space-y-2">
                {tasks
                  .filter((t) => t.status === column)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="bg-gray-900 border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-colors cursor-pointer"
                    >
                      <p className="text-sm font-medium">{task.title}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          task.source === "linear"
                            ? "bg-purple-900/30 text-purple-400"
                            : "bg-blue-900/30 text-blue-400"
                        }`}>
                          {task.source === "linear" ? task.identifier : "Notion"}
                        </span>
                        {task.assignee && (
                          <span className="text-xs text-gray-500">{task.assignee}</span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
