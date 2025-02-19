<script setup lang="ts">
import { getAllRecipes } from '@/services/recipes';
import { type Order } from '@/types/orders';
import { clear } from 'console';
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

const clearFilters = () => {
  idRecipeFilter.value = '';
  idRecipeNameFilter.value = '';
  currentPage.value = 1;
  fetchOrders(currentPage.value);
}

const reload = () => {
  fetchOrders(currentPage.value);
}

</script>

<template>
  <div class="bg-white/50 py-5 px-5 border-shadow rounded-xl h-full flex flex-col">
    <div class="mb-4 flex justify-between items-center flex-col md:flex-row gap-4">
      <div class="gap-4 flex flex-col md:flex-row w-full">
        <input type="text" v-model="idRecipeFilter" placeholder="Filter by recipe ID"
          class="border w-full rounded-lg py-1 px-2 border-gray-400 placeholder-gray-400 focus:border-[#00d6bcca] focus:outline-none focus:ring-0" />
        <input type="text" v-model="idRecipeNameFilter" placeholder="Filter by recipe name"
          class="border w-full rounded-lg py-1 px-2 border-gray-400 placeholder-gray-400 focus:border-[#00d6bcca] focus:outline-none focus:ring-0" />
      </div>
      <div class="flex items-center h-full gap-4 w-full md:w-min flex-col sm:flex-row mt-5 mb-1 md:mt-0 md:mb-0">
        <button class="bg-[#00d6bcca] h-full w-full md:w-min px-6 rounded-lg cursor-pointer"
          @click="clearFilters">Clear</button>
        <button class="bg-[#00d6bcca] h-full w-full md:w-min px-6 rounded-lg cursor-pointer"
          @click="reload">Reload</button>
      </div>
    </div>

    <hr class="border-gray-200 mx-1">

    <div v-if="isLoading" class="flex items-center justify-center h-full">
      <span class="font-bold text-xl">Loading...</span>
    </div>

    <div v-else class="flex-1 mt-4 overflow-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="bg-white shadow-md rounded-lg flex items-center" v-for="recipe in recipes" :key="recipe.id">
          <div class="w-1/2 h-full">
            <img :src="recipe.imageUrl" alt="Recipe Image" class="object-cover rounded-l-lg h-full" />
          </div>
          <div class="p-4 flex-1"> <!-- Add padding here instead -->
            <h3 class="font-semibold text-lg">{{ recipe.name }}</h3>
            <div>
              <hr class="border-gray-200 mx-1 my-2">
              <p v-for="ingredient in recipe.ingredients" :key="ingredient.id">
                <span class="font-semibold">{{ ingredient.quantity }}</span> {{ ingredient.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
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
