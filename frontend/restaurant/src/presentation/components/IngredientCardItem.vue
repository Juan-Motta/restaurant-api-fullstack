<template>
  <div class="bg-white shadow-md rounded-lg flex items-center">
    <div class="w-1/2 h-70 xl:h-full">
      <img :src="imageUrl" alt="Recipe Image" class="object-cover rounded-l-lg h-full" />
    </div>
    <div class="p-4 flex-1 flex flex-col items-center">
      <h3 class="font-semibold text-lg">{{ $t(name) }}</h3>
      <hr class="border-gray-200 mx-1 my-2 w-full" />
      <span class="text-3xl font-bold">{{ quantity }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  imageUrl: string
  quantity: number
}>()
</script>
