<script setup lang="ts">
import { getAllBuys } from '@/services/buys'
import { type Buy } from '@/types/buys'
import { ref, onMounted, watch } from 'vue'
import TableItem from '../components/TableItem.vue'
import PaginatorItem from '../components/PaginatorItem.vue'
import IsLoadingItem from '../components/IsLoadingItem.vue'
import FilterBarItem from '../components/FilterBarItem.vue'

const buys = ref<Buy[]>([])

const isLoading = ref(true)

const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalItems = ref(0)

const idBuyFilter = ref('')
const idIngredientFilter = ref('')
const idIngredientNameFilter = ref('')

const fetchOrders = async (page: number) => {
  isLoading.value = true
  try {
    const data = await getAllBuys(
      page,
      itemsPerPage.value,
      idBuyFilter.value,
      idIngredientFilter.value,
      idIngredientNameFilter.value,
    )
    buys.value = data.data
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

watch([idBuyFilter, idIngredientFilter, idIngredientNameFilter], () => {
  currentPage.value = 1
  fetchOrders(currentPage.value)
})

onMounted(() => {
  fetchOrders(currentPage.value)
})

const clearFilters = () => {
  idBuyFilter.value = ''
  idIngredientFilter.value = ''
  idIngredientNameFilter.value = ''
  currentPage.value = 1
  fetchOrders(currentPage.value)
}

const reload = () => {
  fetchOrders(currentPage.value)
}

const tableColumns = [
  { key: 'id', label: 'Id', hidden: true },
  { key: 'ingredient.id', label: 'Ingredient Id', hidden: true },
  { key: 'ingredient.name', label: 'Ingredient Name', hidden: false, translate: true },
  { key: 'quantity', label: 'Quantity', hidden: false },
]
</script>

<template>
  <div class="bg-white/50 py-5 px-5 border-shadow rounded-xl h-full flex flex-col">
    <FilterBarItem @clear="clearFilters" @reload="reload">
      <input
        type="text"
        v-model="idBuyFilter"
        :placeholder="$t('filter-by-buy-id')"
        class="border w-full rounded-lg py-1 px-2 border-gray-400 placeholder-gray-400 focus:border-[#00d6bcca] focus:outline-none focus:ring-0"
      />
      <input
        type="text"
        v-model="idIngredientFilter"
        :placeholder="$t('filter-by-ingredient-id')"
        class="border w-full rounded-lg py-1 px-2 border-gray-400 placeholder-gray-400 focus:border-[#00d6bcca] focus:outline-none focus:ring-0"
      />
      <input
        type="text"
        v-model="idIngredientNameFilter"
        :placeholder="$t('filter-by-ingredient-name')"
        class="border w-full rounded-lg py-1 px-2 border-gray-400 placeholder-gray-400 focus:border-[#00d6bcca] focus:outline-none focus:ring-0"
      />
    </FilterBarItem>

    <hr class="border-gray-200 mx-1" />

    <div v-if="isLoading" class="flex items-center justify-center h-full">
      <IsLoadingItem />
    </div>

    <div v-else class="flex-1 overflow-auto">
      <TableItem :columns="tableColumns" :data="buys" />
    </div>

    <PaginatorItem
      @change-page="changePage"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      :total-items="totalItems"
    />
  </div>
</template>
