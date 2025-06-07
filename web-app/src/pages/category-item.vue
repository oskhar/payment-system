<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { VForm } from 'vuetify/components'

// State
const categories = ref<{ id: number; name: string }[]>([])
const dialogAdd = ref(false)
const name = ref('')
const formRef = ref<typeof VForm | null>(null)

// Fetch categories
const fetchCategories = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/category`)
    categories.value = res.data.data || []
  } catch (err) {
    console.error('Gagal mengambil kategori:', err)
  }
}

// Create category
const addCategory = async () => {
  try {
    const isValid = await formRef.value?.validate()
    if (!isValid.valid) return

    const res = await axios.post(`${import.meta.env.VITE_API_URL}/category`, {
      name: name.value,
    })

    Swal.fire({
      icon: 'success',
      title: 'Kategori Ditambahkan!',
      text: res.data.message || 'Kategori berhasil ditambahkan.',
      timer: 2000,
      showConfirmButton: false,
    })

    dialogAdd.value = false
    name.value = ''
    fetchCategories()
  } catch (err) {
    console.error('Gagal menambah kategori:', err)
    Swal.fire('Gagal', 'Kategori tidak bisa ditambahkan.', 'error')
  }
}

// Delete category
const deleteCategory = async (ids: number[]) => {
  const confirmation = await Swal.fire({
    title: 'Hapus kategori?',
    text: 'Tindakan ini tidak dapat dibatalkan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
    buttonsStyling: false,
    customClass: {
      confirmButton: 'v-btn v-btn--elevated v-btn--density-default v-btn--size-default bg-error text-white',
      cancelButton: 'v-btn v-btn--elevated v-btn--density-default v-btn--size-default bg-secondary text-white ml-3',
    },
  })

  if (confirmation.isConfirmed) {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/category`, { data: { ids } })
      Swal.fire('Terhapus!', 'Kategori berhasil dihapus.', 'success')
      fetchCategories()
    } catch (err) {
      console.error('Gagal menghapus kategori:', err)
      Swal.fire('Gagal', 'Kategori tidak bisa dihapus.', 'error')
    }
  }
}

// On mount
onMounted(() => {
  fetchCategories()
})
</script>

<template>
  <VCard class="mt-6">
    <CardTitle class="pa-5 d-flex justify-space-between align-center">
      <div class="text-h5">Kategori</div>
      <VBtn
        color="primary"
        prepend-icon="ri-add-line"
        @click="dialogAdd = true"
      >
        Tambah
      </VBtn>
    </CardTitle>

    <VCardText>
      <VTable dense>
        <thead>
          <tr>
            <th>NO</th>
            <th>Nama Kategori</th>
            <th class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(cat, index) in categories"
            :key="cat.id"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ cat.name }}</td>
            <td class="text-center">
              <VBtn
                color="error"
                icon="ri-delete-bin-line"
                variant="tonal"
                @click="deleteCategory([+cat.id])"
              />
            </td>
          </tr>
          <tr v-if="categories.length === 0">
            <td
              colspan="3"
              class="text-center text-medium-emphasis"
            >
              Tidak ada kategori.
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>

  <!-- Dialog Tambah Kategori -->
  <VDialog
    v-model="dialogAdd"
    max-width="400"
  >
    <VCard>
      <VCardTitle class="pa-4">Tambah Kategori</VCardTitle>
      <VForm
        ref="formRef"
        @submit.prevent="addCategory"
      >
        <VCardText>
          <VTextField
            v-model="name"
            label="Nama Kategori"
            required
          />
        </VCardText>
        <VCardActions class="pa-4 justify-end">
          <VBtn
            variant="outlined"
            color="secondary"
            @click="dialogAdd = false"
          >
            Batal
          </VBtn>
          <VBtn
            type="submit"
            color="primary"
          >
            Simpan
          </VBtn>
        </VCardActions>
      </VForm>
    </VCard>
  </VDialog>
</template>

<style scoped lang="scss">
.text-h5 {
  font-weight: 600;
}
</style>
