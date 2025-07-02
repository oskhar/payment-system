<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import ItemCard from '@/views/pages/penjualan/ItemCard.vue'

// [PENAMBAHAN] Impor logo Anda.
// Pastikan Anda menempatkan file logo di 'src/assets/images/logo-toko.png' atau sesuaikan path-nya.
// Disarankan logo berformat PNG, hitam-putih, dan tidak terlalu kompleks.
import logoUrl from '@images/logo-toko.png'

// --- Type Definitions ---
// Tidak ada perubahan di sini, semua tipe data tetap sama.
interface Category {
  id: number
  name: string
}
interface ItemPrice {
  id?: number
  price: number
  min_quantity: number
}
interface Item {
  id: number
  image_url: string
  name: string
  barcode: string
  stock: number
  categories: Category[]
  item_prices: ItemPrice[]
}
interface CartItem {
  product: Item
  quantity: number
}

// --- Reactive State ---
// Tidak ada perubahan di sini, semua state tetap sama.
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
// Tidak ada perubahan di sini.
const device = ref<USBDevice | null>(null)
const endpoint = ref<USBEndpoint | null>(null)
const cartBackup = ref<CartItem[]>([])
const totalPriceBackup = ref(0)
const paymentMethodBackup = ref('')
const transactionNumber = ref('')
const transactionDate = ref('')
const cashierName = ref('Admin')

const VENDOR_ID = 1155
const PRODUCT_ID = 22339

// --- [PERBAIKAN UKURAN LOGO] Fungsi Helper untuk Mengonversi Gambar menjadi Data Byte ESC/POS ---
/**
 * Mengonversi gambar menjadi data byte untuk printer ESC/POS menggunakan perintah GS v 0.
 * Fungsi ini tidak memodifikasi fungsionalitas lain dan hanya digunakan untuk memproses logo.
 * @param {string} imageUrl URL atau path gambar yang diimpor.
 * @returns {Promise<Uint8Array>} Promise yang menghasilkan data byte gambar yang siap cetak.
 */
async function convertImageToRaster(imageUrl: string): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.crossOrigin = 'anonymous'
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d', { willReadFrequently: true })
      if (!context) return reject(new Error('Gagal mendapatkan konteks canvas'))

      // [PERBAIKAN] Lebar logo disesuaikan untuk kertas 80mm.
      // Nilai 300px adalah contoh, Anda dapat menyesuaikannya.
      const maxLogoWidth = 160

      let targetWidth = image.width
      let targetHeight = image.height

      // Skalakan gambar jika lebih lebar dari batas maksimum yang ditentukan
      if (targetWidth > maxLogoWidth) {
        const scale = maxLogoWidth / targetWidth

        targetWidth = maxLogoWidth
        targetHeight = Math.ceil(image.height * scale)
      }

      // Pastikan lebar adalah kelipatan 8 untuk konversi byte yang optimal pada printer
      if (targetWidth % 8 !== 0) targetWidth = Math.floor(targetWidth / 8) * 8

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

            if (brightness < threshold) byte |= 1 << (7 - bit)
          }
          bytes[byteIndex++] = byte
        }
      }

      const xL = (canvas.width / 8) % 256
      const xH = Math.floor(canvas.width / 8 / 256)
      const yL = canvas.height % 256
      const yH = Math.floor(canvas.height / 256)

      // Perintah ESC/POS untuk print raster bit image
      const command = new Uint8Array([0x1d, 0x76, 0x30, 0x00, xL, xH, yL, yH])
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
  // Tidak ada perubahan di sini, fungsionalitas koneksi tetap sama.
  device.value = selectedDevice
  await device.value.open()
  if (device.value.configuration === null) await device.value.selectConfiguration(1)

  const interfaceNumber = 0
  try {
    if (device.value.configuration?.interfaces[interfaceNumber].claimed) console.log('Interface sudah di-claim.')
    else await device.value.claimInterface(interfaceNumber)
  } catch (error) {
    console.warn('Gagal claim interface, mencoba detach kernel driver...', error)
    if (device.value.detachKernelDriver)
      // Periksa ketersediaan fungsi
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
  // Tidak ada perubahan di sini, fungsionalitas koneksi tetap sama.
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
    } else {
      const devices = await navigator.usb.getDevices()

      selectedDevice = devices.find(d => d.vendorId === VENDOR_ID && d.productId === PRODUCT_ID) || null
    }

    if (!selectedDevice) {
      if (!requestNew) console.log('Tidak ada printer yang diizinkan. Klik tombol untuk menghubungkan.')

      return
    }

    await setupDevice(selectedDevice)
  } catch (error: any) {
    console.error('Gagal koneksi ke USB printer:', error)
    if (error.name !== 'NotFoundError')
      toast.fire({ icon: 'error', title: 'Gagal claim interface. Di Linux, periksa udev rules.' })
  }
}

