import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/presentation/views/LoginView.vue'
import DashboardViewVue from '@/presentation/views/DashboardView.vue.vue'
import BuyView from '@/presentation/views/BuyView.vue'
import OrderView from '@/presentation/views/OrderView.vue'
import StoreView from '@/presentation/views/StoreView.vue'
import RecipesView from '@/presentation/views/RecipesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/take-order',
      name: 'take-order',
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
      name: 'buys',
      component: BuyView,
      meta: { title: 'Buys' },
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrderView,
      meta: { title: 'Orders' },
    },
    {
      path: '/storage',
      name: 'storage',
      component: StoreView,
      meta: { title: 'Stores' },
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: RecipesView,
      meta: { title: 'Recipes' },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('jwt')
  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router
