// Renderer process entry point
// This runs in the Electron browser context
export {};

declare global {
  interface Window {
    electronAPI: {
      computer: {
        click: (x: number, y: number) => Promise<{ success: boolean }>;
        doubleClick: (x: number, y: number) => Promise<{ success: boolean }>;
        type: (text: string) => Promise<{ success: boolean }>;
        keyPress: (keys: string[]) => Promise<{ success: boolean }>;
        moveMouse: (x: number, y: number) => Promise<{ success: boolean }>;
        screenshot: () => Promise<{ image: string } | { error: string }>;
      };
      agent: {
        init: (apiKey: string) => Promise<void>;
        chat: (message: string) => Promise<{ response: string; actions: string[] }>;
      };
      screen: {
        getSources: () => Promise<Array<{ id: string; name: string; thumbnail: string }>>;
      };
    };
  }
}

// Chat functionality
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input") as HTMLInputElement | null;
const sendBtn = document.getElementById("send-btn");

function addMessage(role: "user" | "assistant", content: string) {
  if (!chatMessages) return;
  const div = document.createElement("div");
  div.className = `message ${role}`;
  div.innerHTML = `<div class="message-content"><strong>${role === "user" ? "You" : "AI"}:</strong> ${content}</div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
  if (!chatInput) return;
  const message = chatInput.value.trim();
  if (!message) return;

  addMessage("user", message);
  chatInput.value = "";

  try {
    const result = await window.electronAPI.agent.chat(message);
    addMessage("assistant", result.response);
  } catch (error) {
    addMessage("assistant", `Error: ${error}`);
  }
}

sendBtn?.addEventListener("click", sendMessage);
chatInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Screenshot button
document.getElementById("screenshot-btn")?.addEventListener("click", async () => {
  const result = await window.electronAPI.computer.screenshot();
  if ("image" in result) {
    addMessage("assistant", "Screenshot captured.");
  } else {
    addMessage("assistant", `Screenshot failed: ${result.error}`);
  }
});

console.log("Standup AI Desktop renderer loaded");
