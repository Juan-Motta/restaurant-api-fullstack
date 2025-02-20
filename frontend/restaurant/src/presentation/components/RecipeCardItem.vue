<template>
  <div class="bg-white shadow-md rounded-lg flex items-center">
    <div class="w-1/2 h-70 md:h-full">
      <img :src="imageUrl" alt="Recipe Image" class="object-cover rounded-l-lg h-full" />
    </div>
    <div class="p-4 flex-1">
      <h3 class="font-semibold text-lg">{{ $t(name) }}</h3>
      <div>
        <hr class="border-gray-200 mx-1 my-2" />
        <p v-for="ingredient in ingredients" :key="ingredient.id">
          <span class="font-semibold">{{ ingredient.quantity }}</span> {{ $t(ingredient.name) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  imageUrl: string
  ingredients: { id: number; name: string; quantity: number; imageUrl: string }[]
}>()
</script>
