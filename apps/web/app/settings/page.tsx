"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="border-b border-gray-800 px-6 py-4">
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-sm text-gray-400">Configure your integrations and preferences</p>
      </div>

      <div className="p-6 max-w-2xl space-y-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Anthropic */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3">Anthropic (AI Agent)</h3>
            <label className="block">
              <span className="text-xs text-gray-400">API Key</span>
              <input
                type="password"
                placeholder="sk-ant-..."
                className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </label>
          </div>

          {/* Notion */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3">Notion</h3>
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs text-gray-400">API Key</span>
                <input
                  type="password"
                  placeholder="ntn_..."
                  className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </label>
              <label className="block">
                <span className="text-xs text-gray-400">Standup Board Database ID</span>
                <input
                  type="text"
                  placeholder="abc123..."
                  className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Linear */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3">Linear</h3>
            <label className="block">
              <span className="text-xs text-gray-400">API Key</span>
              <input
                type="password"
                placeholder="lin_api_..."
                className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </label>
          </div>

          {/* Browserbase */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3">Browserbase</h3>
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs text-gray-400">API Key</span>
                <input
                  type="password"
                  placeholder="bb_..."
                  className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </label>
              <label className="block">
                <span className="text-xs text-gray-400">Project ID</span>
                <input
                  type="text"
                  placeholder="project_..."
                  className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Cartesia */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3">Cartesia (Voice)</h3>
            <label className="block">
              <span className="text-xs text-gray-400">API Key</span>
              <input
                type="password"
                placeholder="sk_car_..."
                className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </label>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
          >
            {saved ? "Saved!" : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}
