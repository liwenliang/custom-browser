<script setup>
/**
 * 导入依赖
 */
// Vue 相关
import { provide, ref, nextTick } from "vue";

// 自定义 composables
import { useWebview } from "./composables/useWebview"; // webview 相关功能
import { useTabs } from "./composables/useTabs"; // 标签页管理功能
import { useWebviewEvents } from "./composables/useWebviewEvents"; // webview 事件处理功能

// 组件
import Toolbox from "./components/Toolbox.vue"; // 工具栏组件
import TabBar from "./components/TabBar.vue"; // 标签栏组件

/**
 * 初始化配置
 */
// 设置默认 URL
const defaultUrl = "https://www.baidu.com";

// 初始化 webview
const { webviewRef } = useWebview(defaultUrl);
let toolboxRef = ref(null);

// 初始化标签页管理
const { tabs, activeTabId, createNewTab, closeTab } = useTabs(defaultUrl);

// 初始化 webview 事件处理
useWebviewEvents({ createNewTab });

/**
 * Webview 相关方法
 */
// 设置 webview 引用
const setWebviewRef = (el, tabId) => {
  if (el) webviewRef.value = el;
};

/**
 * 标签页相关方法
 */
// 更新标签页标题
const updateTabTitle = (tab, event) => {
  tab.title = event.title;
  updateNavigationState();
};

// 更新标签页图标
const updateTabIcon = (tab, event) => {
  tab.icon = event.favicons[0];
  updateNavigationState();
};

// 切换当前活动的标签页
const switchTab = (id) => {
  activeTabId.value = id;
  updateNavigationState();
};

/**
 * 工具栏相关方法
 */
// 更新导航状态
const updateNavigationState = () => {
  nextTick(() => {
    toolboxRef.value.updateNavigationState();
  });
};
</script>

<template>
  <!-- 浏览器主容器 -->
  <div class="browser-container">
    
    <!-- 标签栏组件 -->
    <TabBar
      :tabs="tabs"
      :active-tab-id="activeTabId"
      @close-tab="closeTab"
      @switch-tab="(id) => switchTab(id)"
      @new-tab="createNewTab"
    />

    <!-- 工具栏组件 -->
    <Toolbox ref="toolboxRef" />
    
    <!-- webview 容器 -->
    <div class="webview-container">
      <!-- 遍历所有标签页 -->
      <template v-for="tab in tabs" :key="tab.id">
        <!-- 只显示当前活动的标签页内容 -->
        <div v-show="tab.id === activeTabId" class="webview-wrapper">
          <webview
            :ref="(el) => setWebviewRef(el, tab.id)"
            class="webview"
            :class="{ active: tab.id === activeTabId }"
            :data-active="tab.id === activeTabId"
            :src="tab.url"
            allowpopups
            @page-title-updated="(e) => updateTabTitle(tab, e)"
            @page-favicon-updated="(e) => updateTabIcon(tab, e)"
          ></webview>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/**
 * 布局样式
 */
/* 浏览器容器 */
.browser-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* webview 相关样式 */
.webview-container {
  flex: 1;
  position: relative;
}

.webview-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.webview {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
