<script setup lang="ts">
import { ref } from 'vue';
import { createOrder } from '@/services/orders';
import ButtonItem from '../components/ButtonItem.vue';
import DashboardCardItem from '../components/DashboardCardItem.vue';

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
    successMessage.value = 'order-created-succesfully';
    console.log('Created Order Response:', response);
  } catch (error) {
    errorMessage.value = 'order-created-failed';
    console.error('Error creating order:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="bg-white/50 py-8 px-5 border-shadow rounded-xl h-full flex flex-col items-center">

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8 w-full">
      <DashboardCardItem title="orders-created" :value="ordersCreated" color="text-green-600" />
      <DashboardCardItem title="orders-prepared" :value="ordersPrepared" color="text-blue-600" />
      <DashboardCardItem title="orders-in-kitchen" :value="ordersInKitchen" color="text-yellow-500" />
      <DashboardCardItem title="orders-finished" :value="ordersFinished" color="text-red-600" />
    </div>

    <div class="h-full flex items-center flex-col justify-center">
      <ButtonItem :isLoading="isLoading" :errorMessage="errorMessage" :successMessage="successMessage"
        @on-click="handleCreateOrder" />
    </div>
  </div>
</template>
