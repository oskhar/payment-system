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
        path: 'category-item',
        component: () => import('@/pages/category-item.vue'),
      },
      {
        path: 'stock-item',
        component: () => import('@/pages/stock-item.vue'),
      },
      {
        path: 'typography',
        component: () => import('@/pages/typography.vue'),
      },
      {
        path: 'top-up',
        component: () => import('@/pages/top-up.vue'),
      },
      {
        path: 'pelanggan',
        component: () => import('@/pages/pelanggan.vue'),
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
