import { auth, getCurrentUser, db } from '~/services/fireinit'
// import firebase from 'firebase'
// import functions from '~/assets/functions'
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
  unsuscribe: null // guardará la funcion para dejar de escuchar cambios
})

export const getters = {
  logged: (state, getters, rootState) => state.user.uid !== null
}

export const mutations = {
  setUser(
    state,
    { id, name, email, birth, genre, info, image, following, followers }
  ) {
    state.user.uid = id
    state.user.name = name
    state.user.email = email
    state.user.birth = birth
    state.user.genre = genre
    state.user.info = info
    state.user.image = image || 'default-profile.png'
    state.user.followers = followers
    state.user.following = following
  },
  clearUser(state) {
    state.user.uid = null
    state.user.name = ''
    state.user.email = ''
    state.user.birth = ''
    state.user.genre = ''
    state.user.info = ''
    state.user.image = ''
    state.user.followers = []
    state.user.following = []
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
    const index = state.user.following.indexOf(idUserToUnfollow)
    state.user.following.splice(index, 1)
    /* state.user.following = state.user.following.filter(
      item => item !== idUserToUnfollow
    ) */
  },
  updateFollowers(state, followers) {
    state.user.followers = followers
  },
  setListeningAuth(state, listening) {
    state.listeningAuth = listening
  },
  setAfterLogin(state, path) {
    state.afterLogin = path
  }
}

export const actions = {
  test() {
    console.log('test')
  },

  startListeningToUser({ state, dispatch }, userDoc) {
    // Nos ponemos en escucha del documento del usuario
    state.unsubscribe = userDoc.onSnapshot(userDocSnapshot => {
      // funcion que se ejecutará cuando se detecten cambios en el documento del usuario
      dispatch('updateUser', userDocSnapshot)
    })
    console.log('startListeningToUser')
  },

  stopListeningToUser({ state, commit }) {
    // Limpiar el user
    commit('clearUser')
    // Dejar de escuchar a cambios
    state.unsubscribe()
    console.log('stopListeningToUser')
  },

  updateUser({ commit, rootState }, userDocSnapshot) {
    // Borrar el viejo user
    commit('clearUser')
    // Guardar el nuevo user
    const userData = userDocSnapshot.data()
    commit('setUser', {
      id: userDocSnapshot.id,
      name: userData.name,
      email: userData.email,
      birth: userData.birth,
      genre: userData.genre,
      info: userData.info,
      image: userData.image,
      following: userData.following,
      followers: userData.followers
    })
  },

  async initAuth({ state, commit, dispatch }) {
    if (!state.listeningAuth) {
      commit('setListeningAuth', true)
      auth.onAuthStateChanged(user => {
        console.log('Cambio Auth state')
        if (user) {
          // Login: buscamos el documento y empezamos a escuchar sus cambios
          const userDoc = db.collection('accounts').doc(user.uid)
          userDoc
            .get()
            .then(function(doc) {
              if (doc.exists) {
                dispatch('startListeningToUser', userDoc)
                console.log('startListeningToUser de initAuth')
              } else {
                // No existe el documento del usuario loggeado
              }
            })
            .catch(function(error) {
              console.log('Error getting document: ', error)
            })
        } else {
          // Logout: limpiamos store y dejamos de escuchar cambios
          commit('clearUser')
          dispatch('stopListeningToUser')
          console.log('stopListeningToUser de initAuth')
        }
      })
      const user = await getCurrentUser() // Obtiene el usuario si no se cerrá sesión
      const prevUid = state.user.uid
      const newUid = user ? user.uid : null
      if (prevUid !== newUid) commit('clearUser')
    }
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

  async logout({ commit, dispatch }) {
    await auth.signOut()
    this.$router.push('/')
  },

  signup({ commit, dispatch }, payload) {
    auth
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then(async function() {
        const user = await getCurrentUser() // Obtiene el usuario actual
        const userDocRef = db.collection('accounts').doc(user.uid)
        if (user) {
          // Creamos el documento en firebase del usuario registrado
          userDocRef
            .get()
            .then(function(doc) {
              if (doc.exists) {
                // Ya existe el documento de este usuario
                console.log('Document already exists:', doc.data())
              } else {
                // Creamos el documento
                userDocRef
                  .set({
                    birth: payload.birth,
                    email: user.email,
                    following: [],
                    followers: [],
                    genre: payload.genre,
                    info: '', // info personal por defecto vacía, editable luego
                    image: '/default-profile.png', // imagen por defecto, editable luego
                    name: payload.name
                  })
                  .then(function() {
                    // Con el usuario loggeado y documento creado empezamos a escuchar
                    dispatch('startListeningToUser', userDocRef)
                  })
                  .catch(function(error) {
                    console.log('Error creando el documento: ' + error)
                  })
              }
            })
            .catch(function(error) {
              console.log('Error getting document:', error)
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
      // Buscamos y actualizamos el documento en firebase
      const docRef = db.collection('accounts').doc(userLogged.uid)
      docRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            docRef.update({
              birth: payload.birth,
              genre: payload.genre,
              info: payload.info,
              name: payload.name
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
      // Buscamos y actualizamos el documento en firebase
      const docRef = db.collection('accounts').doc(userLogged.uid)
      docRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            docRef.update({ image: newImage })
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
      /* const docRef2 = await db.collection('accounts').doc(idUserToFollow)
      docRef2.update({
        followers: firestore.FieldValue.arrayUnion(userLogged.uid)
      }) */
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
      /* const docRef2 = await db.collection('accounts').doc(idUserToUnfollow)
      docRef2.update({
        followers: firestore.FieldValue.arrayRemove(userLogged.uid)
      }) */
    }
  },

  showUser({ state }, idUserToShow) {
    if (idUserToShow === state.user.uid) {
      this.$router.push('/account')
    } else {
      this.$router.push('/users/' + idUserToShow)
    }
  }
}
