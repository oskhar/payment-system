<template>
  <!-- SECTION: Card Display -->
  <VCard class="shopping-card" elevation="4" max-width="360" rounded="xl">
    <!-- Delete Button -->
    <VBtn icon variant="flat" size="small" class="close-btn" aria-label="Delete item" data-testid="delete-button"
      @click="handleDeleteItem">
      <VIcon icon="ri-close-line" />
    </VBtn>

    <!-- Product Image -->
    <VImg :src="item.image_url" :alt="`Gambar ${item.name}`" height="220" cover />

    <!-- Main Content -->
    <VCardText class="pt-4">
      <h3 class="title">
        {{ item.name }}
      </h3>
      <p class="price">
        {{ formattedBasePrice }}
      </p>
      <p class="stock" :class="{ 'out-of-stock': item.stock === 0 }">
        Stok: {{ item.stock }}
      </p>
      <p class="barcode">Barcode: {{ item.barcode || '-' }}</p>

      <!-- Categories -->
      <div v-if="item.categories?.length" class="categories">
        <VChip v-for="category in item.categories" :key="category.id" class="category-chip" color="secondary"
          size="small" variant="tonal">
          {{ category.name }}
        </VChip>
      </div>
    </VCardText>

    <!-- Actions -->
    <VCardActions class="pa-4 pt-0">
      <VRow no-gutters>
        <VCol>
          <VBtn color="success" variant="tonal" prepend-icon="ri-add-line" block data-testid="restock-button"
            @click="openRestockDialog">
            Restock
          </VBtn>
        </VCol>
        <VCol class="pl-2">
          <VBtn prepend-icon="ri-pencil-line" block color="primary" variant="tonal" data-testid="edit-button"
            @click="openItemFormDialog">
            Edit
          </VBtn>
        </VCol>
      </VRow>
    </VCardActions>
  </VCard>
  <!-- !SECTION -->

  <!-- SECTION: Edit Item Dialog -->
  <VDialog v-model="dialogs.itemForm" max-width="600" persistent>
    <VCard>
      <VForm @submit.prevent="submitItemForm">
        <VCardTitle class="pa-4"> Edit Item </VCardTitle>

        <VCardText class="pb-0">
          <VTextField v-model="form.name" label="Nama Item" class="mb-4" required />
          <VTextField v-model="form.barcode" label="Barcode Item" class="mb-4" />
          <VSelect v-model="form.selectedCategories" label="Kategori" :items="categories" item-title="name"
            item-value="id" multiple chips clearable closable-chips class="mb-4" variant="outlined">
            <template #prepend-item>
              <VListItem title="Pilih Semua" @click="toggleSelectAllCategories">
                <template #prepend>
                  <VCheckbox :model-value="isAllCategoriesSelected" />
                </template>
              </VListItem>
              <VDivider />
            </template>
          </VSelect>

          <!-- Price Section -->
          <p class="text-subtitle-1 mb-2">Pengaturan Harga</p>
          <VTextField v-if="form.item_prices.length > 0" v-model.number="form.item_prices[0].price" label="Harga Dasar"
            type="number" prefix="Rp" class="mb-2" required hint="Harga untuk pembelian minimal 1 buah."
            persistent-hint />
          <VDivider class="my-4" />

          <!-- Tiered Prices -->
          <div v-for="(tier, index) in form.item_prices.slice(1)" :key="index" class="d-flex align-center ga-2 mb-3">
            <VTextField v-model.number="form.item_prices[index + 1].min_quantity" label="Min. Kuantitas" type="number"
              density="compact" hide-details style="width: 150px" />
            <VTextField v-model.number="form.item_prices[index + 1].price" label="Harga per Item" type="number"
              prefix="Rp" density="compact" hide-details class="flex-grow-1" />
            <VBtn icon="ri-delete-bin-line" variant="text" color="error" size="small"
              @click="removePriceTier(index + 1)" />
          </div>
          <VBtn block variant="tonal" color="primary" prepend-icon="ri-add-line" class="mb-4" @click="addPriceTier">
            Tambah Harga Bertingkat
          </VBtn>
          <VDivider class="my-4" />

          <VTextarea v-model="form.description" label="Deskripsi" rows="3" class="mb-4" />
          <VFileInput v-model="form.imageFile" label="Upload Gambar Baru (Opsional)" accept="image/*" prepend-icon=""
            prepend-inner-icon="ri-image-add-line" />
        </VCardText>

        <VCardActions class="pa-4 d-flex justify-end">
          <VBtn color="secondary" variant="text" @click="closeAllDialogs">
            Batal
          </VBtn>
          <VBtn type="submit" variant="elevated" color="primary">
            Update
          </VBtn>
        </VCardActions>
      </VForm>
    </VCard>
  </VDialog>
  <!-- !SECTION -->

  <!-- SECTION: Restock Dialog -->
  <VDialog v-model="dialogs.restock" max-width="500" persistent>
    <VCard>
      <VForm @submit.prevent="submitRestockForm">
        <VCardTitle class="pa-4"> Restock: {{ item.name }} </VCardTitle>
        <VCardText>
          <VTextField v-model="restockForm.transaction_number"
            :label="restockForm.transaction_number_auto ? 'No Transaksi (Otomatis)' : 'No Transaksi'"
            :disabled="restockForm.transaction_number_auto" class="mb-2" />
          <VSwitch v-model="restockForm.transaction_number_auto" label="Nomor transaksi otomatis" color="primary"
            class="mb-2" />
          <VSelect v-model="restockForm.type" label="Tipe Transaksi" :items="[
            { title: 'Stok Masuk', value: 'stock_in' },
            { title: 'Stok Keluar', value: 'stock_out' },
          ]" class="mb-4" required />
          <VTextField v-model.number="restockForm.quantity" label="Jumlah Item" type="number" class="mb-4" required />
          <VTextarea v-model="restockForm.description" label="Deskripsi (Opsional)" auto-grow clearable rows="2" />
        </VCardText>
        <VCardActions class="pa-4 d-flex justify-end">
          <VBtn color="secondary" variant="text" @click="closeAllDialogs">
            Batal
          </VBtn>
          <VBtn type="submit" variant="elevated" color="primary">
            Submit
          </VBtn>
        </VCardActions>
      </VForm>
    </VCard>
  </VDialog>
  <!-- !SECTION -->
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import Swal from 'sweetalert2'
import axios from 'axios'

