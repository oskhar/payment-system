<template>
  <VCard
    class="shopping-card"
    elevation="8"
    max-width="360"
  >
    <!-- Tombol silang pojok kanan atas -->
    <VBtn
      icon
      class="close-btn"
      color="error"
      aria-label="Close card"
      @click="deleteItem([+item.id])"
    >
      <VIcon>ri-close-line</VIcon>
    </VBtn>

    <!-- Gambar produk -->
    <VImg
      :src="item.image_url"
      alt="Gambar produk"
      height="220"
      class="product-image"
      cover
    ></VImg>

    <!-- Konten utama -->
    <VCardText>
      <h3 class="title">{{ item.name }}</h3>
      <p class="price">Rp {{ new Intl.NumberFormat('id-ID').format(`${item.price}`.replace(/\D/g, '')) }}.-</p>
      <p
        class="stock"
        :class="{ 'out-of-stock': item.stock === 0 }"
      >
        Stok: {{ item.stock }}
      </p>

      <!-- Kategori sebagai chips -->
      <div class="categories">
        <VChip
          v-for="(category, index) in item.categories"
          :key="index"
          class="category-chip"
          color="secondary"
          text-color="white"
          small
          outlined
        >
          {{ category.name }}
        </VChip>
      </div>

      <VRow
        class="mt-3"
        no-gutters
      >
        <VCol cols="6">
          <VBtn
            color="success"
            prepend-icon="ri-add-line"
            block
            @click="dialogRestock = true"
          >
            Restock
          </VBtn>
        </VCol>
        <VCol
          cols="6"
          class="pl-1"
        >
          <VBtn
            prepend-icon="ri-pencil-line"
            block
            color="primary"
            @click="openDialog('edit', item)"
          >
            Edit
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

  <!-- Modal Dialog untuk Tambah/Edit Item -->
  <VDialog
    v-model="dialogAddItem"
    max-width="500"
  >
    <VCard>
      <VCardTitle class="pa-4">{{ editedItem ? 'Edit Item' : 'Tambah Item' }}</VCardTitle>
      <VForm
        @submit.prevent="submitForm"
        ref="formRef"
      >
        <VCardText>
          <VTextField
            class="mb-3"
            v-model="form.name"
            label="Nama Item"
            required
          ></VTextField>

          <VSelect
            clearable
            chips
            class="mb-3"
            v-model="form.selectedCategory"
            label="Kategori"
            :items="categories"
            item-title="name"
            item-value="id"
            multiple
            variant="outlined"
          >
            <template #prepend-item>
              <VListItem
                title="Pilih Semua"
                @click="toggleSelectAll"
              >
                <template #prepend>
                  <VCheckbox :model-value="isAllSelected" />
                </template>
              </VListItem>
            </template>
          </VSelect>

          <VTextField
            class="mb-3"
            v-model.number="form.price"
            label="Harga"
            type="number"
            required
          ></VTextField>

          <VTextarea
            class="mb-3"
            v-model="form.description"
            label="Deskripsi"
            required
          ></VTextarea>

          <VFileInput
            class="mb-3"
            label="Upload Gambar"
            @change="handleFileUpload"
            accept="image/*"
            :required="!editedItem"
          ></VFileInput>
        </VCardText>

        <VCardActions class="pa-4 d-flex justify-end">
          <VBtn
            color="secondary"
            variant="outlined"
            @click="closeDialog"
          >
            Batal
          </VBtn>
          <VBtn
            type="submit"
            variant="elevated"
            color="primary"
          >
            {{ editedItem ? 'Update' : 'Submit' }}
          </VBtn>
        </VCardActions>
      </VForm>
    </VCard>
  </VDialog>
  <VDialog
    v-model="dialogRestock"
    max-width="500"
  >
    <VCard>
      <VCardTitle class="pa-4">Restock Item</VCardTitle>
      <VForm
        @submit.prevent="submitRestockForm"
        ref="formRef"
      >
        <VCardText>
          <VTextField
            v-model="restockForm.transaction_number"
            class="mb-3"
            :label="restockForm.transaction_number_auto ? 'No Transaksi Otomatis Generate' : 'No Transaksi'"
            :disabled="restockForm.transaction_number_auto"
            required
          />

          <VSwitch
            v-model="restockForm.transaction_number_auto"
            class="mb-3"
            label="No Transaksi Otomatis"
            color="primary"
          />

          <VSelect
            v-model="restockForm.type"
            class="mb-3"
            label="Tipe"
            :items="[
              { name: 'Stock Masuk', value: 'stock_in' },
              { name: 'Stock Keluar', value: 'stock_out' },
            ]"
            item-title="name"
            item-value="value"
            persistent-hint
            return-object
            single-line
            required
          />

          <VTextField
            v-model.number="restockForm.quantity"
            class="mb-3"
            label="Jumlah Item"
            type="number"
            required
          />

          <VExpansionPanels
            class="mb-3"
            variant="accordion"
            elevation="0"
          >
            <VExpansionPanel>
              <VExpansionPanelTitle> Deskripsi (Opsional) </VExpansionPanelTitle>
              <VExpansionPanelText>
                <VTextarea
                  v-model="restockForm.description"
                  label="Deskripsi"
                  auto-grow
                  clearable
                />
              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>
        </VCardText>

        <VCardActions class="pa-4 d-flex justify-end">
          <VBtn
            color="secondary"
            variant="outlined"
            @click="closeDialog"
          >
            Batal
          </VBtn>
          <VBtn
            type="submit"
            variant="elevated"
            color="primary"
          >
            Submit
          </VBtn>
        </VCardActions>
      </VForm>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import axios from 'axios'

