import { nextTick } from 'vue'

export function useWebviewEvents({ createNewTab = () => {} } = {}) {
  const handleNewWindow = (url) => {
    console.log('新窗口事件renderer:', url)
    createNewTab(url)
  }

  window.webviewEvents = {
    handleNewWindow,
  }

  return {
  }
} 