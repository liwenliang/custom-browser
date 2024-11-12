// 从 electron 导入所需模块
import { contextBridge, ipcRenderer } from 'electron';

// 将 electronAPI 暴露给渲染进程
// 提供 sendMessage 方法用于发送消息到主进程
contextBridge.exposeInMainWorld('electronAPI', {
  // message: 要发送的消息内容
  sendMessage: (message) => ipcRenderer.send('message', message)
})
