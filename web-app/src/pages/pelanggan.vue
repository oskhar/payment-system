<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import io from 'socket.io-client'
import CardScan from '@images/misc/CardScan.png'

// Fungsi untuk mengambil data pelanggan
const fetchCustomers = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/customer`)
    customers.value = response.data.data.customers
    pagination.value = response.data.data.pagination
  } catch (error) {
    console.error('Gagal mengambil data pelanggan:', error)
  }
}

// State untuk modal dan input name
const dialogAddCustomer = ref(false)
const name = ref('')

const pagination = ref<{
  total: string
  total_page: number
  limit: number
  page: string
  links: {
    first: string
    prev: string
    next: string
    last: string
  }
}>({})

// Fungsi untuk submit data ke backend
const submitForm = async () => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/customer`, {
      name: name.value,
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
    name.value = ''

    await fetchCustomers()
  } catch (error) {
    // Jika gagal, tampilkan notifikasi error
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: 'Terjadi kesalahan, coba lagi nanti.',
    })
  }
  dialogAddCustomer.value = false
}

const dialogScanUID = ref<boolean>(false)
const scanningCustomerId = ref<number | null>(null)

// Inisialisasi socket.io
const socket = io(`${import.meta.env.VITE_API_URL}`)

// Fungsi untuk menghapus data pelanggan
const deleteCustomer = async (ids: number[]) => {
  console.log(ids)

  const confirmation = await Swal.fire({
    title: 'Hapus pelanggan?',
    text: 'Data pelanggan akan dihapus permanen.',
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
      await axios.delete(`${import.meta.env.VITE_API_URL}/customer`, { data: { ids } })
      Swal.fire('Terhapus!', 'Data pelanggan berhasil dihapus.', 'success')
      await fetchCustomers()
    } catch (error) {
      Swal.fire('Gagal', 'Gagal menghapus data pelanggan.', 'error')
    }
  }
}

// Fungsi untuk memulai scan
const handleScan = async (customerId: number) => {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/customer/uid-scan/${customerId}`)

    // Set customer ID yang sedang scanning
    scanningCustomerId.value = customerId
    dialogScanUID.value = true
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: 'Terjadi kesalahan, coba lagi nanti.',
    })
  }
}

// Fungsi untuk menangani stop scan secara manual
const stopScan = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/customer/uid-scan/stop`)

    dialogScanUID.value = false
    scanningCustomerId.value = null
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal!',
      text: 'Terjadi kesalahan, coba lagi nanti.',
    })
  }
}

// State untuk daftar pelanggan
const customers = ref<{ id: number; name: string; uid_card: string; is_waiting_scan: boolean }[]>([])

// Event listener WebSocket untuk menerima hasil scan RFID
socket.on('scan-update', ({ uid }) => {
  if (scanningCustomerId.value) {
    const customer = customers.value.find(c => c.id === scanningCustomerId.value)
    if (customer) {
      customer.uid_card = uid
    }

    dialogScanUID.value = false
    scanningCustomerId.value = null

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: `RFID Card berhasil discan: ${uid}`,
      timer: 2000,
      showConfirmButton: false,
    })
  }
})

// Cleanup WebSocket saat komponen di-unmount
onUnmounted(() => {
  socket.disconnect()
})

// Ambil daftar pelanggan saat komponen dimuat
onMounted(fetchCustomers)
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <CardTitle class="d-flex justify-space-between align-center pa-5">
          <p class="text-h5">Pelanggan</p>
          <VBtn
            prepend-icon="ri-add-line"
            color="success"
            style="width: 7rem"
            rounded
            @click="dialogAddCustomer = true"
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
                <th class="text-uppercase text-center">Nama</th>
                <th class="text-uppercase text-center">UID Kartu</th>
                <th class="text-uppercase text-center">Saldo</th>
                <th class="text-uppercase text-center">Tanggal Dibuat</th>
                <th class="text-uppercase text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, index) in customers"
                :key="item.id"
              >
                <td>{{ index + 1 }}</td>
                <td class="text-center">{{ item.name }}</td>
                <td class="text-center">{{ item.uid_card }}</td>
                <td class="text-center">
                  Rp. {{ new Intl.NumberFormat('id-ID').format(`${item.balance}`.replace(/\D/g, '')) }}.-
                </td>
                <td class="text-center">{{ item.created_at }}</td>
                <td class="text-center ga-2">
                  <VBtn
                    color="primary"
                    rounded
                    @click="handleScan(item.id)"
                  >
                    Scan UID
                  </VBtn>
                  <VBtn
                    color="error"
                    class="ml-2"
                    icon="ri-delete-bin-line"
                    @click="deleteCustomer([+item.id])"
                  />
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardItem>
        <div class="text-center justify-center align-items mb-5 d-flex ga-1">
          <VBtn
            color="grey-lighten-2"
            icon="ri-arrow-left-double-line"
            density="default"
            :disabled="!pagination.first"
            @click="page = 1"
          />

          <VBtn
            color="grey-lighten-2"
            icon="ri-arrow-left-s-line"
            density="default"
            :disabled="!pagination.prev"
            @click="prevPage"
          />

          <VBtn
            v-for="n in pagination.total_page"
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
            :disabled="!pagination.next"
            @click="nextPage"
          />

          <VBtn
            color="grey-lighten-2"
            icon="ri-arrow-right-double-line"
            density="default"
            :disabled="!pagination.last"
            @click="page = totalPage"
          />
        </div>
      </VCard>
    </VCol>
  </VRow>

  <!-- Modal Form -->
  <VDialog
    v-model="dialogAddCustomer"
    max-width="400"
  >
    <VCard>
      <VCardTitle class="pa-4">Tambah Pelanggan</VCardTitle>
      <VCardText>
        <VTextField
          v-model="name"
          label="Nama Pelanggan"
        />
      </VCardText>
      <VCardActions class="pa-4 d-flex justify-end">
        <VBtn
          color="secondary"
          variant="outlined"
          @click="dialogAddCustomer = false"
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
  <VDialog
    v-model="dialogScanUID"
    max-width="500px"
  >
    <VCard>
      <VCardItem>
        <center>
          <p class="text-h2 text-primary">Scan Kartu!</p>
          <img :src="CardScan" />
        </center>
        <VBtn
          variant="flat"
          color="primary"
          block
          @click="stopScan"
        >
          Selesai
        </VBtn>
      </VCardItem>
    </VCard>
  </VDialog>
</template>
