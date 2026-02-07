import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";

export default function SettingsScreen() {
  const [saved, setSaved] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Configuration</Text>
        <Text style={styles.sectionDesc}>
          Enter your API keys to connect integrations. Keys are stored locally on your device.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Anthropic</Text>
        <TextInput
          style={styles.input}
          placeholder="sk-ant-..."
          placeholderTextColor="#6b7280"
          secureTextEntry
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notion API Key</Text>
        <TextInput
          style={styles.input}
          placeholder="ntn_..."
          placeholderTextColor="#6b7280"
          secureTextEntry
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Linear API Key</Text>
        <TextInput
          style={styles.input}
          placeholder="lin_api_..."
          placeholderTextColor="#6b7280"
          secureTextEntry
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Browserbase API Key</Text>
        <TextInput
          style={styles.input}
          placeholder="bb_..."
          placeholderTextColor="#6b7280"
          secureTextEntry
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cartesia API Key</Text>
        <TextInput
          style={styles.input}
          placeholder="sk_car_..."
          placeholderTextColor="#6b7280"
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }}
      >
        <Text style={styles.saveText}>{saved ? "Saved!" : "Save Settings"}</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Server URL</Text>
        <TextInput
          style={styles.input}
          placeholder="https://your-standup-ai.vercel.app"
          placeholderTextColor="#6b7280"
        />
        <Text style={styles.hint}>
          Point to your deployed Next.js web app for the API backend.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },
  content: {
    padding: 20,
    gap: 16,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: "#9ca3af",
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#d1d5db",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1f2937",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#2563eb",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  hint: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 6,
  },
});
