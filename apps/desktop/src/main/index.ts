import { app, BrowserWindow, ipcMain, desktopCapturer, screen } from "electron";
import * as path from "path";
import { ComputerController } from "./computer-control";
import { AgentHandler } from "./agent-handler";

let mainWindow: BrowserWindow | null = null;
const computerController = new ComputerController();
let agentHandler: AgentHandler | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: "#030712",
    titleBarStyle: "hiddenInset",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // In development, load from file. In production, load built HTML.
  mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC Handlers

// Computer Control
ipcMain.handle("computer:click", async (_event, x: number, y: number) => {
  return computerController.click(x, y);
});

ipcMain.handle("computer:doubleClick", async (_event, x: number, y: number) => {
  return computerController.doubleClick(x, y);
});

ipcMain.handle("computer:type", async (_event, text: string) => {
  return computerController.type(text);
});

ipcMain.handle("computer:keyPress", async (_event, keys: string[]) => {
  return computerController.keyPress(keys);
});

ipcMain.handle("computer:moveMouse", async (_event, x: number, y: number) => {
  return computerController.moveMouse(x, y);
});

ipcMain.handle("computer:screenshot", async () => {
  return computerController.takeScreenshot();
});

ipcMain.handle("computer:getMousePosition", async () => {
  const point = screen.getCursorScreenPoint();
  return { x: point.x, y: point.y };
});

// Agent
ipcMain.handle("agent:init", async (_event, config: { anthropicApiKey: string }) => {
  agentHandler = new AgentHandler(config.anthropicApiKey, computerController);
  return { success: true };
});

ipcMain.handle("agent:chat", async (_event, message: string) => {
  if (!agentHandler) {
    return { error: "Agent not initialized. Please set your API key in settings." };
  }
  try {
    const response = await agentHandler.chat(message);
    return { message: response };
  } catch (error) {
    return { error: String(error) };
  }
});

// Screen capture for agent vision
ipcMain.handle("screen:capture", async () => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: { width: 1920, height: 1080 },
    });

    if (sources.length > 0) {
      const screenshot = sources[0]!.thumbnail.toDataURL();
      return { image: screenshot };
    }
    return { error: "No screen sources found" };
  } catch (error) {
    return { error: String(error) };
  }
});
