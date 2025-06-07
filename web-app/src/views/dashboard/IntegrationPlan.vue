<script setup lang="ts">
import Laptop from '@images/avatars/Laptop.webp'
</script>
<template>
  <VCard
    class="text-center text-sm-start"
    style="background: rgba(234, 67, 53, 0.1) !important"
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
          <VCardTitle class="text-error"> Mesin Kasir Terintegrasi untuk Bisnis Anda </VCardTitle>
        </VCardItem>

        <VCardText class="text-black">
          Efisien dengan mesin kasir modern yang terhubung ke aplikasi!⚡️
          <br />
          <VBtn
            color="error"
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
            :src="Laptop"
            :height="$vuetify.display.xs ? '150' : '182'"
            class="flip-in-rtl"
          />
        </div>
      </VCol>
    </VRow>
  </VCard>
</template>
