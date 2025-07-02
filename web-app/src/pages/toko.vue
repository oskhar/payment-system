<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { VForm } from 'vuetify/components'

type Branch = {
  id: number
  name: string
  address: string
  image_url: string | null
}

const branches = ref<Branch[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<typeof VForm | null>(null)

const name = ref('')
const address = ref('')
const imageUrl = ref('')
const selectedId = ref<number | null>(null)

const fetchBranches = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/branch`)
    branches.value = res.data.data || []
  } catch (err) {
    console.error('Gagal mengambil data cabang:', err)
  }
}

const resetForm = () => {
  name.value = ''
  address.value = ''
  imageUrl.value = ''
  selectedId.value = null
  isEdit.value = false
}

const openAddDialog = () => {
  resetForm()
  dialogVisible.value = true
}

const openEditDialog = (branch: Branch) => {
  name.value = branch.name
  address.value = branch.address
  imageUrl.value = branch.image_url || ''
  selectedId.value = branch.id
  isEdit.value = true
  dialogVisible.value = true
}

const saveBranch = async () => {
  const isValid = await formRef.value?.validate()
  if (!isValid?.valid) return

  const payload = {
    name: name.value,
    address: address.value,
    image_url: imageUrl.value || null,
  }

  try {
    if (isEdit.value && selectedId.value !== null) {
      await axios.put(`${import.meta.env.VITE_API_URL}/branch/${selectedId.value}`, payload)
      Swal.fire('Berhasil', 'Cabang berhasil diperbarui.', 'success')
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/branch`, payload)
      Swal.fire('Berhasil', 'Cabang berhasil ditambahkan.', 'success')
    }

    dialogVisible.value = false
    resetForm()
    fetchBranches()
  } catch (err) {
    console.error('Gagal menyimpan cabang:', err)
    Swal.fire('Gagal', 'Terjadi kesalahan saat menyimpan cabang.', 'error')
  }
}

const deleteBranch = async (id: number) => {
  const confirm = await Swal.fire({
    title: 'Hapus cabang?',
    text: 'Tindakan ini tidak dapat dibatalkan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  })

  if (confirm.isConfirmed) {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/branch`, {
        data: { ids: [id] },
      })
      Swal.fire('Terhapus!', 'Cabang berhasil dihapus.', 'success')
      fetchBranches()
    } catch (err) {
      console.error('Gagal menghapus cabang:', err)
      Swal.fire('Gagal', 'Tidak bisa menghapus cabang.', 'error')
    }
  }
}

onMounted(fetchBranches)
</script>

<template>
  <VCard class="mt-6">
    <VCardTitle class="pa-5 d-flex justify-space-between align-center">
      <div class="text-h5">Daftar Cabang</div>
      <VBtn color="primary" prepend-icon="ri-add-line" @click="openAddDialog">
        Tambah Cabang
      </VBtn>
    </VCardTitle>

    <VCardText>
      <VTable dense>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Lokasi</th>
            <th>Gambar</th>
            <th class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(branch, index) in branches" :key="branch.id">
            <td>{{ index + 1 }}</td>
            <td>{{ branch.name }}</td>
            <td>{{ branch.address }}</td>
            <td>
              <img
                v-if="branch.image_url"
                :src="branch.image_url"
                alt="Gambar"
                width="60"
                height="40"
              />
            </td>
            <td class="text-center">
              <VBtn icon="ri-edit-line" color="warning" variant="tonal" @click="openEditDialog(branch)" />
              <VBtn icon="ri-delete-bin-line" color="error" variant="tonal" @click="deleteBranch(branch.id)" />
            </td>
          </tr>
          <tr v-if="branches.length === 0">
            <td colspan="5" class="text-center text-medium-emphasis">Belum ada data cabang.</td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>

  <!-- Dialog Tambah/Edit -->
  <VDialog v-model="dialogVisible" max-width="500">
    <VCard>
      <VCardTitle class="pa-4">{{ isEdit ? 'Edit Cabang' : 'Tambah Cabang' }}</VCardTitle>
      <VForm ref="formRef" @submit.prevent="saveBranch">
        <VCardText>
          <VTextField v-model="name" label="Nama Cabang" required />
          <VTextField v-model="address" label="Lokasi" required />
          <VTextField v-model="imageUrl" label="URL Gambar (Opsional)" />
        </VCardText>
        <VCardActions class="pa-4 justify-end">
          <VBtn variant="outlined" color="secondary" @click="dialogVisible = false">Batal</VBtn>
          <VBtn type="submit" color="primary">Simpan</VBtn>
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
