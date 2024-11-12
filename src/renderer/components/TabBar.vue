<script setup>
import { ref } from 'vue'

defineProps({
  tabs: {
    type: Array,
    required: true,
    validator: (tabs) => tabs.every(tab => 'icon' in tab)
  },
  activeTabId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close-tab', 'switch-tab', 'new-tab'])

// 关闭标签页
const handleCloseTab = (tabId, event) => {
  event.stopPropagation()
  emit('close-tab', tabId)
}
</script>

<template>
  <div class="tab-bar">
    <div class="tabs-wrapper">
      <div class="tabs-container">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab', { active: tab.id === activeTabId }]"
          :data-tab-id="tab.id"
          @click="emit('switch-tab', tab.id)"
        >
          <div class="tab-content">
            <div class="icon-container">
              <img 
                v-if="tab.icon" 
                :src="tab.icon" 
                class="tab-icon" 
                alt=""
              >
              <div v-else class="loading-icon"></div>
            </div>
            <span class="tab-title">{{ tab.title || '新页签' }}</span>
          </div>
          <button 
            class="close-btn"
            @click="handleCloseTab(tab.id, $event)"
          >×</button>
        </div>
      </div>
      <div class="new-tab-btn-container">
        <button 
          class="new-tab-btn"
          @click="emit('new-tab')"
        >+</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-bar {
  display: flex;
  height: 36px;
  background: #f1f1f1;
  border-bottom: 1px solid #ddd;
  padding: 0;
  padding-left: 80px;
  min-width: 0;
}

.tabs-wrapper {
  display: flex;
  flex: 1;
  position: relative;
  min-width: 0;
}

.tabs-container {
  display: flex;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 36px 0 4px;
  min-width: 0;
}

.tabs-container::-webkit-scrollbar {
  display: none;
}

.tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  min-width: 160px;
  max-width: 240px;
  height: 32px;
  line-height: 32px;
  margin: 4px 0 0 0;
  border-radius: 8px 8px 0 0;
  background: #e4e4e4;
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: all 0.2s ease-out;
}

.tab-content {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0; /* 防止子元素溢出 */
}

.tab:not(.active):hover {
  background: #eaeaea;
}

.tab.active {
  background: #fff;
  box-shadow: none;
}

.tab:hover {
  transform: none;
  box-shadow: none;
}

.tab + .tab {
  margin-left: -8px;
}

.tab-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  margin-left: 4px;
}

.close-btn {
  width: 16px;
  height: 16px;
  border: none;
  background: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  opacity: 0;
  transition: all 0.2s ease;
  transform-origin: center;
  padding: 0;
  margin-left: 4px;
  margin-right: 4px;
}

.tab:hover .close-btn {
  opacity: 0.7;
}

.tab.active .close-btn {
  opacity: 0.7;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  opacity: 1 !important;
  transform: rotate(90deg);
}

.new-tab-btn {
  width: 28px;
  min-width: 28px;
  height: 28px;
  margin: 4px;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s ease;
}

.new-tab-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.tab-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  flex-shrink: 0;
}

.icon-container {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-icon {
  width: 12px;
  height: 12px;
  border: 1.5px solid #e0e0e0;
  border-top: 1.5px solid #666;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.new-tab-btn-container {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  background: #f1f1f1;
  padding: 0 4px;
}
</style> 