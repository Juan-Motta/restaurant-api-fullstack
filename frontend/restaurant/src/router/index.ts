import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/presentation/views/LoginView.vue'
import DashboardViewVue from '@/presentation/views/DashboardView.vue.vue'
import BuyView from '@/presentation/views/BuyView.vue'
import OrderView from '@/presentation/views/OrderView.vue'
import StoreView from '@/presentation/views/StoreView.vue'
import RecipesView from '@/presentation/views/RecipesView.vue'
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
      path: '/take-order',
      name: 'Take Order',
      component: DashboardViewVue,
      meta: { title: 'Take an order' },
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { title: 'Login' },
    },
    {
      path: '/buys',
      name: 'Historical Buys',
      component: BuyView,
      meta: { title: 'Buys' },
    },
    {
      path: '/orders',
      name: 'Historical Orders',
      component: OrderView,
      meta: { title: 'Orders' },
    },
    {
      path: '/storage',
      name: 'Storage',
      component: StoreView,
      meta: { title: 'Stores' },
    },
    {
      path: '/recipes',
      name: 'Recipes',
      component: RecipesView,
      meta: { title: 'Recipes' },
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

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    next({ path: '/' })
  } else if (jwtToken && !isAuthenticated) {
    localStorage.removeItem('jwt')
    clearUserData()
    next({ path: '/' })
  } else {
    next()
  }
})

export default router