// --- [PERBAIKAN LEBAR KERTAS] Fungsi Print Struk ---
const printReceiptToUsb = async () => {
  if (!isPrinterConnected.value || !device.value || !endpoint.value) {
    console.warn('Device atau endpoint printer belum tersedia.')
    toast.fire({ icon: 'warning', title: 'Printer tidak terhubung. Hubungkan kembali.' })

    return
  }

  // [PERBAIKAN] Lebar kertas diubah ke 48 untuk printer 80mm.
  const paperWidthChars = 48

  // -- Perintah ESC/POS --
  const encoder = new TextEncoder()
  const initPrinter = encoder.encode('\x1B\x40')
  const centerAlign = encoder.encode('\x1B\x61\x01')
  const leftAlign = encoder.encode('\x1B\x61\x00')
  const cutPaper = encoder.encode('\x1D\x56\x41\x10')
  const lineFeed = encoder.encode('\n')

  // -- Data Struk --
  const storeName = 'TOKO MUVIE\n'
  const address = 'Jalan Contoh No. 123, Jakarta\n'
  const separator = `${'-'.repeat(paperWidthChars)}\n`

  let infoLines = `No Transaksi: ${transactionNumber.value}\n`
  infoLines += `Tanggal     : ${new Date(transactionDate.value).toLocaleString('id-ID', { hour12: false })}\n`
  infoLines += `Kasir       : ${cashierName.value}\n`
  infoLines += `Pembayaran  : ${paymentMethodBackup.value.toUpperCase()}\n`

  let detailsLines = ''
  cartBackup.value.forEach(item => {
    const itemPrice = getPriceForQuantity(item.product, item.quantity)
    const quantityPrice = `${item.quantity} x ${itemPrice.toLocaleString('id-ID')}`

    const subtotal = itemPrice * item.quantity
    const formattedSubtotal = `Rp${subtotal.toLocaleString('id-ID')}`

    // Potong nama item jika terlalu panjang agar tidak merusak layout
    const maxItemNameLength = paperWidthChars - 1

    const itemName =
      item.product.name.length > maxItemNameLength
        ? item.product.name.substring(0, maxItemNameLength)
        : item.product.name

    detailsLines += `${itemName}\n`

    // [PERBAIKAN] Gunakan `paperWidthChars` untuk padding dinamis
    const priceLine = `  ${quantityPrice}`.padEnd(paperWidthChars - formattedSubtotal.length) + formattedSubtotal

    detailsLines += `${priceLine}\n`
  })

  const totalPayment = totalPriceBackup.value

  const formattedTotal = `Rp${totalPayment.toLocaleString('id-ID')}`
  const totalLabel = 'Total Bayar:'

  // [PERBAIKAN] Gunakan `paperWidthChars` untuk padding dinamis
  const totalLines = `${totalLabel}${formattedTotal.padStart(paperWidthChars - totalLabel.length)}\n`

  const footer = '\nTerima Kasih!\n\n\n'

  try {
    // --- Proses dan siapkan data logo ---
    const logoData = await convertImageToRaster(logoUrl).catch(err => {
      console.error('Gagal memproses logo:', err)

      return new Uint8Array() // Jika gagal, kirim array kosong
    })

    // Menggabungkan semua bagian struk menjadi satu buffer untuk dikirim
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
  } catch (err) {
    console.error('Gagal mencetak ke USB printer:', err)
    toast.fire({ icon: 'error', title: 'Gagal mencetak struk.' })
  }
}

// -- Sisa Fungsionalitas --
// Semua fungsi di bawah ini TIDAK DIUBAH dan tetap menjaga fungsionalitas asli.

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
  if (!searchQuery.value) return products.value

  return products.value.filter(
    p =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchQuery.value)),
  )
})

