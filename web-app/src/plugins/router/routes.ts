/**
 * Mendefinisikan semua rute aplikasi.
 * Meta 'requiresAuth' digunakan untuk halaman yang memerlukan login.
 * Meta 'requiresBranch' digunakan untuk halaman yang memerlukan pemilihan toko/cabang.
 * Meta 'guest' digunakan untuk halaman yang hanya bisa diakses oleh pengguna yang belum login (misal: halaman login).
 */
export const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'item',
        component: () => import('@/pages/items.vue'),
        meta: { requiresAuth: true, requiresBranch: true }, // Butuh memilih toko
      },
      {
        path: 'transaksi', // Penjualan
        component: () => import('@/pages/transaksi.vue'),
        meta: { requiresAuth: true, requiresBranch: true }, // Butuh memilih toko
      },
      {
        path: 'stock',
        component: () => import('@/pages/stock.vue'),
        meta: { requiresAuth: true, requiresBranch: true }, // Butuh memilih toko
      },
      {
        path: 'stock-opname',
        component: () => import('@/pages/stock-opname.vue'),
        meta: { requiresAuth: true, requiresBranch: true }, // Butuh memilih toko
      },
      {
        path: 'riwayat', // Riwayat Transaksi
        component: () => import('@/pages/riwayat.vue'),
        meta: { requiresAuth: true, requiresBranch: true }, // Butuh memilih toko
      },
      {
        path: 'toko',
        component: () => import('@/pages/toko.vue'),
        meta: { requiresAuth: true }, // Halaman ini TIDAK memerlukan 'requiresBranch'
      },
      {
        path: 'barcode-test',
        component: () => import('@/pages/barcode-test.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'printer-test',
        component: () => import('@/pages/printer-test.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'category-item',
        component: () => import('@/pages/category-item.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'unit',
        component: () => import('@/pages/unit.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'typography',
        component: () => import('@/pages/typography.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'form-layouts',
        component: () => import('@/pages/form-layouts.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/pages/login.vue'),
        meta: { guest: true },
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
        meta: { guest: true },
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
