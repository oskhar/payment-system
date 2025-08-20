<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid'
import api from '@/api'

// =================================================================
// Type Definitions
// =================================================================
interface Item {
  id: number
  name: string
}

interface Unit {
  id: number
  name: string
}

interface StockEntry {
  key: string
  unit_id: number | null
  quantity: number
}

interface Branch {
  id: number
  name: string
}

// =================================================================
// Reactive State
// =================================================================

// --- Branch State ---
const branch = ref<Branch>(JSON.parse(localStorage.getItem('selectedBranch')))

const items = ref<Item[]>([]) // Local state for items
const isLoadingItems = ref(false) // Loading state for items
const selectedItemId = ref<number | null>(null)

const stockEntries = ref<StockEntry[]>([
  // Start with one default entry
  { key: uuidv4(), unit_id: null, quantity: 1 },
])

const availableUnits = ref<Unit[]>([])
const isLoadingUnits = ref(false)
const isSubmitting = ref(false)

// =================================================================
// Functions: API Calls
// =================================================================

/**
 * Fetches the list of all available items from the server.
 */
const fetchItems = async () => {
  isLoadingItems.value = true
  try {
    const response = await api.get(`${import.meta.env.VITE_API_URL}/item`, { params: { branch_id: branch.value.id } })

    // Assuming the API returns items in `response.data.data`
    items.value = response.data.data.items
  } catch (error) {
    console.error('Failed to fetch items:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal Memuat Item',
      text: 'Terjadi kesalahan saat mengambil daftar item.',
    })
  } finally {
    isLoadingItems.value = false
  }
}

/**
 * Fetches available units for the currently selected item.
 * @param {number} itemId - The ID of the selected item.
 */
const fetchUnitsForItem = async (itemId: number) => {
  isLoadingUnits.value = true
  availableUnits.value = []
  try {
    const response = await api.get(`${import.meta.env.VITE_API_URL}/item/${itemId}/unit`)

    availableUnits.value = response.data.data.units.map((unit: any) => ({
      id: unit.id,
      name: unit.name,
    }))

    // Set the default unit for the first entry if units are available
    if (availableUnits.value.length > 0 && stockEntries.value.length > 0) {
      // Only set if the current unit is not set
      if (!stockEntries.value[0].unit_id) stockEntries.value[0].unit_id = availableUnits.value[0].id
    }
  } catch (error) {
    console.error(`Failed to fetch units for item ${itemId}:`, error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal Memuat Unit',
      text: 'Tidak dapat mengambil daftar unit untuk item yang dipilih.',
    })
  } finally {
    isLoadingUnits.value = false
  }
}

/**
 * Submits the stock opname data to the server.
 */
const submitStockOpname = async () => {
  // --- Validation ---
  if (!selectedItemId.value) {
    Swal.fire('Validasi Gagal', 'Silakan pilih item terlebih dahulu.', 'warning')

    return
  }

  const hasInvalidEntry = stockEntries.value.some(entry => !entry.unit_id || entry.quantity <= 0)
  if (hasInvalidEntry) {
    Swal.fire('Validasi Gagal', 'Pastikan semua baris stok memiliki unit dan kuantitas lebih dari 0.', 'warning')

    return
  }

  // Check for duplicate units
  const unitIds = stockEntries.value.map(entry => entry.unit_id)
  const hasDuplicateUnits = new Set(unitIds).size !== unitIds.length
  if (hasDuplicateUnits) {
    Swal.fire('Validasi Gagal', 'Setiap unit hanya dapat dipilih satu kali per item.', 'warning')

    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      item_id: selectedItemId.value,
      branch_id: branch.value.id,
      stock: stockEntries.value.map(({ unit_id, quantity }) => ({
        unit_id,
        quantity,
      })),
    }

    // Assuming the endpoint is /stock/opname
    await api.post('/stock/opname', payload)

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Stok opname berhasil disinkronkan.',
      timer: 2000,
      showConfirmButton: false,
    })

    // Reset form after successful submission
    resetForm()
  } catch (error: any) {
    console.error('Error submitting stock opname:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal Menyimpan',
      text: error.response?.data?.message || 'Terjadi kesalahan pada server.',
    })
  } finally {
    isSubmitting.value = false
  }
}

// =================================================================
// Utility Functions
// =================================================================

/**
 * Adds a new, empty stock entry row to the form.
 */
const addStockEntry = () => {
  stockEntries.value.push({
    key: uuidv4(),
    unit_id: null,
    quantity: 1,
  })
}

