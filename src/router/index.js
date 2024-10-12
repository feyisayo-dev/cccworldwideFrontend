import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import { isUserLoggedIn } from './utils'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Redirect to dashboards based on role or to landing page if not logged in
    {
      path: '/',
      name: 'LandingPage',
      beforeEnter: (to, from, next) => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userRole = userData['role'];

        if (userRole === 'Admin') {
          next({ name: 'dashboards-admin-dashboard' });
        } else if (userRole === 'Client') {
          next({ name: 'dashboards-user-dashboard' });
        } else {
          // Redirect to 'landing' route
          next({ name: 'landing' });
        }
      },
    },
    {
      path: '/landing',
      name: 'landing',
      component: () => import('@/pages/landing.vue'), // Ensure the path to the component is correct
    },

    // Admin dashboard route
    // Admin dashboard route
    {
      path: '/dashboards/admin-dashboard',
      name: 'dashboards-admin-dashboard',
      component: () => import('@/pages/dashboards/admin-dashboard.vue'),
      beforeEnter: (to, from, next) => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userRole = userData['role'];

        // Check if the user is logged in and is an Admin
        if (userRole === 'Admin') {
          next(); // Allow Admins to access the admin dashboard
        } else if (userRole === 'Client') {
          // Redirect Users to their own dashboard
          next({ name: 'dashboards-user-dashboard' });
        } else {
          // Redirect to login if no role is found
          next({ name: 'Login' });
        }
      }
    },

    // User dashboard route
    {
      path: '/dashboards/user-dashboard',
      name: 'dashboards-user-dashboard',
      component: () => import('@/pages/dashboards/user-dashboard.vue'),
      beforeEnter: (to, from, next) => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userRole = userData['role'];

        // Check if the user is logged in
        if (userRole === 'Admin' || userRole === 'Client') {
          next(); // Allow both Admin and Client to access the user dashboard
        } else {
          // Redirect to login if no valid role is found
          next({ name: 'Login' });
        }
      }
    },

    {
      path: '/dashboards/addChildren-dashboard',
      name: 'dashboards-addChildren-dashboard',
      component: () => import('@/pages/dashboards/addChildren-dashboard.vue'),
      beforeEnter: (to, from, next) => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userRole = userData['role'];

        // Check if the user is logged in
        if (userRole === 'Admin' || userRole === 'Client') {
          next(); // Allow both Admin and Client to access the user dashboard
        } else {
          // Redirect to login if no valid role is found
          next({ name: 'Login' });
        }
      }
    },

    {
      path: '/dashboards/addcommitte-dashboard',
      name: 'dashboards-addcommitte-dashboard',
      component: () => import('@/pages/dashboards/addcommitte-dashboard.vue'),
      beforeEnter: (to, from, next) => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userRole = userData['role'];

        // Check if the user is logged in
        if (userRole === 'Admin') {
          next(); // Allow Admins to access the admin dashboard
        } else if (userRole === 'Client') {
          // Redirect Users to their own dashboard
          next({ name: 'dashboards-user-dashboard' });
        } else {
          // Redirect to login if no role is found
          next({ name: 'Login' });
        }
      }
    },

    {
      path: '/dashboards/addcommitteemember-dashboard',
      name: 'dashboards-addcommitteemember-dashboard',
      component: () => import('@/pages/dashboards/addcommitteemember-dashboard.vue'),
      beforeEnter: (to, from, next) => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userRole = userData['role'];

        // Check if the user is logged in
        if (userRole === 'Admin') {
          next(); // Allow Admins to access the admin dashboard
        } else if (userRole === 'Client') {
          // Redirect Users to their own dashboard
          next({ name: 'dashboards-user-dashboard' });
        } else {
          // Redirect to login if no role is found
          next({ name: 'Login' });
        }
      }
    },

    {
      path: '/dashboards/addevent-dashboard',
      name: 'dashboards-addevent-dashboard',
      component: () => import('@/pages/dashboards/addevent-dashboard.vue'),
      beforeEnter: (to, from, next) => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userRole = userData['role'];

        // Check if the user is logged in
        if (userRole === 'Admin') {
          next(); // Allow Admins to access the admin dashboard
        } else if (userRole === 'Client') {
          // Redirect Users to their own dashboard
          next({ name: 'dashboards-user-dashboard' });
        } else {
          // Redirect to login if no role is found
          next({ name: 'Login' });
        }
      }
    },

    {
      path: '/dashboards/addmemberpayment-dashboard',
      name: 'dashboards-addmemberpayment-dashboard',
      component: () => import('@/pages/dashboards/addmemberpayment-dashboard.vue'),
      beforeEnter: (to, from, next) => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userRole = userData['role'];

        // Check if the user is logged in
        if (userRole === 'Admin' || userRole === 'Client') {
          next(); // Allow both Admin and Client to access the user dashboard
        } else {
          // Redirect to login if no valid role is found
          next({ name: 'Login' });
        }
      }
    },
    {
      path: '/dashboards/addministry-dashboard',
      name: 'dashboards-addministry-dashboard',
      component: () => import('@/pages/dashboards/addministry-dashboard.vue'),
      beforeEnter: (to, from, next) => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userRole = userData['role'];

        // Check if the user is logged in
        if (userRole === 'Admin') {
          next(); // Allow Admins to access the admin dashboard
        } else if (userRole === 'Client') {
          // Redirect Users to their own dashboard
          next({ name: 'dashboards-user-dashboard' });
        } else {
          // Redirect to login if no role is found
          next({ name: 'Login' });
        }
      }
    },

    {
      path: '/dashboards/addtitle-dashboard',
      name: 'dashboards-addtitle-dashboard',
      component: () => import('@/pages/dashboards/addtitle-dashboard.vue'),
      beforeEnter: (to, from, next) => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userRole = userData['role'];

        // Check if the user is logged in
        if (userRole === 'Admin') {
          next(); // Allow Admins to access the admin dashboard
        } else if (userRole === 'Client') {
          // Redirect Users to their own dashboard
          next({ name: 'dashboards-user-dashboard' });
        } else {
          // Redirect to login if no role is found
          next({ name: 'Login' });
        }
      }
    },

    {
      path: '/dashboards/baptism-dashboard',
      name: 'dashboards-baptism-dashboard',
      component: () => import('@/pages/dashboards/baptism-dashboard.vue'),
      beforeEnter: (to, from, next) => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userRole = userData['role'];

        // Check if the user is logged in
        if (userRole === 'Admin' || userRole === 'Client') {
          next(); // Allow both Admin and Client to access the user dashboard
        } else {
          // Redirect to login if no valid role is found
          next({ name: 'Login' });
        }
      }
    },

    {
      path: '/dashboards/parish-dashboard',
      name: 'dashboards-parish-dashboard',
      component: () => import('@/pages/dashboards/parish-dashboard.vue'),
      beforeEnter: (to, from, next) => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userRole = userData['role'];

        // Check if the user is logged in
        if (userRole === 'Admin') {
          next(); // Allow Admins to access the admin dashboard
        } else if (userRole === 'Client') {
          // Redirect Users to their own dashboard
          next({ name: 'dashboards-user-dashboard' });
        } else {
          // Redirect to login if no role is found
          next({ name: 'Login' });
        }
      }
    },
    // Login page
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/login.vue')
    },
    // Register page
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/pages/register.vue')
    },
    // User profile route
    {
      path: '/pages/user-profile',
      redirect: () => ({ name: 'pages-user-profile-tab', params: { tab: 'profile' } }),
    },
    // Account settings route
    {
      path: '/pages/account-settings',
      redirect: () => ({ name: 'pages-account-settings-tab', params: { tab: 'account' } }),
    },
    // Setup layouts dynamically
    ...setupLayouts(routes),
  ],
});

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
router.beforeEach(to => {
  const isLoggedIn = isUserLoggedIn()

  /*
  
    ℹ️ Commented code is legacy code
  
    if (!canNavigate(to)) {
      // Redirect to login if not logged in
      // ℹ️ Only add `to` query param if `to` route is not index route
      if (!isLoggedIn)
        return next({ name: 'login', query: { to: to.name !== 'index' ? to.fullPath : undefined } })
  
      // If logged in => not authorized
      return next({ name: 'not-authorized' })
    }
  
    // Redirect if logged in
    if (to.meta.redirectIfLoggedIn && isLoggedIn)
      next('/')
  
    return next()
  
    */
  // if (canNavigate(to)) {
  //   if (to.meta.redirectIfLoggedIn && isLoggedIn)
  //     return '/'
  // }
  // else {
  //   if (isLoggedIn)
  //     return { name: 'not-authorized' }
  //   else
  //     return { name: 'login', query: { to: to.name !== 'index' ? to.fullPath : undefined } }
  // }
})
export default router