const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      image_url: '',
      name: '',
      price: 0,
      stock: 0,
      categories: [],
      description: '',
    }),
  },
})

const emit = defineEmits(['close'])

// State untuk dialog modal
const dialogAddItem = ref(false)
const dialogRestock = ref(false)

// State untuk form restock
const restockForm = ref({
  transaction_number: '',
  transaction_number_auto: true,
  type: { name: 'Stock Masuk', value: 'stock_in' },
  description: '',
  quantity: 0,
})

// State untuk form data
const form = ref({
  name: '',
  selectedCategory: [] as number[],
  price: 0,
  description: '',
  imageFile: null as File | null,
})

// State untuk kategori
const categories = ref<{ id: number; name: string }[]>([])

// State untuk item yang sedang diedit
const editedItem = ref(null as null | typeof props.item)

// Computed untuk cek semua kategori terpilih
const isAllSelected = computed(() => {
  return form.value.selectedCategory.length === categories.value.length
})

// Fungsi toggle pilih semua kategori
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    form.value.selectedCategory = []
  } else {
    form.value.selectedCategory = categories.value.map(c => c.id)
  }
}

// Fungsi untuk membuka dialog modal
const openDialog = (mode: 'edit' | 'add', itemData?: typeof props.item) => {
  if (mode === 'edit' && itemData) {
    editedItem.value = itemData
    // Isi form dengan data item yang diedit
    form.value.name = itemData.name
    form.value.selectedCategory = itemData.categories.map(c => c.id)
    form.value.price = itemData.price
    form.value.description = itemData.description || ''
    form.value.imageFile = null // reset file input
  } else {
    editedItem.value = null
    resetForm()
  }
  dialogAddItem.value = true
}

// Fungsi untuk menutup dialog dan reset form
const closeDialog = () => {
  dialogAddItem.value = false
  dialogRestock.value = false
  resetForm()
  resetRestockForm()
  editedItem.value = null
}

// Reset form ke nilai default
const resetForm = () => {
  form.value = {
    name: '',
    selectedCategory: [],
    price: 0,
    description: '',
    imageFile: null,
  }
}

const resetRestockForm = () => {
  restockForm.value = {
    transaction_number: '',
    transaction_number_auto: true,
    type: { name: 'Stock Masuk', value: 'stock_in' },
    description: '',
    quantity: 0,
  }
}

