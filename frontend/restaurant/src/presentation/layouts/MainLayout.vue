<template>
  <div class="flex h-full bg-gray-100">
    <SidebarModule :is-sidebar-open="isSidebarOpen" @logout="logout" />
    <div class="flex-1 flex flex-col md:ml-64">
      <LayoutTitleItem :is-sidebar-open="isSidebarOpen" @toggle-sidebar="toggleSidebar" />
      <main class="flex-1 overflow-y-auto bg-gray-100">
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import SidebarModule from '../modules/SidebarModule.vue'
import LayoutTitleItem from '../components/LayoutTitleItem.vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleResize = () => {
  if (window.innerWidth >= 768) {
    isSidebarOpen.value = true
  }
}
onBeforeMount(() => {
  isSidebarOpen.value = window.innerWidth >= 768
  window.addEventListener('resize', handleResize)
})

onMounted(() => {
  window.removeEventListener('resize', handleResize)
})

const logout = () => {
  console.log('Logging out...')
}
</script>
