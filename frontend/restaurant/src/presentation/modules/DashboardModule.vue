<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { createOrder, getOrderStatusResume } from '@/services/orders'
import ButtonItem from '../components/ButtonItem.vue'
import DashboardCardItem from '../components/DashboardCardItem.vue'

const ordersCreated = ref('-')
const ordersPrepared = ref('-')
const ordersInKitchen = ref('-')
const ordersFinished = ref('-')

const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const fetchOrdersResume = async () => {
  try {
    const response = await getOrderStatusResume();
    const preparedData = response.filter((order) => order.status === 'PREPARED');
    const inKitchenData = response.filter((order) => order.status === 'IN_KITCHEN');
    const finishedData = response.filter((order) => order.status === 'FINISHED');

    // Update the counts only when different
    const newOrdersCreated = finishedData.length ? String(finishedData[0].totalCount) : '0';
    const newOrdersPrepared = preparedData.length ? String(preparedData[0].count) : '0';
    const newOrdersInKitchen = inKitchenData.length ? String(inKitchenData[0].count) : '0';
    const newOrdersFinished = finishedData.length ? String(finishedData[0].count) : '0';

    if (newOrdersCreated !== ordersCreated.value) {
      ordersCreated.value = newOrdersCreated;
    }
    if (newOrdersPrepared !== ordersPrepared.value) {
      ordersPrepared.value = newOrdersPrepared;
    }
    if (newOrdersInKitchen !== ordersInKitchen.value) {
      ordersInKitchen.value = newOrdersInKitchen;
    }
    if (newOrdersFinished !== ordersFinished.value) {
      ordersFinished.value = newOrdersFinished;
    }
  } catch (error) {
    console.error('Error fetching orders resume:', error);
  }
};

const handleCreateOrder = async () => {
  isLoading.value = true
  errorMessage.value = null
  successMessage.value = null

  try {
    const response = await createOrder()
    successMessage.value = 'order-created-succesfully'
    console.log('Created Order Response:', response)
  } catch (error) {
    errorMessage.value = 'order-created-failed'
    console.error('Error creating order:', error)
  } finally {
    isLoading.value = false
  }
  try {
    await fetchOrdersResume()
  } catch (error) {
    console.error('Error creating order:', error)
  }
}

let intervalId: number;

onMounted(() => {
  fetchOrdersResume()
  intervalId = window.setInterval(fetchOrdersResume, 10000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div class="bg-white/50 py-8 px-5 border-shadow rounded-xl h-full flex flex-col items-center">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8 w-full">
      <DashboardCardItem class="card-transition" title="orders-created" :value="ordersCreated" color="text-green-600" />
      <DashboardCardItem class="card-transition" title="orders-prepared" :value="ordersPrepared" color="text-blue-600" />
      <DashboardCardItem
        class="card-transition"
        title="orders-in-kitchen"
        :value="ordersInKitchen"
        color="text-yellow-500"
      />
      <DashboardCardItem class="card-transition" title="orders-finished" :value="ordersFinished" color="text-red-600" />
    </div>

    <div class="h-full flex items-center flex-col justify-center">
      <ButtonItem
        :isLoading="isLoading"
        :errorMessage="errorMessage"
        :successMessage="successMessage"
        @on-click="handleCreateOrder"
      />
    </div>
  </div>
</template>

<style scoped>
.card-transition {
  transition: all 0.3s ease;
}
</style>
