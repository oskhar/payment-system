<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import Swal from 'sweetalert2'
import api from '@/api'

// Local Components
import ShoppingCard from '@/views/pages/items/ShoppingCard.vue'

// =================================================================
// Type Definitions
// =================================================================
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

interface Category {
  id: number
  name: string
}

// [TAMBAH] Interface untuk data Satuan dari API
interface Unit {
  id: number
  name: string
}

// [TAMBAH] Interface untuk struktur data satuan di dalam form
interface FormUnit {
  id: number | null
  price: number
  cost: number
  conversion_to_base: number
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

// --- Item State ---
const items = ref<Item[]>([])
const isLoadingItems = ref(false)
const searchQuery = ref('')

// --- Category State ---
const categories = ref<Category[]>([])
const selectedCategories = ref<number[]>([])

// [TAMBAH] --- Unit State ---
const units = ref<Unit[]>([])

// [TAMBAH] --- Bulk Action State ---
const selectedItemsForDeletion = ref<number[]>([])

// --- Form State (Add Item Dialog) ---
const isSubmitting = ref(false)
const dialogAddItem = ref(false)

// [UBAH] Form state disesuaikan dengan skema backend baru
const formAddItem = reactive({
  name: '',
  description: '',
  barcode: '',
  image: null as File | null,
  units: [{ id: null, price: 0, cost: 0, wholesale_price: 0, conversion_to_base: 1 }] as FormUnit[],
  base_unit_id: null as number | null,
})

// --- Pagination State ---
const pagination = reactive({
  currentPage: 1,
  totalPages: 3,
})

// =================================================================
// Computed Properties
// =================================================================

const isAllCategoriesSelected = computed(() => {
  return categories.value.length > 0 && selectedCategories.value.length === categories.value.length
})

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value

  const lowerCaseQuery = searchQuery.value.toLowerCase()

  return items.value.filter(
    item => item.name.toLowerCase().includes(lowerCaseQuery) || item.barcode.toLowerCase().includes(lowerCaseQuery),
  )
})

// =================================================================
// Functions: API Calls
// =================================================================

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
      image_url: `${import.meta.env.VITE_API_URL}/public${item.image_url}`,
    }))

    // pagination.totalPages = response.data.data.totalPages;
  } catch (error) {
    console.error('Gagal mengambil data item:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal Memuat Item',
      text: 'Terjadi kesalahan saat mengambil data item.',
    })
  } finally {
    isLoadingItems.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await api.get('category')

    // Pastikan data yang diterima adalah array
    if (Array.isArray(response.data.data?.categories || response.data.data)) {
      categories.value = response.data.data?.categories || response.data.data
    } else {
      console.error('Data kategori yang diterima bukan array:', response.data.data)
      categories.value = []
    }
  } catch (error) {
    console.error('Gagal mengambil data kategori:', error)
  }
}

// [UBAH] Fungsi untuk mengambil data satuan dengan perbaikan
const fetchUnits = async () => {
  try {
    const response = await api.get('unit')
    const unitsData = response.data.data?.units || response.data.data

    // [FIX] Pastikan data yang diterima adalah array untuk VSelect
    if (Array.isArray(unitsData)) {
      units.value = unitsData
    } else {
      console.error('Data satuan yang diterima bukan array:', unitsData)
      units.value = [] // Set ke array kosong untuk menghindari error render
    }
  } catch (error) {
    console.error('Gagal mengambil data satuan:', error)
    units.value = [] // Set ke array kosong jika terjadi error
  }
}

// =================================================================
// Functions: Category Management
// =================================================================

const toggleSelectAllCategories = () => {
  if (isAllCategoriesSelected.value) selectedCategories.value = []
  else selectedCategories.value = categories.value.map(c => c.id)
}

const addCategory = async () => {
  dialogAddItem.value = false

  const { value: categoryName } = await Swal.fire({
    title: 'Tambah Kategori Baru',
    input: 'text',
    inputLabel: 'Nama Kategori',
    inputPlaceholder: 'Masukkan nama kategori...',
    showCancelButton: true,
    reverseButtons: true,
    confirmButtonText: 'Tambah',
    inputValidator: value => {
      if (!value) return 'Nama kategori tidak boleh kosong!'
    },
    customClass: {
      confirmButton:
        'v-btn v-btn--elevated v-theme--light bg-primary text-white v-btn--density-default v-btn--size-default v-btn--variant-elevated',
      cancelButton:
        'v-btn v-btn--elevated v-theme--light bg-secondary text-white v-btn--density-default v-btn--size-default v-btn--variant-elevated ml-3',
    },
    didOpen: () => {
      document.querySelector('.swal2-container').style.zIndex = '9999'
    },
  })

  if (categoryName) {
    try {
      const { data } = await api.post('category', { name: categoryName })

      categories.value.push(data.data)
      Swal.fire({
        icon: 'success',
        title: 'Kategori Ditambahkan!',
        text: data.message || 'Kategori baru berhasil ditambahkan.',
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menambahkan',
        text: error.response?.data?.message || 'Terjadi kesalahan pada server.',
      })
    }
  }
}

