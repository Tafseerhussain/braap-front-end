import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import BasicLayout from '@/components/layouts/BasicLayout'

Vue.use(VueRouter)

let oldpush = VueRouter.prototype.push
let oldreplace = VueRouter.prototype.replace
VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    oldpush.call(this, location, resolve, reject)
  } else {
    oldpush.call(this, location, () => { }, () => { })
  }
}

VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    oldreplace.call(this, location, resolve, reject)
  } else {
    oldreplace.call(this, location, () => { }, () => { })
  }
}


export const constantRouteMap = [{
  path: '/',
  name: 'Home',
  meta: {
    title: 'Home'
  },
  component: Home
},
{
  path: '/404',
  name: 'NotFound',
  meta: {
    title: '404'
  },
  component: () => import( /* webpackChunkName: "notFound" */ '../views/NotFound')
},
{
  path: '/',
  name: '',
  component: BasicLayout,
  children: [{
    path: 'features',
    name: 'Features',
    meta: {
      title: 'Fettures'
    },
    component: () => import( /* webpackChunkName: "features" */ '../views/Features')
  },
  {
    path: 'features/:id',
    name: 'SingleFeature',
    component: () => import( /* webpackChunkName: "features" */ '../views/Features/SingleFeature.vue')
  },
  {
    path: 'about',
    name: 'About',
    component: () => import( /* webpackChunkName: "about" */ '../views/About')
  },
  {
    path: 'tech-sign-up',
    name: 'Technician',
    component: () => import( /* webpackChunkName: "technician" */ '../views/Technician/BraapTechnician.vue')
  },
  {
    path: 'service-technician',
    name: 'JobPost',
    component: () => import( /* webpackChunkName: "jobPost" */ '../views/JobPost')
  },
  {
    path: 'supplier',
    name: 'Supplier',
    component: () => import( /* webpackChunkName: "supplier" */ '../views/BraapSupplier')
  },
  {
    path: 'pricing',
    name: 'Pricing',
    component: () => import( /* webpackChunkName: "pricing" */ '../views/Pricing')
  },
  {
    path: 'blog',
    name: 'Blog',
    component: () => import( /* webpackChunkName: "blog" */ '../views/Blog')
  },
  {
    path: 'single-blog',
    name: 'SingleBlog',
    component: () => import( /* webpackChunkName: "blog" */ '../views/Blog/SingleBlog.vue')
  },
  {
    path: 'cart',
    name: 'Cart',
    component: () => import( /* webpackChunkName: "cart" */ '../views/Cart/index.vue')
  },
  {
    path: 'user',
    name: 'BraapUser',
    component: () => import( /* webpackChunkName: "braapUser" */ '../views/BraapUser')
  },
  {
    path: 'contact',
    name: 'Contact',
    component: () => import( /* webpackChunkName: "contact" */ '../views/Contact')
  },
  {
    path: 'customers',
    name: 'Customers',
    component: () => import(/* webpackChunkName: "techcustomer" */ '../views/Customers')
  }
  ]
},
{
  path: '/user',
  name: 'User',
  component: BasicLayout,
  redirect: '/',
  children: [{
    path: 'login',
    name: 'Login',
    meta: {
      title: 'Login'
    },
    component: () => import( /* webpackChunkName: "user" */ '../views/User/Login')
  },
  {
    path: 'registration',
    name: 'Registration',
    meta: {
      title: 'Registration'
    },
    component: () => import( /* webpackChunkName: "user" */ '../views/User/Registration')
  },
  {
    path: 'forgot-password',
    name: 'ForgotPassword',
    meta: {
      title: 'Forgot Password'
    },
    component: () => import( /* webpackChunkName: "user" */ '../views/User/ForgotPassword')
  },
  {
    path: 'reset-password/:token',
    name: 'ResetPassword',
    meta: {
      title: 'Reset Password'
    },
    component: () => import( /* webpackChunkName: "user" */ '../views/User/ResetPassword')
  }
  ]
},
{
  path: '/search',
  name: 'Search',
  component: BasicLayout,
  redirect: '/',
  children: [{
    path: 'search-result',
    name: 'SearchResult',
    meta: {
      title: 'Search Result'
    },
    component: () => import( /* webpackChunkName: "search" */ '../views/Search/index.vue')
  }]
}
]

export const authorizeRouteMap = [{
  path: '/',
  name: '',
  component: BasicLayout,
  redirect: '/',
  children: [{
    path: 'my-shop',
    name: 'MyShop',
    meta: {
      title: 'My Shop'
    },
    component: () => import( /* webpackChunkName: "myShop" */ '../views/MyShop/index.vue')
  },
  {
    path: 'data-hub',
    name: 'DataHub',
    meta: {
      title: 'Data Hub'
    },
    component: () => import( /* webpackChunkName: "dataHub" */ '../views/DataHub/index.vue')
  },
  {
    path: 'my-shop/purchase-machine-access',
    name: 'PurchaseMachineAccess',
    meta: {
      title: 'Purchase Machine Access'
    },
    component: () => import( /* webpackChunkName: "myShop" */ '../views/MyShop/PurchaseMachineAccess')
  },
  {
    path: 'workshop',
    redirect: 'my-shop'
  },
  {
    path: 'workshop/:id',
    name: 'Workshop',
    meta: {
      title: 'Workspace'
    },
    component: () => import( /* webpackChunkName: "workshop" */ '../views/Workshop')
  },
  {
    path: 'workshop/:id/history/:workId',
    name: 'WorkHistory',
    meta: {
      title: 'Workspace'
    },
    component: () => import( /* webpackChunkName: "workshop" */ '../views/WorkHistory')
  },
  {
    path: 'account',
    name: 'Account',
    meta: {
      title: 'Account'
    },
    component: () => import( /* webpackChunkName: "account" */ '../views/Account/index.vue')
  },
  {
    path: 'checkout',
    name: 'Checkout',
    meta: {
      title: 'Checkout'
    },
    component: () => import( /* webpackChunkName: "checkout" */ '../views/Checkout/index.vue')
  },
  {
    path: 'checkout/complete',
    name: 'CheckoutComplete',
    meta: { title: 'Checkout Complete' },
    component: () => import(/* webpackChunkName: "checkout" */ '../views/Checkout/Complete.vue')
  }
  ]
},
{
  path: '*',
  redirect: '/404'
}
]

let routes = constantRouteMap.concat(authorizeRouteMap)
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return {
      y: 0,
      behavior: 'auto'
    }
  }
})

export default router