// =================================================================
// Type Definitions
// =================================================================
interface Category {
  id: number
  name: string
}

interface ItemPrice {
  id?: number // ID bersifat opsional, karena harga baru belum punya ID
  price: number
  min_quantity: number
}

interface Item {
  id: number
  image_url: string
  name: string
  barcode: string
  stock: number
  categories: Category[]
  description: string
  item_prices: ItemPrice[] // Relasi baru
}

// =================================================================
// Props & Emits
// =================================================================
const props = defineProps<{
  item: Item
}>()

const emit = defineEmits<{
  (e: 'updated'): void
}>()

// =================================================================
// Reactive State
// =================================================================

const dialogs = reactive({
  itemForm: false,
  restock: false,
})

const form = reactive({
  name: '',
  barcode: '',
  selectedCategories: [] as number[],
  item_prices: [{ price: 0, min_quantity: 1 }] as ItemPrice[], // State untuk harga bertingkat
  description: '',
  imageFile: null as File[] | null,
})

const restockForm = reactive({
  transaction_number: '',
  transaction_number_auto: true,
  type: 'stock_in',
  description: '',
  quantity: 0,
})

const categories = ref<Category[]>([])

// =================================================================
// Computed Properties
// =================================================================

const formattedBasePrice = computed(() => {
  const basePriceTier = props.item.item_prices?.find(p => p.min_quantity === 1)
  const price = basePriceTier?.price || 0
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
})

const isAllCategoriesSelected = computed(() => {
  return categories.value.length > 0 && form.selectedCategories.length === categories.value.length
})

// =================================================================
// Functions: Dialog Management
// =================================================================

const openItemFormDialog = () => {
  // Populate form with existing item data for editing
  form.name = props.item.name
  form.barcode = props.item.barcode
  form.selectedCategories = props.item.categories.map(c => c.id)
  form.description = props.item.description || ''

  // PERBAIKAN: Logika pengisian harga yang lebih aman
  // Deep copy harga untuk menghindari mutasi props
  let prices = JSON.parse(JSON.stringify(props.item.item_prices || []))

  // Pastikan selalu ada minimal satu harga (harga dasar)
  if (prices.length === 0) {
    prices.push({ price: 0, min_quantity: 1 })
  }

  // Paksa harga dasar (elemen pertama) untuk selalu memiliki min_quantity: 1
  prices[0].min_quantity = 1

  form.item_prices = prices

  form.imageFile = null // Reset file input
  dialogs.itemForm = true
}

const openRestockDialog = () => {
  dialogs.restock = true
}

const closeAllDialogs = () => {
  dialogs.itemForm = false
  dialogs.restock = false
  resetItemForm()
  resetRestockForm()
}

// =================================================================
// Functions: Form Handling
// =================================================================

const resetItemForm = () => {
  form.name = ''
  form.barcode = ''
  form.selectedCategories = []
  form.item_prices = [{ price: 0, min_quantity: 1 }]
  form.description = ''
  form.imageFile = null
}

