import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _47e4f73a = () => interopDefault(import('..\\pages\\account\\index.vue' /* webpackChunkName: "pages_account_index" */))
const _e12d7316 = () => interopDefault(import('..\\pages\\inspire.vue' /* webpackChunkName: "pages_inspire" */))
const _59c98844 = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages_login" */))
const _7ed62514 = () => interopDefault(import('..\\pages\\posts\\index.vue' /* webpackChunkName: "pages_posts_index" */))
const _d3b9b346 = () => interopDefault(import('..\\pages\\pruebas.vue' /* webpackChunkName: "pages_pruebas" */))
const _16f60fbf = () => interopDefault(import('..\\pages\\users\\index.vue' /* webpackChunkName: "pages_users_index" */))
const _1801a01a = () => interopDefault(import('..\\pages\\account\\delete.vue' /* webpackChunkName: "pages_account_delete" */))
const _f8ba6fac = () => interopDefault(import('..\\pages\\posts\\create.vue' /* webpackChunkName: "pages_posts_create" */))
const _6546a0e9 = () => interopDefault(import('..\\pages\\posts\\myposts.vue' /* webpackChunkName: "pages_posts_myposts" */))
const _17f2f5e7 = () => interopDefault(import('..\\pages\\users\\_id.vue' /* webpackChunkName: "pages_users__id" */))
const _dfbc35a6 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

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
    path: "/account",
    component: _47e4f73a,
    name: "account"
  }, {
    path: "/inspire",
    component: _e12d7316,
    name: "inspire"
  }, {
    path: "/login",
    component: _59c98844,
    name: "login"
  }, {
    path: "/posts",
    component: _7ed62514,
    name: "posts"
  }, {
    path: "/pruebas",
    component: _d3b9b346,
    name: "pruebas"
  }, {
    path: "/users",
    component: _16f60fbf,
    name: "users"
  }, {
    path: "/account/delete",
    component: _1801a01a,
    name: "account-delete"
  }, {
    path: "/posts/create",
    component: _f8ba6fac,
    name: "posts-create"
  }, {
    path: "/posts/myposts",
    component: _6546a0e9,
    name: "posts-myposts"
  }, {
    path: "/users/:id",
    component: _17f2f5e7,
    name: "users-id"
  }, {
    path: "/",
    component: _dfbc35a6,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
