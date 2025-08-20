import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import Swal from 'sweetalert2' // 1. Impor SweetAlert2
import { routes } from './routes'
import api from '@/api'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const selectedBranch = localStorage.getItem('selectedBranch') // 2. Ambil data toko yang dipilih

  if (to.meta.requiresAuth) {
    if (token) {
      try {
        // Cek validitas token
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        await api.post('/auth/me')

        // 3. Tambahkan pengecekan untuk halaman yang butuh memilih toko
        if (to.meta.requiresBranch && !selectedBranch) {
          // Jika halaman butuh toko tapi toko belum dipilih
          Swal.fire({
            title: 'Toko Belum Dipilih!',
            text: 'Anda harus membuat toko atau cabang terlebih dahulu.',
            icon: 'warning',
            confirmButtonText: 'Baik, Mengerti',
          })

          // Arahkan ke halaman pemilihan toko dan jangan lanjutkan navigasi
          return next('/toko')
        }

        // Jika semua pengecekan lolos, lanjutkan navigasi
        next()
      } catch (error) {
        // Jika token tidak valid, hapus dan arahkan ke login
        localStorage.removeItem('auth_token')
        delete api.defaults.headers.common['Authorization']
        next('/login')
      }
    } else {
      // Jika tidak ada token, arahkan ke login
      next('/login')
    }
  } else if (to.meta.guest && token) {
    // Jika pengguna sudah login tapi mengakses halaman guest (cth: login), arahkan ke dashboard
    next('/dashboard')
  } else {
    // Untuk halaman yang tidak memerlukan autentikasi
    next()
  }
})

export default function(app: App) {
  app.use(router)
}

export { router }