const resetRestockForm = () => {
  restockForm.transaction_number = ''
  restockForm.transaction_number_auto = true
  restockForm.type = 'stock_in'
  restockForm.description = ''
  restockForm.quantity = 0
}

const addPriceTier = () => {
  form.item_prices.push({ price: 0, min_quantity: 0 })
}

const removePriceTier = (index: number) => {
  form.item_prices.splice(index, 1)
}

const toggleSelectAllCategories = () => {
  if (isAllCategoriesSelected.value) form.selectedCategories = []
  else form.selectedCategories = categories.value.map(c => c.id)
}

// =================================================================
// Functions: API Calls & Logic
// =================================================================

const submitItemForm = async () => {
  try {
    // PERBAIKAN: Pastikan kuantitas minimum untuk harga dasar adalah 1 sebelum submit
    if (form.item_prices.length > 0) {
      form.item_prices[0].min_quantity = 1
    }

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('barcode', form.barcode)
    formData.append('description', form.description)
    formData.append('categories', JSON.stringify(form.selectedCategories))

    // Kirim data harga sebagai string JSON
    formData.append('item_prices', JSON.stringify(form.item_prices))

    if (form.imageFile?.[0]) {
      formData.append('image', form.imageFile[0])
    }

    // Menggunakan metode PUT untuk update (lebih sesuai semantik REST)
    await axios.put(`${import.meta.env.VITE_API_URL}/item/${props.item.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    Swal.fire('Berhasil', 'Item berhasil diperbarui.', 'success')
    emit('updated')
  } catch (error) {
    console.error('Gagal submit form:', error)
    Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan data.', 'error')
  } finally {
    closeAllDialogs()
  }
}

const submitRestockForm = async () => {
  try {
    const payload = {
      transaction_number: restockForm.transaction_number_auto ? 'auto' : restockForm.transaction_number,
      type: restockForm.type,
      description: restockForm.description,
      quantity: restockForm.quantity,
    }
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/item/${props.item.id}/stock`, payload)

    if (res.data.status) {
      emit('updated')
      Swal.fire('Berhasil', 'Stok item berhasil diupdate.', 'success')
    } else {
      Swal.fire('Gagal', res.data.message || 'Gagal melakukan restock.', 'error')
    }
  } catch (error: any) {
    console.error('Gagal submit restock:', error)
    Swal.fire('Gagal', error?.message || 'Terjadi kesalahan pada server.', 'error')
  } finally {
    closeAllDialogs()
  }
}

const handleDeleteItem = async () => {
  const result = await Swal.fire({
    title: `Hapus "${props.item.name}"?`,
    text: 'Tindakan ini tidak dapat dibatalkan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
    reverseButtons: true,
    customClass: {
      confirmButton: 'v-btn bg-error text-white',
      cancelButton: 'v-btn bg-secondary text-white mr-2',
    },
    buttonsStyling: false,
  })

  if (result.isConfirmed) {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/item`, { data: { ids: [parseInt(props.item.id)] } })
      Swal.fire('Terhapus!', 'Item berhasil dihapus.', 'success')
      emit('updated')
    } catch (err) {
      console.error('Gagal menghapus item:', err)
      Swal.fire('Gagal', 'Item tidak dapat dihapus.', 'error')
    }
  }
}

const fetchCategories = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/category`)
    categories.value = response.data.data
  } catch (error) {
    console.error('Gagal mengambil data kategori:', error)
  }
}

// =================================================================
// Lifecycle Hooks
// =================================================================

onMounted(() => {
  fetchCategories()
})
</script>

<style lang="scss" scoped>
.shopping-card {
  position: relative;
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;

  &:hover {
    box-shadow: 0 12px 24px rgba(var(--v-theme-primary-darken-1), 0.2);
    transform: translateY(-5px);
  }

  .close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(2px);
  }

  .title {
    font-weight: 600;
    font-size: 1.15rem;
    color: rgb(var(--v-theme-on-surface));
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .price {
    font-weight: 700;
    font-size: 1.1rem;
    color: rgb(var(--v-theme-primary));
    margin-bottom: 0.5rem;
  }

  .stock {
    font-size: 0.9rem;
    color: rgb(var(--v-theme-success));

    &.out-of-stock {
      color: rgb(var(--v-theme-error));
      font-weight: 500;
    }
  }

  .barcode {
    font-size: 0.8rem;
    color: rgba(var(--v-theme-on-surface), 0.6);
    margin-bottom: 0.75rem;
  }

  .categories {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    min-height: 30px; // ensure consistent height even with no chips
  }
}
</style>
