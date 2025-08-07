<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router' // 1. Impor useRouter
import NavItems from '@/layouts/components/NavItems.vue'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import api from '@/api'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'

// =================================================================
// Type Definitions
// =================================================================
interface Branch {
  id: number
  name: string
}

// =================================================================
// Reactive State
// =================================================================
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
const router = useRouter() // 2. Dapatkan instance router

// State untuk visibilitas sidebar
const isSidebarVisible = ref(true)

// State untuk data cabang
const branches = ref<Branch[]>([])
const selectedBranchId = ref<number | null>(null)
const isLoadingBranches = ref(false)

// =================================================================
// Functions
// =================================================================

/**
 * Mengambil daftar cabang dari API.
 */
const fetchBranches = async () => {
  isLoadingBranches.value = true
  try {
    const response = await api.get(`branch`)
    branches.value = response.data.data.branches // Sesuaikan jika struktur data berbeda
  }
  catch (error: any) { // 3. Modifikasi blok catch
    console.error('Gagal mengambil daftar cabang:', error)

    // Periksa jika error berasal dari response server dan statusnya 401
    if (error.response && error.response.status === 401) {
      // Arahkan pengguna ke halaman login
      localStorage.removeItem('auth_token')
      router.push('/login')
    }
    // Anda bisa menambahkan notifikasi error lain di sini jika diperlukan
  }
  finally {
    isLoadingBranches.value = false
  }
}

/**
 * Fungsi untuk men-toggle visibilitas sidebar.
 */
const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value
}

// =================================================================
// Watchers & Lifecycle Hooks
// =================================================================

/**
 * Mengawasi perubahan pada `selectedBranchId` dan menyimpannya ke localStorage.
 */
watch(selectedBranchId, (newId) => {
  if (newId) {
    const selectedBranch = branches.value.find(branch => branch.id === newId)
    if (selectedBranch) {
      // Simpan objek branch (id dan nama) ke localStorage
      localStorage.setItem('selectedBranch', JSON.stringify(selectedBranch))
    }
  }
  else {
    // Hapus dari localStorage jika tidak ada cabang yang dipilih
    localStorage.removeItem('selectedBranch')
  }
})

/**
 * Saat komponen dimuat, ambil data cabang dan set pilihan dari localStorage.
 * Jika tidak ada di localStorage, gunakan cabang pertama sebagai default.
 */
onMounted(async () => {
  // 1. Ambil semua data cabang dari API
  await fetchBranches()

  // 2. Coba dapatkan data cabang yang tersimpan dari localStorage
  const savedBranch = localStorage.getItem('selectedBranch')

  if (savedBranch) {
    // Jika ada, gunakan data yang tersimpan
    const branch: Branch = JSON.parse(savedBranch)
    selectedBranchId.value = branch.id
  } else if (branches.value.length > 0) {
    // Jika tidak ada di localStorage DAN daftar cabang tidak kosong,
    // atur cabang pertama sebagai nilai default.
    selectedBranchId.value = branches.value[0].id
  }
})
</script>

<template>
  <VerticalNavLayout :is-nav-visible="isSidebarVisible">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Tombol untuk menyembunyikan/menampilkan sidebar -->
        <IconBtn
          class="d-none d-lg-block"
          @click="toggleSidebar"
        >
          <VIcon icon="ri-menu-unfold-line" />
        </IconBtn>

        <!-- 👉 Vertical nav toggle in overlay mode -->
        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="ri-menu-line" />
        </IconBtn>

        <VSpacer />

        <div class="attention-branch-selector d-flex align-center pl-3">
          <VIcon icon="ri-store-2-line" class="mr-3" />
          <!-- 👉 Branch Selector -->
          <VSelect
            v-model="selectedBranchId"
            :items="branches"
            :loading="isLoadingBranches"
            item-title="name"
            item-value="id"
            label="Pilih Cabang"
            placeholder="Pilih Cabang"
            hide-details
            variant="underlined"
            class="me-4 "
            style="max-width: 400px;"
          />
        </div>

        <!-- 👉 Tombol Fullscreen -->
        <IconBtn @click="toggleFullscreen">
          <VIcon :icon="isFullscreen ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'" />
        </IconBtn>

        <IconBtn>
          <VIcon icon="ri-notification-line" />
        </IconBtn>

        <NavbarThemeSwitcher class="me-2" />

        <UserProfile />
      </div>
    </template>

    <template #vertical-nav-header="{ toggleIsOverlayNavActive }">
      <RouterLink
        to="/"
        class="app-logo app-title-wrapper"
      >
        <!-- eslint-disable vue/no-v-html -->
        <img
          class="d-flex"
          style="border-radius: 50%"
          :style="{ width: isSidebarVisible ? '80px' : '2rem' }"
          src="/logo-toko.png"
        >
        <!-- eslint-enable -->
      </RouterLink>

      <IconBtn
        class="d-block d-lg-none"
        @click="toggleIsOverlayNavActive(false)"
      >
        <VIcon icon="ri-close-line" />
      </IconBtn>
    </template>

    <template #vertical-nav-content>
      <NavItems />
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}

.app-logo {
  display: flex;
  align-items: center;
  column-gap: 0.75rem;

  .app-logo-title {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.75rem;
    text-transform: uppercase;
  }
}

.custom-logo-title {
  font-size: 1.3rem !important;
  font-weight: 500 !important;
  line-height: 1rem !important;
}

/* Animasi untuk menarik perhatian ke pemilih cabang */
@keyframes pulse-glow {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0.3);
  }
  70% {
    box-shadow: 0 0 5px 10px rgba(var(--v-theme-primary), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0);
  }
}

.attention-branch-selector {
  border-radius: 6px;
  animation: pulse-glow 3s infinite;
  transition: all 0.3s ease-in-out;
}

.attention-branch-selector:hover {
  animation-play-state: paused; /* Hentikan animasi saat di-hover */
}
</style>
