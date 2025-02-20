<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h3 :class="cardStyle">{{ $t(title) }}</h3>
    <p class="text-4xl text-center">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  value: number | string
  color: string
}>()

const cardStyle = `text-lg font-bold mb-4 ${props.color} text-center`
</script>
