import { ReactNode } from "react";

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono text-gray-300">
      {children}
    </code>
  );
}
