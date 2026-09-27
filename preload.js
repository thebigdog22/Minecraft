const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("launcher", {
  launchGame(game) {
    return ipcRenderer.invoke("launch-game", game);
  }
});
