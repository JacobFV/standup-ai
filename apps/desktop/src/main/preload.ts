import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // Computer Control
  computer: {
    click: (x: number, y: number) => ipcRenderer.invoke("computer:click", x, y),
    doubleClick: (x: number, y: number) => ipcRenderer.invoke("computer:doubleClick", x, y),
    type: (text: string) => ipcRenderer.invoke("computer:type", text),
    keyPress: (keys: string[]) => ipcRenderer.invoke("computer:keyPress", keys),
    moveMouse: (x: number, y: number) => ipcRenderer.invoke("computer:moveMouse", x, y),
    screenshot: () => ipcRenderer.invoke("computer:screenshot"),
    getMousePosition: () => ipcRenderer.invoke("computer:getMousePosition"),
  },

  // Agent
  agent: {
    init: (config: { anthropicApiKey: string }) => ipcRenderer.invoke("agent:init", config),
    chat: (message: string) => ipcRenderer.invoke("agent:chat", message),
  },

  // Screen
  screen: {
    capture: () => ipcRenderer.invoke("screen:capture"),
  },
});
