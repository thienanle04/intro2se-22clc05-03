import { createRouter, createWebHistory } from 'vue-router'
import UserView from '@/views/UserView.vue'
import ShopView from '@/views/ShopView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: UserView,
    },
    {
      path: '/shop',
      name: 'shop',
      component: ShopView,
    },
  ],
})

export default router
