import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _aaae5434 = () => interopDefault(import('../pages/about.vue' /* webpackChunkName: "pages/about" */))
const _2707f666 = () => interopDefault(import('../pages/collector.vue' /* webpackChunkName: "pages/collector" */))
const _37990756 = () => interopDefault(import('../pages/publisher.vue' /* webpackChunkName: "pages/publisher" */))
const _93bf8908 = () => interopDefault(import('../pages/readPage.vue' /* webpackChunkName: "pages/readPage" */))
const _6b3e9eaa = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/about",
    component: _aaae5434,
    name: "about"
  }, {
    path: "/collector",
    component: _2707f666,
    name: "collector"
  }, {
    path: "/publisher",
    component: _37990756,
    name: "publisher"
  }, {
    path: "/readPage",
    component: _93bf8908,
    name: "readPage"
  }, {
    path: "/",
    component: _6b3e9eaa,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
