<script setup lang="ts">
import { getAllRecipes } from '@/services/recipes'
import { type Recipe } from '@/types/recipes'
import { ref, onMounted, watch } from 'vue'

import RecipeCardItem from '../components/RecipeCardItem.vue'
import PaginatorItem from '../components/PaginatorItem.vue'
import IsLoadingItem from '../components/IsLoadingItem.vue'
import FilterBarItem from '../components/FilterBarItem.vue'

const recipes = ref<Recipe[]>([])

const isLoading = ref(true)
const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalItems = ref(0)

const idRecipeFilter = ref('')
const idRecipeNameFilter = ref('')

const fetchOrders = async (page: number) => {
  isLoading.value = true
  try {
    const data = await getAllRecipes(
      page,
      itemsPerPage.value,
      idRecipeFilter.value,
      idRecipeNameFilter.value,
    )
    recipes.value = data.data
    totalItems.value = data.total
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    isLoading.value = false
  }
}

const changePage = (page: number) => {
  currentPage.value = page
  fetchOrders(currentPage.value)
}

watch([idRecipeFilter, idRecipeNameFilter], () => {
  currentPage.value = 1
  fetchOrders(currentPage.value)
})

onMounted(() => {
  fetchOrders(currentPage.value)
})

const clearFilters = () => {
  idRecipeFilter.value = ''
  idRecipeNameFilter.value = ''
  currentPage.value = 1
  fetchOrders(currentPage.value)
}

const reload = () => {
  fetchOrders(currentPage.value)
}
</script>

<template>
  <div class="bg-white/50 py-5 px-5 border-shadow rounded-xl h-full flex flex-col">
    <FilterBarItem @clear="clearFilters" @reload="reload">
      <input
        type="text"
        v-model="idRecipeFilter"
        :placeholder="$t('filter-by-recipe-id')"
        class="border w-full rounded-lg py-1 px-2 border-gray-400 placeholder-gray-400 focus:border-[#00d6bcca] focus:outline-none focus:ring-0"
      />
      <input
        type="text"
        v-model="idRecipeNameFilter"
        :placeholder="$t('filter-by-recipe-name')"
        class="border w-full rounded-lg py-1 px-2 border-gray-400 placeholder-gray-400 focus:border-[#00d6bcca] focus:outline-none focus:ring-0"
      />
    </FilterBarItem>

    <hr class="border-gray-200 mx-1" />

    <div v-if="isLoading" class="flex items-center justify-center h-full">
      <IsLoadingItem />
    </div>

    <div v-else class="flex-1 mt-4 overflow-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecipeCardItem
          v-for="recipe in recipes"
          :key="recipe.id"
          :name="recipe.name"
          :imageUrl="recipe.imageUrl"
          :ingredients="recipe.ingredients"
        />
      </div>
    </div>

    <PaginatorItem
      @change-page="changePage"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      :total-items="totalItems"
    />
  </div>
</template>