/**
 * Removes a stock entry row from the form by its key.
 * @param {string} key - The unique key of the stock entry to remove.
 */
const removeStockEntry = (key: string) => {
  stockEntries.value = stockEntries.value.filter(entry => entry.key !== key)
}

/**
 * Resets the entire form to its initial state.
 */
const resetForm = () => {
  selectedItemId.value = null
  stockEntries.value = [{ key: uuidv4(), unit_id: null, quantity: 1 }]
  availableUnits.value = []
}

// =================================================================
// Watchers
// =================================================================

/**
 * Watch for changes in the selected item to fetch its units
 * and reset existing stock entries.
 */
watch(selectedItemId, newId => {
  // Reset previous state
  stockEntries.value = [{ key: uuidv4(), unit_id: null, quantity: 1 }]
  availableUnits.value = []

  if (newId) fetchUnitsForItem(newId)
})

// =================================================================
// Lifecycle Hooks
// =================================================================
onMounted(() => {
  fetchItems()
})
</script>

<template>
  <VCard>
    <VCardTitle class="pa-5">
      <h5 class="text-h5">Formulir Stock Opname</h5>
    </VCardTitle>
    <VCardSubtitle>
      Gunakan formulir ini untuk menyinkronkan jumlah stok fisik di gudang dengan data di sistem.
    </VCardSubtitle>

    <VForm @submit.prevent="submitStockOpname">
      <VCardText class="pt-6">
        <!-- 1. Item Selection -->
        <VSelect
          v-model="selectedItemId"
          :items="items"
          :loading="isLoadingItems"
          item-title="name"
          item-value="id"
          label="Pilih Item"
          placeholder="Cari dan pilih item..."
          clearable
          required
          class="mb-4"
        />

        <!-- Divider -->
        <VDivider
          v-if="selectedItemId"
          class="my-4"
        />

        <!-- 2. Dynamic Stock Entries -->
        <div v-if="selectedItemId">
          <p class="text-subtitle-1 mb-3">Masukkan Kuantitas Fisik</p>

          <VRow
            v-for="(entry, index) in stockEntries"
            :key="entry.key"
            align="center"
            class="mb-2"
          >
            <!-- Unit Selection -->
            <VCol
              cols="12"
              sm="6"
            >
              <VSelect
                v-model="entry.unit_id"
                :items="availableUnits"
                item-title="name"
                item-value="id"
                label="Pilih Unit"
                :loading="isLoadingUnits"
                :disabled="isLoadingUnits"
                hide-details="auto"
                required
                no-data-text="Tidak ada unit tersedia"
              />
            </VCol>

            <!-- Quantity Input -->
            <VCol
              cols="12"
              sm="4"
            >
              <VTextField
                v-model.number="entry.quantity"
                label="Kuantitas"
                type="number"
                min="1"
                hide-details="auto"
                required
              />
            </VCol>

            <!-- Remove Button -->
            <VCol
              cols="12"
              sm="2"
              class="text-right"
            >
              <VBtn
                v-if="stockEntries.length > 1"
                icon="ri-delete-bin-line"
                variant="text"
                color="error"
                size="small"
                @click="removeStockEntry(entry.key)"
              />
            </VCol>
          </VRow>

          <!-- Add More Button -->
          <VBtn
            color="primary"
            variant="tonal"
            prepend-icon="ri-add-line"
            class="mt-4"
            :disabled="!selectedItemId || isLoadingUnits"
            @click="addStockEntry"
          >
            Tambah Stok dengan Unit Lain
          </VBtn>
        </div>

        <!-- Placeholder when no item is selected -->
        <div
          v-else
          class="text-center py-16"
        >
          <VIcon
            icon="ri-inbox-2-line"
            size="50"
            class="text-disabled mb-4"
          />
          <p class="text-h6 text-disabled">Pilih Item Terlebih Dahulu</p>
          <p class="text-medium-emphasis">Kuantitas stok dapat diisi setelah Anda memilih item.</p>
        </div>
      </VCardText>

      <VCardActions class="pa-4 d-flex justify-end">
        <VBtn
          color="secondary"
          variant="text"
          @click="resetForm"
        >
          Batal
        </VBtn>
        <VBtn
          type="submit"
          variant="elevated"
          color="primary"
          :loading="isSubmitting"
          :disabled="isSubmitting || !selectedItemId"
        >
          Simpan Stok Opname
        </VBtn>
      </VCardActions>
    </VForm>
  </VCard>
</template>

<style scoped>
/* Scoped styles for this component */
.text-right {
  text-align: right;
}
</style>
