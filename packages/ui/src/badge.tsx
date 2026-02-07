"use client";

import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "notion" | "linear" | "success" | "warning" | "error";
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: "bg-gray-800 text-gray-300",
  notion: "bg-blue-900/30 text-blue-400",
  linear: "bg-purple-900/30 text-purple-400",
  success: "bg-green-900/30 text-green-400",
  warning: "bg-yellow-900/30 text-yellow-400",
  error: "bg-red-900/30 text-red-400",
};

export const Badge = ({
  children,
  variant = "default",
  className = "",
}: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
