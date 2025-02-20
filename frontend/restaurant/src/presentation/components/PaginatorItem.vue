<template>
  <div class="mt-5 flex justify-between">
    <button @click="$emit('change-page', currentPage - 1)" :disabled="currentPage === 1"
      class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 cursor-pointer">
      {{ $t('previous') }}
    </button>
    <span class="self-center">{{ $t('page') }} {{ currentPage }}</span>
    <button @click="$emit('change-page', currentPage + 1)" :disabled="(currentPage * itemsPerPage) >= totalItems"
      class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 cursor-pointer">
      {{ $t('next') }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ currentPage: number, itemsPerPage: number, totalItems: number }>();
</script>
