export default function({ store, redirect, route }) {
  const loginPage = '/login'
  if (!store.getters['user/logged']) {
    store.commit('user/setAfterLogin', route.path)
    redirect(loginPage)
  }
}
