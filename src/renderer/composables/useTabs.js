import { ref, nextTick } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export function useTabs(defaultUrl) {
  const tabs = ref([
    {
      id: uuidv4(),
      url: defaultUrl,
      title: '新页签',
      icon: ''
    }
  ])
  const activeTabId = ref(tabs.value[0].id)

  const createNewTab = (url = defaultUrl) => {
    const newTab = {
      id: uuidv4(),
      url,
      title: '新页签',
      icon: ''
    }
    tabs.value.push(newTab)
    activeTabId.value = newTab.id
    nextTick(() => {
      const newTabElement = document.querySelector(`[data-tab-id="${newTab.id}"]`)
      newTabElement?.scrollIntoView({ behavior: 'smooth' })
    })
    return newTab
  }

  const closeTab = (tabId) => {
    const index = tabs.value.findIndex(tab => tab.id === tabId)
    if (tabs.value.length === 1) {
      createNewTab()
    }
    tabs.value.splice(index, 1)
    if (activeTabId.value === tabId) {
      activeTabId.value = tabs.value[Math.max(0, index - 1)].id
    }
  }

  return {
    tabs,
    activeTabId,
    createNewTab,
    closeTab
  }
} 