// =================================================================
// Functions: Item Management (Form & Dialog)
// =================================================================

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) formAddItem.image = target.files[0]
}

// [UBAH] Mengganti fungsi `addPriceTier` menjadi `addUnit`
const addUnit = () => {
  formAddItem.units.push({ id: null, price: 0, cost: 0, conversion_to_base: 0 })
}

// [UBAH] Mengganti fungsi `removePriceTier` menjadi `removeUnit`
const removeUnit = (index: number) => {
  // Cegah penghapusan satuan pertama
  if (index > 0) {
    const removedUnitId = formAddItem.units[index].id

    // Jika satuan yang dihapus adalah base_unit, reset base_unit_id ke satuan pertama
    if (removedUnitId && removedUnitId === formAddItem.base_unit_id) formAddItem.base_unit_id = formAddItem.units[0].id

    formAddItem.units.splice(index, 1)
  }
}

// [UBAH] Menyesuaikan fungsi reset form
const resetForm = () => {
  formAddItem.name = ''
  formAddItem.description = ''
  formAddItem.barcode = ''
  formAddItem.image = null
  selectedCategories.value = []
  formAddItem.units = [{ id: null, price: 0, cost: 0, conversion_to_base: 1 }]
  formAddItem.base_unit_id = null

  const fileInput = document.getElementById('file-input') as HTMLInputElement
  if (fileInput) fileInput.value = ''
}

const closeAndResetDialog = () => {
  dialogAddItem.value = false
  resetForm()
}

// [UBAH] Menyesuaikan fungsi submit form dengan skema baru
const submitForm = async () => {
  if (isSubmitting.value) return

  // Validasi sederhana
  if (!formAddItem.base_unit_id) {
    Swal.fire({
      icon: 'error',
      title: 'Input Tidak Lengkap',
      text: 'Harap tentukan satuan dasar untuk item ini.',
    })

    return
  }

  isSubmitting.value = true

  const formData = new FormData()

  // Data utama
  formData.append('name', formAddItem.name)
  formData.append('description', formAddItem.description || '')
  formData.append('barcode', formAddItem.barcode)
  formData.append('base_unit_id', String(formAddItem.base_unit_id))

  // [FIX] Mengirim data array dengan benar menggunakan notasi kurung siku
  // untuk kategori
  selectedCategories.value.forEach((id, index) => {
    formData.append(`category[${index}][id]`, String(id))
  })

  // untuk unit
  formAddItem.units
    .filter(u => u.id) // Pastikan hanya unit yang sudah dipilih yang dikirim
    .forEach((unit, index) => {
      if (unit.id) {
        formData.append(`unit[${index}][id]`, String(unit.id))
        formData.append(`unit[${index}][price]`, String(unit.price))
        formData.append(`unit[${index}][wholesale_price]`, String(unit.wholesale_price))
        formData.append(`unit[${index}][cost]`, String(unit.cost))
        formData.append(`unit[${index}][conversion_to_base]`, String(unit.conversion_to_base))
      }
    })

  // File gambar (jika ada)
  if (formAddItem.image) formData.append('image', formAddItem.image)

  try {
    await api.post('item', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    await fetchItems()
    closeAndResetDialog()

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Item baru berhasil ditambahkan.',
      timer: 2000,
      showConfirmButton: false,
    })
  } catch (error: any) {
    console.error('Error submitting form:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal Menambahkan Item',
      text: error.response?.data?.message || 'Terjadi kesalahan pada server.',
    })
  } finally {
    isSubmitting.value = false
  }
}

const onItemUpdated = async () => {
  await fetchItems()
}

