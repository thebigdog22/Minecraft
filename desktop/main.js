const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const { execFile } = require("child_process");

function createWindow() {
  const win = new BrowserWindow({
    width: 1250,
    height: 780,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#111111",
    autoHideMenuBar: true,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile("index.html");
}

function launchMinecraft() {
  const locations = [
    path.join(
      process.env.LOCALAPPDATA || "",
      "Programs",
      "Minecraft Launcher",
      "MinecraftLauncher.exe"
    ),

    path.join(
      process.env.PROGRAMFILES || "",
      "Minecraft Launcher",
      "MinecraftLauncher.exe"
    ),

    path.join(
      process.env["ProgramFiles(x86)"] || "",
      "Minecraft Launcher",
      "MinecraftLauncher.exe"
    )
  ];

  const launcher = locations.find((file) => fs.existsSync(file));

  if (launcher) {
    execFile(launcher, [], () => {});
    return {
      ok: true,
      message: "Minecraft Launcher started!"
    };
  }

  shell.openExternal("minecraft://");

  return {
    ok: true,
    message: "Opening Minecraft..."
  };
}

function launchEducation() {
  shell.openExternal("minecraftedu://");

  return {
    ok: true,
    message: "Opening Minecraft Education..."
  };
}

function launchStoreGame(name) {
  shell.openExternal(
    "ms-windows-store://search/?query=" +
      encodeURIComponent(name)
  );

  return {
    ok: true,
    message: "Opening " + name + "..."
  };
}

app.whenReady().then(() => {
  ipcMain.handle("launch-game", async (event, game) => {
    if (game === "minecraft") {
      return launchMinecraft();
    }

    if (game === "education") {
      return launchEducation();
    }

    if (game === "dungeons") {
      return launchStoreGame("Minecraft Dungeons");
    }

    if (game === "legends") {
      return launchStoreGame("Minecraft Legends");
    }

    return {
      ok: false,
      message: "Unknown game."
    };
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
