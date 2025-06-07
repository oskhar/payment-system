<script setup lang="ts">
import HiCharacter from '@images/avatars/Hi.webp'
</script>

<template>
  <VCard class="text-center text-sm-start">
    <VRow no-gutters>
      <VCol
        cols="12"
        sm="8"
        order="2"
        order-sm="1"
      >
        <VCardItem class="pb-3">
          <VCardTitle class="text-primary">
            Selamat Datang di SAMPOS!
          </VCardTitle>
        </VCardItem>

        <VCardText>
          Aplikasi agar kasirmu labih cantik 🌟 Pengelolaan gudang yang terstruktur dan catat Transaksi ga pake ribet 🚀
          <br>
          <VBtn
            variant="tonal"
            class="mt-6"
            size="small"
          >
            View Badges
          </VBtn>
        </VCardText>
      </VCol>

      <VCol
        cols="12"
        sm="4"
        order="1"
        order-sm="2"
        class="text-center"
      >
        <img
          :src="HiCharacter"
          :height="$vuetify.display.xs ? '150' : '182'"
          :class="$vuetify.display.xs ? 'mt-6 mb-n2' : 'position-absolute'"
          class="character-image john-illustration flip-in-rtl"
        >
      </VCol>
    </VRow>
  </VCard>
</template>

<style lang="scss" scoped>
.john-illustration {
  inset-block-end: -0.125rem;
  inset-inline-end: 3.5rem;
}
.character-image {
  object-fit: cover !important; /* Pastikan gambar terpotong */
  object-position: top !important; /* Posisi pemotongan */
  overflow: hidden !important; /* Hindari overflow */
  bottom: -35% !important;
  height: 130% !important;
  min-width: 220px;
}
</style>
