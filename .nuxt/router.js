import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _38fa6686 = () => interopDefault(import('../pages/collector.vue' /* webpackChunkName: "pages/collector" */))
const _13b42716 = () => interopDefault(import('../pages/publisher.vue' /* webpackChunkName: "pages/publisher" */))
const _220f475c = () => interopDefault(import('../pages/readPage.vue' /* webpackChunkName: "pages/readPage" */))
const _5e5030cb = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _38fa6686,
    name: "collector"
  }, {
    path: "/publisher",
    component: _13b42716,
    name: "publisher"
  }, {
    path: "/readPage",
    component: _220f475c,
    name: "readPage"
  }, {
    path: "/",
    component: _5e5030cb,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
