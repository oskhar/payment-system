<script setup lang="ts">
import { defineProps, onMounted, ref, watch } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

// =================================================================
// Type Definitions
// =================================================================
interface Stock {
  id: number
  item_id: number
  item_name: string // Assuming we will get item name from the backend for display
  transaction_number: string
  type: 'in' | 'out'
  description: string | null
  quantity: number
  created_at: string // Use string for date to display easily, format later
}

interface Item {
  id: number
  name: string

  // Add other item properties if needed, but 'name' and 'id' are essential for dropdown
}

interface StockHeader {
  title: string
  key: string
  sortable?: boolean
}

// =================================================================
// Props
// =================================================================
const props = defineProps<{
  items: Item[] // List of items to populate the item selection dropdown
}>()

// =================================================================
// Reactive State
// =================================================================
const stocks = ref<Stock[]>([])
const isLoadingStocks = ref(false)
const dialogAddStock = ref(false)
const isSubmittingStock = ref(false)
const selectedStockIds = ref<number[]>([]) // For deleting multiple stocks

const formAddStock = ref({
  item_id: null as number | null,
  type: 'in' as 'in' | 'out',
  quantity: 0,
  description: '',
})

// Data table headers
const stockHeaders: StockHeader[] = [
  { title: 'Item', key: 'item_name' },
  { title: 'Nomor Transaksi', key: 'transaction_number' },
  { title: 'Tipe', key: 'type' },
  { title: 'Kuantitas', key: 'quantity' },
  { title: 'Deskripsi', key: 'description' },
  { title: 'Tanggal', key: 'created_at' },
  { title: 'Aksi', key: 'actions', sortable: false },
]

// =================================================================
// Functions: API Calls
// =================================================================

const fetchStocks = async () => {
  isLoadingStocks.value = true
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/stock`)

    stocks.value = response.data.data.map((stock: any) => ({
      ...stock,
      item_name: props.items.find(item => item.id === stock.item_id)?.name || 'Unknown Item',
      created_at: new Date(stock.created_at).toLocaleString(), // Format date for display
    }))
  }
  catch (error) {
    console.error('Gagal mengambil data stok:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal Memuat Stok',
      text: 'Terjadi kesalahan saat mengambil data stok.',
    })
  }
  finally {
    isLoadingStocks.value = false
  }
}

const submitAddStock = async () => {
  if (isSubmittingStock.value)
    return

  if (!formAddStock.value.item_id || formAddStock.value.quantity <= 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Input Tidak Valid',
      text: 'Mohon lengkapi semua field yang diperlukan dan pastikan kuantitas lebih dari 0.',
    })

    return
  }

  isSubmittingStock.value = true
  try {
    const payload = {
      type: formAddStock.value.type,
      quantity: formAddStock.value.quantity,
      description: formAddStock.value.description || null,
      transaction_number: 'auto', // Assuming backend handles this with a default
    }

    await axios.post(`${import.meta.env.VITE_API_URL}/item/${formAddStock.value.item_id}/stock`, payload)

    await fetchStocks() // Refresh stock list
    dialogAddStock.value = false
    resetFormAddStock()

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Stok berhasil ditambahkan.',
      timer: 2000,
      showConfirmButton: false,
    })
  }
  catch (error: any) {
    console.error('Error adding stock:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal Menambah Stok',
      text: error.response?.data?.message || 'Terjadi kesalahan pada server.',
    })
  }
  finally {
    isSubmittingStock.value = false
  }
}

const deleteSelectedStocks = async () => {
  if (selectedStockIds.value.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Tidak Ada Stok Terpilih',
      text: 'Pilih setidaknya satu entri stok untuk dihapus.',
    })

    return
  }

  const result = await Swal.fire({
    title: 'Konfirmasi Penghapusan',
    text: `Anda yakin ingin menghapus ${selectedStockIds.value.length} entri stok terpilih?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
    reverseButtons: true,
    customClass: {
      confirmButton:
        'v-btn v-btn--elevated v-theme--light bg-primary text-white v-btn--density-default v-btn--size-default v-btn--variant-elevated',
      cancelButton:
        'v-btn v-btn--elevated v-theme--light bg-secondary text-white v-btn--density-default v-btn--size-default v-btn--variant-elevated ml-3',
    },
  })

  if (result.isConfirmed) {
    try {
      // The backend expects an object with 'ids' array
      await axios.delete(`${import.meta.env.VITE_API_URL}/stock`, { data: { ids: selectedStockIds.value } })

      await fetchStocks() // Refresh stock list
      selectedStockIds.value = [] // Clear selection
      Swal.fire({
        icon: 'success',
        title: 'Berhasil Dihapus!',
        text: 'Entri stok berhasil dihapus.',
        timer: 2000,
        showConfirmButton: false,
      })
    }
    catch (error: any) {
      console.error('Error deleting stocks:', error)
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menghapus Stok',
        text: error.response?.data?.message || 'Terjadi kesalahan pada server.',
      })
    }
  }
}

