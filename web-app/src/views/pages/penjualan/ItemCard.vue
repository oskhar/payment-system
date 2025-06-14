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
    ></VImg>

    <!-- Konten utama -->
    <VCardText>
      <h3 class="title">{{ item.name }}</h3>
      <p class="price">Rp {{ new Intl.NumberFormat('id-ID').format(`${item.price}`.replace(/\D/g, '')) }}.-</p>
      <p
        class="stock"
        :class="{ 'out-of-stock': item.stock === 0 }"
      >
        Stok: {{ item.stock }}
      </p>

      <!-- Kategori sebagai chips -->
      <div class="categories">
        <VChip
          v-for="(category, index) in item.categories"
          :key="index"
          class="category-chip"
          color="secondary"
          text-color="white"
          small
          outlined
        >
          {{ category.name }}
        </VChip>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import axios from 'axios'

const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({
      id: 0,
      image_url: '',
      name: '',
      price: 0,
      stock: 0,
      categories: [],
      description: '',
    }),
  },
})

const categories = ref<{ id: number; name: string }[]>([])

// Fungsi fetch kategori (bisa dipanggil di mounted atau parent)
const fetchCategory = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/category`)
    categories.value = response.data.data
  } catch (error) {
    console.error('Gagal mengambil data kategori:', error)
  }
}

// Panggil fetchCategory saat komponen mount
fetchCategory()
</script>

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
