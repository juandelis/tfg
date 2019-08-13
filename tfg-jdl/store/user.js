import { auth, getCurrentUser, db } from '~/services/fireinit'
// import firebase from 'firebase'
import functions from '~/assets/functions'
import { firestore } from 'firebase'

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
    image: '',
    followers: [],
    following: []
  },
  afterLogin: '/', // donde dirigirse una vez complete el login (por defecto el inicio)
  listeningAuth: false,
  recoveryEmail: ''
})

export const getters = {
  logged: (state, getters, rootState) => state.user.uid !== null
}

export const mutations = {
  setUser(
    state,
    { user, name, birth, genre, info, image, following, followers }
  ) {
    if (user) {
      state.user.uid = user.uid
      state.user.name = user.displayName || name
      state.user.email = user.email
      state.user.birth = birth
      state.user.genre = genre
      state.user.info = info
      state.user.image = image || 'default-profile.png'
      state.user.followers = followers
      state.user.following = following
    } else {
      // clearUserState
      state.user.uid = null
      state.user.name = ''
      state.user.email = ''
      state.user.birth = ''
      state.user.genre = ''
      state.user.info = ''
      state.user.image = ''
      state.user.followers = []
      state.user.following = []
    }
  },
  updateUserData(state, { name, birth, genre, info }) {
    state.user.name = name
    state.user.birth = birth
    state.user.genre = genre
    state.user.info = info
  },
  updateImage(state, image) {
    state.user.image = image
  },
  addFollowing(state, newFollowing) {
    state.user.following.push(newFollowing)
  },
  removeFollowing(state, idUserToUnfollow) {
    state.user.following = state.user.following.filter(
      item => item !== idUserToUnfollow
    )
  },
  updateFollowers(state, followers) {
    state.user.followers = followers
  },
  setListeningAuth(state, listening) {
    state.listeningAuth = listening
  },
  setAfterLogin(state, path) {
    state.afterLogin = path
  },
  setRecoveryEmail(state, email) {
    state.recoveryEmail = email
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
        console.log('Cambio Auth state')
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
                  image: doc.data().image,
                  followers: doc.data().followers,
                  following: doc.data().following
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
            image: null,
            followers: [],
            following: []
          })
        }
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
          image: null,
          followers: [],
          following: []
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
            image: 'default-profile.png',
            following: [],
            followers: []
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

  updateAccount({ state, commit, dispatch }, payload) {
    console.log('UPDATE ' + state.user.uid)
    const userLogged = state.user
    if (userLogged) {
      // Actualizamos el documento en firebase
      const docRef = db.collection('accounts').doc(userLogged.uid)
      docRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            console.log('Updating document')
            // Actualizamos los valores del documento
            docRef.update({
              birth: payload.birth,
              genre: payload.genre,
              info: payload.info,
              name: payload.name
            })
            // Hacemos setUser con los campos editados
            commit('updateUserData', {
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

  updateUserImage({ state, commit, dispatch }, newImage) {
    const userLogged = state.user
    if (userLogged) {
      // Actualizamos el documento en firebase
      const docRef = db.collection('accounts').doc(userLogged.uid)
      docRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            console.log('Updating document (image)')
            // Actualizamos imagen en el documento firebase
            docRef.update({ image: newImage })
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
  },

  async follow({ state, commit, dispatch }, idUserToFollow) {
    const userLogged = state.user
    if (userLogged) {
      // Add userToFollow to following array of userLogged
      const docRef = await db.collection('accounts').doc(userLogged.uid)
      docRef.update({
        following: firestore.FieldValue.arrayUnion(idUserToFollow)
      })
      // Add userLogged to followers array of userToFollow
      const docRef2 = await db.collection('accounts').doc(idUserToFollow)
      docRef2.update({
        followers: firestore.FieldValue.arrayUnion(userLogged.uid)
      })

      commit('addFollowing', idUserToFollow)
    }
  },

  async unfollow({ state, commit, dispatch }, idUserToUnfollow) {
    const userLogged = state.user
    if (userLogged) {
      // Remove idUserToUnfollow from following array of userLogged
      const docRef = await db.collection('accounts').doc(userLogged.uid)
      docRef.update({
        following: firestore.FieldValue.arrayRemove(idUserToUnfollow)
      })
      // Remove userLogged from followers array of idUserToUnfollow
      const docRef2 = await db.collection('accounts').doc(idUserToUnfollow)
      docRef2.update({
        followers: firestore.FieldValue.arrayRemove(userLogged.uid)
      })

      commit('removeFollowing', idUserToUnfollow)
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
