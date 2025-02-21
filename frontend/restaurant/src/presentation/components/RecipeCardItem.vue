<template>
  <div class="bg-white shadow-md rounded-lg flex items-center">
    <div class="w-1/2 h-70 xl:h-full">
      <v-lazy-image class="object-cover rounded-l-lg h-full" :src="imageUrl" :src-placeholder="getMinImage(imageUrl)" />
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
import VLazyImage from "v-lazy-image";

defineProps<{
  name: string
  imageUrl: string
  ingredients: { id: number; name: string; quantity: number; imageUrl: string }[]
}>()

const getMinImage = (imageUrl: string) => {
  return imageUrl.replace('.webp', '_min.webp')
}
</script>

<style scoped>
.v-lazy-image {
  filter: blur(5px);
  transition: filter 1.6s;
  will-change: filter;
}
.v-lazy-image-loaded {
  filter: blur(0);
}
</style>
