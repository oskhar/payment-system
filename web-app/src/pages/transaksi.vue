<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Swal from 'sweetalert2'
import ItemCard from '@/views/pages/penjualan/ItemCard.vue'
import api from '@/api'

// Impor logo Anda
import logoUrl from '@images/logo-toko.png'

// --- Type Definitions (Diperbaiki) ---

interface Unit {
  id: number
  name: string
}

// [BARU] Interface untuk data unit yang melekat pada item, termasuk harganya.
interface ItemUnit {
  id: number // ID dari relasi item_unit
  unit_id: number
  price: string // Harga dari API dalam bentuk string
  cost: string
  unit: Unit // Objek Unit yang berisi nama
  conversion_to_base: string
}

interface Item {
  id: number
  image_url: string
  name: string
  barcode: string
  stock: number
  item_units: ItemUnit[] // Setiap item punya daftar unit & harganya
  base_unit: Unit // Untuk menentukan unit default
}

// [PERBAIKAN] Interface untuk item di keranjang disederhanakan.
interface CartItem {
  product: Item
  quantity: number
  selected_unit_id: number | null // Cukup simpan ID unit yang dipilih
}

// Interface untuk data yang disimpan saat backup untuk cetak struk
interface CartBackupItem extends CartItem {
  resolvedPrice: number
  resolvedUnitName: string
}

interface Branch {
  id: number
  name: string
}

// --- Reactive State ---
const branch = ref<Branch>(JSON.parse(localStorage.getItem('selectedBranch')))
const searchQuery = ref('')
const products = ref<Item[]>([])
const cart = ref<CartItem[]>([])
const paymentMethod = ref('cash')
const isPrinterConnected = ref(false)

const paymentMethods = [
  { label: 'DANA', value: 'dana' },
  { label: 'BRI', value: 'bri' },
  { label: 'BCA', value: 'bca' },
  { label: 'MANDIRI', value: 'mandiri' },
  { label: 'CASH', value: 'cash' },
]

// --- USB Printer State & Methods ---
const device = ref<USBDevice | null>(null)
const endpoint = ref<USBEndpoint | null>(null)
const cartBackup = ref<CartBackupItem[]>([]) // Menggunakan tipe data backup yang baru
const totalPriceBackup = ref(0)
const paymentMethodBackup = ref('')
const transactionNumber = ref('')
const transactionDate = ref('')
const cashierName = ref('Admin')

const VENDOR_ID = 1155
const PRODUCT_ID = 22339

// --- Fungsi Helper & Printer ---
// Tidak ada perubahan fungsionalitas di semua fungsi terkait printer,
// hanya penyesuaian pada data yang digunakan di printReceiptToUsb

async function convertImageToRaster(imageUrl: string): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d', { willReadFrequently: true })
      if (!context)
        return reject(new Error('Gagal mendapatkan konteks canvas'))

      const maxLogoWidth = 160
      let targetWidth = image.width
      let targetHeight = image.height

      if (targetWidth > maxLogoWidth) {
        const scale = maxLogoWidth / targetWidth
        targetWidth = maxLogoWidth
        targetHeight = Math.ceil(image.height * scale)
      }

      if (targetWidth % 8 !== 0)
        targetWidth = Math.floor(targetWidth / 8) * 8

      canvas.width = targetWidth
      canvas.height = targetHeight
      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      const threshold = 128
      const bytes = new Uint8Array((canvas.width * canvas.height) / 8)
      let byteIndex = 0

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x += 8) {
          let byte = 0
          for (let bit = 0; bit < 8; bit++) {
            const pixelIndex = (y * canvas.width + (x + bit)) * 4
            const r = data[pixelIndex]
            const g = data[pixelIndex + 1]
            const b = data[pixelIndex + 2]
            const brightness = (r + g + b) / 3
            if (brightness < threshold)
              byte |= 1 << (7 - bit)
          }
          bytes[byteIndex++] = byte
        }
      }

      const xL = (canvas.width / 8) % 256
      const xH = Math.floor(canvas.width / 8 / 256)
      const yL = canvas.height % 256
      const yH = Math.floor(canvas.height / 256)

      const command = new Uint8Array([0x1D, 0x76, 0x30, 0x00, xL, xH, yL, yH])
      const finalData = new Uint8Array(command.length + bytes.length)
      finalData.set(command, 0)
      finalData.set(bytes, command.length)
      resolve(finalData)
    }
    image.onerror = reject
    image.src = imageUrl
  })
}

