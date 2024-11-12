// 导入所需的 Electron 模块和自定义功能模块
import { app, BrowserWindow } from "electron";
import { createWindow } from "./window";
import { setupShortcuts } from "./shortcuts"; 

// 当 Electron 完成初始化时执行
app.whenReady().then(() => {
  // 设置快捷键
  setupShortcuts();
  // 创建主窗口
  createWindow();

  // 在 macOS 上,当点击 dock 图标且没有其他窗口打开时,
  // 应用程序通常会重新创建一个窗口
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 当所有窗口都被关闭时退出应用
// 在 macOS 上,应用程序及其菜单栏通常会保持活动状态,
// 直到用户使用 Cmd + Q 显式退出
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
