
<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import ScanUIDButton from './ScanUIDButton.vue'
import axios from 'axios'

// State untuk menyimpan data pelanggan
const customers = ref<{ id: number; name: string; uid_card: string; created_at: Date }[]>([])

// Fungsi untuk mengambil data pelanggan dari API
const fetchCustomers = async () => {
  try {
    const response = await axios.get('http://localhost:3000/customer')
    customers.value = response.data.data.customers // Menyimpan data ke state
  } catch (error) {
    console.error('Gagal mengambil data pelanggan:', error)
  }
}

// Panggil fetchCustomers saat komponen dimuat
onMounted(fetchCustomers)
</script>

<template>
  <VTable style="height: 70vh" fixed-header>
    <thead>
      <tr>
        <th class="text-uppercase">No</th>
        <th class="text-uppercase text-center">Nama</th>
        <th class="text-uppercase text-center">UID Kartu</th>
        <th class="text-uppercase text-center">Tanggal Dibuat</th>
        <th class="text-uppercase text-center">Aksi</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(item, index) in customers" :key="item.id">
        <td>{{ index + 1 }}</td>
        <td class="text-center">{{ item.name }}</td>
        <td class="text-center">{{ item.uid_card }}</td>
        <td class="text-center">{{ item.created_at }}</td>
        <td class="text-center ga-2">
          <ScanUIDButton :customerId="item.id" />
          <VBtn color="error" class="ml-2" icon="ri-delete-bin-line" />
        </td>
      </tr>
    </tbody>
  </VTable>
</template>
