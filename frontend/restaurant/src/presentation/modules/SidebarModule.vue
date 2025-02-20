<template>
  <aside
    :class="[
      'flex flex-col bg-white w-64 fixed h-full transition-transform duration-300 ease-in-out md:translate-x-0',
      { 'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen },
    ]"
  >
    <div class="mt-4 mb-4 flex flex-none justify-center">
      <div class="flex w-full items-center justify-baseline ml-8">
        <span class="mr-4">
          <RestaurantIcon />
        </span>
        <h1 class="text-lg font-semibold text-[#] text-center cursor-pointer" @click="redirectHome">
          Restaurant App
        </h1>
      </div>
    </div>
    <hr class="border-gray-200 mx-5" />
    <div class="flex flex-col grow">
      <nav class="flex-1 px-2 py-4 overflow-y-auto">
        <SidebarButton toUrl="/take-order">
          <span class="mr-2"> <OrderIcon /> </span>{{ $t('take-an-order') }}
        </SidebarButton>
        <SidebarButton toUrl="/recipes">
          <span class="mr-2">
            <AppleIcon />
          </span>
          {{ $t('recipes') }}
        </SidebarButton>
        <SidebarButton toUrl="/storage">
          <span class="mr-2"> <StoreIcon /> </span>{{ $t('storage-items') }}
        </SidebarButton>
        <SidebarButton toUrl="/orders">
          <span class="mr-2"> <CoinIcon /> </span>{{ $t('historical-orders') }}
        </SidebarButton>
        <SidebarButton toUrl="/buys">
          <span class="mr-2"> <CartIcon /> </span>{{ $t('historical-buys') }}
        </SidebarButton>
      </nav>
      <hr class="border-gray-200 mx-5" />
      <div class="py-4 px-6 flex-none">
        <SidebarUserItem />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import OrderIcon from '@/presentation/icons/OrderIcon.vue'
import AppleIcon from '@/presentation/icons/AppleIcon.vue'
import StoreIcon from '@/presentation/icons/StoreIcon.vue'
import CoinIcon from '@/presentation/icons/CoinIcon.vue'
import CartIcon from '@/presentation/icons/CartIcon.vue'
import RestaurantIcon from '@/presentation/icons/RestaurantIcon.vue'

import SidebarButton from '../components/SidebarButton.vue'
import SidebarUserItem from '../components/SidebarUserItem.vue'

defineProps({
  isSidebarOpen: Boolean,
})

const router = useRouter()

const redirectHome = () => {
  router.push('/take-order')
}
</script>

<style scoped></style>
