import axios from 'axios'

// 1. Membuat instance Axios. Anda bisa menambahkan konfigurasi default lain di sini
//    seperti baseURL untuk menghindari penulisan URL berulang.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// 2. Membuat Request Interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token')

    if (token)
      config.headers.Authorization = `Bearer ${token}`

    return config
  },
  error => {
    return Promise.reject(error)
  },
)

// 3. Ekspor instance yang sudah dikonfigurasi
export default api
