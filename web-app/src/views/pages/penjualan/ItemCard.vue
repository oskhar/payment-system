<script setup lang="ts">
import { computed } from 'vue'

// =================================================================
// Type Definitions
// Struktur data tidak berubah, hanya memastikan tipe data sesuai.
// =================================================================
interface ItemPrice {
  id?: number
  price: number
  min_quantity: number
}

interface Item {
  id: number
  image_url: string
  name: string
  stock: number
  item_prices: ItemPrice[]
}

// =================================================================
// Props
// Props tetap sama, menerima objek 'item'.
// =================================================================
const props = defineProps<{
  item: Item
}>()

// =================================================================
// Computed Properties
// Logika untuk mendapatkan harga dasar tidak berubah.
// =================================================================

/**
 * Menemukan harga dasar (dimana min_quantity adalah 1 atau harga terendah)
 * dan memformatnya ke dalam format mata uang Rupiah.
 */
const formattedBasePrice = computed(() => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(
    props.item.price,
  )
})
</script>

<template>
  <VCard
    class="item-card"
    style="height: 300px"
    elevation="4"
  >
    <!-- Gambar Produk sebagai Latar Belakang -->
    <VImg
      :src="item.image_url"
      :alt="item.name"
      class="bg-image"
      cover
      gradient="to top, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.3) 39%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0) 100%"
    >
      <!-- Konten Overlay di atas Gambar -->
      <div class="overlay-content">
        <!-- Informasi Stok -->
        <VChip
          class="stock-chip"
          :color="item.stock > 0 ? 'success' : 'error'"
          size="small"
          label
        >
          Stok: {{ item.stock }}
        </VChip>

        <!-- Informasi Nama dan Harga -->
        <div class="text-info">
          <h3 class="item-name text-white">
            {{ item.name }}
          </h3>
          <p class="item-price text-white">
            {{ formattedBasePrice }}
          </p>
        </div>
      </div>
    </VImg>
  </VCard>
</template>

<style lang="scss" scoped>
.item-card {
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  aspect-ratio: 4 / 3; // Menjaga rasio aspek kartu

  &:hover:not(:disabled) {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.overlay-content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 12px;
  color: white;
  z-index: 2;
}

.stock-chip {
  align-self: flex-end; // Posisikan di kanan atas
  font-weight: bold;
}

.text-info {
  align-self: flex-start; // Posisikan di kiri bawah
}

.item-name {
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.3;
}

.item-price {
  font-size: 1rem;
  font-weight: 500;
  margin-top: 4px;
}

.out-of-stock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3; // Tampil di atas konten lain

  span {
    font-size: 1.5rem;
    font-weight: bold;
    transform: rotate(-15deg);
    border: 3px solid #b71c1c;
    padding: 8px 16px;
    border-radius: 8px;
  }
}
</style>
