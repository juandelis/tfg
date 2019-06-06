import { auth, getCurrentUser, db } from '~/services/fireinit'
// import firebase from 'firebase'
import functions from '~/assets/functions'

/* function createUserDocument(user) {
  return firebase
    .database()
    .ref(`accounts/${user.uid}`)
    .set({
      username: user.displayName || user.email.split('@')[0], // use part of the email as a username
      email: user.email,
      image: user.newImage || '/images/default-profile.png' // supply a default profile image for all users
    })
} */

export const state = () => ({
  user: {
    uid: null, // no null si está logueado
    displayName: '',
    email: '',
    birth: '',
    genre: ''
  },
  afterLogin: '/', // donde dirigirse una vez complete el login (por defecto el inicio)
  listeningAuth: false
})

export const getters = {
  logged: (state, getters, rootState) => state.user.uid !== null
}

export const mutations = {
  setUser(state, { user, name, birth, genre }) {
    if (user) {
      state.user.uid = user.uid
      state.user.displayName = user.displayName || name
      state.user.email = user.email
      state.user.birth = birth
      state.user.genre = genre
    } else {
      // clearUserState
      state.user.uid = null
      state.user.displayName = ''
      state.user.email = ''
      state.user.birth = ''
      state.user.genre = ''
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
        commit('setUser', {
          user: user,
          name: '',
          birth: '',
          genre: ''
        })
        console.log('Cambio Auth state')
      })
      const user = await getCurrentUser() // Obtiene el usuario si no se cerrá sesión
      const prevUid = state.user.uid
      const newUid = user ? user.uid : null
      if (prevUid !== newUid)
        commit('setUser', {
          user: user,
          name: '',
          birth: '',
          genre: ''
        })
    }
  },
  async logout({ commit, dispatch }) {
    commit('setUser', {})
    await auth.signOut()
    this.$router.push('/')
  },
  login({ commit, dispatch }, payload) {
    auth
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then(async function() {
        const user = await getCurrentUser() // Obtiene el usuario actual
        if (user) {
          // TODO Hacer el setUser con los datos del usuario logueado (coger de firebase)
          const docRef = db.collection('accounts').doc(user.uid)
          docRef
            .get()
            .then(function(doc) {
              if (doc.exists) {
                // Ya existe el documento de este usuario
                console.log('Document readed:', doc.data())
                commit('setUser', {
                  user: user,
                  name: doc.data().name,
                  birth: doc.data().birth,
                  genre: doc.data().genre
                })
              }
            })
            .catch(function(error) {
              console.log('Error getting document:', error)
              return null
            })
        }
      })
      .catch(function(error) {
        // Handle Errors here.
        if (error.code === 'auth/wrong-password') {
          alert('CONTRASEÑA INCORRECTA')
        } else if (error.code === 'auth/user-not-found') {
          alert('NO EXISTE EL USUARIO')
        }
        // ...
      })
  },
  signup({ commit, dispatch }, payload) {
    auth
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then(async function() {
        const user = await getCurrentUser() // Obtiene el usuario actual
        if (user) {
          functions.createUserDocument(
            user,
            payload.name,
            payload.birth,
            payload.genre
          )
          // TODO Hacer el setUser con los datos del usuario registrado/logueado
        }
      })
      .catch(function(error) {
        // Handle Errors here.
        if (error.code === 'auth/weak-password') {
          alert('CONTRASEÑA DEMASIADO DÉBIL')
        } else if (error.code === 'auth/email-already-in-use') {
          console.log('EL USUARIO YA EXISTE')
        }
        // ...
      })
  } /*,
  userCreate({ state }, account) {
    return auth
      .createUserWithEmailAndPassword(account.email, account.password)
      .then(({ user }) => {
        return createUserDocument(user)
      })
  },
  userCreateDocument({ state }) {
    return true
  } */
}
