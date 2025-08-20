<template>
  <!-- SECTION: Card Display -->
  <VCard
    class="shopping-card"
    elevation="4"
    max-width="360"
    rounded="xl"
  >
    <!-- Delete Button -->
    <VBtn
      icon
      variant="flat"
      size="small"
      class="close-btn"
      aria-label="Delete item"
      data-testid="delete-button"
      @click="handleDeleteItem"
    >
      <VIcon icon="ri-close-line" />
    </VBtn>

    <!-- Product Image -->
    <VImg
      :src="item.image_url"
      :alt="`Gambar ${item.name}`"
      height="220"
      cover
    />

    <!-- Main Content -->
    <VCardText class="pt-4">
      <h3 class="title">
        {{ item.name }}
      </h3>
      <p class="price mt-3">
        Harga:
        {{ formattedBasePrice }}
      </p>
      <p class="price text-caption text-secondary">
        Grosir:
        {{
          new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(item.wholesale_price || 0)
        }}
      </p>
      <p class="price text-caption text-secondary">
        Modal:
        {{
          new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(item.cost || 0)
        }}
      </p>
      <p
        class="stock"
        :class="{ 'out-of-stock': item.stock <= 0 }"
      >
        Stok: {{ item.stock }} {{ baseUnitName }}
      </p>
      <p class="barcode">Barcode: {{ item.barcode || '-' }}</p>

      <!-- Categories -->
      <div
        v-if="item.categories?.length"
        class="categories"
      >
        <VChip
          v-for="catLink in item.categories"
          :key="catLink.id"
          class="category-chip"
          color="secondary"
          size="small"
          variant="tonal"
        >
          {{ catLink.name }}
        </VChip>
      </div>
    </VCardText>

    <!-- Actions -->
    <VCardActions class="pa-4 pt-0">
      <VRow no-gutters>
        <VCol>
          <VBtn
            color="success"
            variant="tonal"
            prepend-icon="ri-add-line"
            block
            data-testid="restock-button"
            @click="openRestockDialog"
          >
            Restock
          </VBtn>
        </VCol>
        <VCol class="pl-2">
          <VBtn
            prepend-icon="ri-pencil-line"
            block
            color="primary"
            variant="tonal"
            data-testid="edit-button"
            @click="openItemFormDialog"
          >
            Edit
          </VBtn>
        </VCol>
      </VRow>
    </VCardActions>
  </VCard>
  <!-- !SECTION -->

  <!-- SECTION: Edit Item Dialog -->
  <VDialog
    v-model="dialogs.itemForm"
    max-width="800"
    persistent
  >
    <VCard>
      <VForm @submit.prevent="submitItemForm">
        <VCardTitle class="pa-4 d-flex justify-space-between align-center">
          <span>Edit Item</span>
          <VBtn
            icon="ri-close-line"
            variant="text"
            @click="closeAllDialogs"
          />
        </VCardTitle>

        <VCardText class="pb-0">
          <VRow>
            <!-- Kolom Kiri: Info Dasar -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="form.name"
                label="Nama Item"
                class="mb-4"
                required
              />
              <VTextField
                v-model="form.barcode"
                label="Barcode Item"
                class="mb-4"
              />
              <VSelect
                v-model="form.selectedCategories"
                label="Kategori"
                :items="categories"
                item-title="name"
                item-value="id"
                multiple
                chips
                clearable
                closable-chips
                class="mb-4"
              >
                <template #prepend-item>
                  <VListItem
                    title="Pilih Semua"
                    @click="toggleSelectAllCategories"
                  >
                    <template #prepend>
                      <VCheckbox :model-value="isAllCategoriesSelected" />
                    </template>
                  </VListItem>
                  <VDivider />
                </template>
              </VSelect>
              <VTextarea
                v-model="form.description"
                label="Deskripsi"
                rows="2"
                class="mb-4"
              />
              <VFileInput
                v-model="form.imageFile"
                label="Upload Gambar Baru (Opsional)"
                accept="image/*"
                prepend-icon=""
                prepend-inner-icon="ri-image-add-line"
              />
            </VCol>

            <!-- Kolom Kanan: Pengaturan Satuan & Harga -->
            <VCol
              cols="12"
              md="6"
            >
              <p class="text-subtitle-1 mb-2">Pengaturan Satuan & Harga</p>
              <p class="text-caption text-medium-emphasis mb-4">
                Pilih salah satu sebagai <b>satuan dasar</b> (acuan stok).
              </p>

              <VRadioGroup
                v-model="form.base_unit_id"
                class="w-100"
              >
                <div
                  v-for="(unit, index) in form.units"
                  :key="index"
                  class="unit-row mb-4"
                >
                  <div class="d-flex align-center ga-2">
                    <VRadio
                      :value="unit.id"
                      :disabled="!unit.id"
                      class="mt-4"
                    />
                    <VSelect
                      v-model="unit.id"
                      label="Unit"
                      :items="units"
                      item-title="name"
                      item-value="id"
                      density="compact"
                      hide-details
                      style="min-width: 120px"
                      required
                    />
                    <VBtn
                      v-if="form.units.length > 1"
                      icon="ri-delete-bin-line"
                      variant="text"
                      color="error"
                      size="small"
                      @click="removeUnit(index)"
                    />
                  </div>
                  <VRow class="pl-12 pt-2">
                    <VCol
                      cols="12"
                      sm="6"
                    >
                      <VTextField
                        v-model.number="unit.cost"
                        label="Harga Beli (Modal)"
                        type="number"
                        prefix="Rp"
                        density="compact"
                        hide-details
                        required
                      />
                    </VCol>
                    <VCol
                      cols="12"
                      sm="6"
                    >
                      <VTextField
                        v-model.number="unit.price"
                        label="Harga Jual"
                        type="number"
                        prefix="Rp"
                        density="compact"
                        hide-details
                        required
                      />
                    </VCol>
                    <VCol cols="12">
                      <VTextField
                        v-model.number="unit.conversion_to_base"
                        label="Konversi ke Satuan Dasar"
                        type="number"
                        :disabled="unit.id === form.base_unit_id"
                        density="compact"
                        :hint="unit.id === form.base_unit_id ? 'Satuan dasar selalu bernilai 1' : ''"
                        persistent-hint
                        required
                      />
                    </VCol>
                  </VRow>
                  <VDivider
                    v-if="index < form.units.length - 1"
                    class="mt-4"
                  />
                </div>
              </VRadioGroup>

              <VBtn
                block
                variant="tonal"
                color="primary"
                prepend-icon="ri-add-line"
                @click="addUnit"
              >
                Tambah Satuan Lain
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>

        <VCardActions class="pa-4 d-flex justify-end">
          <VBtn
            color="secondary"
            variant="text"
            @click="closeAllDialogs"
          >
            Batal
          </VBtn>
          <VBtn
            type="submit"
            variant="elevated"
            color="primary"
            :loading="isSubmitting"
          >
            Update
          </VBtn>
        </VCardActions>
      </VForm>
    </VCard>
  </VDialog>
  <!-- !SECTION -->

  <!-- SECTION: Restock Dialog -->
  <VDialog
    v-model="dialogs.restock"
    max-width="500"
    persistent
  >
    <VCard>
      <VForm @submit.prevent="submitRestockForm">
        <VCardTitle class="pa-4">
          Restock: {{ item.name }} - <b class="text-primary">{{ branch.name }}</b></VCardTitle
        >
        <VCardText>
          <VTextField
            v-model="restockForm.transaction_number"
            :label="restockForm.transaction_number_auto ? 'No Transaksi (Otomatis)' : 'No Transaksi'"
            :disabled="restockForm.transaction_number_auto"
            class="mb-2"
          />
          <VSwitch
            v-model="restockForm.transaction_number_auto"
            label="Nomor transaksi otomatis"
            color="primary"
            class="mb-2"
          />
          <VSelect
            v-model="restockForm.type"
            label="Tipe Transaksi"
            :items="[
              { title: 'Stok Masuk', value: 'in' },
              { title: 'Stok Keluar', value: 'out' },
            ]"
            class="mb-4"
            required
          />

          <!-- [BARU] Tambahkan VRow untuk mensejajarkan Jumlah dan Unit -->
          <VRow>
            <VCol cols="8">
              <VTextField
                v-model.number="restockForm.quantity"
                label="Jumlah"
                type="number"
                required
              />
            </VCol>
            <VCol cols="4">
              <VSelect
                v-model="restockForm.unit_id"
                label="Unit"
                :items="availableRestockUnits"
                item-title="name"
                item-value="id"
                required
                no-data-text="Unit tidak ada"
              />
            </VCol>
          </VRow>

          <VTextarea
            v-model="restockForm.description"
            label="Deskripsi (Opsional)"
            auto-grow
            clearable
            rows="2"
            class="mt-4"
          />
        </VCardText>
        <VCardActions class="pa-4 d-flex justify-end">
          <VBtn
            color="secondary"
            variant="text"
            @click="closeAllDialogs"
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
  <!-- !SECTION -->
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import Swal from 'sweetalert2'
import api from '@/api'

