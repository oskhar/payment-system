import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import Swal from 'sweetalert2'
import { routes } from './routes'
import api from '@/api'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  // Menampilkan loading di awal navigasi
  Swal.fire({
    title: 'Memuat...',
    text: 'Harap tunggu sebentar',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })

  const token = localStorage.getItem('auth_token')
  const selectedBranch = localStorage.getItem('selectedBranch')

  // Logika untuk rute yang memerlukan autentikasi
  if (to.meta.requiresAuth) {
    // --- PERUBAHAN DIMULAI ---
    // Pengecekan hanya berdasarkan keberadaan token di localStorage.
    // Tidak ada lagi hit ke endpoint /auth/me di sini.
    if (token) {
      // Set header Authorization untuk request API selanjutnya di halaman tujuan
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      // Pengecekan cabang tetap dilakukan jika rute memerlukannya
      if (to.meta.requiresBranch && !selectedBranch) {
        Swal.fire({
          title: 'Toko Belum Dipilih!',
          text: 'Anda harus membuat atau memilih toko/cabang terlebih dahulu.',
          icon: 'warning',
          confirmButtonText: 'Baik, Mengerti',
        })
        return next('/toko') // Arahkan ke halaman pemilihan toko
      }

      next() // Lanjutkan navigasi karena token ada
    }
    else {
      // Jika token tidak ada, langsung arahkan ke halaman login
      next('/login')
    }
    // --- PERUBAHAN SELESAI ---
  }
  // Logika untuk rute tamu (seperti halaman login)
  else if (to.meta.guest && token) {
    // Jika pengguna sudah login (ada token) dan mencoba mengakses halaman tamu,
    // arahkan ke dashboard.
    next('/dashboard')
  }
  // Untuk rute yang tidak memerlukan autentikasi
  else {
    next()
  }
})

// Hook ini akan selalu dijalankan setelah navigasi selesai (baik berhasil atau gagal)
router.afterEach(() => {
  Swal.close() // Menutup loading Swal
})


export default function(app: App) {
  app.use(router)
}

export { router }
