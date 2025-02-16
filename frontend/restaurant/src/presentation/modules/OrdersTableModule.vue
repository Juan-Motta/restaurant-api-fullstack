<script setup lang="ts">
import { getAllOrders } from '@/services/orders';
import { type Order } from '@/types/orders';
import { ref, onMounted } from 'vue';

const orders = ref<Order[]>([]);
const isLoading = ref(true);

const fetchOrders = async () => {
  try {
    const data = await getAllOrders();
    orders.value = data;
  } catch (error) {
    console.error('Error fetching orders:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchOrders();
});

</script>

<template>
  <div class="bg-white/50 py-8 px-5 border-shadow rounded-xl">
    <div v-if="isLoading" class="flex items-center justify-center h-32">
      <span class="text-[#e04b85] font-bold">Loading...</span>
    </div>

    <table v-else class="min-w-full border-collapse">
      <thead>
        <tr class="text-left">
          <th class="pt-2 pb-6 px-4">Id</th>
          <th class="pt-2 pb-6 px-4 hidden md:table-cell">Name</th>
          <th class="pt-2 pb-6 px-4">Date</th>
          <th class="pt-2 pb-6 px-4 hidden md:table-cell">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td class="py-2 px-4">{{ order.id }}</td>
          <td class="py-2 px-4 hidden md:table-cell">{{ order.name }}</td>
          <td class="py-2 px-4">{{ order.date }}</td>
          <td class="py-2 px-4 hidden md:table-cell">{{ order.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
