<template>
  <aside :class="[
    'flex flex-col bg-white w-64 fixed h-full transition-transform duration-300 ease-in-out md:translate-x-0',
    { 'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen }
  ]">
    <div class="mt-4 mb-4 flex flex-none justify-center">
      <div class="flex w-full items-center justify-baseline ml-8">
        <span class="mr-4">
          <RestaurantIcon />
        </span>
        <h1 class="text-lg font-semibold text-[#] text-center cursor-pointer" @click="redirectHome">Restaurant App</h1>
      </div>
    </div>
    <hr class="border-gray-200 mx-5">
    <div class="flex flex-col grow">
      <nav class="flex-1 px-2 py-4 overflow-y-auto">
        <RouterLink to="/take-order"
          class="flex my-1 mx-3 px-3 py-2 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-200 items-center"
          activeClass="bg-[#00d6bcca] border-shadow">
          <span class="mr-2">
            <OrderIcon />
          </span>{{ $t('take-an-order') }}
        </RouterLink>
        <RouterLink to="/recipes"
          class="flex mx-3 my-1 px-3 py-2 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-200 items-center"
          activeClass="bg-[#00d6bcca] border-shadow">
          <span class="mr-2">
            <AppleIcon />
          </span> {{ $t('recipes') }}
        </RouterLink>
        <RouterLink to="/storage"
          class="flex mx-3 px-3 my-1 py-2 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-200 items-center"
          activeClass="bg-[#00d6bcca] border-shadow">
          <span class="mr-2">
            <StoreIcon />
          </span>{{ $t('storage-items') }}
        </RouterLink>
        <RouterLink to="/orders"
          class="flex mx-3 px-3 py-2 my-1 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-200 items-center"
          activeClass="bg-[#00d6bcca] border-shadow">
          <span class="mr-2">
            <CoinIcon />
          </span>{{ $t('historical-orders') }}
        </RouterLink>
        <RouterLink to="/buys"
          class="flex mx-3 px-3 py-2 my-1 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-200 items-center"
          activeClass="bg-[#00d6bcca] border-shadow">
          <span class="mr-2">
            <CartIcon />
          </span>{{ $t('historical-buys') }}
        </RouterLink>
      </nav>
      <hr class="border-gray-200 mx-5">
      <div class="py-4 px-6 flex-none">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <img class="w-8 h-8 rounded-full" src="/avatar.jpg" alt="User avatar">
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-700">{{ getUserData().name }}</p>
              <button @click="logout" class="text-xs font-medium text-gray-500 hover:text-gray-700 cursor-pointer">{{
                $t('logout') }}</button>
            </div>
          </div>
          <div class="mr-4">
            <LangButtonItem />
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import OrderIcon from '@/presentation/icons/OrderIcon.vue';
import AppleIcon from '@/presentation/icons/AppleIcon.vue';
import StoreIcon from '@/presentation/icons/StoreIcon.vue';
import CoinIcon from '@/presentation/icons/CoinIcon.vue';
import CartIcon from '@/presentation/icons/CartIcon.vue';
import RestaurantIcon from '@/presentation/icons/RestaurantIcon.vue';
import { useUserStore } from '@/stores/user'
import LangButtonItem from '../components/LangButtonItem.vue';

defineProps({
  isSidebarOpen: Boolean,
});

const router = useRouter();
const { getUserData } = useUserStore();


const logout = () => {
  localStorage.removeItem('jwt');
  router.push('/login');
};

const redirectHome = () => {
  router.push('/take-order');
}
</script>

<style scoped></style>
