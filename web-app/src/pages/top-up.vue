<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

// State untuk modal dan input name
const dialogAddItem = ref<boolean>(false)
const nominal = ref<number>(0)
const selectedCustomer = ref([])

// Fungsi untuk submit data ke backend
const submitForm = async () => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/top-up-balance`, {
      customer_id: selectedCustomer.value,
      nominal: nominal.value,
    })

    // Jika berhasil, tampilkan notifikasi
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Pelanggan berhasil ditambahkan.',
      timer: 2000,
      showConfirmButton: false,
    })

    // Tutup modal dan reset input
    dialogAddItem.value = false
    nominal.value = 0
    selectedCustomer.value = []

    await fetchTopUpBalance()
  } catch (error) {
    // Jika gagal, tampilkan notifikasi error
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: 'Terjadi kesalahan, coba lagi nanti.',
    })
  }
}

const handleAddDialog = async () => {
  await fetchCustomers()
  dialogAddItem.value = true
}
// Cek apakah semua item sudah dipilih
const isAllSelected = computed(() => {
  return selectedCustomer.value.length === customers.value.length
})

// Fungsi untuk memilih semua atau menghapus semua
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedCustomer.value = []
  } else {
    selectedCustomer.value = customers.value.map(c => c.id)
  }
}

// State untuk daftar pelanggan
const topUpBalances = ref<
  {
    id: number
    nominal: number
    customer: {
      id: number
      name: string
    }
    created_at: boolean
  }[]
>([])

const customers = ref<
  {
    id: number
    name: string
    uid_card: string
    is_waiting_scan: boolean
  }[]
>([])

// Fungsi untuk mengambil data pelanggan
const fetchCustomers = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/customer`)
    customers.value = response.data.data.customers
  } catch (error) {
    console.error('Gagal mengambil data pelanggan:', error)
  }
}

// Fungsi untuk mengambil data pelanggan
const fetchTopUpBalance = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/top-up-balance`)
    topUpBalances.value = response.data.data.top_up_balances
  } catch (error) {
    console.error('Gagal mengambil data pelanggan:', error)
  }
}

// Ambil daftar pelanggan saat komponen dimuat
onMounted(async () => {
  await fetchTopUpBalance()
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <CardTitle class="d-flex justify-space-between align-center pa-5">
          <p class="text-h5">Top Up Saldo</p>
          <VBtn
            prepend-icon="ri-add-line"
            color="success"
            style="width: 7rem"
            rounded
            @click="handleAddDialog"
          >
            Tambah
          </VBtn>
        </CardTitle>

        <VCardItem>
          <VTable
            style="height: 70vh"
            fixed-header
          >
            <thead>
              <tr>
                <th class="text-uppercase">No</th>
                <th class="text-uppercase text-center">Nama Pelanggan</th>
                <th class="text-uppercase text-center">Nominal</th>
                <th class="text-uppercase text-center">Tanggal Dibuat</th>
                <th class="text-uppercase text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, index) in topUpBalances"
                :key="item.id"
              >
                <td>{{ index + 1 }}</td>
                <td class="text-center">{{ item.customer.name }}</td>
                <td class="text-center">Rp. {{ new Intl.NumberFormat('id-ID').format(`${item.nominal}`.replace(/\D/g, '')) }}.-</td>
                <td class="text-center">{{ item.created_at }}</td>
                <td class="text-center ga-2">
                  <VBtn
                    color="error"
                    class="ml-2"
                    icon="ri-delete-bin-line"
                  />
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardItem>
      </VCard>
    </VCol>
  </VRow>

  <!-- Modal Form -->
  <VDialog
    v-model="dialogAddItem"
    max-width="700"
  >
    <VCard>
      <VCardTitle class="pa-4">Tambah Saldo</VCardTitle>
      <VCardText>
        <VSelect
          clearable
          chips
          class="mb-3"
          v-model="selectedCustomer"
          label="Pilih Pelanggan"
          :items="customers"
          item-title="name"
          item-value="id"
          multiple
          variant="outlined"
        >
          <!-- Tambahkan tombol "Pilih Semua" di awal daftar -->
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
          v-model="nominal"
          label="Nominal Saldo"
        />
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
          variant="elevated"
          color="primary"
          @click="submitForm"
        >
          Submit
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
