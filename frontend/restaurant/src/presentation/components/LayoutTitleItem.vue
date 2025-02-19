<template>
  <header class="">
    <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-semibold text-gray-900">{{ pageName }}</h1>
        <button @click="$emit('toggleSidebar')"
          class="md:hidden rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
          <span class="sr-only">{{ isSidebarOpen ? 'Close sidebar' : 'Open sidebar' }}</span>
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
    <hr class="border-gray-300 mx-8">
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const pageName = computed(() => {
  return route.name || 'Home';
});

defineProps({
  isSidebarOpen: Boolean,
})

</script>
