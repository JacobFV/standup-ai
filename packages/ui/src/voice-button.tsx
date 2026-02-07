"use client";

interface VoiceButtonProps {
  state: "idle" | "listening" | "processing" | "speaking";
  onClick: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const stateStyles: Record<string, string> = {
  idle: "bg-gray-800 hover:bg-gray-700 border-gray-700",
  listening: "bg-red-900/50 hover:bg-red-900/70 border-red-600 animate-pulse",
  processing: "bg-yellow-900/50 border-yellow-600",
  speaking: "bg-blue-900/50 border-blue-600",
};

const sizeStyles: Record<string, string> = {
  sm: "w-10 h-10",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

export const VoiceButton = ({
  state,
  onClick,
  size = "md",
  className = "",
}: VoiceButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={state === "processing"}
      className={`rounded-full border-2 flex items-center justify-center transition-all ${stateStyles[state]} ${sizeStyles[size]} ${className}`}
      title={
        state === "idle"
          ? "Start voice input"
          : state === "listening"
            ? "Stop listening"
            : state === "processing"
              ? "Processing..."
              : "Speaking..."
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${size === "lg" ? "h-7 w-7" : size === "sm" ? "h-4 w-4" : "h-5 w-5"} text-white`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {state === "listening" ? (
          <rect x="6" y="6" width="12" height="12" rx="2" strokeWidth={2} />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        )}
      </svg>
    </button>
  );
};
