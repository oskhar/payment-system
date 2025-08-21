<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import api from '@/api'

// Impor library untuk generate PDF
// Pastikan Anda telah menginstal jspdf dan jspdf-autotable
// npm install jspdf jspdf-autotable
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Impor logo untuk struk
import logoUrl from '@images/logo-toko.png'

// --- STATE UNTUK RIWAYAT TRANSAKSI ---
const transactions = ref<any[]>([])

// --- STATE UNTUK PRINTER ---
const device = ref<USBDevice | null>(null)
const endpoint = ref<USBEndpoint | null>(null)
const isPrinterConnected = ref(false)
const VENDOR_ID = 1155 // Sesuaikan dengan Vendor ID printer Anda
const PRODUCT_ID = 22339 // Sesuaikan dengan Product ID printer Anda

const toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
})

// --- FUNGSI UNTUK RIWAYAT TRANSAKSI ---

const fetchTransactions = async () => {
  try {
    const { data } = await api.get(`${import.meta.env.VITE_API_URL}/transaction`)
    transactions.value = data.data
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
  }
}

const deleteTransaction = async (id: number) => {
  try {
    await api.delete(`${import.meta.env.VITE_API_URL}/transaction`, {
      data: { id: [id] },
    })
    transactions.value = transactions.value.filter(t => t.id !== id)
    Swal.fire('Deleted!', 'Transaction has been deleted.', 'success')
  } catch (error) {
    console.error('Failed to delete transaction:', error)
    Swal.fire('Error!', 'Failed to delete transaction.', 'error')
  }
}

const confirmDelete = async (transactionId: number) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This transaction will be permanently deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  })

  if (result.isConfirmed) {
    deleteTransaction(transactionId)
  }
}

// --- FUNGSI UNTUK PRINT STRUK ---

// Mengubah gambar logo menjadi format raster untuk printer thermal
async function convertImageToRaster(imageUrl: string): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d', { willReadFrequently: true })
      if (!context) return reject(new Error('Gagal mendapatkan konteks canvas'))

      const maxLogoWidth = 160
      let targetWidth = image.width
      let targetHeight = image.height

      if (targetWidth > maxLogoWidth) {
        const scale = maxLogoWidth / targetWidth
        targetWidth = maxLogoWidth
        targetHeight = Math.ceil(image.height * scale)
      }

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
            const brightness = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3
            if (brightness < threshold) byte |= 1 << (7 - bit)
          }
          bytes[byteIndex++] = byte
        }
      }

      const xL = (canvas.width / 8) % 256
      const xH = Math.floor(canvas.width / 8 / 256)
      const yL = canvas.height % 256
      const yH = Math.floor(canvas.height / 256)

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

// Melakukan setup dan klaim interface USB printer
const setupDevice = async (selectedDevice: USBDevice) => {
  device.value = selectedDevice
  await device.value.open()
  if (device.value.configuration === null) await device.value.selectConfiguration(1)

  const interfaceNumber = 0
  await device.value.claimInterface(interfaceNumber)

  const iface = device.value.configuration?.interfaces[interfaceNumber]
  endpoint.value = iface?.alternates[0]?.endpoints.find(e => e.direction === 'out') ?? null

  if (endpoint.value) {
    isPrinterConnected.value = true
    toast.fire({ icon: 'success', title: 'Printer terhubung.' })
  }
}

// Menghubungkan ke printer USB, baik yang sudah diizinkan atau meminta izin baru
const connectUsbPrinter = async (requestNew = false) => {
  if (!('usb' in navigator)) {
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
    if (error.name !== 'NotFoundError') toast.fire({ icon: 'error', title: 'Gagal menghubungkan printer.' })
  }
}

// Fungsi utama untuk mencetak struk thermal berdasarkan data transaksi
const printReceipt = async (transaction: any) => {
  if (!isPrinterConnected.value || !device.value || !endpoint.value) {
    toast.fire({ icon: 'warning', title: 'Printer tidak terhubung. Hubungkan terlebih dahulu.' })
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
  const address = `${transaction.branch.name} - ${transaction.branch.address}\n`
  const separator = `${'-'.repeat(paperWidthChars)}\n`

  let infoLines = `No Transaksi: ${transaction.transaction_number}\n`
  infoLines += `Tanggal     : ${new Date(transaction.created_at).toLocaleString('id-ID', { hour12: false })}\n`
  infoLines += `Kasir       : ${transaction.creator.name}\n`
  infoLines += `Pembayaran  : ${transaction.payment_method.toUpperCase()}\n`

  let detailsLines = ''
  transaction.items.forEach((item: any) => {
    const itemPrice = item.price
    const quantityPrice = `${item.quantity} x ${Number(itemPrice).toLocaleString('id-ID')}`
    const subtotal = item.total_amount
    const formattedSubtotal = `Rp${Number(subtotal).toLocaleString('id-ID')}`

    const itemName = `Item ID: ${item.item_id} (Unit ID: ${item.unit_id})`
    detailsLines += `${itemName}\n`
    const priceLine = `  ${quantityPrice}`.padEnd(paperWidthChars - formattedSubtotal.length) + formattedSubtotal
    detailsLines += `${priceLine}\n`
  })

  const totalPayment = transaction.total_amount
  const formattedTotal = `Rp${Number(totalPayment).toLocaleString('id-ID')}`
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
  } catch (err) {
    console.error('Gagal mencetak ke USB printer:', err)
    toast.fire({ icon: 'error', title: 'Gagal mencetak struk.' })
  }
}

