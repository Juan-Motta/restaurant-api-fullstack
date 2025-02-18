<script setup lang="ts">
import { ref } from 'vue';
import { createOrder } from '@/services/orders';

const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const handleCreateOrder = async () => {
  isLoading.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  try {
    const response = await createOrder();
    successMessage.value = 'Order created successfully!';
    console.log('Created Order Response:', response);
  } catch (error) {
    errorMessage.value = 'Failed to create order. Please try again.';
    console.error('Error creating order:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="bg-white/50 py-8 px-5 border-shadow rounded-xl h-full flex flex-col">
    <div class="flex items-center justify-center h-screen">
      <div class="text-center">
        <button @click="handleCreateOrder" :disabled="isLoading"
          class="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200 disabled:opacity-50">
          <span v-if="isLoading">Creating...</span>
          <span v-else>Create an Order</span>
        </button>
        <div v-if="successMessage" class="text-green-500 mt-4">{{ successMessage }}</div>
        <div v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
