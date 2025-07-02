<script setup lang="ts">
import { computed } from 'vue'

// =================================================================
// Type Definitions (Disesuaikan dengan struktur data baru)
// =================================================================
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
  stock: number
  categories: Category[]
  item_prices: ItemPrice[]
}

// =================================================================
// Props & Emits
// =================================================================
const props = defineProps<{
  item: Item
}>()

// =================================================================
// Computed Properties (Untuk mengambil harga dasar)
// =================================================================

/**
 * Menemukan harga dasar (dimana min_quantity adalah 1) dari array item_prices
 * dan memformatnya ke dalam format mata uang Rupiah.
 */
const formattedBasePrice = computed(() => {
  // Temukan harga dengan kuantitas minimum 1 sebagai harga dasar.
  const basePriceTier = props.item.item_prices?.find(p => p.min_quantity === 1)

  // Jika tidak ditemukan, gunakan harga 0 sebagai fallback.
  const price = basePriceTier?.price || 0

  // Format harga ke dalam string Rupiah.
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
})
</script>

<template>
  <VCard
    class="shopping-card"
    elevation="8"
    max-width="360"
  >
    <!-- Gambar produk -->
    <VImg
      :src="item.image_url"
      alt="Gambar produk"
      height="220"
      class="product-image"
      cover
    />

    <!-- Konten utama -->
    <VCardText>
      <h3 class="title">
        {{ item.name }}
      </h3>
      <!-- PERBAIKAN: Menggunakan computed property untuk harga -->
      <p class="price">
        {{ formattedBasePrice }}
      </p>
      <p
        class="stock"
        :class="{ 'out-of-stock': item.stock === 0 }"
      >
        Stok: {{ item.stock }}
      </p>

      <!-- Kategori sebagai chips -->
      <div
        v-if="item.categories?.length"
        class="categories"
      >
        <VChip
          v-for="category in item.categories"
          :key="category.id"
          class="category-chip"
          color="secondary"
          text-color="white"
          size="small"
          variant="outlined"
        >
          {{ category.name }}
        </VChip>
      </div>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.shopping-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: #ffffff;
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
  cursor: default;

  &:hover {
    box-shadow: 0 16px 32px rgba(25, 118, 210, 0.35);
    transform: translateY(-6px);
  }

  .close-btn {
    position: absolute;
    top: 14px;
    right: 14px;
    color: #555;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
    z-index: 10;

    &:hover {
      background: #1976d2;
      color: white;
    }
  }

  .product-image {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
  }

  .title {
    font-weight: 700;
    font-size: 1.4rem;
    margin-bottom: 0.3rem;
    color: #1e2d3d;
    user-select: none;
  }

  .price {
    font-weight: 600;
    font-size: 1.2rem;
    color: #1976d2;
    margin-bottom: 0.6rem;
    user-select: none;
  }

  .stock {
    font-size: 1rem;
    margin-bottom: 1rem;
    color: #4caf50;
    user-select: none;

    &.out-of-stock {
      color: #e53935;
      font-weight: 700;
    }
  }

  .categories {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .category-chip {
      border-radius: 14px;
      font-weight: 500;
      text-transform: capitalize;
      cursor: default;
      user-select: none;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #1565c0 !important;
        color: white !important;
      }
    }
  }
}
</style>