const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => sum + getPriceForQuantity(item.product, item.quantity) * item.quantity, 0)
})

const getPriceForQuantity = (item: Item, quantity: number): number => {
  if (!item.item_prices || item.item_prices.length === 0) return 0
  const sortedPrices = [...item.item_prices].sort((a, b) => b.min_quantity - a.min_quantity)
  const applicableTier = sortedPrices.find(tier => quantity >= tier.min_quantity)

  return applicableTier?.price ?? sortedPrices[sortedPrices.length - 1]?.price ?? 0
}

const fetchProducts = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/item`)

    products.value = response.data.data.items.map((row: any) => ({
      ...row,
      image_url: row.image_url
        ? `${import.meta.env.VITE_API_URL}${row.image_url}`
        : 'https://placehold.co/360x220/EBF4FF/767676?text=No+Image',
    }))
  } catch (error) {
    console.error('Gagal mengambil data produk:', error)
    toast.fire({ icon: 'error', title: 'Gagal memuat produk.' })
  }
}

const addToCart = (product: Item) => {
  if (product.stock <= 0) {
    toast.fire({ icon: 'error', title: `Maaf, stok ${product.name} habis.` })

    return
  }
  const existingItem = cart.value.find(item => item.product.id === product.id)
  if (existingItem) {
    if (existingItem.quantity < product.stock) existingItem.quantity++
    else toast.fire({ icon: 'warning', title: `Stok maksimal ${product.name} tercapai.` })
  } else {
    cart.value.push({ product, quantity: 1 })
  }
}

const incrementQuantity = (index: number) => {
  const item = cart.value[index]
  if (item.quantity < item.product.stock) item.quantity++
  else toast.fire({ icon: 'warning', title: `Stok maksimal ${item.product.name} tercapai.` })
}

const decrementQuantity = (index: number) => {
  if (cart.value[index].quantity > 1) cart.value[index].quantity--
  else cart.value.splice(index, 1)
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

  try {
    const payload = {
      transaction_number: 'auto',
      payment_method: paymentMethod.value,
      transaction_items: cart.value.map(item => ({
        item_id: item.product.id,
        quantity: item.quantity,
        price_at_transaction: getPriceForQuantity(item.product, item.quantity),
      })),
    }

    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/transaction`, payload)

    // Logika backup data untuk dicetak tidak diubah
    cartBackup.value = JSON.parse(JSON.stringify(cart.value))
    totalPriceBackup.value = totalPrice.value
    paymentMethodBackup.value = paymentMethod.value
    transactionNumber.value = data.transaction?.transaction_number || ''
    transactionDate.value = data.transaction?.created_at || ''

    // Panggil fungsi print setelah semua data siap
    await toast.fire({ icon: 'success', title: 'Pembayaran Berhasil!' })
    await printReceiptToUsb()

    // Reset state setelah berhasil
    cart.value = []
    await fetchProducts()
  } catch (error) {
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
      } else {
        toast.fire({ icon: 'error', title: 'Barcode tidak ditemukan.' })
      }
    }
    buffer = ''

    return
  }
  if (e.key.length === 1) buffer += e.key
  if (scanTimer) clearTimeout(scanTimer)
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
      <!-- Daftar Produk -->
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
            <VAlert type="info"> Belum ada item yang tersedia atau cocok dengan pencarian. </VAlert>
          </VCol>
        </template>
      </VCol>

      <!-- Keranjang Belanja -->
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
                <VIcon start> ri-printer-line </VIcon>
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
                :key="cartItem.product.id"
                class="cart-item"
              >
                <VListItemTitle class="font-weight-bold">
                  {{ cartItem.product.name }}
                </VListItemTitle>
                <VListItemSubtitle>
                  {{
                    getPriceForQuantity(cartItem.product, cartItem.quantity).toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    })
                  }}
                </VListItemSubtitle>

                <template #append>
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
                </template>
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
                  })
                }}</span>
              </div>
              <VBtn
                color="primary"
                block
                size="large"
                class="checkout-btn mt-4"
                :disabled="!paymentMethod || !isPrinterConnected"
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
  padding-left: 0;
  padding-right: 0;
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
