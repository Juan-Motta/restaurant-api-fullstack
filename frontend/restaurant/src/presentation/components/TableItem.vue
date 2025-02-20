<template>
  <table class="min-w-full border-collapse">
    <thead>
      <tr class="text-center">
        <th
          v-for="col in columns"
          :key="col.key"
          class="pt-2 pb-6 px-4"
          :class="{ 'hidden md:table-cell': col.hidden }"
        >
          {{ $t(col.label) }}
        </th>
      </tr>
    </thead>
    <tbody class="text-center">
      <tr v-for="item in data" :key="item.id">
        <td
          v-for="col in columns"
          :key="col.key"
          class="py-2 px-4"
          :class="{ 'hidden md:table-cell': col.hidden }"
        >
          <span v-if="col.transform" v-html="col.transform(getValueByKey(item, col.key))"></span>
          <span v-else>{{
            col.translate ? $t(getValueByKey(item, col.key)) : getValueByKey(item, col.key)
          }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
interface Column {
  key: string
  label: string
  hidden?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform?: (value: any) => string
  translate?: boolean
}

defineProps<{
  columns: Column[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[]
}>()

type NestedKeyOf<T> = {
  [K in keyof T]: K extends string
    ? T[K] extends Record<string, unknown>
      ? K | `${K}.${NestedKeyOf<T[K]>}`
      : K
    : never
}[keyof T]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getValueByKey<T>(obj: T, key: NestedKeyOf<T>): any {
  const keys = key.split('.')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return keys.reduce((accumulator: any, currentKey: string) => {
    return accumulator && currentKey in accumulator ? accumulator[currentKey] : undefined
  }, obj)
}
</script>
