<template>
  <RouterLink
    :to="toUrl"
    class="flex my-1 mx-3 px-3 py-2 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-200 items-center"
    activeClass="bg-[#00d6bcca] border-shadow"
  >
    <slot></slot>
  </RouterLink>
</template>

<script setup lang="ts">
defineProps<{
  toUrl: string
}>()
</script>