// Fungsi handle upload file gambar
const handleFileUpload = (files: File[]) => {
  form.value.imageFile = files.length > 0 ? files[0] : null
}

// Fungsi submit form untuk create atau update
const submitForm = async () => {
  try {
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('price', form.value.price.toString())
    formData.append('description', form.value.description)
    formData.append('categories', JSON.stringify(form.value.selectedCategory))
    if (form.value.imageFile) {
      formData.append('image', form.value.imageFile)
    }

    if (editedItem.value) {
      // Update item
      await axios.put(`${import.meta.env.VITE_API_URL}/item/${editedItem.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/item/${editedItem.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      console.log(data)
      Swal.fire('Berhasil', 'Item berhasil diperbarui', 'success')
      emit('updated', data.data)
    }
    closeDialog()
  } catch (error) {
    console.error('Gagal submit form:', error)
    closeDialog()
    Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan data', 'error')
  }
}

const submitRestockForm = async () => {
  try {
    console.log(props.item.id)
    await axios.post(`${import.meta.env.VITE_API_URL}/item/${props.item.id}/stock`, {
      transaction_number: restockForm.value.transaction_number_auto ? 'auto' : restockForm.value.transaction_number,
      type: restockForm.value.type.value,
      description: restockForm.value.description,
      quantity: restockForm.value.quantity,
    })
    Swal.fire('Berhasil', 'Item berhasil diupdate', 'success')
    closeDialog()
  } catch (error) {
    console.error('Gagal submit form:', error)
    closeDialog()
    Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan data', 'error')
  }
}

// Fungsi delete item (sudah ada dari kode awal)
const deleteItem = async (ids: number[]) => {
  const confirmation = await Swal.fire({
    title: 'Hapus item?',
    text: 'Tindakan ini tidak dapat dibatalkan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
    buttonsStyling: false,
    reverseButtons: true,
    customClass: {
      confirmButton: 'v-btn v-btn--elevated v-btn--density-default v-btn--size-default bg-error text-white ml-3',
      cancelButton: 'v-btn v-btn--elevated v-btn--density-default v-btn--size-default bg-secondary text-white',
    },
  })

  if (confirmation.isConfirmed) {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/item`, { data: { ids } })
      Swal.fire('Terhapus!', 'Item berhasil dihapus.', 'success')
      emit('close') // Emit event untuk refresh data di parent jika perlu
    } catch (err) {
      console.error('Gagal menghapus item:', err)
      Swal.fire('Gagal', 'Item tidak bisa dihapus.', 'error')
    }
  }
}

// Fungsi fetch kategori (bisa dipanggil di mounted atau parent)
const fetchCategory = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/category`)
    categories.value = response.data.data
  } catch (error) {
    console.error('Gagal mengambil data kategori:', error)
  }
}

// Panggil fetchCategory saat komponen mount
fetchCategory()
</script>

<style lang="scss" scoped>
.shopping-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: #ffffff;
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
  cursor: default;

  &:hover {
    box-shadow: 0 16px 32px rgba(25, 118, 210, 0.35);
    transform: translateY(-6px);
  }

  .close-btn {
    position: absolute;
    top: 14px;
    right: 14px;
    color: #555;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
    z-index: 10;

    &:hover {
      background: #1976d2;
      color: white;
    }
  }

  .product-image {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
  }

  .title {
    font-weight: 700;
    font-size: 1.4rem;
    margin-bottom: 0.3rem;
    color: #1e2d3d;
    user-select: none;
  }

  .price {
    font-weight: 600;
    font-size: 1.2rem;
    color: #1976d2;
    margin-bottom: 0.6rem;
    user-select: none;
  }

  .stock {
    font-size: 1rem;
    margin-bottom: 1rem;
    color: #4caf50;
    user-select: none;

    &.out-of-stock {
      color: #e53935;
      font-weight: 700;
    }
  }

  .categories {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .category-chip {
      border-radius: 14px;
      font-weight: 500;
      text-transform: capitalize;
      cursor: default;
      user-select: none;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #1565c0 !important;
        color: white !important;
      }
    }
  }
}
</style>