const setupDevice = async (selectedDevice: USBDevice) => {
  device.value = selectedDevice
  await device.value.open()
  if (device.value.configuration === null)
    await device.value.selectConfiguration(1)

  const interfaceNumber = 0
  try {
    if (device.value.configuration?.interfaces[interfaceNumber].claimed)
      console.log('Interface sudah di-claim.')
    else await device.value.claimInterface(interfaceNumber)
  }
  catch (error) {
    console.warn('Gagal claim interface, mencoba detach kernel driver...', error)
    if (device.value.detachKernelDriver)
      await device.value.detachKernelDriver(interfaceNumber)
    await device.value.claimInterface(interfaceNumber)
  }

  const iface = device.value.configuration?.interfaces[interfaceNumber]
  const alternate = iface?.alternates[0]
  endpoint.value = alternate?.endpoints.find(e => e.direction === 'out') ?? null

  if (endpoint.value) {
    isPrinterConnected.value = true
    console.log('✅ Printer USB berhasil terhubung.')
    toast.fire({ icon: 'success', title: 'Printer terhubung.' })
  }
}

const connectUsbPrinter = async (requestNew = false) => {
  if (!('usb' in navigator)) {
    console.warn('WebUSB API tidak didukung oleh browser ini.')
    toast.fire({ icon: 'error', title: 'Browser tidak mendukung WebUSB.' })
    return
  }

  try {
    let selectedDevice: USBDevice | null = null
    if (requestNew) {
      selectedDevice = await navigator.usb.requestDevice({
        filters: [{ vendorId: VENDOR_ID, productId: PRODUCT_ID }],
      })
    }
    else {
      const devices = await navigator.usb.getDevices()
      selectedDevice = devices.find(d => d.vendorId === VENDOR_ID && d.productId === PRODUCT_ID) || null
    }

    if (!selectedDevice) {
      if (!requestNew)
        console.log('Tidak ada printer yang diizinkan. Klik tombol untuk menghubungkan.')
      return
    }
    await setupDevice(selectedDevice)
  }
  catch (error: any) {
    console.error('Gagal koneksi ke USB printer:', error)
    if (error.name !== 'NotFoundError')
      toast.fire({ icon: 'error', title: 'Gagal claim interface. Di Linux, periksa udev rules.' })
  }
}

