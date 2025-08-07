<script lang="ts" setup>
import { ref } from 'vue'
import StockTable from '@/views/pages/items/StockTable.vue'
import api from '@/api'

// =================================================================
// Reactive State
// =================================================================

// --- Branch State ---

const branch = ref<Branch>(JSON.parse(localStorage.getItem('selectedBranch')))

// --- Item State ---

interface Item {
  id: number
  name: string
  category: string
  stock: number
  price: number
  barcode: string
  image_url: string
  description: string
  created_at: Date
}

const items = ref<Item[]>([])
const selectedItemsForDeletion = ref<number[]>([])
const isLoadingItems = ref(false)
const searchQuery = ref('')

const fetchItems = async () => {
  isLoadingItems.value = true
  try {
    const params = {
      search: searchQuery.value,

      // page: pagination.currentPage,
    }

    const response = await api.get('item', { params: { ...params, branch_id: branch.value.id } })

    items.value = response.data.data.items.map((item: any) => ({
      ...item,
      image_url: `${import.meta.env.VITE_API_URL}${item.image_url}`,
    }))

    // pagination.totalPages = response.data.data.totalPages;
  }
  catch (error) {
    console.error('Gagal mengambil data item:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal Memuat Item',
      text: 'Terjadi kesalahan saat mengambil data item.',
    })
  }
  finally {
    isLoadingItems.value = false
  }
}

const onItemUpdated = async () => {
  await fetchItems()
}

onMounted(async () => {
  await fetchItems()
})
</script>

<template>
  <!-- Stock Management Card -->
  <StockTable
    v-model:selected-items="selectedItemsForDeletion"
    :items="items"
    @updated="onItemUpdated"
  />
</template>
