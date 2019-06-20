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
    name: '',
    email: '',
    birth: '',
    genre: '',
    image: ''
  },
  afterLogin: '/', // donde dirigirse una vez complete el login (por defecto el inicio)
  listeningAuth: false
})

export const getters = {
  logged: (state, getters, rootState) => state.user.uid !== null
}

export const mutations = {
  setUser(state, { user, name, birth, genre, info, image }) {
    if (user) {
      state.user.uid = user.uid
      state.user.name = user.displayName || name
      state.user.email = user.email
      state.user.birth = birth
      state.user.genre = genre
      state.user.info = info
      state.user.image = image || 'default-profile.png'
    } else {
      // clearUserState
      state.user.uid = null
      state.user.name = ''
      state.user.email = ''
      state.user.birth = ''
      state.user.genre = ''
      state.user.genre = ''
      state.user.image = ''
    }
  },
  updateUser(state, { name, birth, genre, info }) {
    state.user.name = name
    state.user.birth = birth
    state.user.genre = genre
    state.user.info = info
  },
  updateImage(state, image) {
    state.user.image = image
  },
  setListeningAuth(state, listening) {
    state.listeningAuth = listening
  },
  setAfterLogin(state, payload) {
    state.afterLogin = payload
  }
}

export const actions = {
  test() {
    console.log('test')
  },
  async initAuth({ state, commit, dispatch }) {
    if (!state.listeningAuth) {
      commit('setListeningAuth', true)
      auth.onAuthStateChanged(user => {
        // Buscamos el documento del usuario logueado en firebase
        if (user) {
          const docRef = db.collection('accounts').doc(user.uid)
          docRef
            .get()
            .then(function(doc) {
              if (doc.exists) {
                // Hacemos el setUser con los datos obtenidos
                console.log('Document readed:', doc.data())
                commit('setUser', {
                  user: user,
                  name: doc.data().name,
                  birth: doc.data().birth,
                  genre: doc.data().genre,
                  info: doc.data().info,
                  image: doc.data().image
                })
              }
            })
            .catch(function(error) {
              console.log('Error getting document:', error)
            })
        } else {
          commit('setUser', {
            user: user,
            name: '',
            birth: '',
            genre: '',
            info: '',
            image: null
          })
        }
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
          genre: '',
          info: '',
          image: null
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
          // Creamos el documento en firebase del usuario registrado
          functions.createUserDocument(
            user,
            payload.name,
            payload.birth,
            payload.genre,
            null,
            null
          )
          // Hacemos setUser con los datos del usuario registrado
          commit('setUser', {
            user: user,
            name: payload.name,
            birth: payload.birth,
            genre: payload.genre,
            info: '',
            image: 'default-profile.png'
          })
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
  },
  async updateAccount({ commit, dispatch }, payload) {
    const user = await getCurrentUser() // Obtiene el usuario actual
    if (user) {
      // Actualizamos el documento en firebase
      const docRef = db.collection('accounts').doc(user.uid)
      docRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            console.log('Updating document')
            // Actualizamos los valores del documento
            docRef.set(
              {
                birth: payload.birth,
                genre: payload.genre,
                info: payload.info,
                name: payload.name
              },
              { merge: true }
            )
            // Hacemos setUser con los campos editados
            commit('updateUser', {
              name: payload.name,
              birth: payload.birth,
              genre: payload.genre,
              info: payload.info
            })
          } else {
            console.log('No such document!')
          }
        })
        .catch(function(error) {
          console.log('Error getting document:', error)
        })
    }
  },
  async updateUserImage({ commit, dispatch }, newImage) {
    const user = await getCurrentUser() // Obtiene el usuario actual
    if (user) {
      // Actualizamos el documento en firebase
      const docRef = db.collection('accounts').doc(user.uid)
      docRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            console.log('Updating document (image)')
            // Actualizamos imagen en el documento firebase
            docRef.set({ image: newImage }, { merge: true })
            // Actualizamos imagen en el store
            commit('updateImage', newImage)
          } else {
            console.log('No such document!')
          }
        })
        .catch(function(error) {
          console.log('Error getting document:', error)
        })
    }
  }
  /*,
  setUserWithFirebase({ commit, dispatch }, user) {
    // Buscamos el documento del usuario logueado en firebase
    const docRef = db.collection('accounts').doc(user.uid)
    docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          // Hacemos el setUser con los datos obtenidos
          console.log('Document readed:', doc.data())
          commit('setUser', {
            user: user,
            name: doc.data().name,
            birth: doc.data().birth,
            genre: doc.data().genre,
            info: doc.data().info,
            image: doc.data().image
          })
        }
      })
      .catch(function(error) {
        console.log('Error getting document:', error)
      })
  } ,
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
