<script setup lang="ts">
import { getAllIngredients } from '@/services/storage';
import { type Ingredient } from '@/types/ingredients'
import { ref, onMounted, watch } from 'vue';

import IngredientCardItem from '../components/IngredientCardItem.vue';
import PaginatorItem from '../components/PaginatorItem.vue';
import IsLoadingItem from '../components/IsLoadingItem.vue';
import FilterBarItem from '../components/FilterBarItem.vue';

const ingredients = ref<Ingredient[]>([]);

const isLoading = ref(true);

const currentPage = ref(1);
const itemsPerPage = ref(20);
const totalItems = ref(0);

const idIngredientFilter = ref('');
const idIngredientNameFilter = ref('');

const fetchOrders = async (page: number) => {
  isLoading.value = true;
  try {
    const data = await getAllIngredients(page, itemsPerPage.value, idIngredientFilter.value, idIngredientNameFilter.value);
    ingredients.value = data.data;
    totalItems.value = data.total;
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

const clearFilters = () => {
  idIngredientFilter.value = '';
  idIngredientNameFilter.value = '';
  currentPage.value = 1;
  fetchOrders(currentPage.value);
}

const reload = () => {
  fetchOrders(currentPage.value);
}
</script>

<template>
  <div class="bg-white/50 py-5 px-5 border-shadow rounded-xl h-full flex flex-col">
    <FilterBarItem @clear="clearFilters" @reload="reload">
      <input type="text" v-model="idIngredientFilter" :placeholder="$t('filter-by-ingredient-id')"
        class="border w-full rounded-lg py-1 px-2 border-gray-400 placeholder-gray-400 focus:border-[#00d6bcca] focus:outline-none focus:ring-0" />
      <input type="text" v-model="idIngredientNameFilter" :placeholder="$t('filter-by-ingredient-name')"
        class="border w-full rounded-lg py-1 px-2 border-gray-400 placeholder-gray-400 focus:border-[#00d6bcca] focus:outline-none focus:ring-0" />
    </FilterBarItem>

    <hr class="border-gray-200 mx-1">

    <div v-if="isLoading" class="flex items-center justify-center h-full">
      <IsLoadingItem />
    </div>

    <div v-else class="flex-1 mt-4 overflow-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IngredientCardItem v-for="ingredient in ingredients" :key="ingredient.id" :name="ingredient.name"
          :imageUrl="ingredient.imageUrl" :quantity="ingredient.quantity" />
      </div>
    </div>

    <PaginatorItem @change-page="changePage" :current-page=currentPage :items-per-page=itemsPerPage
      :total-items=totalItems />
  </div>
</template>
