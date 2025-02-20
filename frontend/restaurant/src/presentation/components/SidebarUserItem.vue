<template>
  <div class="flex justify-between items-center">
    <div class="flex items-center">
      <img class="w-8 h-8 rounded-full" src="/avatar.jpg" alt="User avatar" />
      <div class="ml-4">
        <p class="text-sm font-medium text-gray-700">{{ getUserData().name }}</p>
        <button
          @click="logout"
          class="text-xs font-medium text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          {{ $t('logout') }}
        </button>
      </div>
    </div>
    <div class="mr-4">
      <LangButtonItem />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import LangButtonItem from '../components/LangButtonItem.vue'

const router = useRouter()
const { getUserData } = useUserStore()

const logout = () => {
  localStorage.removeItem('jwt')
  router.push('/login')
}
</script>
