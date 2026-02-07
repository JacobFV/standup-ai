"use client";

const MOCK_STANDUPS = [
  {
    id: "1",
    date: "2026-02-07",
    team: "Engineering",
    participants: 5,
    duration: "4m 32s",
    blockers: 1,
    summary: "Sprint velocity on track. One blocker on auth service deployment — waiting on DevOps review.",
  },
  {
    id: "2",
    date: "2026-02-06",
    team: "Engineering",
    participants: 4,
    duration: "3m 48s",
    blockers: 0,
    summary: "All tasks progressing. Design review completed for new dashboard. CI/CD improvements merged.",
  },
  {
    id: "3",
    date: "2026-02-05",
    team: "Engineering",
    participants: 5,
    duration: "6m 12s",
    blockers: 2,
    summary: "Two blockers identified: API rate limiting issue and missing design specs. Both assigned for resolution.",
  },
];

export default function StandupsPage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="border-b border-gray-800 px-6 py-4">
        <h2 className="text-lg font-semibold">Standup History</h2>
        <p className="text-sm text-gray-400">Past standups and summaries</p>
      </div>

      <div className="p-6 space-y-4 max-w-3xl">
        {MOCK_STANDUPS.map((standup) => (
          <div
            key={standup.id}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{standup.date}</span>
                <span className="text-xs bg-gray-800 px-2 py-0.5 rounded-full text-gray-400">
                  {standup.team}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>{standup.participants} people</span>
                <span>{standup.duration}</span>
                {standup.blockers > 0 && (
                  <span className="text-red-400">{standup.blockers} blocker{standup.blockers > 1 ? "s" : ""}</span>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-300">{standup.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
