// 导入所需的 Electron 模块和其他依赖
import { BrowserWindow, Menu, MenuItem, app, session, desktopCapturer } from "electron";
import { join } from "path";
import { createApplicationMenu } from "./menu";

/**
 * 创建主窗口
 * 设置窗口属性和网页功能
 * 初始化上下文菜单和应用菜单
 * 加载应用内容
 */
export function createWindow() {
  // 创建浏览器窗口实例
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 12, y: 10 },
    webPreferences: {
      preload: join(__dirname, "preload.js"), // 预加载脚本
      nodeIntegration: false, // 禁用 Node.js 集成
      contextIsolation: true, // 启用上下文隔离
      spellcheck: true, // 启用拼写检查
      webviewTag: true, // 启用 webview 标签
      webSecurity: true, // 启用网页安全性
      allowRunningInsecureContent: false, // 禁止运行不安全内容
      enableWebSQL: true, // 启用 WebSQL
      webgl: true, // 启用 WebGL
      plugins: true, // 启用插件
      sandbox: false, // 禁用沙箱
    },
  });

  // 设置共享屏幕请求处理
  session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
    desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
      callback({ video: sources[0], audio: 'loopback' })
    })
  })

  // 处理外部协议
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // 只允许 http 和 https 协议
    if (url.startsWith("http:") || url.startsWith("https:")) {
      return { action: "allow" };
    }

    // 其他所有协议都拒绝处理
    return { action: "deny" };
  });

  // 监听 webview 标签创建事件
  mainWindow.webContents.on("did-attach-webview", (event, webContents) => {
    // 为 webview 设置新窗口处理
    webContents.setWindowOpenHandler(({ url }) => {
      console.log("webview 新窗口事件:", url);
      if (url.startsWith("http:") || url.startsWith("https:")) {
        // 向渲染进程发送新窗口事件
        // updateNavigationState
        mainWindow.webContents.executeJavaScript(
          `
          window.webviewEvents.handleNewWindow('${url}');
          `
        );
        return { action: "deny" };
      }
      return { action: "deny" };
    });

    // 添加右键菜单
    webContents.on("context-menu", (event, params) => {
      const menu = new Menu();
      menu.append(
        new MenuItem({
          label: "审查元素",
          click: () => {
            webContents.inspectElement(params.x, params.y);
          },
        })
      );

      // 可以添加更多菜单项
      menu.append(new MenuItem({ type: "separator" }));
      menu.append(
        new MenuItem({
          label: "刷新页面",
          click: () => {
            webContents.reload();
          },
        })
      );

      menu.popup();
    });
  });

  createApplicationMenu(mainWindow);
  loadAppContent(mainWindow);
  mainWindow.maximize();
}

/**
 * 加载应用内容
 * 根据环境变量决定加载开发服务器或本地文件
 * @param mainWindow 主窗口实例
 */
function loadAppContent(mainWindow) {
  if (process.env.NODE_ENV === "development") {
    // 开发环境下连接本地开发服务器
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  } else {
    // 生产环境下加载打包后的文件
    mainWindow.loadFile(join(app.getAppPath(), "renderer", "index.html"));
  }
}
