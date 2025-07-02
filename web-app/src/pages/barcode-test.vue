<template>
  <v-app>
    <v-main>
      <v-container>
        <h1>Scan Barcode</h1>
        <v-text-field
          v-model="scannedCode"
          label="Scan hasil barcode"
          outlined
          ref="barcodeInput"
          autofocus
        ></v-text-field>

        <v-btn
          color="primary"
          class="mt-4"
          @click="handleScan"
        >
          Proses Barcode
        </v-btn>

        <div v-if="lastScanned" class="mt-4">
          <strong>Terakhir discan:</strong> {{ lastScanned }}
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      scannedCode: '',
      lastScanned: '',
      buffer: '',
      scanning: false,
      timer: null,
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeydown)
  },
  methods: {
    handleKeydown(e) {
      if (!this.scanning) {
        this.buffer = ''
        this.scanning = true
      }

      clearTimeout(this.timer)

      if (e.key === 'Enter') {
        this.lastScanned = this.buffer
        this.scannedCode = this.buffer
        this.buffer = ''
        this.scanning = false
        return
      }

      this.buffer += e.key

      this.timer = setTimeout(() => {
        // fallback jika tidak ada Enter
        if (this.buffer.length > 3) {
          this.lastScanned = this.buffer
          this.scannedCode = this.buffer
        }
        this.buffer = ''
        this.scanning = false
      }, 100)
    },
    handleScan() {
      alert(`Barcode diproses: ${this.scannedCode}`)
    },
  },
}
</script>

<style>
body {
  font-family: 'Roboto', sans-serif;
}
</style>