// [PERBAIKAN] Menggunakan data dari cartBackup yang sudah di-resolve saat checkout
const printReceiptToUsb = async () => {
  if (!isPrinterConnected.value || !device.value || !endpoint.value) {
    console.warn('Device atau endpoint printer belum tersedia.')
    toast.fire({ icon: 'warning', title: 'Printer tidak terhubung. Hubungkan kembali.' })
    return
  }

  const paperWidthChars = 48
  const encoder = new TextEncoder()
  const initPrinter = encoder.encode('\x1B\x40')
  const centerAlign = encoder.encode('\x1B\x61\x01')
  const leftAlign = encoder.encode('\x1B\x61\x00')
  const cutPaper = encoder.encode('\x1D\x56\x41\x10')
  const lineFeed = encoder.encode('\n')

  const storeName = 'TOKO MUVIE\n'
  const address = 'Jalan Contoh No. 123, Jakarta\n'
  const separator = `${'-'.repeat(paperWidthChars)}\n`

  let infoLines = `No Transaksi: ${transactionNumber.value}\n`
  infoLines += `Tanggal     : ${new Date(transactionDate.value).toLocaleString('id-ID', { hour12: false })}\n`
  infoLines += `Kasir       : ${cashierName.value}\n`
  infoLines += `Pembayaran  : ${paymentMethodBackup.value.toUpperCase()}\n`

  let detailsLines = ''
  cartBackup.value.forEach(item => {
    const itemPrice = item.resolvedPrice // Mengambil harga yang sudah disimpan
    const quantityPrice = `${item.quantity} x ${itemPrice.toLocaleString('id-ID')}`
    const subtotal = itemPrice * item.quantity
    const formattedSubtotal = `Rp${subtotal.toLocaleString('id-ID')}`
    
    // Menambahkan nama unit ke dalam struk
    const itemNameWithUnit = `${item.product.name} (${item.resolvedUnitName})`
    const maxItemNameLength = paperWidthChars - 1
    const itemName = itemNameWithUnit.length > maxItemNameLength
      ? itemNameWithUnit.substring(0, maxItemNameLength)
      : itemNameWithUnit
      
    detailsLines += `${itemName}\n`
    const priceLine = `  ${quantityPrice}`.padEnd(paperWidthChars - formattedSubtotal.length) + formattedSubtotal
    detailsLines += `${priceLine}\n`
  })

  const totalPayment = totalPriceBackup.value
  const formattedTotal = `Rp${totalPayment.toLocaleString('id-ID')}`
  const totalLabel = 'Total Bayar:'
  const totalLines = `${totalLabel}${formattedTotal.padStart(paperWidthChars - totalLabel.length)}\n`
  const footer = '\nTerima Kasih!\n\n\n'

  try {
    const logoData = await convertImageToRaster(logoUrl).catch(err => {
      console.error('Gagal memproses logo:', err)
      return new Uint8Array()
    })

    const receiptParts = [
      initPrinter,
      centerAlign,
      logoData,
      logoData.length > 0 ? lineFeed : new Uint8Array(),
      encoder.encode(storeName),
      encoder.encode(address),
      leftAlign,
      encoder.encode(separator),
      encoder.encode(infoLines),
      encoder.encode(separator),
      encoder.encode(detailsLines),
      encoder.encode(separator),
      encoder.encode(totalLines),
      encoder.encode(footer),
      cutPaper,
    ]

    const totalLength = receiptParts.reduce((sum, part) => sum + part.length, 0)
    const dataToSend = new Uint8Array(totalLength)
    let offset = 0
    for (const part of receiptParts) {
      dataToSend.set(part, offset)
      offset += part.length
    }

    await device.value.transferOut(endpoint.value.endpointNumber, dataToSend)
    console.log('✅ Struk berhasil dikirim ke printer.')
  }
  catch (err) {
    console.error('Gagal mencetak ke USB printer:', err)
    toast.fire({ icon: 'error', title: 'Gagal mencetak struk.' })
  }
}

// --- Fungsionalitas Inti ---
let buffer = ''
let scanTimer: NodeJS.Timeout | null = null

const toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
})

const filteredProducts = computed(() => {
  if (!searchQuery.value)
    return products.value

  return products.value.filter(
    p =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      || (p.barcode && p.barcode.includes(searchQuery.value)),
  )
})

// [BARU] Fungsi helper untuk mendapatkan harga berdasarkan unit yang dipilih
const getSelectedUnitPrice = (cartItem: CartItem): number => {
  if (!cartItem.selected_unit_id)
    return 0 // Jika tidak ada unit terpilih, harga 0

  // Cari data item_unit yang cocok di dalam produk
  const selectedItemUnit = cartItem.product.item_units.find(
    iu => iu.unit.id === cartItem.selected_unit_id,
  )

  // Kembalikan harga dari unit tersebut (ubah string ke angka)
  return selectedItemUnit ? parseFloat(selectedItemUnit.price) : 0
}

// [PERBAIKAN] totalPrice sekarang menggunakan fungsi baru
const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => {
    const price = getSelectedUnitPrice(item)
    return sum + price * item.quantity
  }, 0)
})

// [DIHAPUS] Fungsi getPriceForQuantity tidak diperlukan lagi

const fetchProducts = async () => {
  try {
    const response = await api.get('item', { params: { branch_id: branch.value.id } })
    products.value = response.data.data.items.map((row: any) => ({
      ...row,
      image_url: row.image_url
        ? `${import.meta.env.VITE_API_URL}${row.image_url}`
        : 'https://placehold.co/360x220/EBF4FF/767676?text=No+Image',
    }))
  }
  catch (error) {
    console.error('Gagal mengambil data produk:', error)
    toast.fire({ icon: 'error', title: 'Gagal memuat produk.' })
  }
}

// [DIHAPUS] Fungsi fetchUnitsForItem tidak diperlukan lagi

// [PERBAIKAN] addToCart disederhanakan
const addToCart = (product: Item) => {
  const existingItemIndex = cart.value.findIndex(item => item.product.id === product.id)

  if (existingItemIndex !== -1) {
    cart.value[existingItemIndex].quantity++
  }
  else {
    // Tentukan unit default saat item pertama kali ditambahkan
    // Prioritas: base_unit dari produk, atau unit pertama jika base_unit null
    const defaultUnitId = product.base_unit?.id ?? product.item_units[0]?.unit.id ?? null

    cart.value.push({
      product,
      quantity: 1,
      selected_unit_id: defaultUnitId, // Langsung set unit default
    })
  }
}

