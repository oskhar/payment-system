<script setup lang="ts">
import MusicEnjoy from '@images/avatars/MusicEnjoy.webp'
</script>

<template>
  <VCard
    class="text-center text-sm-start"
    style="background: rgba(77, 140, 246, 0.1) !important"
    elevation="0"
  >
    <VRow no-gutters>
      <VCol
        cols="12"
        sm="8"
        order="2"
        order-sm="1"
      >
        <VCardItem class="pb-3">
          <VCardTitle class="text-primary"> Upgrade Paket, Kelola Lebih Luas </VCardTitle>
        </VCardItem>

        <VCardText class="text-black">
          Tingkatkan efisiensi gudang dan atur stok tanpa batas! 🚀
          <br />
          <VBtn
            class="mt-6"
            size="small"
          >
            Check Out
          </VBtn>
        </VCardText>
      </VCol>

      <VCol
        cols="12"
        sm="4"
        order="1"
        order-sm="2"
        class="text-center d-flex justify-center text-center align-items"
      >
        <div style="overflow: hidden">
          <img
            :src="MusicEnjoy"
            :height="$vuetify.display.xs ? '150' : '182'"
            class="flip-in-rtl"
          />
        </div>
      </VCol>
    </VRow>
  </VCard>
</template>
