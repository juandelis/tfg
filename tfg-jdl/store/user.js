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
  unsubscribeUser: null, // guardará la funcion para dejar de escuchar cambios de User
  unsubscribeFollowers: null, // guardará la funcion para dejar de escuchar cambios en Followers
  unsubscribeFollowing: null // guardará la funcion para dejar de escuchar cambios en Following
})

export const getters = {
  logged: (state, getters, rootState) => state.user.uid !== null
}

export const mutations = {
  setUser(state, { id, name, email, birth, genre, info, image }) {
    state.user.uid = id
    state.user.name = name
    state.user.email = email
    state.user.birth = birth
    state.user.genre = genre
    state.user.info = info
    state.user.image = image || 'default-profile.png'
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
  setUnsubscribeUser(state, unsubscribeUserFunction) {
    state.unsubscribeUser = unsubscribeUserFunction
  },
  setUnsubscribeFollowers(state, unsubscribeFollowersFunction) {
    state.unsubscribeFollowers = unsubscribeFollowersFunction
  },
  setUnsubscribeFollowing(state, unsubscribeFollowingFunction) {
    state.unsubscribeFollowing = unsubscribeFollowingFunction
  },
  clearUnsubscribes(state) {
    state.unsubscribeUser = null
    state.unsubscribeFollowers = null
    state.unsubscribeFollowing = null
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
  addFollower(state, newFollower) {
    state.user.followers.push(newFollower)
  },
  removeFollower(state, oldFollower) {
    const index = state.user.followers.indexOf(oldFollower)
    state.user.followers.splice(index, 1)
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

  startListeningToFollowers({ state, commit }, userId) {
    // Nos ponemos en escucha de los documentos follow que tienen al user como destino (Followers)
    commit(
      'setUnsubscribeFollowers',
      db
        .collection('follows')
        .where('dest', '==', userId)
        .onSnapshot(followersSnapshot => {
          // este código se ejecutará cuando se detecten cambios en los followers
          followersSnapshot.docChanges().forEach(change => {
            const followData = change.doc.data()
            // Follower añadido
            if (change.type === 'added') commit('addFollower', followData.ori)
            // Follower borrado
            if (change.type === 'removed')
              commit('removeFollower', followData.ori)
          })
        })
    )
    console.log('startListeningToFollowers')
  },

  stopListeningToFollowers({ state }) {
    // Dejar de escuchar a cambios en los followers
    state.unsubscribeFollowers()
    console.log('stopListeningToFollowers')
  },

  startListeningToFollowing({ state, commit }, userId) {
    // Nos ponemos en escucha de los documentos follow que tienen al user como destino (Following)
    commit(
      'setUnsubscribeFollowing',
      db
        .collection('follows')
        .where('ori', '==', userId)
        .onSnapshot(followingSnapshot => {
          // este código se ejecutará cuando se detecten cambios en los following
          followingSnapshot.docChanges().forEach(change => {
            const followData = change.doc.data()
            // Follower añadido
            if (change.type === 'added') commit('addFollowing', followData.dest)
            // Follower borrado
            if (change.type === 'removed')
              commit('removeFollowing', followData.dest)
          })
        })
    )
    console.log('startListeningToFollowing')
  },

  stopListeningToFollowing({ state }) {
    // Dejar de escuchar a cambios en los following
    state.unsubscribeFollowing()
    console.log('stopListeningToFollowing')
  },

  startListeningToUser({ state, commit, dispatch }, userDoc) {
    // Nos ponemos en escucha del documento del usuario
    commit(
      'setUnsubscribeUser',
      userDoc.onSnapshot(userDocSnapshot => {
        if (!userDocSnapshot.exists) {
          // El user logged ha sido borrado
          console.log('El user logged ha sido borrado')
          dispatch('logout')
        } else {
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
            image: userData.image
          })
        }
      })
    )
    console.log('startListeningToUser')
  },

  stopListeningToUser({ state, commit }) {
    // Limpiar el user
    commit('clearUser')
    // Dejar de escuchar a cambios
    state.unsubscribeUser()
    console.log('stopListeningToUser')
  },

  async initAuth({ state, commit, dispatch }) {
    if (!state.listeningAuth) {
      commit('setListeningAuth', true)
      auth.onAuthStateChanged(user => {
        console.log('Cambio Auth state')
        if (user) {
          // Login: buscamos el documento y empezamos a escuchar sus cambios
          const userDoc = db.doc('accounts/' + user.uid)
          userDoc
            .get()
            .then(function(doc) {
              if (doc.exists) {
                dispatch('startListeningToUser', userDoc)
                console.log('startListeningToUser de initAuth')
                dispatch('startListeningToFollowers', user.uid)
                console.log('startListeningToFollowers de initAuth')
                dispatch('startListeningToFollowing', user.uid)
                console.log('startListeningToFollowing de initAuth')
              } else {
                // No existe el documento del usuario loggeado
              }
            })
            .catch(function(error) {
              console.log('Error getting document: ', error)
            })
        } else {
          // Logout: Dejamos de escuchar cambios y limpiamos store
          dispatch('stopListeningToFollowing')
          console.log('stopListeningToFollowing de initAuth')
          dispatch('stopListeningToFollowers')
          console.log('stopListeningToFollowers de initAuth')
          dispatch('stopListeningToUser')
          console.log('stopListeningToUser de initAuth')
          commit('clearUnsubscribes')
          commit('clearUser')
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
                    email: user.email,
                    image: '/default-profile.png', // imagen por defecto, editable luego
                    name: payload.name
                  })
                  .then(function() {
                    // Con el usuario loggeado y documento creado empezamos a escuchar
                    dispatch('startListeningToUser', userDocRef)
                    console.log('startListeningToUser de signup')
                    dispatch('startListeningToFollowers', user.uid)
                    console.log('startListeningToFollowers de signup')
                    dispatch('startListeningToFollowing', user.uid)
                    console.log('startListeningToFollowing de signup')
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

  follow({ state, commit, dispatch }, idUserToFollow) {
    const userLogged = state.user
    if (userLogged) {
      db.collection('follows').add({
        date: firestore.Timestamp.now(),
        dest: idUserToFollow,
        ori: userLogged.uid
      })
      /*
      // Add userToFollow to following array of userLogged
      const docRef = await db.collection('accounts').doc(userLogged.uid)
      docRef.update({
        following: firestore.FieldValue.arrayUnion(idUserToFollow)
      })
      // Add userLogged to followers array of userToFollow
      const docRef2 = await db.collection('accounts').doc(idUserToFollow)
      docRef2.update({
        followers: firestore.FieldValue.arrayUnion(userLogged.uid)
      }) */
    }
  },

  unfollow({ state, commit, dispatch }, idUserToUnfollow) {
    const userLogged = state.user
    if (userLogged) {
      db.collection('follows')
        .where('ori', '==', userLogged.uid)
        .where('dest', '==', idUserToUnfollow)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete().catch(function(error) {
              console.error('Error removing follow document: ', error)
            })
          })
        })
        .catch(function(error) {
          console.log('Error getting follow document: ', error)
        })
      /*
      // Remove idUserToUnfollow from following array of userLogged
      const docRef = await db.collection('accounts').doc(userLogged.uid)
      docRef.update({
        following: firestore.FieldValue.arrayRemove(idUserToUnfollow)
      })
      // Remove userLogged from followers array of idUserToUnfollow
      const docRef2 = await db.collection('accounts').doc(idUserToUnfollow)
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
