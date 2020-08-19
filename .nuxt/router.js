import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _6c967b66 = () => interopDefault(import('../pages/collector.vue' /* webpackChunkName: "pages/collector" */))
const _f23f6f88 = () => interopDefault(import('../pages/publisher.vue' /* webpackChunkName: "pages/publisher" */))
const _5846d6b5 = () => interopDefault(import('../pages/readPage.vue' /* webpackChunkName: "pages/readPage" */))
const _58b4efdc = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

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
    path: "/collector",
    component: _6c967b66,
    name: "collector"
  }, {
    path: "/publisher",
    component: _f23f6f88,
    name: "publisher"
  }, {
    path: "/readPage",
    component: _5846d6b5,
    name: "readPage"
  }, {
    path: "/",
    component: _58b4efdc,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
