import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/presentation/views/LoginView.vue'
import DashboardViewVue from '@/presentation/views/DashboardView.vue'
import BuyView from '@/presentation/views/BuyView.vue'
import OrderView from '@/presentation/views/OrderView.vue'
import StoreView from '@/presentation/views/StoreView.vue'
import RecipesView from '@/presentation/views/RecipesView.vue'
import CreateUserView from '@/presentation/views/CreateUserView.vue'
import NotFoundView from '@/presentation/views/NotFoundView.vue'
import { jwtDecode } from 'jwt-decode'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/signin',
      name: 'signin',
      component: CreateUserView,
      meta: { title: 'Create User' },
    },
    {
      path: '/take-order',
      name: 'take-an-order',
      component: DashboardViewVue,
      meta: { title: 'Take an order' },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Login' },
    },
    {
      path: '/buys',
      name: 'historical-buys',
      component: BuyView,
      meta: { title: 'Buys' },
    },
    {
      path: '/orders',
      name: 'historical-orders',
      component: OrderView,
      meta: { title: 'Orders' },
    },
    {
      path: '/storage',
      name: 'storage-items',
      component: StoreView,
      meta: { title: 'Stores' },
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: RecipesView,
      meta: { title: 'Recipes' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const { setUserData, clearUserData } = useUserStore()
  const jwtToken = localStorage.getItem('jwt')

  const isTokenValid = (token: string) => {
    if (!token) return false
    try {
      const decodedToken: { userId: number; userName: string; userEmail: string; exp: number } =
        jwtDecode(token)
      const currentTime = Date.now() / 1000
      if (!decodedToken.exp) return false
      if (decodedToken.exp < currentTime) {
        clearUserData()
        return false
      }
      setUserData({ id: decodedToken.userId, name: decodedToken.userName })
      return decodedToken.exp > currentTime
    } catch (error) {
      console.error('JWT decode error:', error)
      return false
    }
  }
  const isAuthenticated = jwtToken && isTokenValid(jwtToken)
  if (to.path === '/login' || to.path === '/signin') {
    if (isAuthenticated) {
      next({ path: '/take-order' })
    } else {
      next()
    }
  } else if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    localStorage.removeItem('jwt')
    clearUserData()
    next({ path: '/login' })
  } else if (!jwtToken || !isAuthenticated) {
    localStorage.removeItem('jwt')
    clearUserData()
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router
