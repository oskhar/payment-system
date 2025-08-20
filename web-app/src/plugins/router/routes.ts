export const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
        meta: { requiresAuth: true }, // <-- TAMBAHKAN META
      },
      {
        path: 'item',
        component: () => import('@/pages/items.vue'),
        meta: { requiresAuth: true }, // <-- TAMBAHKAN META
      },
      {
        path: 'transaksi',
        component: () => import('@/pages/transaksi.vue'),
        meta: { requiresAuth: true }, // <-- TAMBAHKAN META
      },
      {
        path: 'barcode-test',
        component: () => import('@/pages/barcode-test.vue'),
        meta: { requiresAuth: true }, // <-- TAMBAHKAN META
      },
      {
        path: 'printer-test',
        component: () => import('@/pages/printer-test.vue'),
        meta: { requiresAuth: true }, // <-- TAMBAHKAN META
      },
      {
        path: 'category-item',
        component: () => import('@/pages/category-item.vue'),
        meta: { requiresAuth: true }, // <-- TAMBAHKAN META
      },
      {
        path: 'unit',
        component: () => import('@/pages/unit.vue'),
        meta: { requiresAuth: true }, // <-- TAMBAHKAN META
      },
      {
        path: 'stock',
        component: () => import('@/pages/stock.vue'),
        meta: { requiresAuth: true }, // <-- TAMBAHKAN META
      },
      {
        path: 'stock-opname',
        component: () => import('@/pages/stock-opname.vue'),
        meta: { requiresAuth: true }, // <-- TAMBAHKAN META
      },
      {
        path: 'typography',
        component: () => import('@/pages/typography.vue'),
        meta: { requiresAuth: true }, // <-- TAMBAHKAN META
      },
      {
        path: 'toko',
        component: () => import('@/pages/toko.vue'),
        meta: { requiresAuth: true }, // <-- TAMBAHKAN META
      },
      {
        path: 'riwayat',
        component: () => import('@/pages/riwayat.vue'),
        meta: { requiresAuth: true }, // <-- TAMBAHKAN META
      },
      {
        path: 'form-layouts',
        component: () => import('@/pages/form-layouts.vue'),
        meta: { requiresAuth: true }, // <-- TAMBAHKAN META
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
        meta: { guest: true }, // <-- TAMBAHKAN META
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
        meta: { guest: true }, // <-- TAMBAHKAN META
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
