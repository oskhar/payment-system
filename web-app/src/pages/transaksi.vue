<template>
  <VContainer
    fluid
    class="cashier-page"
  >
    <VRow>
      <!-- Daftar Produk -->
      <VCol
        cols="12"
        md="8"
        class="product-list"
      >
        <VTextField
          v-model="searchQuery"
          label="Cari Produk..."
          prepend-inner-icon="ri-search-line"
          class="search-input"
          outlined
          dense
          clearable
        />

        <VRow class="mt-4">
          <VCol
            cols="12"
            md="4"
            class="product-list"
            v-for="product in filteredProducts"
          >
            <VCard
              :key="product.id"
              class="product-card"
              outlined
              @click="addToCart(product)"
            >
              <VImg
                :src="product.image_url"
                height="140"
                class="product-image"
              />
              <VCardTitle class="product-title">{{ product.name }}</VCardTitle>
              <VCardSubtitle class="product-price">Rp {{ product.price.toLocaleString() }}</VCardSubtitle>
            </VCard>
          </VCol>
        </VRow>
      </VCol>

      <!-- Keranjang Belanja -->
      <VCol
        cols="12"
        md="4"
        class="cart-section"
      >
        <div class="cart-header">
          <h3>Daftar Belanja</h3>
        </div>

        <VCard class="pa-4">
          <div
            v-if="cart.length === 0"
            class="empty-cart"
          >
            <p class="text-h3 text-secondary">masih kosong..</p>
          </div>

          <VList
            v-else
            dense
          >
            <VListItem
              v-for="(item, index) in cart"
              :key="item.product.id"
              class="cart-item"
              style="border-bottom: 1px solid black"
            >
              <VListItemSubtitle class="d-flex justify-space-between">
                <span class="text-h5">Rp {{ item.product.price.toLocaleString() }} x</span>
                <div class="quantity-controls d-flex align-center">
                  <VBtn
                    icon
                    color="error"
                    @click="removeFromCart(index)"
                  >
                    <VIcon>ri-delete-bin-line</VIcon>
                    <!-- Ganti mdi-delete ke ri-delete-bin-line -->
                  </VBtn>
                  <VBtn
                    class="ml-3"
                    icon
                    small
                    @click="decrementQuantity(index)"
                  >
                    <VIcon>ri-subtract-line</VIcon>
                    <!-- Ganti mdi-minus ke ri-subtract-line -->
                  </VBtn>

                  <span class="quantity-display mx-2 text-h5">{{ item.quantity }}</span>

                  <VBtn
                    icon
                    small
                    @click="incrementQuantity(index)"
                  >
                    <VIcon>ri-add-line</VIcon>
                    <!-- Ganti mdi-plus ke ri-add-line -->
                  </VBtn>
                </div>
              </VListItemSubtitle>

              <VListItemAction class="d-flex justify-space-between mt-3">
                <span class="text-h4 text-primary">{{ item.product.name }}</span>
                <span class="text-h5">: Rp {{ item.product.price.toLocaleString() }}</span>
              </VListItemAction>
            </VListItem>
          </VList>

          <div
            class="cart-footer"
            v-if="cart.length > 0"
          >
            <div class="total text-h3 my-3">
              <span class="">Total:</span>
              <span class="total-price">Rp {{ totalPrice.toLocaleString() }}</span>
            </div>
            <VBtn
              color="primary"
              block
              size="large"
              @click="checkout"
              class="checkout-btn"
            >
              Bayar Sekarang
            </VBtn>
          </div>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2' // Import SweetAlert2

export default {
  name: 'CashierPage',
  data() {
    return {
      searchQuery: '',
      products: [],
      cart: [],
      // Membuat instance Swal toast agar dapat digunakan kembali
      toast: Swal.mixin({
        toast: true,
        position: 'bottom-end', // pojok kanan bawah
        showConfirmButton: false,
        timer: 3000, // durasi tampil 3 detik
        timerProgressBar: true,
        didOpen: toast => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
      }),
    }
  },
  computed: {
    filteredProducts() {
      return this.searchQuery
        ? this.products.filter(p => p.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
        : this.products
    },
    totalPrice() {
      return this.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    },
  },

  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/item`)
        this.products = response.data.data.items.map(row => ({
          ...row,
          image_url: `${import.meta.env.VITE_API_URL}${row.image_url}`,
        }))
        console.log(this.products)
      } catch (error) {
        console.error('Gagal mengambil data produk:', error)
      }
    },
    addToCart(product) {
      const found = this.cart.find(item => item.product.id === product.id)
      if (found) {
        if (found.quantity < product.stock) {
          found.quantity++
        } else {
          this.toast.fire({
            icon: 'warning',
            title: `Jumlah maksimal stok produk "${product.name}" adalah ${product.stock}.`,
          })
        }
      } else {
        if (product.stock > 0) {
          this.cart.push({ product, quantity: 1 })
        } else {
          this.toast.fire({
            icon: 'error',
            title: `Maaf, stok produk "${product.name}" sedang habis.`,
          })
        }
      }
    },
    updateQuantity(index, quantity) {
      if (quantity < 1) this.cart.splice(index, 1)
      else {
        if (quantity <= this.cart[index].product.stock) {
          this.cart[index].quantity = quantity
        } else {
          this.toast.fire({
            icon: 'warning',
            title: `Jumlah maksimal stok produk "${this.cart[index].product.name}" adalah ${this.cart[index].product.stock}.`,
          })
        }
      }
    },
    removeFromCart(index) {
      this.cart.splice(index, 1)
    },
    checkout() {
      this.toast.fire({
        icon: 'success',
        title: `Pembayaran Berhasil! Total: Rp ${this.totalPrice.toLocaleString()}`,
      })
      this.cart = []
    },
    incrementQuantity(index) {
      if (this.cart[index].quantity < this.cart[index].product.stock) {
        this.cart[index].quantity++
      } else {
        this.toast.fire({
          icon: 'warning',
          title: `Jumlah maksimal stok produk "${this.cart[index].product.name}" adalah ${this.cart[index].product.stock}.`,
        })
      }
    },
    decrementQuantity(index) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity--
      } else {
        this.removeFromCart(index)
      }
    },
  },

  mounted() {
    this.fetchProducts()
  },
}
</script>