const incrementQuantity = (index: number) => {
  cart.value[index].quantity++
}

const decrementQuantity = (index: number) => {
  if (cart.value[index].quantity > 1)
    cart.value[index].quantity--
  else
    cart.value.splice(index, 1)
}

const checkout = async () => {
  if (!paymentMethod.value) {
    toast.fire({ icon: 'warning', title: 'Pilih metode pembayaran.' })
    return
  }
  if (cart.value.length === 0) {
    toast.fire({ icon: 'warning', title: 'Keranjang belanja masih kosong.' })
    return
  }

  const isAllUnitsSelected = cart.value.every(item => item.selected_unit_id !== null)
  if (!isAllUnitsSelected) {
    toast.fire({ icon: 'warning', title: 'Pastikan semua item memiliki unit yang dipilih.' })
    return
  }

  try {
    const payload = {
      transaction_number: 'auto',
      total_amount: totalPrice.value,
      payment_method: paymentMethod.value,
      branch_id: branch.value.id,
      items: cart.value.map(cartItem => ({ // perhatikan perubahan 'item' menjadi 'items' jika API Anda menggunakan bentuk jamak
        unit_id: cartItem.selected_unit_id,
        item_id: cartItem.product.id,
        quantity: cartItem.quantity,
        price: getSelectedUnitPrice(cartItem), // Kirim juga harga per unit saat transaksi
      })),
    }

    const { data } = await api.post('transaction', payload)

    // [PERBAIKAN] Backup data untuk cetak struk dengan menyimpan harga dan nama unit yang sudah final
    cartBackup.value = cart.value.map(item => {
        const selectedUnitInfo = item.product.item_units.find(iu => iu.unit.id === item.selected_unit_id)
        return {
            ...item,
            resolvedPrice: getSelectedUnitPrice(item),
            resolvedUnitName: selectedUnitInfo?.unit.name || 'N/A',
        }
    })
    
    totalPriceBackup.value = totalPrice.value
    paymentMethodBackup.value = paymentMethod.value
    transactionNumber.value = data.data.transaction_number || ''
    transactionDate.value = data.data.created_at || ''

    await toast.fire({ icon: 'success', title: 'Pembayaran Berhasil!' })

    if (isPrinterConnected.value) {
      await printReceiptToUsb()
    }
    else {
      toast.fire({ icon: 'info', title: 'Printer tidak terhubung. Nota dapat dicetak dari riwayat penjualan.' })
    }

    cart.value = []
    await fetchProducts()
  }
  catch (error) {
    console.error('Gagal checkout:', error)
    const errorMessage = error instanceof Error ? error.message : 'Gagal saat checkout.'
    toast.fire({ icon: 'error', title: errorMessage })
  }
}

const handleScanKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    if (buffer) {
      const scannedBarcode = buffer.trim()
      const matchedItem = products.value.find(item => item.barcode === scannedBarcode)
      if (matchedItem) {
        addToCart(matchedItem)
        toast.fire({ icon: 'success', title: `${matchedItem.name} ditambahkan.` })
      }
      else {
        toast.fire({ icon: 'error', title: 'Barcode tidak ditemukan.' })
      }
    }
    buffer = ''
    return
  }
  if (e.key.length === 1)
    buffer += e.key

  if (scanTimer)
    clearTimeout(scanTimer)

  scanTimer = setTimeout(() => {
    buffer = ''
  }, 300)
}

onMounted(() => {
  fetchProducts()
  connectUsbPrinter()
  window.addEventListener('keydown', handleScanKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleScanKeydown)
  if (device.value && device.value.opened) {
    isPrinterConnected.value = false
    device.value.close()
  }
})
</script>

