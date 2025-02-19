<script setup lang="ts">
import { getAllRecipes } from '@/services/recipes';
import { type Order } from '@/types/orders';
import { ref, onMounted, watch } from 'vue';

const recipes = ref<Order[]>([]);
const isLoading = ref(true);
const currentPage = ref(1);
const ordersPerPage = ref(20);
const totalOrders = ref(0);

const idRecipeFilter = ref('');
const idRecipeNameFilter = ref('');

const fetchOrders = async (page: number) => {

  isLoading.value = true;
  try {
    const params: Record<string, any> = {
      page,
      perPage: ordersPerPage.value,
    };

    if (idRecipeFilter.value) {
      params.recipeId = idRecipeFilter.value;
    }
    if (idRecipeNameFilter.value) {
      params.recipeName = idRecipeNameFilter.value;
    }

    const data = await getAllRecipes(params.page, params.perPage, params.recipeId, params.recipeName);
    recipes.value = data.data;
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

watch([idRecipeFilter, idRecipeNameFilter], () => {
  currentPage.value = 1;
  fetchOrders(currentPage.value);
});

onMounted(() => {
  fetchOrders(currentPage.value);
});
</script>

<template>
  <div class="bg-white/50 py-5 px-5 border-shadow rounded-xl h-full flex flex-col">
    <div class="mb-4 flex justify-between items-center">
      <div class="gap-4 flex">
        <input type="text" v-model="idRecipeFilter" placeholder="Filter by recipe ID"
          class="border rounded-lg py-1 px-2 border-gray-400 placeholder-gray-400 focus:border-[#00d6bcca] focus:outline-none focus:ring-0" />
        <input type="text" v-model="idRecipeNameFilter" placeholder="Filter by recipe name"
          class="border rounded-lg py-1 px-2 border-gray-400 placeholder-gray-400 focus:border-[#00d6bcca] focus:outline-none focus:ring-0" />
      </div>
      <div class="flex items-center h-full gap-4">
        <button class="bg-[#00d6bcca] h-full px-6 rounded-lg cursor-pointer">Clear</button>
        <button class="bg-[#00d6bcca] h-full px-6 rounded-lg cursor-pointer">Reload</button>
      </div>
    </div>

    <hr class="border-gray-200 mx-1">

    <div v-if="isLoading" class="flex items-center justify-center h-32">
      <span class="text-[#e04b85] font-bold">Loading...</span>
    </div>

    <div v-else class="flex-1 overflow-auto">
      <table class="min-w-full border-collapse">
        <thead>
          <tr class="text-left">
            <th class="pt-2 pb-6 px-4">Id</th>
            <th class="pt-2 pb-6 px-4 hidden md:table-cell">Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="recipe in recipes" :key="recipe.id">
            <td class="py-2 px-4">{{ recipe.id }}</td>
            <td class="py-2 px-4 hidden md:table-cell">{{ recipe.name }}</td>
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