// =================================================================
// Type Definitions
// =================================================================

const branch = ref(JSON.parse(localStorage.getItem('selectedBranch') || '{}'))

interface Unit {
  id: number
  name: string
  abbreviation: string
}

interface Category {
  id: number
  name: string
}

interface ItemCategoryLink {
  id: number
  item_id: number
  category_id: number
  category: Category
}

interface ItemUnit {
  id: number // Ini adalah ID dari relasi item_unit
  item_id: number
  unit_id: number
  unit: Unit
  conversion_to_base: number
  price: number
  wholesale_price: number
  cost: number
}

interface Item {
  id: number
  name: string
  barcode: string
  description: string
  image_url: string
  stock: number
  price: number // Harga jual satuan dasar
  cost: number // Harga beli satuan dasar
  wholesale_price: number
  base_unit_id: number
  base_unit: Unit
  categories: ItemCategoryLink[]
  item_units: ItemUnit[]
}

interface FormUnit {
  id: number | null
  price: number
  wholesale_price: number
  cost: number
  conversion_to_base: number
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

const isSubmitting = ref(false)

const form = reactive({
  name: '',
  barcode: '',
  description: '',
  selectedCategories: [] as number[],
  units: [] as FormUnit[],
  base_unit_id: null as number | null,
  imageFile: null as File[] | null,
})

// [DIUBAH] Menambahkan unit_id ke restockForm
const restockForm = reactive({
  transaction_number: '',
  transaction_number_auto: true,
  type: 'in',
  description: '',
  quantity: 0,
  unit_id: null as number | null, // Properti baru untuk menyimpan ID unit
})

const categories = ref<Category[]>([])
const units = ref<Unit[]>([]) // Untuk VSelect

// =================================================================
// Computed Properties
// =================================================================

const baseUnit = computed(() => {
  if (!props.item || !Array.isArray(props.item.item_units)) {
    return undefined
  }
  return props.item.item_units.find(iu => iu.unit.id === props.item.base_unit_id)
})

const formattedBasePrice = computed(() => {
  const price = props.item.price || 0
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
})

const baseUnitName = computed(() => {
  return props.item.base_unit?.name || ''
})

const isAllCategoriesSelected = computed(() => {
  return categories.value.length > 0 && form.selectedCategories.length === categories.value.length
})

// [BARU] Computed property untuk menyediakan daftar unit ke VSelect di dialog restock
const availableRestockUnits = computed(() => {
  if (!props.item || !props.item.item_units) {
    return []
  }
  // Memetakan item_units menjadi format yang bisa dibaca VSelect
  return props.item.item_units.map(itemUnit => ({
    id: itemUnit.unit.id,
    name: itemUnit.unit.name,
  }))
})

// =================================================================
// Functions: Dialog Management
// =================================================================

const openItemFormDialog = () => {
  const { item } = props
  form.name = item.name
  form.barcode = item.barcode
  form.description = item.description || ''
  form.base_unit_id = item.base_unit_id
  form.selectedCategories = item.categories.map(catLink => catLink.id)
  form.units = item.item_units.map(itemUnit => ({
    id: itemUnit.unit.id,
    price: itemUnit.price,
    cost: itemUnit.cost,
    conversion_to_base: itemUnit.conversion_to_base,
  }))
  const baseUnitInForm = form.units.find(u => u.id === form.base_unit_id)
  if (baseUnitInForm) {
    baseUnitInForm.conversion_to_base = 1
  }
  form.imageFile = null
  dialogs.itemForm = true
}

// [DIUBAH] Mengatur nilai default saat membuka dialog restock
const openRestockDialog = () => {
  // Reset form
  restockForm.transaction_number = ''
  restockForm.transaction_number_auto = true
  restockForm.type = 'in'
  restockForm.description = ''
  restockForm.quantity = 0

  // [DIUBAH] Atur unit default ke unit pertama yang tersedia di dalam array
  if (availableRestockUnits.value.length > 0) {
    restockForm.unit_id = availableRestockUnits.value[0].id
  } else {
    restockForm.unit_id = null
  }

  dialogs.restock = true
}

const closeAllDialogs = () => {
  dialogs.itemForm = false
  dialogs.restock = false
}

// =================================================================
// Functions: Form Handling
// =================================================================

const addUnit = () => {
  form.units.push({ id: null, price: 0, cost: 0, conversion_to_base: 0 })
}

const removeUnit = (index: number) => {
  const unitToRemove = form.units[index]
  if (unitToRemove.id === form.base_unit_id) {
    Swal.fire('Aksi Ditolak', 'Tidak dapat menghapus satuan yang menjadi acuan dasar.', 'warning')
    return
  }
  form.units.splice(index, 1)
}

const toggleSelectAllCategories = () => {
  if (isAllCategoriesSelected.value) form.selectedCategories = []
  else form.selectedCategories = categories.value.map(c => c.id)
}

// =================================================================
// Functions: API Calls & Logic
// =================================================================

const submitItemForm = async () => {
  isSubmitting.value = true
  try {
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('name', form.name)
    formData.append('barcode', form.barcode)
    formData.append('description', form.description)
    if (form.base_unit_id) {
      formData.append('base_unit_id', String(form.base_unit_id))
    }
    form.selectedCategories.forEach((id, index) => {
      formData.append(`category[${index}][id]`, String(id))
    })
    form.units.forEach((unit, index) => {
      if (unit.id) {
        formData.append(`unit[${index}][id]`, String(unit.id))
        formData.append(`unit[${index}][price]`, String(unit.price))
        formData.append(`unit[${index}][cost]`, String(unit.cost))
        formData.append(`unit[${index}][conversion_to_base]`, String(unit.conversion_to_base))
      }
    })
    if (form.imageFile?.[0]) {
      formData.append('image', form.imageFile[0])
    }
    await api.put(`/item/${props.item.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    Swal.fire('Berhasil', 'Item berhasil diperbarui.', 'success')
    emit('updated')
  } catch (error: any) {
    console.error('Gagal submit form:', error)
    const message = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.'
    Swal.fire('Gagal', message, 'error')
  } finally {
    isSubmitting.value = false
    closeAllDialogs()
  }
}

// [DIUBAH] Menambahkan unit_id ke payload
const submitRestockForm = async () => {
  // Validasi sederhana
  if (!restockForm.unit_id || restockForm.quantity <= 0) {
    Swal.fire('Validasi Gagal', 'Pastikan jumlah item lebih dari 0 dan unit telah dipilih.', 'warning')
    return
  }

  try {
    const payload = {
      transaction_number: restockForm.transaction_number_auto ? 'auto' : restockForm.transaction_number,
      type: restockForm.type,
      description: restockForm.description,
      quantity: restockForm.quantity,
      unit_id: restockForm.unit_id, // Kirim ID unit yang dipilih
      branch_id: branch.value.id,
    }

    const res = await api.post(`/item/${props.item.id}/stock`, payload)

    if (res.data.status) {
      emit('updated')
      Swal.fire('Berhasil', 'Stok item berhasil diupdate.', 'success')
    } else {
      Swal.fire('Gagal', res.data.message || 'Gagal melakukan restock.', 'error')
    }
  } catch (error: any) {
    console.error('Gagal submit restock:', error)
    Swal.fire('Gagal', error?.response?.data?.message || 'Terjadi kesalahan pada server.', 'error')
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
      await api.delete(`/item`, { data: { ids: [props.item.id] } })
      Swal.fire('Terhapus!', 'Item berhasil dihapus.', 'success')
      emit('updated')
    } catch (err) {
      console.error('Gagal menghapus item:', err)
      Swal.fire('Gagal', 'Item tidak dapat dihapus.', 'error')
    }
  }
}

const fetchInitialData = async () => {
  try {
    const [categoriesRes, unitsRes] = await Promise.all([api.get(`/category`), api.get(`/unit`)])
    if (Array.isArray(categoriesRes.data.data)) {
      categories.value = categoriesRes.data.data
    }
    const unitsData = unitsRes.data.data?.units || unitsRes.data.data
    if (Array.isArray(unitsData)) {
      units.value = unitsData
    }
  } catch (error) {
    console.error('Gagal mengambil data awal:', error)
  }
}

// =================================================================
// Lifecycle Hooks
// =================================================================

onMounted(() => {
  fetchInitialData()
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

.unit-row {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 12px;
}
</style>
