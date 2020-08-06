import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _5e34f186 = () => interopDefault(import('../pages/collector.vue' /* webpackChunkName: "pages/collector" */))
const _e3dde5a8 = () => interopDefault(import('../pages/publisher.vue' /* webpackChunkName: "pages/publisher" */))
const _df4375fc = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _5e34f186,
    name: "collector"
  }, {
    path: "/publisher",
    component: _e3dde5a8,
    name: "publisher"
  }, {
    path: "/",
    component: _df4375fc,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
