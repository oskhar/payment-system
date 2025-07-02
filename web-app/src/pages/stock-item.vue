<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

// ================== STATE ==================

const stocks = ref<any[]>([])
const items = ref<{ id: number; name: string }[]>([])

const dialogForm = ref(false)
const isEdit = ref(false)
const selectedStockId = ref<number | null>(null)

const form = reactive({
  item_id: null as number | null,
  quantity: 0,
  type: 'stock_in',
  description: '',
})

// ================== FETCH DATA ==================

const fetchStock = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/stock`)
    stocks.value = res.data.data.stock
  } catch (err) {
    console.error('Gagal mengambil data stok:', err)
  }
}

const fetchItems = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/item`)
    items.value = res.data.data.items
  } catch (err) {
    console.error('Gagal mengambil item:', err)
  }
}

// ================== FORM ==================

const openForm = (stock?: any) => {
  if (stock) {
    isEdit.value = true
    selectedStockId.value = stock.id
    form.item_id = stock.item?.id ?? null
    form.quantity = stock.quantity
    form.type = stock.type
    form.description = stock.description
  } else {
    isEdit.value = false
    selectedStockId.value = null
    form.item_id = null
    form.quantity = 0
    form.type = 'stock_in'
    form.description = ''
  }

  dialogForm.value = true
}

const closeForm = () => {
  dialogForm.value = false
}

// ================== CRUD HANDLERS ==================

const submitForm = async () => {
  try {
    if (!form.item_id || !form.quantity || !form.type) {
      Swal.fire('Gagal', 'Harap lengkapi semua field!', 'error')
      return
    }

    const payload = {
      item_id: form.item_id,
      quantity: form.quantity,
      type: form.type,
      description: form.description,
    }

    if (isEdit.value && selectedStockId.value !== null) {
      await axios.put(`${import.meta.env.VITE_API_URL}/stock/${selectedStockId.value}`, payload)
      Swal.fire('Berhasil', 'Stok berhasil diperbarui', 'success')
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/stock`, payload)
      Swal.fire('Berhasil', 'Stok berhasil ditambahkan', 'success')
    }

    await fetchStock()
    dialogForm.value = false
  } catch (err) {
    console.error('Gagal menyimpan stok:', err)
    Swal.fire('Error', 'Gagal menyimpan stok!', 'error')
  }
}

const deleteStock = async (id: number) => {
  const confirm = await Swal.fire({
    title: 'Yakin ingin menghapus?',
    text: 'Data stok akan dihapus permanen.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
    reverseButtons: true,
    customClass: {
      actions: 'swal2-reverse-buttons',
    },
  })

  if (confirm.isConfirmed) {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/stock/${id}`)
      await fetchStock()
      Swal.fire('Terhapus!', 'Data stok berhasil dihapus.', 'success')
    } catch (err) {
      console.error('Gagal hapus:', err)
      Swal.fire('Error', 'Gagal menghapus data stok.', 'error')
    }
  }
}

// ================== INIT ==================

onMounted(async () => {
  await fetchStock()
  await fetchItems()
})
</script>

<template>
  <VCard class="mt-10">
    <CardTitle class="d-flex justify-space-between align-center pa-5">
      <p class="text-h5">Manajemen Stok</p>
      <VBtn
        prepend-icon="ri-add-line"
        color="success"
        @click="openForm"
      >
        Tambah
      </VBtn>
    </CardTitle>

    <VCardItem>
      <VTable fixed-header>
        <thead>
          <tr>
            <th>No</th>
            <th class="text-center">Item</th>
            <th class="text-center">Nomor Transaksi</th>
            <th class="text-center">Qty</th>
            <th class="text-center">Tipe</th>
            <th class="text-center">Deskripsi</th>
            <th class="text-center">Tanggal</th>
            <th class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(s, i) in stocks"
            :key="s.id"
          >
            <td>{{ i + 1 }}</td>
            <td class="text-center">{{ s.item?.name || '-' }}</td>
            <td class="text-center">{{ s.transaction_number }}</td>
            <td class="text-center">{{ s.quantity }}</td>
            <td class="text-center">
              <VChip :color="s.type === 'stock_in' ? 'success' : 'warning'">
                {{ s.type === 'stock_in' ? 'Stok Masuk' : 'Stok Keluar' }}
              </VChip>
            </td>
            <td class="text-center">{{ s.description || '-' }}</td>
            <td class="text-center">{{ new Date(s.created_at).toLocaleString() }}</td>
            <td class="text-center">
              <VBtn
                icon="ri-pencil-line"
                color="primary"
                @click="openForm(s)"
              />
              <VBtn
                icon="ri-delete-bin-line"
                color="error"
                class="ml-2"
                @click="deleteStock(s.id)"
              />
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardItem>
  </VCard>

  <!-- Dialog Form -->
  <VDialog
    v-model="dialogForm"
    max-width="500"
  >
    <VCard>
      <VCardTitle>
        {{ isEdit ? 'Edit Stok' : 'Tambah Stok' }}
      </VCardTitle>
      <VCardText>
        <VForm>
          <VSelect
            v-model="form.item_id"
            label="Pilih Item"
            :items="items"
            item-title="name"
            item-value="id"
            required
            class="mb-3"
          />
          <VTextField
            v-model.number="form.quantity"
            label="Jumlah"
            type="number"
            required
            class="mb-3"
          />
          <VSelect
            v-model="form.type"
            label="Tipe Transaksi"
            :items="[
              { title: 'Stok Masuk', value: 'stock_in' },
              { title: 'Stok Keluar', value: 'stock_out' },
            ]"
            item-title="title"
            item-value="value"
            required
            class="mb-3"
          />
          <VTextarea
            v-model="form.description"
            label="Deskripsi"
            rows="3"
          />
        </VForm>
      </VCardText>
      <VCardActions class="justify-end px-5 pb-4">
        <VBtn
          variant="outlined"
          color="secondary"
          @click="closeForm"
        >
          Batal
        </VBtn>
        <VBtn
          variant="elevated"
          color="primary"
          @click="submitForm"
        >
          Simpan
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped lang="scss">
.text-center {
  text-align: center;
}
</style>