// [TAMBAH] Fungsi untuk menghapus item yang dipilih secara massal
const deleteSelectedItems = async () => {
  // Pastikan ada item yang dipilih
  if (selectedItemsForDeletion.value.length === 0) {
    Swal.fire('Pilih Item', 'Silakan pilih satu atau lebih item yang ingin dihapus.', 'info')

    return
  }

  // Konfirmasi pengguna
  const result = await Swal.fire({
    title: `Hapus ${selectedItemsForDeletion.value.length} Item?`,
    text: 'Tindakan ini tidak dapat dibatalkan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6e7881',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
    reverseButtons: true,
  })

  if (result.isConfirmed) {
    try {
      // Siapkan payload. Backend diharapkan menerima objek dengan key 'ids'
      // yang berisi array of numbers.
      const payload = {
        ids: selectedItemsForDeletion.value,
      }

      // Kirim request DELETE dengan payload di dalam body (properti 'data' di api)
      await api.delete('item', {
        data: payload,
      })

      Swal.fire({
        icon: 'success',
        title: 'Dihapus!',
        text: `Berhasil menghapus ${selectedItemsForDeletion.value.length} item.`,
        timer: 2000,
        showConfirmButton: false,
      })

      // Muat ulang daftar item dan kosongkan pilihan
      await fetchItems()
      selectedItemsForDeletion.value = []
    } catch (error: any) {
      console.error('Gagal menghapus item:', error)
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menghapus',
        text: error.response?.data?.message || 'Terjadi kesalahan pada server.',
      })
    }
  }
}

// =================================================================
// Watchers
// =================================================================
// [TAMBAH] Watcher untuk auto-set base_unit_id ke satuan pertama saat dipilih
watch(
  () => formAddItem.units[0].id,
  newId => {
    if (newId) formAddItem.base_unit_id = newId
  },
)

// =================================================================
// Lifecycle Hooks
// =================================================================

onMounted(async () => {
  await fetchItems()
  await fetchCategories()
  await fetchUnits() // [TAMBAH] Panggil fetchUnits
})
</script>

