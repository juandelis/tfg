export default function ({ store, redirect, route }) {
  if (!store.getters['user/logged']) {
    store.commit('user/setAfterLogin', route.path)
    redirect('/login')
  }
}
