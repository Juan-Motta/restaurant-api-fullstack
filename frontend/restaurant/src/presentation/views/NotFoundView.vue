<template>
  <div class="flex flex-col items-center justify-center h-screen text-center">
    <h1 class="text-4xl font-bold mb-4">404 - Not Found</h1>
    <p class="mb-8">Sorry, the page you are looking for does not exist.</p>
    <router-link to="/"
      class="px-6 py-3 bg-[#0eb3a0ca] hover:bg-[#67cec2ca] text-white font-semibold rounded-lg shadow-md transition duration-200">
      Go to Home
    </router-link>
  </div>
</template>

<script setup lang="ts">
// There might not be any logic here, but you can add script if needed for your needs.
</script>

<style scoped>
/* Add any additional styles here */
</style>
