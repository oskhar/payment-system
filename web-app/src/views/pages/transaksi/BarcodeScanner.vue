<template>
  <div>
    <v-text-field
      v-model="inputValue"
      label="Scan Barcode"
      ref="inputRef"
      @keydown="onKeyDown"
      hide-details
      autofocus
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'

const inputValue = ref('')
const inputRef = ref<InstanceType<typeof HTMLInputElement> | null>(null)
let buffer = ''
let timer: ReturnType<typeof setTimeout> | null = null

const emit = defineEmits<{
  (e: 'on-scan', value: string): void
}>()

function onKeyDown(event: KeyboardEvent) {
  if (timer) clearTimeout(timer)

  // Ignore control keys
  if (event.key.length === 1) {
    buffer += event.key
  }

  // Barcode scanners biasanya mengetik cepat, kita debounce ~200ms
  timer = setTimeout(() => {
    if (buffer.length >= 5) {
      emit('on-scan', buffer)
    }
    buffer = ''
    inputValue.value = ''
  }, 200)
}

onMounted(async () => {
  await nextTick()
  const el = inputRef.value?.$el?.querySelector('input') as HTMLInputElement
  el?.focus()
})
</script>
