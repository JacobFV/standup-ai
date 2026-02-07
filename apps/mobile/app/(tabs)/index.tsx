import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

type VoiceState = "idle" | "listening" | "processing" | "speaking";

export default function StandupScreen() {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [updates, setUpdates] = useState<
    Array<{ type: string; text: string }>
  >([]);

  const toggleListening = () => {
    if (voiceState === "idle") {
      setVoiceState("listening");
      // Start recording
    } else if (voiceState === "listening") {
      setVoiceState("processing");
      // Stop recording, send for processing
      setTimeout(() => {
        setVoiceState("idle");
        setTranscript("Yesterday I finished the auth flow. Today I'm working on the dashboard. No blockers.");
        setUpdates([
          { type: "yesterday", text: "Finished the auth flow" },
          { type: "today", text: "Working on the dashboard" },
          { type: "blocker", text: "None" },
        ]);
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.greeting}>Good morning! 👋</Text>
        <Text style={styles.subtitle}>Ready for your standup update?</Text>

        {/* Voice Button */}
        <View style={styles.voiceContainer}>
          <TouchableOpacity
            style={[
              styles.voiceButton,
              voiceState === "listening" && styles.voiceButtonActive,
              voiceState === "processing" && styles.voiceButtonProcessing,
            ]}
            onPress={toggleListening}
            activeOpacity={0.8}
          >
            <Text style={styles.voiceIcon}>
              {voiceState === "listening" ? "🔴" : voiceState === "processing" ? "⏳" : "🎙"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.voiceLabel}>
            {voiceState === "listening"
              ? "Listening... tap to stop"
              : voiceState === "processing"
              ? "Processing your update..."
              : "Tap to start your standup"}
          </Text>
        </View>

        {/* Transcript */}
        {transcript ? (
          <View style={styles.transcriptCard}>
            <Text style={styles.transcriptLabel}>Your update:</Text>
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>
        ) : null}

        {/* Parsed Updates */}
        {updates.length > 0 ? (
          <View style={styles.updatesContainer}>
            <Text style={styles.updatesTitle}>Parsed standup:</Text>
            {updates.map((update, i) => (
              <View key={i} style={styles.updateRow}>
                <View
                  style={[
                    styles.updateBadge,
                    update.type === "yesterday" && { backgroundColor: "#1e3a5f" },
                    update.type === "today" && { backgroundColor: "#1a3a2a" },
                    update.type === "blocker" && { backgroundColor: "#3a1a1a" },
                  ]}
                >
                  <Text style={styles.updateBadgeText}>
                    {update.type === "yesterday" ? "Yesterday" : update.type === "today" ? "Today" : "Blocker"}
                  </Text>
                </View>
                <Text style={styles.updateText}>{update.text}</Text>
              </View>
            ))}

            <TouchableOpacity style={styles.confirmButton}>
              <Text style={styles.confirmText}>
                Confirm & Move Tasks
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#9ca3af",
    marginBottom: 40,
  },
  voiceContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  voiceButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1f2937",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#374151",
  },
  voiceButtonActive: {
    backgroundColor: "#7f1d1d",
    borderColor: "#ef4444",
  },
  voiceButtonProcessing: {
    backgroundColor: "#78350f",
    borderColor: "#f59e0b",
  },
  voiceIcon: {
    fontSize: 40,
  },
  voiceLabel: {
    fontSize: 14,
    color: "#9ca3af",
  },
  transcriptCard: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  transcriptLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  transcriptText: {
    fontSize: 14,
    color: "#e5e7eb",
    lineHeight: 20,
  },
  updatesContainer: {
    marginBottom: 24,
  },
  updatesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#d1d5db",
    marginBottom: 12,
  },
  updateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  updateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  updateBadgeText: {
    fontSize: 12,
    color: "#e5e7eb",
    fontWeight: "500",
  },
  updateText: {
    fontSize: 14,
    color: "#d1d5db",
    flex: 1,
  },
  confirmButton: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 16,
  },
  confirmText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