<template>
  <!-- Search Card -->
  <VCard class="mb-10">
    <VCardText>
      <VForm @submit.prevent="fetchItems">
        <VRow class="d-flex justify-center align-center">
          <VCol
            cols="12"
            md="6"
          >
            <div class="d-flex">
              <VTextField
                id="search"
                v-model="searchQuery"
                placeholder="Temukan"
                variant="solo"
                density="comfortable"
                hide-details
                class="flex-grow-1"
                @keydown.enter="fetchItems"
              />
              <VBtn
                class="ml-3"
                icon="ri-search-line"
                type="submit"
                aria-label="Cari Item"
              />
            </div>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>

  <!-- Items List Card -->
  <VCard class="mb-10">
    <VCardTitle class="d-flex justify-space-between align-center pa-5">
      <h5 class="text-h5">Daftar Item</h5>
      <VBtn
        prepend-icon="ri-add-line"
        color="primary"
        data-testid="add-item-button"
        @click="dialogAddItem = true"
      >
        Tambah Item
      </VBtn>
    </VCardTitle>

    <div class="pb-5 px-5">
      <VRow>
        <VCol
          v-if="isLoadingItems"
          cols="12"
          class="text-center py-16"
        >
          <VProgressCircular
            indeterminate
            color="primary"
          />
          <p class="text-medium-emphasis mt-4">Memuat data item...</p>
        </VCol>

        <template v-else-if="filteredItems.length > 0">
          <VCol
            v-for="item in filteredItems"
            :key="item.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            class="mb-4"
          >
            <ShoppingCard
              :item="item"
              @updated="onItemUpdated"
            />
          </VCol>
        </template>

        <VCol
          v-else
          cols="12"
          class="text-center py-16"
        >
          <VIcon
            icon="ri-inbox-2-line"
            size="50"
            class="text-disabled mb-4"
          />
          <p class="text-h6 text-disabled">
            {{ searchQuery ? 'Item tidak ditemukan.' : 'Belum ada item tersedia.' }}
          </p>
          <p class="text-medium-emphasis">
            {{
              searchQuery
                ? 'Coba kata kunci lain atau tambahkan item baru.'
                : 'Klik tombol "Tambah Item" untuk memulai.'
            }}
          </p>
        </VCol>
      </VRow>
    </div>

    <div
      v-if="filteredItems.length > 0"
      class="text-center pb-5"
    >
      <VPagination
        v-model="pagination.currentPage"
        :length="pagination.totalPages"
        :total-visible="5"
        rounded="circle"
        @update:model-value="fetchItems"
      />
    </div>
  </VCard>

  <!-- [UBAH] Dialog Tambah Item disesuaikan -->
  <VDialog
    v-model="dialogAddItem"
    max-width="800"
    persistent
  >
    <VCard>
      <VForm @submit.prevent="submitForm">
        <VCardTitle class="pa-4 d-flex justify-space-between align-center">
          <span>Tambah Item Baru</span>
          <VBtn
            icon="ri-close-line"
            variant="text"
            @click="closeAndResetDialog"
          />
        </VCardTitle>

        <VCardText class="pb-0">
          <VRow>
            <!-- Kolom Kiri: Info Dasar -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="formAddItem.name"
                label="Nama Item"
                class="mb-4"
                required
                data-testid="form-item-name"
              />

              <div class="d-flex align-start ga-2 mb-4">
                <VSelect
                  v-model="selectedCategories"
                  label="Kategori"
                  :items="categories"
                  item-title="name"
                  item-value="id"
                  multiple
                  chips
                  clearable
                  closable-chips
                  class="flex-grow-1"
                >
                  <template #prepend-item>
                    <VListItem
                      title="Pilih Semua"
                      @click="toggleSelectAllCategories"
                    >
                      <template #prepend>
                        <VCheckbox
                          :model-value="isAllCategoriesSelected"
                          readonly
                          class="mr-2"
                        />
                      </template>
                    </VListItem>
                    <VDivider class="mt-2" />
                  </template>
                </VSelect>
                <VBtn
                  icon="ri-add-line"
                  aria-label="Tambah Kategori Baru"
                  title="Tambah Kategori Baru"
                  @click="addCategory"
                />
              </div>

              <VFileInput
                id="file-input"
                label="Upload Gambar (Opsional)"
                accept="image/*"
                class="mb-4"
                @change="handleFileUpload"
              />

              <VTextField
                v-model="formAddItem.barcode"
                label="Barcode Item (Opsional)"
                class="mb-4"
              />

              <VTextarea
                v-model="formAddItem.description"
                label="Deskripsi (Opsional)"
                rows="3"
              />
            </VCol>

            <!-- Kolom Kanan: Pengaturan Satuan & Harga -->
            <VCol
              cols="12"
              md="6"
            >
              <p class="text-subtitle-1 mb-2">Pengaturan Satuan & Harga</p>
              <p class="text-caption text-medium-emphasis mb-4">
                Tentukan semua satuan jual untuk item ini. Pilih salah satu sebagai
                <b>satuan dasar</b> (acuan stok).
              </p>

              <VRadioGroup
                v-model="formAddItem.base_unit_id"
                class="w-100"
              >
                <div
                  v-for="(unit, index) in formAddItem.units"
                  :key="index"
                  class="unit-row mb-4"
                >
                  <div class="d-flex align-center ga-2">
                    <VRadio
                      :value="unit.id"
                      :disabled="!unit.id"
                      class="mt-4"
                    />
                    <VSelect
                      v-model="unit.id"
                      label="Unit"
                      :items="units"
                      item-title="name"
                      item-value="id"
                      density="compact"
                      hide-details
                      style="min-width: 120px"
                      required
                    />
                    <VBtn
                      v-if="index > 0"
                      icon="ri-delete-bin-line"
                      variant="text"
                      color="error"
                      size="small"
                      @click="removeUnit(index)"
                    />
                  </div>
                  <VRow class="pl-12 pt-2">
                    <VCol
                      cols="12"
                      sm="6"
                    >
                      <VTextField
                        v-model.number="unit.cost"
                        label="Harga Beli (Modal)"
                        type="number"
                        prefix="Rp"
                        density="compact"
                        hide-details
                        required
                      />
                    </VCol>
                    <VCol
                      cols="12"
                      sm="6"
                    >
                      <VTextField
                        v-model.number="unit.price"
                        label="Harga Jual"
                        type="number"
                        prefix="Rp"
                        density="compact"
                        hide-details
                        required
                      />
                    </VCol>
                    <VCol cols="12">
                      <VTextField
                        v-model.number="unit.wholesale_price"
                        label="Harga Grosir"
                        type="number"
                        prefix="Rp"
                        density="compact"
                        hide-details
                      />
                    </VCol>
                    <VCol cols="12">
                      <VTextField
                        v-model.number="unit.conversion_to_base"
                        label="Konversi ke Satuan Dasar"
                        type="number"
                        :disabled="index === 0"
                        density="compact"
                        :hint="index === 0 ? 'Satuan pertama adalah acuan dasar (nilai 1)' : ''"
                        persistent-hint
                        required
                      />
                    </VCol>
                  </VRow>
                  <VDivider
                    v-if="index < formAddItem.units.length - 1"
                    class="mt-4"
                  />
                </div>
              </VRadioGroup>

              <VBtn
                block
                variant="tonal"
                color="primary"
                prepend-icon="ri-add-line"
                @click="addUnit"
              >
                Tambah Satuan Lain
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>

        <VCardActions class="pa-4 mt-4 d-flex justify-end">
          <VBtn
            color="secondary"
            @click="closeAndResetDialog"
          >
            Batal
          </VBtn>
          <VBtn
            type="submit"
            variant="elevated"
            color="primary"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            data-testid="submit-item-button"
          >
            Simpan Item
          </VBtn>
        </VCardActions>
      </VForm>
    </VCard>
  </VDialog>
</template>

<style scoped>
.unit-row {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 12px;
}
</style>
