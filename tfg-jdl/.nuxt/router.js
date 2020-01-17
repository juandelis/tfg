import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

const _47e4f73a = () => interopDefault(import('..\\pages\\account\\index.vue' /* webpackChunkName: "pages_account_index" */))
const _743269d5 = () => interopDefault(import('..\\pages\\index2.vue' /* webpackChunkName: "pages_index2" */))
const _e12d7316 = () => interopDefault(import('..\\pages\\inspire.vue' /* webpackChunkName: "pages_inspire" */))
const _07e09084 = () => interopDefault(import('..\\pages\\login\\index.vue' /* webpackChunkName: "pages_login_index" */))
const _7ed62514 = () => interopDefault(import('..\\pages\\posts\\index.vue' /* webpackChunkName: "pages_posts_index" */))
const _d3b9b346 = () => interopDefault(import('..\\pages\\pruebas.vue' /* webpackChunkName: "pages_pruebas" */))
const _16f60fbf = () => interopDefault(import('..\\pages\\users\\index.vue' /* webpackChunkName: "pages_users_index" */))
const _a4c3465c = () => interopDefault(import('..\\pages\\account\\edit.vue' /* webpackChunkName: "pages_account_edit" */))
const _7f01e0e3 = () => interopDefault(import('..\\pages\\account\\password.vue' /* webpackChunkName: "pages_account_password" */))
const _5453a806 = () => interopDefault(import('..\\pages\\login\\autologin.vue' /* webpackChunkName: "pages_login_autologin" */))
const _7ae42c46 = () => interopDefault(import('..\\pages\\login\\logged.vue' /* webpackChunkName: "pages_login_logged" */))
const _8bc9bc42 = () => interopDefault(import('..\\pages\\login\\password.vue' /* webpackChunkName: "pages_login_password" */))
const _f8ba6fac = () => interopDefault(import('..\\pages\\posts\\create.vue' /* webpackChunkName: "pages_posts_create" */))
const _2bd35624 = () => interopDefault(import('..\\pages\\users\\user.vue' /* webpackChunkName: "pages_users_user" */))
const _ebdb4708 = () => interopDefault(import('..\\pages\\posts\\_id.vue' /* webpackChunkName: "pages_posts__id" */))
const _17f2f5e7 = () => interopDefault(import('..\\pages\\users\\_id.vue' /* webpackChunkName: "pages_users__id" */))
const _dfbc35a6 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

Vue.use(Router)

if (process.client) {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'

    // reset scrollRestoration to auto when leaving page, allowing page reload
    // and back-navigation from other pages to use the browser to restore the
    // scrolling position.
    window.addEventListener('beforeunload', () => {
      window.history.scrollRestoration = 'auto'
    })

    // Setting scrollRestoration to manual again when returning to this page.
    window.addEventListener('load', () => {
      window.history.scrollRestoration = 'manual'
    })
  }
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected and scrollToTop is not explicitly disabled
  if (
    to.matched.length < 2 &&
    to.matched.every(r => r.components.default.options.scrollToTop !== false)
  ) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise((resolve) => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}

export function createRouter() {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,

    routes: [{
      path: "/account",
      component: _47e4f73a,
      name: "account"
    }, {
      path: "/index2",
      component: _743269d5,
      name: "index2"
    }, {
      path: "/inspire",
      component: _e12d7316,
      name: "inspire"
    }, {
      path: "/login",
      component: _07e09084,
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
      path: "/account/edit",
      component: _a4c3465c,
      name: "account-edit"
    }, {
      path: "/account/password",
      component: _7f01e0e3,
      name: "account-password"
    }, {
      path: "/login/autologin",
      component: _5453a806,
      name: "login-autologin"
    }, {
      path: "/login/logged",
      component: _7ae42c46,
      name: "login-logged"
    }, {
      path: "/login/password",
      component: _8bc9bc42,
      name: "login-password"
    }, {
      path: "/posts/create",
      component: _f8ba6fac,
      name: "posts-create"
    }, {
      path: "/users/user",
      component: _2bd35624,
      name: "users-user"
    }, {
      path: "/posts/:id",
      component: _ebdb4708,
      name: "posts-id"
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
  })
}
