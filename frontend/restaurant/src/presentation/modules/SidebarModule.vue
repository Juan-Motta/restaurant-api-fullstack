<template>
  <aside :class="[
    'flex flex-col bg-white w-64 fixed h-full transition-transform duration-300 ease-in-out md:translate-x-0',
    { 'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen }
  ]">
    <div class="mt-4 mb-4 flex flex-none justify-center">
      <h1 class="text-lg font-semibold text-gray-900 text-center">Restaurant</h1>
    </div>
    <div class="flex flex-col grow">
      <nav class="flex-1 px-2 py-4 overflow-y-auto">
        <RouterLink to="/take-order"
          class="block px-6 py-2 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-200">
          Realiza una orden</RouterLink>
        <RouterLink to="/recipes"
          class="block px-6 py-2 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-200">
          Recetas</RouterLink>
        <RouterLink to="/storage"
          class="block px-6 py-2 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-200">
          Bodega</RouterLink>
        <RouterLink to="/orders" class="block px-6 py-2 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-200">
          Historial de pedidos</RouterLink>
        <RouterLink to="/buys" class="block px-6 py-2 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-200">
          Historial de compras</RouterLink>
      </nav>
      <div class="p-4 border-t border-gray-200 flex-none">
        <div class="flex items-center">
          <img class="w-8 h-8 rounded-full" src="/public/favicon.ico" alt="User avatar">
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-700">Username</p>
            <button @click="logout" class="text-xs font-medium text-gray-500 hover:text-gray-700">Logout</button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

defineProps({
  isSidebarOpen: Boolean,
});

const router = useRouter();

const logout = () => {
  localStorage.removeItem('jwt');
  router.push('/login');
};
</script>

<style scoped></style>
