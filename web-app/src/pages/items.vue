<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

// Local Components
import ShoppingCard from '@/views/pages/items/ShoppingCard.vue'
import StockTable from '@/views/pages/items/StockTable.vue' // Import komponen StockTable baru

// =================================================================
// Type Definitions
// =================================================================
interface Item {
  id: number
  name: string
  category: string
  stock: number
  price: number // Menampilkan harga dasar di kartu, bisa disesuaikan
  barcode: string
  image_url: string
  description: string
  created_at: Date
}

interface Category {
  id: number
  name: string
}

// Tipe untuk harga bertingkat sesuai skema
interface ItemPriceTier {
  price: number
  min_quantity: number
}

// =================================================================
// Reactive State
// =================================================================

// --- Item State ---
const items = ref<Item[]>([])
const isLoadingItems = ref(false)
const searchQuery = ref('')

// --- Category State ---
const categories = ref<Category[]>([])
const selectedCategories = ref<number[]>([])

// --- Form State (Add Item Dialog) ---
const isSubmitting = ref(false)
const dialogAddItem = ref(false)

// Mengadaptasi form state untuk harga bertingkat
const formAddItem = reactive({
  name: '',
  description: '',
  barcode: '',
  image: null as File | null,
  item_prices: [{ price: 0, min_quantity: 1 }] as ItemPriceTier[], // Harga dasar selalu ada
})

// --- Pagination State ---
const pagination = reactive({
  currentPage: 1,
  totalPages: 3, // Nilai ini seharusnya dinamis dari API
})

// =================================================================
// Computed Properties
// =================================================================

// Cek apakah semua kategori dipilih
const isAllCategoriesSelected = computed(() => {
  return categories.value.length > 0 && selectedCategories.value.length === categories.value.length
})

// Filter items based on search query
const filteredItems = computed(() => {
  if (!searchQuery.value)
    return items.value

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
    // Menambahkan parameter pencarian jika ada
    const params = {
      search: searchQuery.value,

      // page: pagination.currentPage, // jika API mendukung paginasi
    }

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/item`, { params })

    items.value = response.data.data.items.map((item: any) => ({
      ...item,
      image_url: `${import.meta.env.VITE_API_URL}${item.image_url}`,
    }))

    // Update total pages for pagination if API provides it
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

const fetchCategories = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/category`)

    categories.value = response.data.data
  }
  catch (error) {
    console.error('Gagal mengambil data kategori:', error)
  }
}

// =================================================================
// Functions: Category Management
// =================================================================

const toggleSelectAllCategories = () => {
  if (isAllCategoriesSelected.value)
    selectedCategories.value = []
  else selectedCategories.value = categories.value.map(c => c.id)
}

const addCategory = async () => {
  const { value: categoryName } = await Swal.fire({
    title: 'Tambah Kategori Baru',
    input: 'text',
    inputLabel: 'Nama Kategori',
    inputPlaceholder: 'Masukkan nama kategori...',
    showCancelButton: true,
    reverseButtons: true,
    confirmButtonText: 'Tambah',
    inputValidator: value => {
      if (!value)
        return 'Nama kategori tidak boleh kosong!'
    },
    customClass: {
      confirmButton:
        'v-btn v-btn--elevated v-theme--light bg-primary text-white v-btn--density-default v-btn--size-default v-btn--variant-elevated',
      cancelButton:
        'v-btn v-btn--elevated v-theme--light bg-secondary text-white v-btn--density-default v-btn--size-default v-btn--variant-elevated ml-3',
    },
  })

  if (categoryName) {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/category`, { name: categoryName })

      categories.value.push(data.data)
      Swal.fire({
        icon: 'success',
        title: 'Kategori Ditambahkan!',
        text: data.message || 'Kategori baru berhasil ditambahkan.',
        timer: 2000,
        showConfirmButton: false,
      })
    }
    catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menambahkan',
        text: error.response?.data?.message || 'Terjadi kesalahan pada server.',
      })
    }
  }
}

// =================================================================
// Functions: Item Management (Form)
// =================================================================

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files)
    formAddItem.image = target.files[0]
}

// Fungsi untuk menambah baris harga bertingkat baru
const addPriceTier = () => {
  formAddItem.item_prices.push({ price: 0, min_quantity: 0 })
}

// Fungsi untuk menghapus baris harga bertingkat
const removePriceTier = (index: number) => {
  formAddItem.item_prices.splice(index, 1)
}

const resetForm = () => {
  formAddItem.name = ''
  formAddItem.description = ''
  formAddItem.barcode = ''
  formAddItem.image = null
  selectedCategories.value = []

  // Reset harga ke kondisi awal
  formAddItem.item_prices = [{ price: 0, min_quantity: 1 }]
}

// Submit form untuk menambahkan item baru
const submitForm = async () => {
  if (isSubmitting.value)
    return

  isSubmitting.value = true

  const formData = new FormData()

  // Menyusun data sesuai skema baru
  formData.append('name', formAddItem.name)
  formData.append('description', formAddItem.description)
  formData.append('barcode', formAddItem.barcode)
  formData.append('categories', JSON.stringify(selectedCategories.value))

  // Mengubah array of objects menjadi JSON string
  formData.append('item_prices', JSON.stringify(formAddItem.item_prices))

  if (formAddItem.image)
    formData.append('image', formAddItem.image)

  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/item`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    await fetchItems()
    dialogAddItem.value = false
    resetForm()

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Item baru berhasil ditambahkan.',
      timer: 2000,
      showConfirmButton: false,
    })
  }
  catch (error: any) {
    console.error('Error submitting form:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal Menambahkan Item',
      text: error.response?.data?.message || 'Terjadi kesalahan pada server.',
    })
  }
  finally {
    isSubmitting.value = false
  }
}

