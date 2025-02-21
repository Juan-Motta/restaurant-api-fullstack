<template>
  <div class="flex h-dvh">
    <div class="w-full h-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24">
      <h1 class="text-3xl font-bold mb-8">{{ $t('users-registration') }}</h1>
      <form @submit.prevent="handleCreate" class="space-y-4">
        <div>
          <input type="name" v-model="name" :placeholder="$t('name')" required autocomplete="name"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300" />
        </div>
        <div>
          <input type="email" v-model="email" :placeholder="$t('email')" required autocomplete="email"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300" />
        </div>
        <div>
          <input type="password" v-model="password" :placeholder="$t('password')" required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300" />
        </div>
        <div>
          <input type="password" v-model="confirmPassword" :placeholder="$t('password-confirmation')" required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300" />
        </div>
        <button type="submit"
          :disabled="isLoading"
          class="w-full bg-[#0eb3a0ca] text-white font-semibold py-2 rounded-md hover:bg-[#67cec2ca] transition duration-300 cursor-pointer">
          <span v-if="isLoading">{{ $t('creating-user') }}</span>
          <span v-else>{{ $t('create-user') }}</span>
        </button>
      </form>
      <button @click="backHome"
          class="w-full bg-gray-300 text-white font-semibold py-2 rounded-md hover:bg-[#67cec2ca] transition duration-300 mt-5 cursor-pointer">
          {{ $t('back-to-login') }}
        </button>
    </div>
    <div class="md:w-1/2 bg-cover bg-center hidden md:flex" style="background-image: url('/restaurant.webp')"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '@/services/login'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const isLoading = ref(false)

const router = useRouter()

const validatePassword = () => {
  if (password.value !== confirmPassword.value) {
    alert(t('passwords-must-match'))
    return false
  }
  if (password.value.length < 6) {
    alert(t('password-must-be-at-least-6-characters'))
    return false
  }
  return true
}

const validateEmail = () => {
  if (!email.value.includes('@')) {
    alert(t('invalid-email'))
    return false
  }
  return true
}

const validateName = () => {
  if (name.value.length < 3) {
    alert(t('name-must-be-at-least-3-characters'))
    return false
  }
  return true
}

const backHome = () => {
  router.push('/login')
}

const handleCreate = async () => {
  isLoading.value = true
  try {
    if (!validatePassword() || !validateName() || !validateEmail()) {
      isLoading.value = true
      return
    }
    await registerUser(name.value, email.value, password.value, confirmPassword.value)
    isLoading.value = false
    router.push('/login')
  } catch (error) {
    console.error('Login failed:', error)
    isLoading.value = false
    alert(t('create-failed'))
  }
}
</script>
