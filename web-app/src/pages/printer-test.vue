<template>
  <v-container>
    <v-btn
      color="primary"
      @click="connectToUsbPrinter"
    >
      Cetak ke iWare DS260 USB
    </v-btn>
    <v-alert
      v-if="message"
      type="info"
      class="mt-4"
    >
      {{ message }}
    </v-alert>
  </v-container>
</template>

<script>
export default {
  name: 'UsbPrinter',
  data() {
    return {
      message: '',
    }
  },
  methods: {
    // Encoding ASCII murni (7-bit)
    encodeASCII(str) {
      const arr = new Uint8Array(str.length)
      for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i)
        arr[i] = code > 127 ? 32 : code // non-ASCII diubah ke spasi
      }
      return arr
    },

    async connectToUsbPrinter() {
      this.message = ''

      if (!('usb' in navigator)) {
        this.message = 'Browser tidak mendukung WebUSB. Gunakan Chrome via HTTPS atau localhost.'
        return
      }

      try {
        const device = await navigator.usb.requestDevice({
          filters: [{ vendorId: 0x0483, productId: 0x5743 }],
        })

        await device.open()
        if (!device.configuration) {
          await device.selectConfiguration(1)
        }

        const ifaceNum = 0
        if (device.kernelDriverActive && device.detachKernelDriver) {
          try {
            await device.detachKernelDriver(ifaceNum)
            console.log('Kernel driver detached')
          } catch {}
        }

        await device.claimInterface(ifaceNum)

        const iface = device.configuration.interfaces[ifaceNum]
        const alternate = iface.alternates[0]
        const endpt = alternate.endpoints.find(e => e.direction === 'out')
        if (!endpt) {
          this.message = '❌ OUT endpoint tidak ditemukan.'
          return
        }

        // Set code page ke PC437 (default US)
        const cpCommand = new Uint8Array([0x1b, 0x74, 0x00])

        const lines = [
          '*** IWARE DS260 PRINTER TEST ***',
          'Baris pertama TEXT TEST',
          'Baris kedua TEXT TEST',
          'Baris ketiga TEXT TEST',
        ]
        const textBytes = this.encodeASCII(lines.join('\n') + '\n\n')

        const cutCommand = new Uint8Array([0x1d, 0x56, 0x41, 0x10])

        // Gabungkan semua
        const payload = new Uint8Array(cpCommand.length + textBytes.length + cutCommand.length)
        payload.set(cpCommand, 0)
        payload.set(textBytes, cpCommand.length)
        payload.set(cutCommand, cpCommand.length + textBytes.length)

        await device.transferOut(endpt.endpointNumber, payload)

        this.message = '✅ Data ESC/POS telah dikirim, cek hasil cetak.'
      } catch (err) {
        console.error(err)
        this.message = `❌ Gagal cetak: ${err.message}`
      }
    },
  },
}
</script>
