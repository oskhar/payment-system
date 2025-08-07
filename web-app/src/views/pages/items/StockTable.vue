<script setup lang="ts">
import { defineProps, onMounted, ref, watch } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

// =================================================================
// Props
// =================================================================
const props = defineProps<{
  items: Item[] // List of items to populate the item selection dropdown
}>()

const branch = JSON.parse(localStorage.getItem('selectedBranch'))
const namaToko = branch.name

// =================================================================
// Type Definitions
// =================================================================
interface Stock {
  id: number
  item_id: number
  item_name: string
  transaction_number: string
  type: 'in' | 'out'
  description: string | null
  quantity: number
  created_at: string
}

interface Item {
  id: number
  name: string
}

// Interface for units associated with an item
interface Unit {
  id: number
  name: string
}

interface StockHeader {
  title: string
  key: string
  sortable?: boolean
}

// =================================================================
// Reactive State
// =================================================================
const stocks = ref<Stock[]>([])
const isLoadingStocks = ref(false)
const dialogAddStock = ref(false)
const isSubmittingStock = ref(false)
const selectedStockIds = ref<number[]>([])

// State for dynamic units
const availableUnits = ref<Unit[]>([])
const isLoadingUnits = ref(false)

const formAddStock = ref({
  item_id: null as number | null,
  unit_id: null as number | null, // Added for unit selection
  type: 'in' as 'in' | 'out',
  quantity: 0,
  description: '',
})

// Data table headers - Added 'Unit' column
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

    // Assuming the /stock endpoint now returns unit information (e.g., unit_name)
    stocks.value = response.data.data.stocks.map((stock: any) => ({
      ...stock,
      item_name: stock.item.name || 'Unknown Item',
      created_at: new Date(stock.created_at).toLocaleString(),
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

// New function to fetch units for a selected item
const fetchUnitsForItem = async (itemId: number) => {
  isLoadingUnits.value = true
  availableUnits.value = []
  try {
    // Assumption: Endpoint to get a single item's details (including its units) is /item/{id}
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/item/${itemId}/unit`)

    console.log(response.data.data)

    // Map the response to the Unit interface. Adjust the path (e.g., response.data.item_units) as needed.
    availableUnits.value = response.data.data.units.map((itemUnit: any) => ({
      id: itemUnit.id,
      name: itemUnit.name,
    }))

    // *** PERUBAHAN DI SINI ***
    // Secara otomatis pilih unit pertama jika tersedia
    if (availableUnits.value.length > 0)
      formAddStock.value.unit_id = availableUnits.value[0].id
  }
  catch (error) {
    console.error(`Gagal mengambil unit untuk item ${itemId}:`, error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal Memuat Unit',
      text: 'Tidak dapat mengambil daftar unit untuk item yang dipilih.',
    })
  }
  finally {
    isLoadingUnits.value = false
  }
}

const submitAddStock = async () => {
  if (isSubmittingStock.value)
    return

  // Added validation for unit_id
  if (!formAddStock.value.item_id || !formAddStock.value.unit_id || formAddStock.value.quantity <= 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Input Tidak Valid',
      text: 'Mohon lengkapi Item, Unit, dan pastikan Kuantitas lebih dari 0.',
    })

    return
  }

  isSubmittingStock.value = true
  try {
    const payload = {
      type: formAddStock.value.type,
      quantity_change: formAddStock.value.quantity,
      unit_id: formAddStock.value.unit_id, // Include unit_id in the payload
      description: formAddStock.value.description || null,
      transaction_number: 'auto',
    }

    await axios.post(`${import.meta.env.VITE_API_URL}/item`, payload)

    await fetchStocks()
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
      await axios.delete(`${import.meta.env.VITE_API_URL}/stock`, { data: { ids: selectedStockIds.value } })
      await fetchStocks()
      selectedStockIds.value = []
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
    unit_id: null, // Reset unit_id
    type: 'in',
    quantity: 0,
    description: '',
  }
  availableUnits.value = [] // Clear available units
}

// =================================================================
// Watchers
// =================================================================

// Watch for changes in the selected item_id to fetch its units
watch(
  () => formAddStock.value.item_id,
  newId => {
    // Reset unit selection when item changes
    formAddStock.value.unit_id = null
    availableUnits.value = []

    if (newId)
      fetchUnitsForItem(newId)
  },
)

watch(
  () => props.items,
  async (newItems, oldItems) => {
    if (newItems.length > 0 && newItems.length !== oldItems.length)
      await fetchStocks()
  },
  { deep: true, immediate: false },
)

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
        Riwayat Stok
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

        <template #item.type="{ item }">
          <VChip
            :color="item.type === 'in' ? 'success' : 'error'"
            density="comfortable"
          >
            {{ item.type === 'in' ? 'Masuk' : 'Keluar' }}
          </VChip>
        </template>

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
            Stok Baru - <b class="text-primary">{{ namaToko }}</b>
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

            <!-- New VSelect for Units -->
            <VSelect
              v-model="formAddStock.unit_id"
              label="Pilih Unit"
              :items="availableUnits"
              item-title="name"
              item-value="id"
              class="mb-4"
              :disabled="!formAddStock.item_id"
              :loading="isLoadingUnits"
              clearable
              required
              no-data-text="Pilih item terlebih dahulu"
            />

            <VSelect
              v-model="formAddStock.type"
              label="Tipe Transaksi"
              :items="[
                { title: 'Stock Masuk', value: 'in' },
                { title: 'Stock Keluar', value: 'out' },
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
