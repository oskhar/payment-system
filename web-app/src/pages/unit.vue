<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Swal from 'sweetalert2'
import api from '@/api'

// Interface untuk mendefinisikan struktur data Unit, sekarang dengan 'code'
interface Unit {
  id: number
  name: string
  code: string // Menambahkan properti code
}

// State Management (Variabel Reaktif)
const units = ref<Unit[]>([])
const dialogAdd = ref(false)
const name = ref('')
const code = ref('') // Menambahkan state untuk input 'code'
const formRef = ref<InstanceType<typeof VForm> | null>(null)

// --- FUNGSI-FUNGSI API ---

// 1. Mengambil semua unit dari server
const fetchUnits = async () => {
  try {
    const response = await api.get(`${import.meta.env.VITE_API_URL}/unit`)

    // Memperbarui state 'units' dengan data dari response
    // Response dari backend sudah termasuk 'id', 'name', 'code', dan 'createdAt'
    units.value = response.data.data.units || []

    console.log('Units:', response.data)
  } catch (error) {
    console.error('Gagal mengambil data unit:', error)
    Swal.fire('Error', 'Gagal memuat data unit.', 'error')
  }
}

// 2. Menambahkan unit baru
const addUnit = async () => {
  try {
    // Validasi form sebelum mengirim data
    const { valid } = await formRef.value!.validate()
    if (!valid) return

    // Mengirim POST request dengan nama dan kode unit baru
    const response = await api.post('/unit', {
      name: name.value,
      abbreviation: code.value,
    })

    // Menampilkan notifikasi sukses menggunakan SweetAlert2
    Swal.fire({
      icon: 'success',
      title: 'Unit Ditambahkan!',
      text: response.data.message || 'Unit baru berhasil ditambahkan.',
      timer: 2000,
      showConfirmButton: false,
    })

    // Reset dan tutup dialog
    dialogAdd.value = false
    name.value = ''
    code.value = '' // Reset nilai 'code'
    formRef.value?.reset()

    // Ambil data terbaru dari server
    await fetchUnits()
  } catch (error) {
    console.error('Gagal menambah unit:', error)
    Swal.fire('Gagal', 'Unit tidak bisa ditambahkan.', 'error')
  }
}

// 3. Menghapus unit berdasarkan ID (Tidak perlu perubahan di sini)
const deleteUnit = async (ids: number[]) => {
  const result = await Swal.fire({
    title: 'Anda yakin?',
    text: 'Unit yang dihapus tidak dapat dikembalikan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
    buttonsStyling: false,
    customClass: {
      confirmButton: 'v-btn v-btn--elevated bg-error text-white',
      cancelButton: 'v-btn v-btn--elevated bg-secondary text-white ml-3',
    },
  })

  if (result.isConfirmed) {
    try {
      await api.delete(`${import.meta.env.VITE_API_URL}/unit`, { data: { ids } })
      Swal.fire('Terhapus!', 'Unit berhasil dihapus.', 'success')
      await fetchUnits()
    } catch (error) {
      console.error('Gagal menghapus unit:', error)
      Swal.fire('Gagal', 'Unit tidak bisa dihapus.', 'error')
    }
  }
}

// --- LIFECYCLE HOOK ---

onMounted(() => {
  fetchUnits()
})
</script>

<template>
  <VCard class="mt-6">
    <VCardTitle class="pa-5 d-flex justify-space-between align-center">
      <div class="text-h5">Manajemen Satuan Unit</div>
      <VBtn
        color="primary"
        prepend-icon="ri-add-line"
        @click="dialogAdd = true"
      >
        Tambah Unit
      </VBtn>
    </VCardTitle>

    <VCardText>
      <!-- Tabel untuk menampilkan data unit -->
      <VTable density="comfortable">
        <thead>
          <tr>
            <th class="text-left">NO</th>
            <th class="text-left">Nama Unit</th>
            <th class="text-left">Kode Unit</th>
            <!-- Kolom baru -->
            <th class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <!-- Kondisi jika tidak ada data -->
          <tr v-if="units.length === 0">
            <td
              colspan="4"
              class="text-center text-medium-emphasis py-4"
            >
              <!-- Colspan diubah menjadi 4 -->
              Tidak ada data unit.
            </td>
          </tr>
          <!-- Perulangan untuk setiap item unit -->
          <tr
            v-for="(unit, index) in units"
            :key="unit.id"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ unit.name }}</td>
            <td>{{ unit.abbreviation }}</td>
            <!-- Menampilkan data 'code' -->
            <td class="text-center">
              <VBtn
                color="error"
                icon="ri-delete-bin-line"
                variant="tonal"
                density="compact"
                @click="deleteUnit([+unit.id])"
              />
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>

  <!-- Dialog untuk menambah unit baru -->
  <VDialog
    v-model="dialogAdd"
    max-width="400"
    persistent
  >
    <VCard>
      <VForm
        ref="formRef"
        @submit.prevent="addUnit"
      >
        <VCardTitle class="pa-4"> Tambah Unit Baru </VCardTitle>
        <VCardText class="pb-2">
          <VTextField
            v-model="name"
            label="Nama Unit"
            :rules="[v => !!v || 'Nama unit tidak boleh kosong']"
            required
            class="mb-2"
          />
          <VTextField
            v-model="code"
            label="Kode Unit"
            :rules="[v => !!v || 'Kode unit tidak boleh kosong']"
            required
          />
        </VCardText>
        <VCardActions class="pa-4 pt-0 justify-end">
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
