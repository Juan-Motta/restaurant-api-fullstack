<script setup lang="ts">
import { getAllOrders } from '@/services/orders'
import { type Order } from '@/types/orders'
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import TableItem from '../components/TableItem.vue'
import PaginatorItem from '../components/PaginatorItem.vue'
import IsLoadingItem from '../components/IsLoadingItem.vue'
import FilterBarItem from '../components/FilterBarItem.vue'
import { getStatusClass } from '@/utils/orders'
import { formatDate } from '@/utils/date'

const { t } = useI18n()
const orders = ref<Order[]>([])

const isLoading = ref(true)
const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalItems = ref(0)

const idFilter = ref('')
const nameFilter = ref('')
const statusFilter = ref('')

const fetchOrders = async (page: number) => {
  isLoading.value = true
  try {
    const data = await getAllOrders(page, itemsPerPage.value, idFilter.value, statusFilter.value)
    orders.value = data.data
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

watch([idFilter, nameFilter, statusFilter], () => {
  currentPage.value = 1
  fetchOrders(currentPage.value)
})

onMounted(() => {
  fetchOrders(currentPage.value)
})

const formatStatus = (status: string): string => {
  const classValues = getStatusClass(status)
  return `<span v-html class="${classValues}" class="font-semibold">${t(status)}</span>`
}

const translateDate = (date: string): string => {
  const splitedDate = formatDate(date).split(' ')
  return `${t(splitedDate[0])} ${splitedDate[1]} ${splitedDate[2]} ${t(splitedDate[3])} ${splitedDate[4]} ${splitedDate[5]} ${splitedDate[6]}`
}

const clearFilters = () => {
  idFilter.value = ''
  nameFilter.value = ''
  statusFilter.value = ''
  currentPage.value = 1
  fetchOrders(currentPage.value)
}

const reload = () => {
  fetchOrders(currentPage.value)
}

const tableColumns = [
  { key: 'id', label: 'Id', hidden: true },
  { key: 'recipe.name', label: 'Name', hidden: false, translate: true },
  {
    key: 'createdAt',
    label: 'Date',
    hidden: true,
    transform: (value: string) => translateDate(value),
  },
  {
    key: 'status',
    label: 'Status',
    hidden: false,
    transform: (value: string) => formatStatus(value),
  },
]
</script>

<template>
  <div class="bg-white/50 py-5 px-5 border-shadow rounded-xl h-full flex flex-col">
    <FilterBarItem @clear="clearFilters" @reload="reload">
      <input type="text" v-model="idFilter" :placeholder="$t('filter-by-order-id')"
        class="border w-full rounded-lg py-1 px-2 border-gray-400 placeholder-gray-400 focus:border-[#00d6bcca] focus:outline-none focus:ring-0" />
      <select v-model="statusFilter"
        class="border rounded py-1 px-2 border-gray-400 placeholder-gray-400 focus:border-[#00d6bcca] focus:outline-none focus:ring-0">
        <option value="">{{ $t('all-order-statuses') }}</option>
        <option value="PREPARING">{{ $t('order-status-preparing') }}</option>
        <option value="IN_KITCHEN">{{ $t('order-status-in-kitchen') }}</option>
        <option value="FINISHED">{{ $t('order-status-finished') }}</option>
      </select>
    </FilterBarItem>

    <hr class="border-gray-200 mx-1" />

    <div v-if="isLoading" class="flex items-center justify-center h-full">
      <IsLoadingItem />
    </div>

    <div v-else class="flex-1 overflow-auto">
      <TableItem :columns="tableColumns" :data="orders" />
    </div>

    <PaginatorItem @change-page="changePage" :current-page="currentPage" :items-per-page="itemsPerPage"
      :total-items="totalItems" />
  </div>
</template>
