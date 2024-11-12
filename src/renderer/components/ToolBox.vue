<template>
  <!-- 工具栏容器 -->
  <div class="toolbox">
    <!-- 后退按钮 -->
    <button class="nav-btn back-btn" @click="goBack" :disabled="!canGoBack">
      <span class="arrow left"></span>
    </button>
    <!-- 前进按钮 -->
    <button
      class="nav-btn forward-btn"
      @click="goForward"
      :disabled="!canGoForward"
    >
      <span class="arrow right"></span>
    </button>
    <!-- 刷新按钮 -->
    <button class="nav-btn refresh-btn" @click="refresh">
      <span class="refresh-icon" :class="{ rotating: isRotating }"></span>
    </button>
    <!-- 主页按钮 -->
    <button class="nav-btn home-btn" @click="goHome">
      <span class="home-icon"></span>
    </button>
    <!-- 地址栏 -->
    <div class="url-bar">
      <input
        type="text"
        v-model="currentUrl"
        @keyup.enter="navigate"
        @click="handleClick"
        placeholder="输入网址"
      />
    </div>
  </div>
</template>

<script setup>
// 导入Vue相关依赖
import { ref, onMounted, onBeforeUnmount } from "vue";
// 导入webview相关功能
import { useWebview } from "../composables/useWebview";

// 定义响应式状态
const currentUrl = ref(""); // 当前URL
const canGoBack = ref(false); // 是否可以后退
const canGoForward = ref(false); // 是否可以前进
const isRotating = ref(false); // 刷新图标是否旋转

// 从useWebview中解构需要的方法
const { goBack, goForward, reload, goHome, loadURL, getWebview } = useWebview();

// 刷新页面
const refresh = () => {
  isRotating.value = true;
  reload();
  setTimeout(() => {
    isRotating.value = false;
  }, 1000); // 动画持续1秒
};

// 导航到输入的URL
const navigate = () => {
  if (currentUrl.value) {
    let url = currentUrl.value.trim();
    
    // 如果不包含协议，且不是以 www. 开头，先尝试作为搜索词处理
    if (!url.match(/^[a-zA-Z]+:\/\//) && !url.startsWith('www.')) {
      // 检查是否是有效的域名格式
      if (!url.match(/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/)) {
        // 不是域名，作为搜索词使用
        url = `https://www.baidu.com/s?wd=${encodeURIComponent(url)}`;
      } else {
        // 是域名格式，添加 https://
        url = `https://${url}`;
      }
    } else if (url.startsWith('www.')) {
      // 添加 https:// 协议
      url = `https://${url}`;
    }
    
    loadURL(url);
  }
};

// 更新导航状态(前进/后退按钮状态)
const updateNavigationState = () => {
  const webview = getWebview();
  if (webview) {
    canGoBack.value = webview.canGoBack();
    canGoForward.value = webview.canGoForward();
    currentUrl.value = webview.getURL();
  }
};

// 点击地址栏时全选内容
const handleClick = (event) => {
  event.target.select();
};

// 组件挂载时添加事件监听
onMounted(() => {
  const webview = getWebview();
  if (webview) {
    webview.addEventListener("did-navigate", updateNavigationState);
    webview.addEventListener("did-navigate-in-page", updateNavigationState);
    webview.addEventListener("did-start-loading", () => {
      currentUrl.value = webview.getURL();
    });
  }
});

// 组件卸载前移除事件监听
onBeforeUnmount(() => {
  const webview = getWebview();
  if (webview) {
    webview.removeEventListener("did-navigate", updateNavigationState);
    webview.removeEventListener("did-navigate-in-page", updateNavigationState);
  }
});

// 暴露方法给父组件
defineExpose({
  updateNavigationState,
});
</script>

<style scoped>
/* 工具栏容器样式 */
.toolbox {
  display: flex;
  align-items: center;
  height: 40px;
  box-sizing: border-box;
  padding: 0;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

/* 导航按钮基础样式 */
.nav-btn {
  width: 32px;
  height: 32px;
  margin: 0 4px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 导航按钮悬停效果 */
.nav-btn:hover {
  background: #e0e0e0;
}

/* 禁用状态的导航按钮样式 */
.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 箭头图标基础样式 */
.arrow {
  border: solid #666;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
}

/* 左箭头样式 */
.left {
  transform: rotate(135deg);
}

/* 右箭头样式 */
.right {
  transform: rotate(-45deg);
}

/* 刷新图标样式 */
.refresh-icon {
  width: 12px;
  height: 12px;
  border: 1.5px solid #666;
  border-radius: 50%;
  border-right-color: transparent;
  transform: rotate(45deg);
  position: relative;
}

/* 刷新图标箭头部分 */
.refresh-icon:after {
  content: "";
  position: absolute;
  top: -2.5px;
  right: -2.5px;
  width: 0;
  height: 0;
  border-left: 3px solid transparent;
  border-right: 3px solid transparent;
  border-bottom: 5px solid #666;
  transform: rotate(-5deg);
}

/* 主页图标样式 */
.home-icon {
  width: 18px;
  height: 16px;
  position: relative;
  display: inline-block;
}

/* 主页图标屋顶部分 */
.home-icon:before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  width: 0;
  height: 0;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-bottom: 9px solid #666;
}

/* 主页图标房子主体部分 */
.home-icon:after {
  content: "";
  position: absolute;
  left: 3px;
  bottom: 0;
  width: 12px;
  height: 8px;
  background: #666;
}

/* 地址栏容器样式 */
.url-bar {
  flex: 1;
  margin: 0 8px;
  max-width: calc(100% - 200px);
}

/* 地址栏输入框样式 */
input {
  width: 100%;
  height: 28px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
}

/* 地址栏输入框焦点样式 */
input:focus {
  border-color: #999;
}

/* 刷新图标旋转动画 */
@keyframes rotate {
  from {
    transform: rotate(45deg);
  }
  to {
    transform: rotate(405deg);
  }
}

/* 刷新图标旋转状态 */
.refresh-icon.rotating {
  animation: rotate 1s linear;
}
</style>
