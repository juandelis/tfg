import { auth, getCurrentUser } from '~/services/fireinit'
import firebase from 'firebase'

function createUserDocument(user) {
  return firebase
    .database()
    .ref(`accounts/${user.uid}`)
    .set({
      username: user.displayName || user.email.split('@')[0], // use part of the email as a username
      email: user.email,
      image: user.newImage || '/images/default-profile.png' // supply a default profile image for all users
    })
}

export const state = () => ({
  user: {
    displayName: '',
    uid: null, // no null si está logueado
    email: null
  },
  afterLogin: '/login/logged', // donde dirigirse una vez complete el login (si accedió y no tenía permiso)
  listeningAuth: false
})

export const getters = {
  logged: (state, getters, rootState) => state.user.uid !== null
}

export const mutations = {
  setUser(state, user) {
    if (user) {
      state.user.displayName = user.displayName
      state.user.uid = user.uid
    } else {
      // clearUserState
      state.user.displayName = ''
      state.user.uid = null
    }
  },
  setListeningAuth(state, listening) {
    state.listeningAuth = listening
  },
  setAfterLogin(state, payload) {
    state.afterLogin = payload
  }
}

export const actions = {
  async initAuth({ state, commit, dispatch }) {
    if (!state.listeningAuth) {
      commit('setListeningAuth', true)
      auth.onAuthStateChanged(user => {
        commit('setUser', user)
        console.log('Cambio Auth state')
      })
      const user = await getCurrentUser() // Obtiene el usuario si no se cerrá sesión
      const prevUid = state.user.uid
      const newUid = user ? user.uid : null
      if (prevUid !== newUid) commit('setUser', user)
    }
  },
  async logout({ commit, dispatch }) {
    commit('setUser', null)
    await auth.signOut()
    this.$router.push('/')
  },
  userCreate({ state }, account) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(account.email, account.password)
      .then(({ user }) => {
        return createUserDocument(user)
      })
  },
  userCreateDocument({ state }) {
    return true
  }
}