// Handler ketika item di-update dari komponen child
const onItemUpdated = async () => {
  await fetchItems()
}

// =================================================================
// Lifecycle Hooks
// =================================================================

onMounted(async () => {
  await fetchItems()
  await fetchCategories()
})
</script>

<template>
  <!-- VCard paling atas sekarang hanya berisi fungsionalitas pencarian -->
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
                placeholder="Temukan Item berdasarkan Nama atau Barcode"
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

  <VCard class="mb-10">
    <VCardTitle class="d-flex justify-space-between align-center pa-5">
      <h5 class="text-h5">
        Daftar Item
      </h5>
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
          <p class="text-medium-emphasis mt-4">
            Memuat data item...
          </p>
        </VCol>

        <!-- Menggunakan filteredItems untuk menampilkan hasil -->
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

    <div class="text-center pb-5">
      <VPagination
        v-model="pagination.currentPage"
        :length="pagination.totalPages"
        :total-visible="5"
        rounded="circle"
        @update:model-value="fetchItems"
      />
    </div>
  </VCard>

  <!-- Card untuk Tabel CRUD Stock -->
  <VCard class="mt-10">
    <VCardTitle class="pa-5">
      <h5 class="text-h5">
        Manajemen Stok Item
      </h5>
    </VCardTitle>
    <VCardText>
      <StockTable :items="items" />
      <!-- Meneruskan daftar item ke komponen StockTable -->
    </VCardText>
  </VCard>

  <VDialog
    v-model="dialogAddItem"
    max-width="600"
    persistent
  >
    <VCard>
      <VForm @submit.prevent="submitForm">
        <VCardTitle class="pa-4">
          Tambah Item Baru
        </VCardTitle>

        <VCardText class="pb-0">
          <VTextField
            v-model="formAddItem.name"
            label="Nama Item"
            class="mb-4"
            required
            data-testid="form-item-name"
          />

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
            class="mb-4"
          >
            <template #prepend-item>
              <VListItem
                title="Tambah Kategori Baru"
                @click="addCategory"
              >
                <template #prepend>
                  <VIcon
                    icon="ri-add-box-line"
                    class="mr-2"
                  />
                </template>
              </VListItem>

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

          <p class="text-subtitle-1 mb-2">
            Pengaturan Harga
          </p>

          <VTextField
            v-model.number="formAddItem.item_prices[0].price"
            label="Harga Dasar"
            type="number"
            prefix="Rp"
            class="mb-2"
            required
            hint="Harga ini berlaku untuk pembelian minimal 1 buah."
            persistent-hint
          />

          <VDivider class="my-4" />

          <div
            v-for="(tier, index) in formAddItem.item_prices.slice(1)"
            :key="index"
            class="d-flex align-center ga-2 mb-3"
          >
            <VTextField
              v-model.number="formAddItem.item_prices[index + 1].min_quantity"
              label="Min. Kuantitas"
              type="number"
              density="compact"
              hide-details
              style="width: 150px"
            />
            <VTextField
              v-model.number="formAddItem.item_prices[index + 1].price"
              label="Harga per Item"
              type="number"
              prefix="Rp"
              density="compact"
              hide-details
              class="flex-grow-1"
            />
            <VBtn
              icon="ri-delete-bin-line"
              variant="text"
              color="error"
              size="small"
              @click="removePriceTier(index + 1)"
            />
          </div>

          <VBtn
            block
            variant="tonal"
            color="primary"
            prepend-icon="ri-add-line"
            class="mb-4"
            @click="addPriceTier"
          >
            Tambah Harga Bertingkat
          </VBtn>

          <VDivider class="my-4" />

          <VFileInput
            label="Upload Gambar"
            accept="image/*"
            class="mb-4"
            required
            @change="handleFileUpload"
          />

          <VTextField
            v-model="formAddItem.barcode"
            label="Barcode Item (Opsional)"
          />

          <VTextarea
            v-model="formAddItem.description"
            label="Deskripsi (Opsional)"
            class="mt-4"
            rows="3"
            required
          />
        </VCardText>

        <VCardActions class="pa-4 d-flex justify-end">
          <VBtn
            color="secondary"
            variant="text"
            @click="dialogAddItem = false"
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
/* Menghapus style yang tidak lagi relevan */
</style>
