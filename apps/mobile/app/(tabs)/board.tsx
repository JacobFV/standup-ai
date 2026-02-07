import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

const COLUMNS = ["To Do", "In Progress", "Done"];

const MOCK_TASKS = [
  { id: "1", title: "Fix auth bug", status: "In Progress", source: "linear" as const, identifier: "ENG-123" },
  { id: "2", title: "Design review", status: "To Do", source: "notion" as const },
  { id: "3", title: "API docs", status: "Done", source: "linear" as const, identifier: "ENG-456" },
  { id: "4", title: "Sprint planning", status: "To Do", source: "notion" as const },
];

export default function BoardScreen() {
  const [tasks] = useState(MOCK_TASKS);

  return (
    <ScrollView style={styles.container} horizontal pagingEnabled>
      {COLUMNS.map((col) => (
        <View key={col} style={styles.column}>
          <View style={styles.columnHeader}>
            <Text style={styles.columnTitle}>{col}</Text>
            <Text style={styles.columnCount}>
              {tasks.filter((t) => t.status === col).length}
            </Text>
          </View>
          {tasks
            .filter((t) => t.status === col)
            .map((task) => (
              <View key={task.id} style={styles.card}>
                <Text style={styles.cardTitle}>{task.title}</Text>
                <View style={styles.cardMeta}>
                  <View
                    style={[
                      styles.sourceBadge,
                      task.source === "linear"
                        ? styles.linearBadge
                        : styles.notionBadge,
                    ]}
                  >
                    <Text style={styles.sourceText}>
                      {task.source === "linear" ? task.identifier : "Notion"}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },
  column: {
    width: 300,
    padding: 16,
  },
  columnHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#d1d5db",
  },
  columnCount: {
    fontSize: 12,
    color: "#6b7280",
    backgroundColor: "#1f2937",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  cardTitle: {
    fontSize: 14,
    color: "#e5e7eb",
    fontWeight: "500",
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: "row",
  },
  sourceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  linearBadge: {
    backgroundColor: "rgba(147, 51, 234, 0.2)",
  },
  notionBadge: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
  },
  sourceText: {
    fontSize: 11,
    color: "#d1d5db",
  },
});
