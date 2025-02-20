<template>
  <div class="flex h-full">
    <div class="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24">
      <h1 class="text-3xl font-bold mb-8">Login</h1>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <input
            type="email"
            v-model="email"
            placeholder="Email"
            required
            autocomplete="email"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
          />
        </div>
        <div>
          <input
            type="password"
            v-model="password"
            placeholder="Password"
            required
            autocomplete="current-password"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-[#0eb3a0ca] text-white font-semibold py-2 rounded-md hover:bg-[#67cec2ca] transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
    <div
      class="md:w-1/2 bg-cover bg-center hidden md:flex"
      style="background-image: url('/restaurant.webp')"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/login'

const email = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const response = await login(email.value, password.value)
    localStorage.setItem('jwt', response.accessToken)
    router.push('/take-order')
  } catch (error) {
    console.error('Login failed:', error)
    alert('Login failed. Please check your credentials.')
  }
}
</script>
