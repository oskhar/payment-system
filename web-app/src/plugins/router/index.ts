import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import api from '@/api'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('auth_token')

  if (to.meta.requiresAuth) {
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        await api.post('/auth/me')

        next()
      }
      catch (error) {
        localStorage.removeItem('auth_token')
        delete api.defaults.headers.common['Authorization']

        next('/login')
      }
    }
    else {
      next('/login')
    }
  }
  else if (to.meta.guest && token) {
    next('/dashboard')
  }
  else {
    next()
  }
})

export default function(app: App) {
  app.use(router)
}

export { router }
