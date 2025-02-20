<template>
  <div>
    <button class="cursor-pointer" @click="handleLanguage">{{ $t('lang') }}</button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const handleLanguage = () => {
  i18n.locale.value = i18n.locale.value === 'es' ? 'en' : 'es'
}
</script>
