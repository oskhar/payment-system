<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Trophy from '@images/misc/Trophy.png'
import OnlyBook from '@images/misc/OnlyBook.png'
import Swal from 'sweetalert2'
import ShoppingCard from '@/views/pages/items/ShoppingCard.vue'

const items = ref<
  {
    id: number
    name: string
    category: string
    stock: number
    price: number
    image_url: string
    description: string
    created_at: Date
  }[]
>([])
const selectedCategory = ref([])
const categories = ref<
  {
    id: number
    name: string
  }[]
>([])

const isAllSelected = computed(() => {
  return selectedCategory.value.length === categories.value.length
})
// Fungsi untuk memilih semua atau menghapus semua
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedCategory.value = []
  } else {
    selectedCategory.value = categories.value.map(c => c.id)
  }
}

const addCategory = async () => {
  const { value: categoryName } = await Swal.fire({
    title: 'Tambah Kategori',
    input: 'text',
    inputLabel: 'Nama Kategori',
    inputPlaceholder: 'Masukkan nama kategori',
    showCancelButton: true,
    reverseButtons: true,
    confirmButtonText: 'Tambah',
    inputValidator: value => {
      if (!value) return 'Nama kategori tidak boleh kosong!'
    },
    didOpen: () => {
      const swalEl = document.querySelector('.swal2-popup')
      if (swalEl) {
        swalEl.style.zIndex = '5000' // Lebih tinggi dari Vuetify dialog
      }

      const backdrop = document.querySelector('.swal2-backdrop-show')
      if (backdrop) {
        backdrop.style.zIndex = '4999'
      }
    },
    customClass: {
      confirmButton: 'v-btn v-btn--elevated v-btn--density-default v-btn--size-default bg-primary text-white',
      cancelButton: 'v-btn v-btn--elevated v-btn--density-default v-btn--size-default bg-secondary text-white ml-3',
    },
  })

  if (categoryName) {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/category`, {
        name: categoryName,
      })

      // Tampilkan notifikasi sukses
      Swal.fire({
        icon: 'success',
        title: 'Kategori Ditambahkan!',
        text: res.data.message || 'Kategori berhasil ditambahkan.',
        timer: 2000,
        showConfirmButton: false,
      })

      // Tambahkan ke daftar kategori
      categories.value.push({
        id: res.data.data?.id || Math.random(), // fallback id
        name: categoryName,
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menambahkan Kategori',
        text: error.response?.data?.message || 'Terjadi kesalahan.',
      })
    }
  }
}

// Fungsi untuk mengambil data pelanggan
const fetchCategory = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/category`)
    categories.value = response.data.data
    console.log(categories.value)
  } catch (error) {
    console.error('Gagal mengambil data pelanggan:', error)
  }
}

const dialogAddItem = ref<boolean>(false)

const name = ref('')
const price = ref(0)
const description = ref('')
const image = ref(null)

const handleFileUpload = event => {
  image.value = event.target.files[0]
}

const isSubmitting = ref(false)

const submitForm = async () => {
  if (isSubmitting.value) return // Cegah klik ganda

  isSubmitting.value = true

  const categoriesArray = JSON.stringify(categories.value.map((c: { id: number; name: string }) => c.id))
  const formData = new FormData()
  formData.append('name', name.value)
  formData.append('categories', categoriesArray)
  formData.append('price', price.value)
  formData.append('description', description.value)
  if (image.value) {
    formData.append('image', image.value)
  }

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/item`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Item berhasil ditambahkan.',
      timer: 2000,
      showConfirmButton: false,
    })
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    isSubmitting.value = false
    dialogAddItem.value = false
  }
}

const page = ref<number>(1)
const totalPage = 3

const prevPage = () => {
  page.value--
}

const nextPage = () => {
  page.value++
}

const onItemUpdated = async updatedData => {
  const index = items.value.findIndex(item => item.id === updatedData.id)
  items.value[index] = { ...items.value[index], ...updatedData }
}

const dialog = ref<boolean>(false)
const selectedPrologue = ref<string>('')
const openDialog = (prologue: string) => {
  selectedPrologue.value = prologue
  dialog.value = true
}

// Fungsi untuk mengambil data pelanggan
const fetchItems = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/item`)
    items.value = response.data.data.items.map(row => ({
      ...row,
      image_url: `${import.meta.env.VITE_API_URL}${row.image_url}`,
    }))
    console.log(items.value)
  } catch (error) {
    console.error('Gagal mengambil data pelanggan:', error)
  }
}

onMounted(async () => {
  await fetchItems()
  await fetchCategory()
})
</script>

