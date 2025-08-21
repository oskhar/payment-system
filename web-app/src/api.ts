import axios from 'axios'
import Swal from 'sweetalert2'

// Membuat instance Axios dengan baseURL dari environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// 1. Request Interceptor
// Interceptor ini berjalan SEBELUM setiap request dikirim.
// Tujuannya adalah untuk melampirkan token autentikasi secara otomatis.
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      // Jika token ada di localStorage, tambahkan ke header Authorization
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    // Lakukan sesuatu jika ada error saat konfigurasi request
    return Promise.reject(error)
  },
)


// --- PERUBAHAN DIMULAI ---
// 2. Response Interceptor
// Interceptor ini berjalan SETELAH response dari API diterima.
// Tujuannya adalah untuk menangani kasus-kasus global, seperti token tidak valid.
api.interceptors.response.use(
  // Blok 'try': dieksekusi jika response berhasil (status code 2xx)
  response => {
    // Jika response sukses, langsung kembalikan response tersebut
    return response
  },
  // Blok 'catch': dieksekusi jika response gagal (status code bukan 2xx)
  error => {
    // Periksa apakah error disebabkan oleh response dari server dan statusnya 401
    if (error.response && error.response.status === 401) {
      // Hapus data autentikasi dari localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user') // Hapus juga data user jika ada

      // Hapus header Authorization dari default config Axios
      delete api.defaults.headers.common['Authorization']

      // Tampilkan notifikasi kepada pengguna
      Swal.fire({
        title: 'Sesi Berakhir',
        text: 'Sesi Anda telah berakhir. Silakan login kembali.',
        icon: 'warning',
        confirmButtonText: 'Login',
      }).then(() => {
        // Arahkan pengguna ke halaman login setelah notifikasi ditutup.
        // Menggunakan window.location.href memastikan reload halaman penuh,
        // yang akan membersihkan state aplikasi secara tuntas.
        window.location.href = '/login'
      })
    }

    // Kembalikan error agar bisa ditangani lebih lanjut jika diperlukan (misal di blok .catch() spesifik)
    return Promise.reject(error)
  },
)
// --- PERUBAHAN SELESAI ---


// Ekspor instance yang sudah dikonfigurasi
export default api
