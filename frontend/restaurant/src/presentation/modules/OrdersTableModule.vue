<script setup lang="ts">
import { getAllOrders } from '@/services/orders';
import { type Order } from '@/types/orders';
import { ref, onMounted, watch } from 'vue';

const orders = ref<Order[]>([]);
const isLoading = ref(true);
const currentPage = ref(1);
const ordersPerPage = ref(20);
const totalOrders = ref(0);

const idFilter = ref('');
const nameFilter = ref('');
const statusFilter = ref('');

const fetchOrders = async (page: number) => {

  isLoading.value = true;
  try {
    const params: Record<string, any> = {
      page,
      perPage: ordersPerPage.value,
    };

    if (idFilter.value) {
      params.orderId = idFilter.value;
    }
    if (statusFilter.value) {
      params.orderStatus = statusFilter.value;
    }

    const data = await getAllOrders(params.page, params.perPage, params.orderId, params.orderStatus);
    orders.value = data.data;
    totalOrders.value = data.total;
  } catch (error) {
    console.error('Error fetching orders:', error);
  } finally {
    isLoading.value = false;
  }
};

const changePage = (page: number) => {
  currentPage.value = page;
  fetchOrders(currentPage.value);
};

watch([idFilter, nameFilter, statusFilter], () => {
  currentPage.value = 1;
  fetchOrders(currentPage.value);
});

onMounted(() => {
  fetchOrders(currentPage.value);
});

const getStatusClass = (status) => {
  switch (status) {
    case 'FINISHED':
      return 'bg-green-200 text-green-800 px-4 py-1 rounded-xl font-semibold';
    case 'PREPARING':
      return 'bg-yellow-200 text-yellow-800 px-4 py-1 rounded-xl font-semibold';
    case 'IN_KITCHEN':
      return 'bg-blue-200 text-blue-800 px-4 py-1 rounded-xl font-semibold';
    default:
      return 'bg-gray-200 text-gray-800 px-4 py-1 rounded-xl font-semibold';
  }
}

const formatDate = (isoDate) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  };
  return new Date(isoDate).toLocaleString(undefined, options);
}
</script>

<template>
  <div class="bg-white/50 py-5 px-5 border-shadow rounded-xl h-full flex flex-col">
    <div class="mb-4 flex justify-between items-center flex-col md:flex-row gap-4">
      <div class="gap-4 flex flex-col md:flex-row w-full">
        <input type="text" v-model="idFilter" placeholder="Filter by ID"
          class="border w-full rounded-lg py-1 px-2 border-gray-400 placeholder-gray-400 focus:border-[#00d6bcca] focus:outline-none focus:ring-0" />
        <select v-model="statusFilter" class="border rounded p-2 border-gray-400 placeholder-gray-400">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>
      <div class="flex items-center h-full gap-4 w-full md:w-min flex-col sm:flex-row mt-5 mb-1 md:mt-0 md:mb-0">
        <button class="bg-[#00d6bcca] h-full w-full md:w-min px-6 rounded-lg cursor-pointer">Clear</button>
        <button class="bg-[#00d6bcca] h-full w-full md:w-min px-6 rounded-lg cursor-pointer">Reload</button>
      </div>
    </div>

    <hr class="border-gray-200 mx-1">

    <div v-if="isLoading" class="flex items-center justify-center h-full">
      <span class="font-bold text-xl">Loading...</span>
    </div>

    <div v-else class="flex-1 overflow-auto">
      <table class="min-w-full border-collapse">
        <thead>
          <tr class="text-center">
            <th class="pt-2 pb-6 px-4 hidden md:table-cell">Id</th>
            <th class="pt-2 pb-6 px-4">Name</th>
            <th class="pt-2 pb-6 px-4 hidden md:table-cell">Date</th>
            <th class="pt-2 pb-6 px-4">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id" class="text-center">
            <td class="py-2 px-4 text-center hidden md:table-cell">{{ order.id }}</td>
            <td class="py-2 px-4">{{ order.recipe.name }}</td>
            <td class="py-2 px-4 hidden md:table-cell">{{ formatDate(order.createdAt) }}</td>
            <td class="py-2 px-4 flex justify-center"><span :class="getStatusClass(order.status)" class="font-semibold">
                {{ order.status }}
              </span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-5 flex justify-between">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
        Previous
      </button>
      <span class="self-center">Page {{ currentPage }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="(currentPage * ordersPerPage) >= totalOrders"
        class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
        Next
      </button>
    </div>
  </div>
</template>