<template>
  <VCard class="text-center">
    <VRow
      gap="10"
      class="text-center d-flex justify-center my-3 align-stretch"
    >
      <img
        :src="OnlyBook"
        alt="Pencil rocket icon"
        class="icon-img ml-5"
      />
      <VSpacer />
      <VCol cols="7">
        <!-- Header Section -->
        <VCardItem class="text-center d-flex justify-center my-3">
          <h1 class="text-h4 px-16">
            Cari, kelola, dan temukan stok dengan mudah.
            <span class="text-primary">Semua dalam satu sistem.</span>
          </h1>
          <p class="text-body-2 mt-2">
            Kelola stok dengan mudah melalui sistem yang efisien, dari pencatatan barang hingga manajemen inventaris,
            pengiriman, dan lainnya.
          </p>
        </VCardItem>

        <!-- Search Bar -->
        <VCardText class="d-flex justify-center">
          <div class="search-container">
            <VTextField
              id="search"
              placeholder="Temukan Item"
              variant="outlined"
              density="compact"
              hide-details
            />
            <VBtn class="ml-3">
              <VIcon>ri-search-line</VIcon>
            </VBtn>
          </div>
        </VCardText>
      </VCol>
      <VSpacer />
      <img
        :src="Trophy"
        alt="Pencil rocket icon"
        class="icon-img mr-8"
      />
    </VRow>
  </VCard>
  <VCard class="mt-10">
    <CardTitle class="d-flex justify-space-between align-center pa-5">
      <p class="text-h5">Item List</p>
      <VBtn
        prepend-icon="ri-add-line"
        color="success"
        style="width: 7rem"
        rounded
        @click="dialogAddItem = true"
      >
        Tambah
      </VBtn>
    </CardTitle>
    <div class="pb-5 px-5">
      <VRow
        class=""
        style="justify-content: space-between"
        no-gutters
      >
        <!-- Jika items ada -->
        <template v-if="items.length > 0">
          <VCol
            cols="4"
            class="mb-3"
            v-for="item in items"
          >
            <ShoppingCard
              :key="item.id"
              :item="item"
              @close="handleRemove(item.id)"
              @updated="onItemUpdated"
            />
          </VCol>
        </template>

        <!-- Jika items kosong -->
        <template v-else>
          <VCol
            cols="12"
            class="text-center py-10"
          >
            <p class="text-medium-emphasis">Belum ada item tersedia.</p>
          </VCol>
        </template>
      </VRow>
    </div>
    <div class="text-center justify-center align-items mb-5 d-flex ga-1">
      <VBtn
        color="grey-lighten-2"
        icon="ri-arrow-left-double-line"
        density="default"
        :disabled="page === 1"
        @click="page = 1"
      />

      <VBtn
        color="grey-lighten-2"
        icon="ri-arrow-left-s-line"
        density="default"
        :disabled="page === 1"
        @click="prevPage"
      />

      <VBtn
        v-for="n in totalPage"
        :key="n"
        :color="n === page ? 'primary' : 'grey-lighten-2'"
        rounded
        @click="page = n"
      >
        {{ n }}
      </VBtn>

      <VBtn
        color="grey-lighten-2"
        icon="ri-arrow-right-s-line"
        density="default"
        :disabled="page === totalPage"
        @click="nextPage"
      />

      <VBtn
        color="grey-lighten-2"
        icon="ri-arrow-right-double-line"
        density="default"
        :disabled="page === totalPage"
        @click="page = totalPage"
      />
    </div>
  </VCard>
  <!-- Modal Form -->
  <VDialog
    v-model="dialogAddItem"
    max-width="400"
  >
    <VCard>
      <VCardTitle class="pa-4">Tambah Item</VCardTitle>
      <VForm @submit.prevent="submitForm">
        <VCardText>
          <VTextField
            class="mb-3"
            v-model="name"
            label="Nama Item"
            required
          ></VTextField>
          <VSelect
            clearable
            chips
            class="mb-3"
            v-model="selectedCategory"
            label="Kategori"
            :items="categories"
            item-title="name"
            item-value="id"
            multiple
            variant="outlined"
          >
            <!-- Pilih Semua -->
            <template #prepend-item>
              <VListItem
                title="Tambah Kategori"
                @click="addCategory"
              >
                <template #prepend>
                  <VIcon>ri-add-box-line</VIcon>
                </template>
              </VListItem>
              <VListItem
                title="Pilih Semua"
                @click="toggleSelectAll"
              >
                <template #prepend>
                  <VCheckbox :model-value="isAllSelected" />
                </template>
              </VListItem>
            </template>

            <!-- Tambah Kategori -->
            <template #append-item> </template>
          </VSelect>
          <VTextField
            class="mb-3"
            v-model.number="price"
            label="Harga"
            type="number"
            required
          ></VTextField>
          <VTextarea
            class="mb-3"
            v-model="description"
            label="Deskripsi"
            required
          ></VTextarea>

          <VFileInput
            class="mb-3"
            label="Upload Gambar"
            @change="handleFileUpload"
            accept="image/*"
            required
          ></VFileInput>
        </VCardText>
        <VCardActions class="pa-4 d-flex justify-end">
          <VBtn
            color="secondary"
            variant="outlined"
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
            @click="submitForm"
          >
            Submit
          </VBtn>
        </VCardActions>
      </VForm>
    </VCard>
  </VDialog>
</template>

<style scoped lang="scss">
.search-container {
  display: flex;
  align-items: center;
  width: 450px;
}
.icon-img {
  height: 200px;
}
.custom-swal-zindex {
  z-index: 90000 !important;
}
</style>
