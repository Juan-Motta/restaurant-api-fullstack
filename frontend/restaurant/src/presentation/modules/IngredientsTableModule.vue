<script setup lang="ts">
import { getAllIngredients } from '@/services/storage';
import { type Order } from '@/types/orders';
import { ref, onMounted, watch } from 'vue';

const ingredients = ref<Order[]>([]);
const isLoading = ref(true);
const currentPage = ref(1);
const ordersPerPage = ref(20);
const totalOrders = ref(0);

const idIngredientFilter = ref('');
const idIngredientNameFilter = ref('');

const fetchOrders = async (page: number) => {

  isLoading.value = true;
  try {
    const params: Record<string, any> = {
      page,
      perPage: ordersPerPage.value,
    };

    if (idIngredientFilter.value) {
      params.ingredientId = idIngredientFilter.value;
    }
    if (idIngredientNameFilter.value) {
      params.ingredientName = idIngredientNameFilter.value;
    }

    const data = await getAllIngredients(params.page, params.perPage, params.ingredientId, params.ingredientName);
    ingredients.value = data.data;
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

watch([idIngredientFilter, idIngredientNameFilter], () => {
  currentPage.value = 1;
  fetchOrders(currentPage.value);
});

onMounted(() => {
  fetchOrders(currentPage.value);
});
</script>

<template>
  <div class="bg-white/50 py-8 px-5 border-shadow rounded-xl h-full flex flex-col">
    <div class="mb-4">
      <input type="text" v-model="idIngredientFilter" placeholder="Filter by ingredient ID"
        class="border rounded p-2 mr-2" />
      <input type="text" v-model="idIngredientNameFilter" placeholder="Filter by ingredient name"
        class="border rounded p-2 mr-2" />
    </div>

    <div v-if="isLoading" class="flex items-center justify-center h-32">
      <span class="text-[#e04b85] font-bold">Loading...</span>
    </div>

    <div v-else class="flex-1 overflow-auto">
      <table class="min-w-full border-collapse">
        <thead>
          <tr class="text-left">
            <th class="pt-2 pb-6 px-4">Id</th>
            <th class="pt-2 pb-6 px-4 hidden md:table-cell">Name</th>
            <th class="pt-2 pb-6 px-4 hidden md:table-cell">Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ingredient in ingredients" :key="ingredient.id">
            <td class="py-2 px-4">{{ ingredient.id }}</td>
            <td class="py-2 px-4 hidden md:table-cell">{{ ingredient.name }}</td>
            <td class="py-2 px-4 hidden md:table-cell">{{ ingredient.quantity }}</td>
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
