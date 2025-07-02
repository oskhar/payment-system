<script setup lang='ts'>
import { defineProps } from 'vue'
import CardScan from "@images/misc/CardScan.png"

const props = defineProps({
  customerId: {
    type: Number, // Sesuaikan tipe data dengan yang sesuai (String, Number, dsb.)
    required: true, // Jika wajib diisi
  },
})

const dialogScanUID = ref<boolean>(false)

const handleScan = () => {
  dialogScanUID.value = true
  console.log('Scanning UID for customer:', props.customerId)
}
</script>

<template>
  <VBtn
    color="primary"
    rounded
    @click="handleScan"
  >
    Scan UID
  </VBtn>
  <VDialog
    v-model="dialogScanUID"
    max-width="500px"
  >
    <VCard>
      <VCardItem>
        <center>
          <p class="text-h2 text-primary">
            Scan Kartu!
          </p>
          <img :src="CardScan">
        </center>
        <VBtn
          variant="flat"
          color="primary"
          block
          @click="dialogScanUID = false"
        >
          Selesai
        </VBtn>
      </VCardItem>
    </VCard>
  </VDialog>
</template>
