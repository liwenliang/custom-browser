import { ref } from 'vue'

export function useWebview(defaultUrl = 'https://www.baidu.com') {
  const webviewRef = ref(null)

  // 添加一个获取当前激活的 webview 元素的辅助函数
  const getWebview = () => {
    // 优先使用 ref
    if (webviewRef.value) return webviewRef.value
    // 获取当前激活的 webview
    return document.querySelector('webview.active') || document.querySelector('webview[data-active="true"]')
  }

  const actions = {
    goBack: () => {
      const webview = getWebview()
      if (webview && webview.canGoBack()) {
        webview.goBack()
      }
    },
    goForward: () => {
      const webview = getWebview()
      if (webview && webview.canGoForward()) {
        webview.goForward()
      }
    },
    reload: () => {
      const webview = getWebview()
      if (webview) {
        webview.reload()
      }
    },
    goHome: () => {
      const webview = getWebview()
      if (webview) {
        webview.loadURL(defaultUrl)
      }
    },
    loadURL: (url) => {
      const webview = getWebview()
      if (webview) {
        // 确保 URL 格式正确
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url
        }
        webview.loadURL(url)
      }
    }
  }

  // 暴露给主进程调用
  window.webviewActions = actions

  return {
    webviewRef,
    getWebview,
    ...actions
  }
} 