<template>
  <VContainer
    fluid
    class="cashier-page"
  >
    <VRow>
      <VCol
        cols="12"
        md="8"
        class="product-list"
      >
        <VTextField
          v-model="searchQuery"
          label="Cari Produk atau Scan Barcode..."
          prepend-inner-icon="ri-search-line"
          class="search-input mb-3"
          variant="outlined"
          clearable
        />

        <template v-if="filteredProducts.length > 0">
          <VRow>
            <VCol
              v-for="item in filteredProducts"
              :key="item.id"
              cols="12"
              sm="6"
              md="4"
              class="mb-3"
              @click="addToCart(item)"
            >
              <ItemCard :item="item" />
            </VCol>
          </VRow>
        </template>
        <template v-else>
          <VCol
            cols="12"
            class="text-center py-10"
          >
            <VAlert type="info">
              Belum ada item yang tersedia atau cocok dengan pencarian.
            </VAlert>
          </VCol>
        </template>
      </VCol>

      <VCol
        cols="12"
        md="4"
        class="cart-section"
      >
        <VCard class="sticky-top">
          <div class="cart-header">
            <div class="d-flex justify-space-between align-center">
              <h3>Daftar Belanja</h3>
              <VBtn
                :color="isPrinterConnected ? 'success' : 'grey'"
                size="small"
                title="Hubungkan ke Printer Baru"
                @click="connectUsbPrinter(true)"
              >
                <VIcon start>
                  ri-printer-line
                </VIcon>
                {{ isPrinterConnected ? 'Terhubung' : 'Hubungkan' }}
              </VBtn>
            </div>
          </div>
          <VCardText>
            <VAlert
              v-if="cart.length === 0"
              type="info"
              variant="tonal"
              class="mt-4"
            >
              Belum ada item yang dipilih.
            </VAlert>

            <VList
              v-else
              density="compact"
              class="pa-0"
            >
              <VListItem
                v-for="(cartItem, index) in cart"
                :key="`${cartItem.product.id}-${index}`"
                class="cart-item"
              >
                <div class="d-flex flex-column" style="width: 100%;">
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <VListItemTitle class="font-weight-bold">
                        {{ cartItem.product.name }}
                      </VListItemTitle>
                      <VListItemSubtitle>
                        {{
                          getSelectedUnitPrice(cartItem).toLocaleString('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                          })
                        }}
                      </VListItemSubtitle>
                    </div>
                    <div class="quantity-controls">
                      <VBtn
                        size="x-small"
                        icon
                        variant="tonal"
                        @click.stop="decrementQuantity(index)"
                      >
                        <VIcon>ri-subtract-line</VIcon>
                      </VBtn>
                      <span class="quantity-display mx-2">{{ cartItem.quantity }}</span>
                      <VBtn
                        size="x-small"
                        icon
                        variant="tonal"
                        @click.stop="incrementQuantity(index)"
                      >
                        <VIcon>ri-add-line</VIcon>
                      </VBtn>
                    </div>
                  </div>
                  
                  <VSelect
                    v-model="cartItem.selected_unit_id"
                    :items="cartItem.product.item_units"
                    item-title="unit.name"
                    item-value="unit.id" label="Unit"
                    variant="outlined"
                    density="compact"
                    class="mt-3"
                    hide-details
                  />
                </div>
              </VListItem>
            </VList>
          </VCardText>

          <div
            v-if="cart.length > 0"
            class="cart-footer"
          >
            <VDivider />
            <div class="pa-4">
              <VSelect
                v-model="paymentMethod"
                :items="paymentMethods"
                item-title="label"
                item-value="value"
                label="Metode Pembayaran"
                variant="outlined"
                density="compact"
                class="mb-4"
              />
              <div class="total">
                <span class="text-h6 font-weight-bold">Total:</span>
                <span class="total-price text-h6 font-weight-bold">{{
                  totalPrice.toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  })
                }}</span>
              </div>
              <VBtn
                color="primary"
                block
                size="large"
                class="checkout-btn mt-4"
                :disabled="!paymentMethod"
                @click="checkout"
              >
                Bayar Sekarang
              </VBtn>
            </div>
          </div>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style lang="scss" scoped>
.cashier-page {
  background-color: #f4f6f8;
}

.product-list {
  height: calc(100vh - 88px);
  overflow-y: auto;
  padding: 1rem;
}

.cart-section .v-card {
  height: calc(100vh - 88px);
  display: flex;
  flex-direction: column;
}

.cart-header {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;

  h3 {
    margin: 0;
    font-size: 1.25rem;
  }
}

.v-card .v-card-text {
  flex-grow: 1;
  overflow-y: auto;
}

.cart-item {
  border-bottom: 1px solid #eee;
  padding: 12px 0 !important;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-display {
  font-weight: 500;
  min-width: 20px;
  text-align: center;
}

.cart-footer .total {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
