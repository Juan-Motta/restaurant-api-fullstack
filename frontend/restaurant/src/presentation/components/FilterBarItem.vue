<template>
  <div class="mb-4 flex justify-between items-center flex-col md:flex-row gap-4">
    <div class="gap-4 flex flex-col md:flex-row w-full">
      <slot></slot>
    </div>
    <div
      class="flex items-center h-full gap-4 w-full md:w-min flex-col sm:flex-row mt-5 mb-1 md:mt-0 md:mb-0"
    >
      <button
        class="h-full w-full md:w-min px-6 rounded-lg cursor-pointer bg-[#0eb3a0ca] hover:bg-[#67cec2ca]"
        @click="$emit('clear')"
      >
        {{ $t('clear') }}
      </button>
      <button
        class="h-full w-full md:w-min px-6 rounded-lg cursor-pointer bg-[#0eb3a0ca] hover:bg-[#67cec2ca]"
        @click="$emit('reload')"
      >
        {{ $t('reload') }}
      </button>
    </div>
  </div>
</template>
