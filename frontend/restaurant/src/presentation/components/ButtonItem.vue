<template>
  <div class="flex flex-col items-center">
    <button
      @click="$emit('onClick')"
      :disabled="isLoading"
      class="px-6 py-3 bg-[#0eb3a0ca] hover:bg-[#67cec2ca] text-white font-semibold rounded-lg shadow-md transition duration-200 disabled:opacity-50 cursor-pointer"
    >
      <span v-if="isLoading">{{ $t('creating') }}</span>
      <span v-else>{{ $t('create-an-order') }}</span>
    </button>
    <div v-if="successMessage" class="text-green-500 mt-4">{{ $t(successMessage) }}</div>
    <div v-if="errorMessage" class="text-red-500 mt-4">{{ $t(errorMessage) }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isLoading: boolean
  errorMessage: string | null
  successMessage: string | null
}>()
</script>
