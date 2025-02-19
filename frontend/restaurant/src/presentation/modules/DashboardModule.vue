<script setup lang="ts">
import { ref } from 'vue';
import { createOrder } from '@/services/orders';

// Sample stats (These would come from your state management or API in a real scenario)
const ordersCreated = ref(25);
const ordersPrepared = ref(10);
const ordersInKitchen = ref(5);
const ordersFinished = ref(15);

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
  <div class="bg-white/50 py-8 px-5 border-shadow rounded-xl h-full flex flex-col items-center">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8 w-full">
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-lg font-bold mb-4 text-green-600 text-center">Orders Created</h3>
        <p class="text-4xl text-center">{{ ordersCreated }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4 text-center">
        <h3 class="text-lg font-bold mb-4 text-blue-600">Orders Prepared</h3>
        <p class="text-4xl text-center">{{ ordersPrepared }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4 text-center">
        <h3 class="text-lg font-bold mb-4 text-yellow-500">Orders in Kitchen</h3>
        <p class="text-4xl text-center">{{ ordersInKitchen }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4 text-center">
        <h3 class="text-lg font-bold mb-4 text-">Orders Finished</h3>
        <p class="text-4xl text-center">{{ ordersFinished }}</p>
      </div>
    </div>

    <!-- Button Section -->
    <div class="h-full flex items-center flex-col justify-center">
      <button @click="handleCreateOrder" :disabled="isLoading"
        class="px-6 py-3 bg-[#0eb3a0ca] hover:bg-[#67cec2ca] text-white font-semibold rounded-lg shadow-md transition duration-200 disabled:opacity-50 cursor-pointer">
        <span v-if="isLoading">Creating...</span>
        <span v-else>Create an Order</span>
      </button>
      <div v-if="successMessage" class="text-green-500 mt-4">{{ successMessage }}</div>
      <div v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>
