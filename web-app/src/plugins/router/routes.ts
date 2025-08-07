export const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
      },
      {
        path: 'item',
        component: () => import('@/pages/items.vue'),
      },
      {
        path: 'transaksi',
        component: () => import('@/pages/transaksi.vue'),
      },
      {
        path: 'barcode-test',
        component: () => import('@/pages/barcode-test.vue'),
      },
      {
        path: 'printer-test',
        component: () => import('@/pages/printer-test.vue'),
      },
      {
        path: 'category-item',
        component: () => import('@/pages/category-item.vue'),
      },
      {
        path: 'unit',
        component: () => import('@/pages/unit.vue'),
      },
      {
        path: 'stock',
        component: () => import('@/pages/stock.vue'),
      },
      {
        path: 'stock-opname',
        component: () => import('@/pages/stock-opname.vue'),
      },
      {
        path: 'typography',
        component: () => import('@/pages/typography.vue'),
      },
      {
        path: 'toko',
        component: () => import('@/pages/toko.vue'),
      },
      {
        path: 'riwayat',
        component: () => import('@/pages/riwayat.vue'),
      },
      {
        path: 'form-layouts',
        component: () => import('@/pages/form-layouts.vue'),
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
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