// =================================================================
// Utility Functions
// =================================================================
const resetFormAddStock = () => {
  formAddStock.value = {
    item_id: null,
    type: 'in',
    quantity: 0,
    description: '',
  }
}

// Watch for changes in the 'items' prop to re-fetch stocks if necessary
watch(
  () => props.items,
  async (newItems, oldItems) => {
    // Only re-fetch if items actually change (e.g., initial load or significant update)
    if (newItems.length !== oldItems.length || newItems.some((item, index) => item.id !== oldItems[index]?.id))
      await fetchStocks()
  },
  { deep: true, immediate: false },
) // immediate: false because onMounted already fetches initially

// =================================================================
// Lifecycle Hooks
// =================================================================
onMounted(async () => {
  await fetchStocks()
})
</script>

<template>
  <VCard>
    <VCardTitle class="d-flex justify-space-between align-center pa-5">
      <h5 class="text-h5">
        Riwayat Transaksi Stok
      </h5>
      <div class="d-flex ga-2">
        <VBtn
          v-if="selectedStockIds.length > 0"
          color="error"
          prepend-icon="ri-delete-bin-line"
          @click="deleteSelectedStocks"
        >
          Hapus Terpilih ({{ selectedStockIds.length }})
        </VBtn>
        <VBtn
          prepend-icon="ri-add-line"
          color="primary"
          @click="dialogAddStock = true"
        >
          Tambah Transaksi Stok
        </VBtn>
      </div>
    </VCardTitle>

    <VCardText>
      <VDataTable
        v-model="selectedStockIds"
        :headers="stockHeaders"
        :items="stocks"
        item-value="id"
        show-select
        class="elevation-1"
        :loading="isLoadingStocks"
      >
        <template #loading>
          <VProgressLinear
            indeterminate
            color="primary"
            class="my-16"
          />
          <p class="text-center text-medium-emphasis">
            Memuat data stok...
          </p>
        </template>
        <template #no-data>
          <div class="text-center py-16">
            <VIcon
              icon="ri-inbox-2-line"
              size="50"
              class="text-disabled mb-4"
            />
            <p class="text-h6 text-disabled">
              Belum ada riwayat transaksi stok.
            </p>
            <p class="text-medium-emphasis">
              Klik "Tambah Transaksi Stok" untuk menambahkan.
            </p>
          </div>
        </template>

        <!-- Custom template for type column to display badges -->
        <template #item.type="{ item }">
          <VChip
            :color="item.type === 'in' ? 'success' : 'error'"
            density="comfortable"
          >
            {{ item.type === 'in' ? 'Masuk' : 'Keluar' }}
          </VChip>
        </template>

        <!-- Custom template for actions column -->
        <template #item.actions="{ item }">
          <VBtn
            icon="ri-delete-bin-line"
            variant="text"
            color="error"
            size="small"
            @click="
              () => {
                selectedStockIds = [item.id]
                deleteSelectedStocks()
              }
            "
          />
        </template>
      </VDataTable>
    </VCardText>

    <!-- Dialog untuk Menambah Transaksi Stok -->
    <VDialog
      v-model="dialogAddStock"
      max-width="500"
      persistent
    >
      <VCard>
        <VForm @submit.prevent="submitAddStock">
          <VCardTitle class="pa-4">
            Tambah Transaksi Stok Baru
          </VCardTitle>

          <VCardText class="pb-0">
            <VSelect
              v-model="formAddStock.item_id"
              label="Pilih Item"
              :items="props.items"
              item-title="name"
              item-value="id"
              class="mb-4"
              clearable
              required
            />

            <VSelect
              v-model="formAddStock.type"
              label="Tipe Transaksi"
              :items="[
                { title: 'Masuk', value: 'in' },
                { title: 'Keluar', value: 'out' },
              ]"
              class="mb-4"
              required
            />

            <VTextField
              v-model.number="formAddStock.quantity"
              label="Kuantitas"
              type="number"
              min="1"
              class="mb-4"
              required
            />

            <VTextarea
              v-model="formAddStock.description"
              label="Deskripsi (Opsional)"
              rows="3"
              class="mb-4"
            />
          </VCardText>

          <VCardActions class="pa-4 d-flex justify-end">
            <VBtn
              color="secondary"
              variant="text"
              @click="
                () => {
                  dialogAddStock = false
                  resetFormAddStock()
                }
              "
            >
              Batal
            </VBtn>
            <VBtn
              type="submit"
              variant="elevated"
              color="primary"
              :loading="isSubmittingStock"
              :disabled="isSubmittingStock"
            >
              Simpan Transaksi
            </VBtn>
          </VCardActions>
        </VForm>
      </VCard>
    </VDialog>
  </VCard>
</template>

<style scoped>
/* Styling khusus untuk tabel stok jika diperlukan */
</style>
