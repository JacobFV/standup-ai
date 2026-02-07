"use client";

interface TaskCardProps {
  title: string;
  status: string;
  source: "notion" | "linear";
  identifier?: string;
  assignee?: string;
  onClick?: () => void;
  className?: string;
}

export const TaskCard = ({
  title,
  source,
  identifier,
  assignee,
  onClick,
  className = "",
}: TaskCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`bg-gray-900 border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-colors cursor-pointer ${className}`}
    >
      <p className="text-sm font-medium text-white">{title}</p>
      <div className="flex items-center justify-between mt-2">
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            source === "linear"
              ? "bg-purple-900/30 text-purple-400"
              : "bg-blue-900/30 text-blue-400"
          }`}
        >
          {source === "linear" ? identifier || "Linear" : "Notion"}
        </span>
        {assignee && (
          <span className="text-xs text-gray-500">{assignee}</span>
        )}
      </div>
    </div>
  );
};
