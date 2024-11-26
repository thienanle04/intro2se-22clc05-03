import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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
          component: () => import('@/components/user/login.vue'),
        },
        {
          path: 'signup',
          name: 'Signup',
          component: () => import('@/components/user/signup.vue'),
        },
        {
          path: 'book/:id',
          name: 'BookDetails',
          component: () => import('@/components/user/bookDetails.vue'),
        },
      ],
    },
    {
      path: '/shop',
      name: 'shop',
      meta: { requiresAuth: true, roles: ['admin'] },
      component: () => import('@/views/ShopView.vue'),
      redirect: '/shop/modify', // Redirect to /shop/add by default
      children: [
        {
          path: 'add',
          name: 'AddNewBook',
          meta: { requiresAuth: true, roles: ['admin'] },
          component: () => import('@/components/shop/addBookComp.vue'),
        },
        {
          path: 'modify',
          name: 'ModifyAndDeleteBook',
          meta: { requiresAuth: true, roles: ['admin'] },
          component: () => import('@/components/shop/modifyBookComp.vue'),
        }
      ],
    }    
  ],
});


router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');

  if (to.meta.requiresAuth && !isAuthenticated) {
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
