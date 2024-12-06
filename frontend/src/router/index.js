import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/store.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/UserView.vue'),
      children: [
        {
          path: '',
          name: 'HomeBody',
          component: () => import('@/components/user/homeBody.vue'),
        },
        {
          path: 'login',
          name: 'Login',
          meta: { preventAuthenticated: true },
          component: () => import('@/components/user/login.vue'),
        },
        {
          path: 'signup',
          name: 'Signup',
          meta: { preventAuthenticated: true },
          component: () => import('@/components/user/signup.vue'),
        },
        {
          path: 'book/:id',
          name: 'BookDetails',
          component: () => import('@/components/user/bookDetails.vue'),
        },
        {
          path: 'search',
          name: 'SearchResults',
          component: () => import('@/components/user/bookSearch.vue'),
          props: (route) => ({ searchText: route.query.q }), // Pass search text as a prop
        },
        {
          path: '/cart',
          name: 'Cart',
          component: () => import('@/components/user/cart.vue'),
          children: [
            {
              path: '/checkout',
              name: 'Checkout',
              component: () => import('@/components/user/genreBook.vue'),
            }
          ],
        },
        {
          path: '/checkout',
          name: 'Checkout',
          component: () => import('@/components/user/checkout.vue'),
        },
        {
          path: 'genre/:genre',
          name: 'GenreBooks',
          component: () => import('@/components/user/genreBook.vue'),
        },
      ],
    },
    {
      path: '/shop',
      name: 'shop',
      meta: { requiresAuth: true, roles: ['admin'] },
      component: () => import('@/views/ShopView.vue'),
      redirect: '/shop/modifyBook', // Redirect to /shop/add by default
      children: [
        {
          path: 'addBook',
          name: 'AddNewBook',
          meta: { requiresAuth: true, roles: ['admin'] },
          component: () => import('@/components/shop/addBookComp.vue'),
        },
        {
          path: 'modifyBook',
          name: 'ModifyAndDeleteBook',
          meta: { requiresAuth: true, roles: ['admin'] },
          component: () => import('@/components/shop/modifyBookComp.vue'),
        },
        {
          path: 'addUser',
          name: 'AddNewUser',
          meta: { requiresAuth: true, roles: ['admin'] },
          component: () => import('@/components/shop/addUserComp.vue'),
        },
        {
          path: 'modifyUser',
          name: 'ModifyAndDeleteUser',
          meta: { requiresAuth: true, roles: ['admin'] },
          component: () => import('@/components/shop/modifyUserComp.vue'),
        },
        {
          path: 'orderManagement',
          name: 'OrderManagement',
          meta: { requiresAuth: true, roles: ['admin'] },
          component: () => import('@/components/shop/orderManagementComp.vue'),
        },
        {
          path: 'addCategory',
          name: 'AddNewCategory',
          meta: { requiresAuth: true, roles: ['admin'] },
          component: () => import('@/components/shop/addCategoryComp.vue'),
        },
        {
          path: 'modifyCategory',
          name: 'ModifyAndDeleteCategory',
          meta: { requiresAuth: true, roles: ['admin'] },
          component: () => import('@/components/shop/modifyCategoryComp.vue'),
        },
        {
          path: 'orderManagement',
          name: 'OrderManagement',
          meta: { requiresAuth: true, roles: ['admin'] },
          component: () => import('@/components/shop/orderManagementComp.vue'),
        }
      ],
    }
  ],
});


router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;
  const userRole = store.getters.getRole;

  if (to.meta.preventAuthenticated && isAuthenticated) {
    alert('You are already logged in');
    next({ name: 'home', query: { redirect: to.fullPath } });
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    // If the route requires specific roles and the user doesn't have access
    alert('Access denied');
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else {
    next(); // Allow access
  }
});

export default router