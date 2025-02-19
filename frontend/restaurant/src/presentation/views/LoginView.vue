<template>
  <div class="flex h-full">
    <div class="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24">
      <h1 class="text-3xl font-bold mb-8">Login</h1>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <input type="email" v-model="email" placeholder="Email" required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div>
          <input type="password" v-model="password" placeholder="Password" required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <button type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">Login</button>
      </form>
      <a href="#" class="text-blue-500 hover:underline mt-4 inline-block">Reset Password</a>
      <button class="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300 mt-4">Login
        with Google</button>
    </div>
    <div class="md:w-1/2 bg-cover bg-center hidden md:flex" style="background-image: url('/restaurant.webp');">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
      email: email.value,
      password: password.value
    });

    const { accessToken } = response.data;

    localStorage.setItem('jwt', accessToken);

    router.push('/take-order');
  } catch (error) {
    console.error('Login failed:', error);
    alert('Login failed. Please check your credentials.');
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style>