// [BARU] Fungsi untuk generate dan download PDF
const generatePdf = async (transaction: any) => {
  const doc = new jsPDF()

  // Helper untuk mengubah URL gambar menjadi base64
  const toBase64 = (url: string) =>
    fetch(url)
      .then(response => response.blob())
      .then(
        blob =>
          new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
          }),
      )

  try {
    const logoBase64 = (await toBase64(logoUrl)) as string
    doc.addImage(logoBase64, 'PNG', 15, 10, 30, 0) // x, y, width, height
  } catch (error) {
    console.error('Gagal memuat logo untuk PDF:', error)
  }

  // Header Dokumen
  doc.setFontSize(18)
  doc.text('Struk Pembelian', 105, 20, { align: 'center' })
  doc.setFontSize(12)
  doc.text('TOKO MUVIE', 105, 30, { align: 'center' })
  doc.setFontSize(10)
  doc.text(`${transaction.branch.name} - ${transaction.branch.address}`, 105, 38, { align: 'center' })
  doc.line(15, 45, 195, 45) // Garis pemisah

  // Info Transaksi
  doc.setFontSize(10)
  doc.text(`No Transaksi: ${transaction.transaction_number}`, 15, 55)
  doc.text(`Tanggal     : ${new Date(transaction.created_at).toLocaleString('id-ID')}`, 15, 60)
  doc.text(`Kasir       : ${transaction.creator.name}`, 15, 65)
  doc.text(`Pembayaran  : ${transaction.payment_method.toUpperCase()}`, 15, 70)

  // Tabel Item
  const tableColumn = ['Nama Item', 'Kuantitas', 'Harga Satuan', 'Subtotal']
  const tableRows: any[][] = []

  transaction.items.forEach((item: any) => {
    const itemData = [
      `Item ID: ${item.item_id}`, // Placeholder karena nama item tidak ada di API riwayat
      item.quantity,
      `Rp ${Number(item.price).toLocaleString('id-ID')}`,
      `Rp ${Number(item.total_amount).toLocaleString('id-ID')}`,
    ]
    tableRows.push(itemData)
  })

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 75,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] }, // Warna biru
  })

  // Total
  const finalY = (doc as any).lastAutoTable.finalY
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  const totalText = `Total Bayar: Rp ${Number(transaction.total_amount).toLocaleString('id-ID')}`
  doc.text(totalText, 195, finalY + 10, { align: 'right' })

  // Footer
  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.text('Terima kasih telah berbelanja!', 105, finalY + 25, { align: 'center' })

  // Simpan PDF
  doc.save(`struk-${transaction.transaction_number}.pdf`)
}

// --- LIFECYCLE HOOK ---
onMounted(() => {
  fetchTransactions()
  connectUsbPrinter() // Coba hubungkan printer saat komponen dimuat
})
</script>

<template>
  <VContainer fluid>
    <VRow>
      <VCol cols="12">
        <!-- Tombol untuk menghubungkan printer secara manual -->
        <div class="d-flex justify-end mb-4">
          <VBtn
            :color="isPrinterConnected ? 'success' : 'grey'"
            @click="connectUsbPrinter(true)"
          >
            <VIcon start>ri-printer-line</VIcon>
            {{ isPrinterConnected ? 'Printer Terhubung' : 'Hubungkan Printer' }}
          </VBtn>
        </div>

        <VAlert
          v-if="transactions.length === 0"
          type="info"
          class="mt-4"
        >
          No transaction history available.
        </VAlert>
        <VCol
          v-for="transaction in transactions"
          :key="transaction.id"
          cols="12"
          class="pa-0"
        >
          <VCard
            class="mb-3"
            outlined
          >
            <VCardTitle class="d-flex justify-space-between">
              <div>
                <div class="text-h6">
                  {{ transaction.transaction_number }}
                </div>
                <div class="text-subtitle-2 text-capitalize">
                  {{ transaction.payment_method }}
                </div>
              </div>
              <div>
                <!-- [BARU] Tombol Cetak PDF -->
                <VBtn
                  icon
                  variant="text"
                  color="red"
                  class="mr-2"
                  title="Cetak PDF"
                  @click="generatePdf(transaction)"
                >
                  <VIcon>ri-file-pdf-line</VIcon>
                </VBtn>
                <!-- Tombol Print Thermal -->
                <VBtn
                  icon
                  variant="text"
                  color="primary"
                  class="mr-2"
                  title="Cetak Struk Thermal"
                  @click="printReceipt(transaction)"
                >
                  <VIcon>ri-printer-fill</VIcon>
                </VBtn>
                <VBtn
                  icon
                  variant="text"
                  color="error"
                  @click="confirmDelete(transaction.id)"
                >
                  <VIcon>ri-delete-bin-line</VIcon>
                </VBtn>
              </div>
            </VCardTitle>

            <VCardText>
              <div class="font-weight-bold text-h6">
                Rp {{ new Intl.NumberFormat('id-ID').format(transaction.total_amount) }}
              </div>
              <div class="text-caption">
                {{ new Date(transaction.created_at).toLocaleString('id-ID') }}
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>
.v-card-title {
  align-items: center;
}
.text-capitalize {
  text-transform: capitalize;
}
</style>
