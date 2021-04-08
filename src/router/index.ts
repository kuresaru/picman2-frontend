import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/piclib',
    name: 'PicLib',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/PicLib.vue')
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import(/* webpackChunkName: "upload" */ '../views/Upload.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
