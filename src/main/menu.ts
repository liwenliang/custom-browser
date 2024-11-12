// 导入 Electron 的 Menu 模块用于创建应用菜单
import { Menu } from "electron";

/**
 * 创建应用程序菜单
 * @param mainWindow 主窗口实例
 */
export function createApplicationMenu(mainWindow) {
  // 定义菜单模板
  const menuTemplate = [
    {
      label: "操作", // 操作菜单项
      submenu: [
        {
          label: "后退", // 后退按钮
          click: () => {
            // 执行网页后退操作
            mainWindow.webContents.executeJavaScript(
              "window.webviewActions.goBack()"
            );
          },
        },
        {
          label: "前进", // 前进按钮
          click: () => {
            // 执行网页前进操作
            mainWindow.webContents.executeJavaScript(
              "window.webviewActions.goForward()"
            );
          },
        },
        {
          label: "刷新", // 刷新按钮
          click: () => {
            // 执行页面刷新操作
            mainWindow.webContents.executeJavaScript(
              "window.webviewActions.reload()"
            );
          },
        },
        {
          label: "首页", // 首页按钮
          click: () => {
            // 跳转到首页
            mainWindow.webContents.executeJavaScript(
              "window.webviewActions.goHome()"
            );
          },
        },
      ],
    },
  ];

  // 从模板创建菜单
  const menu = Menu.buildFromTemplate(menuTemplate);
  // 设置为应用程序菜单
  Menu.setApplicationMenu(menu);
}