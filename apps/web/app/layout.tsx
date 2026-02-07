import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Standup AI - Scrum Lead Assistant",
  description: "AI-powered standup assistant that automates task management across Notion and Linear",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen">
        <div className="flex h-screen">
          <nav className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
            <div className="mb-8">
              <h1 className="text-xl font-bold text-white">Standup AI</h1>
              <p className="text-sm text-gray-400">Scrum Lead Assistant</p>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <a href="/" className="px-3 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium">
                Chat
              </a>
              <a href="/board" className="px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 text-sm">
                Board View
              </a>
              <a href="/standups" className="px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 text-sm">
                Standup History
              </a>
              <a href="/settings" className="px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 text-sm">
                Settings
              </a>
            </div>
            <div className="border-t border-gray-800 pt-4 mt-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Connected
              </div>
            </div>
          </nav>
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
