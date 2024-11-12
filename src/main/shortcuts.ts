import { app, globalShortcut, BrowserWindow, webContents } from "electron";

export function setupShortcuts() {
  // 注册退出应用快捷键
  globalShortcut.register("CommandOrControl+Q", () => {
    app.quit();
  });

  // 注册开发者工具快捷键
  globalShortcut.register("CommandOrControl+Option+I", () => {
    const mainWindow = BrowserWindow.getFocusedWindow();
    if (mainWindow) {
      // 获取当前窗口中的所有 webContents
      const allWebContents = webContents.getAllWebContents();
      
      // 查找属于 webview 的 webContents
      const webviewContents = allWebContents.find(contents => 
        contents.getType() === 'webview' && 
        contents.hostWebContents === mainWindow.webContents
      );

      // 如果找到 webview，则切换其开发者工具
      if (webviewContents) {
        if (webviewContents.isDevToolsOpened()) {
          webviewContents.closeDevTools();
        } else {
          webviewContents.openDevTools();
        }
      }
    }
  });

  // 注册刷新页面快捷键
  globalShortcut.register("CommandOrControl+R", () => {
    const mainWindow = BrowserWindow.getFocusedWindow();
    if (mainWindow) {
      mainWindow.webContents.reload();
    }
  });

  // 注册强制刷新页面快捷键（忽略缓存）
  globalShortcut.register("CommandOrControl+Shift+R", () => {
    const mainWindow = BrowserWindow.getFocusedWindow();
    if (mainWindow) {
      mainWindow.webContents.reloadIgnoringCache();
    }
  });

  // 注册复制快捷键
  globalShortcut.register("CommandOrControl+C", () => {
    const mainWindow = BrowserWindow.getFocusedWindow();
    if (mainWindow) {
      mainWindow.webContents.copy();
    }
  });

  // 注册剪切快捷键
  globalShortcut.register("CommandOrControl+X", () => {
    const mainWindow = BrowserWindow.getFocusedWindow();
    if (mainWindow) {
      mainWindow.webContents.cut();
    }
  });

  // 注册粘贴快捷键
  globalShortcut.register("CommandOrControl+V", () => {
    const mainWindow = BrowserWindow.getFocusedWindow();
    if (mainWindow) {
      mainWindow.webContents.paste();
    }
  });

  // 注册撤销快捷键
  globalShortcut.register("CommandOrControl+Z", () => {
    const mainWindow = BrowserWindow.getFocusedWindow();
    if (mainWindow) {
      mainWindow.webContents.undo();
    }
  });

  // 注册打印快捷键
  globalShortcut.register("CommandOrControl+P", () => {
    const mainWindow = BrowserWindow.getFocusedWindow();
    if (mainWindow) {
      mainWindow.webContents.print();
    }
  });

  // 注销快捷键
  app.on("will-quit", () => {
    globalShortcut.unregisterAll();
  });
} 