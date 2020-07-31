export { default as Collect } from '../../components/Collect.vue'
export { default as Collection } from '../../components/Collection.vue'
export { default as Content } from '../../components/Content.vue'
export { default as Hud } from '../../components/Hud.vue'
export { default as Login } from '../../components/Login.vue'
export { default as MyCopy } from '../../components/MyCopy.vue'
export { default as Publish } from '../../components/Publish.vue'
export { default as Published } from '../../components/Published.vue'
export { default as Welcome } from '../../components/Welcome.vue'

export const LazyCollect = import('../../components/Collect.vue' /* webpackChunkName: "components/Collect'}" */).then(c => c.default || c)
export const LazyCollection = import('../../components/Collection.vue' /* webpackChunkName: "components/Collection'}" */).then(c => c.default || c)
export const LazyContent = import('../../components/Content.vue' /* webpackChunkName: "components/Content'}" */).then(c => c.default || c)
export const LazyHud = import('../../components/Hud.vue' /* webpackChunkName: "components/Hud'}" */).then(c => c.default || c)
export const LazyLogin = import('../../components/Login.vue' /* webpackChunkName: "components/Login'}" */).then(c => c.default || c)
export const LazyMyCopy = import('../../components/MyCopy.vue' /* webpackChunkName: "components/MyCopy'}" */).then(c => c.default || c)
export const LazyPublish = import('../../components/Publish.vue' /* webpackChunkName: "components/Publish'}" */).then(c => c.default || c)
export const LazyPublished = import('../../components/Published.vue' /* webpackChunkName: "components/Published'}" */).then(c => c.default || c)
export const LazyWelcome = import('../../components/Welcome.vue' /* webpackChunkName: "components/Welcome'}" */).then(c => c.default || c)
