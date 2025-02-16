<script setup lang="ts">
import MainLayout from '../layouts/MainLayout.vue';
</script>

<template>
  <MainLayout>
    <section class="min-h-screen bg-cover bg-center">
      <div class="container mx-auto px-4 h-screen flex flex-col">
        <main class="flex-grow flex flex-col md:flex-row items-center justify-between">
          <div class="w-full md:w-1/2 mb-8 md:mb-0">
            <div class="max-w-md mx-auto space-y-4">
              <input type="text" placeholder="Enter name"
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <button class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md">
                Take an Order
              </button>
            </div>
          </div>
        </main>
      </div>
    </section>
  </MainLayout>
</template>
