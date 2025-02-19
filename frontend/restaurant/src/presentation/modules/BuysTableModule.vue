<script setup lang="ts">
import { getAllBuys } from '@/services/buys';
import { type Order } from '@/types/orders';
import { ref, onMounted, watch } from 'vue';

const buys = ref<Order[]>([]);
const isLoading = ref(true);
const currentPage = ref(1);
const ordersPerPage = ref(20);
const totalOrders = ref(0);

const idBuyFilter = ref('');
const idIngredientFilter = ref('');
const idIngredientNameFilter = ref('');

const fetchOrders = async (page: number) => {

  isLoading.value = true;
  try {
    const params: Record<string, any> = {
      page,
      perPage: ordersPerPage.value,
    };

    if (idBuyFilter.value) {
      params.buyId = idBuyFilter.value;
    }
    if (idIngredientFilter.value) {
      params.ingredientId = idIngredientFilter.value;
    }
    if (idIngredientNameFilter.value) {
      params.ingredientName = idIngredientNameFilter.value;
    }

    const data = await getAllBuys(params.page, params.perPage, params.buyId, params.ingredientId, params.ingredientName);
    buys.value = data.data;
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

watch([idBuyFilter, idIngredientFilter, idIngredientNameFilter], () => {
  currentPage.value = 1;
  fetchOrders(currentPage.value);
});

onMounted(() => {
  fetchOrders(currentPage.value);
});
</script>

<template>
  <div class="bg-white/50 py-5 px-5 border-shadow rounded-xl h-full flex flex-col">
    <div class="mb-4 flex justify-between items-center flex-col md:flex-row gap-4">
      <div class="gap-4 flex flex-col md:flex-row w-full">
        <input type="text" v-model="idBuyFilter" placeholder="Filter by buy ID"
          class="border w-full rounded-lg py-1 px-2 border-gray-400 placeholder-gray-400 focus:border-[#00d6bcca] focus:outline-none focus:ring-0" />
        <input type="text" v-model="idIngredientFilter" placeholder="Filter by ingredient ID"
          class="border w-full rounded-lg py-1 px-2 border-gray-400 placeholder-gray-400 focus:border-[#00d6bcca] focus:outline-none focus:ring-0" />
        <input type="text" v-model="idIngredientNameFilter" placeholder="Filter by ingredient name"
          class="border w-full rounded-lg py-1 px-2 border-gray-400 placeholder-gray-400 focus:border-[#00d6bcca] focus:outline-none focus:ring-0" />
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
            <th class="pt-2 pb-6 px-4 hidden md:table-cell">Ingredient Id</th>
            <th class="pt-2 pb-6 px-4">Ingredient Name</th>
            <th class="pt-2 pb-6 px-4">Quantity</th>
          </tr>
        </thead>
        <tbody class="text-center">
          <tr v-for="buy in buys" :key="buy.id">
            <td class="py-2 px-4 hidden md:table-cell">{{ buy.id }}</td>
            <td class="py-2 px-4 hidden md:table-cell">{{ buy.ingredient.id }}</td>
            <td class="py-2 px-4">{{ buy.ingredient.name }}</td>
            <td class="py-2 px-4">{{ buy.quantity }}</td>
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
