import { firestore } from 'firebase'
import { auth, getCurrentUser, db, storage } from '~/services/fireinit'
// import firebase from 'firebase'
// import functions from '~/assets/functions'

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
    image: '',
    followers: [],
    following: [],
  },
  afterLogin: '/', // donde dirigirse una vez complete el login (por defecto el inicio)
  listeningAuth: false,
  unsubscribeUser: null, // guardará la funcion para dejar de escuchar cambios de User
  unsubscribeFollowers: null, // guardará la funcion para dejar de escuchar cambios en Followers
  unsubscribeFollowing: null, // guardará la funcion para dejar de escuchar cambios en Following
})

export const getters = {
  logged: (state, getters, rootState) => state.user.uid !== null,
}

export const mutations = {
  setUser(state, { id, name, email, image }) {
    state.user.uid = id
    state.user.name = name
    state.user.email = email
    state.user.image = image || 'default-profile.png'
  },
  clearUser(state) {
    state.user.uid = null
    state.user.name = ''
    state.user.email = ''
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
  updateUserData(state, name) {
    state.user.name = name
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
  },
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
        .onSnapshot((followersSnapshot) => {
          // este código se ejecutará cuando se detecten cambios en los followers
          followersSnapshot.docChanges().forEach((change) => {
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
        .onSnapshot((followingSnapshot) => {
          // este código se ejecutará cuando se detecten cambios en los following
          followingSnapshot.docChanges().forEach((change) => {
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
      userDoc.onSnapshot((userDocSnapshot) => {
        if (!userDocSnapshot.exists) {
          // El user logged ha sido borrado
          console.log('El doc del user logged ha sido borrado')
          setTimeout(() => {
            dispatch('logout')
          }, 500)
        } else {
          // Borrar el viejo user
          commit('clearUser')
          // Guardar el nuevo user
          const userData = userDocSnapshot.data()
          commit('setUser', {
            id: userDocSnapshot.id,
            name: userData.name,
            email: userData.email,
            image: userData.image,
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
      auth.onAuthStateChanged((user) => {
        if (user) {
          console.log('Login de initAuth')
          // Login: buscamos el documento y empezamos a escuchar sus cambios
          const userDoc = db.doc('accounts/' + user.uid)
          userDoc
            .get()
            .then(function (doc) {
              if (doc.exists) {
                dispatch('startListeningToUser', userDoc)
                dispatch('startListeningToFollowers', user.uid)
                dispatch('startListeningToFollowing', user.uid)
              } else {
                // Si todavía no existe el documento del user logueado lo creamos
                userDoc
                  .set({
                    email: user.email,
                    image: '/default-profile.png', // imagen por defecto, editable luego
                    name: user.displayName || '????',
                  })
                  .then(function () {
                    // Con el usuario loggeado y su documento creado empezamos a escuchar
                    dispatch('startListeningToUser', userDoc)
                    dispatch('startListeningToFollowers', user.uid)
                    dispatch('startListeningToFollowing', user.uid)
                  })
                  .catch(function (error) {
                    console.log('Error creando el documento: ' + error)
                    user.delete().catch(function (error) {
                      console.log('Error borrando el usuario: ' + error)
                    })
                  })
              }
            })
            .catch(function (error) {
              console.log('Error getting document: ', error)
            })
        } else if (state.user.uid) {
          // Si hay user en el state es que ha hecho logout
          console.log('Logout de initAuth')
          // Dejamos de escuchar cambios
          dispatch('stopListeningToFollowing')
          dispatch('stopListeningToFollowers')
          dispatch('stopListeningToUser')
          // Limpiamos store
          commit('clearUnsubscribes')
          commit('clearUser')
        } else {
          // Si no hay user en el state es que acabamos de lanzar el initAuth
          console.log('Primera ejecución de initAuth')
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
      .catch(function (error) {
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

  updateUserImage({ state }, newImage) {
    const userLoggedId = state.user.uid
    if (userLoggedId) {
      // Actualizamos la imagen en storage y su url en el doc del user
      storage
        .ref('profileImages/' + userLoggedId)
        .put(newImage)
        .then((snapshot) => {
          snapshot.ref.getDownloadURL().then(
            (foundURL) => {
              db.collection('accounts')
                .doc(userLoggedId)
                .update({ image: foundURL })
            },
            (error) => {
              console.log('Error getting DownloadURL. ', error)
            }
          )
        })
        .catch(function (error) {
          return alert('Error insertando nueva imagen en storage. ', error)
        })
    }
  },

  deleteUserImage({ state }) {
    const userLoggedId = state.user.uid
    if (userLoggedId) {
      // No borramos si ya tiene la imagen por defecto
      if (state.user.image === '/default-profile.png') {
        console.log('No se puede borrar la imagen por defecto. ')
      } else {
        // Borramos imagen del storage
        storage
          .ref('profileImages/' + userLoggedId)
          .delete()
          .then(function () {
            // Volver a imagen por defecto
            db.collection('accounts')
              .doc(userLoggedId)
              .update({ image: '/default-profile.png' })
          })
          .catch(function (error) {
            console.log('Error deleting image from storage. ', error)
          })
      }
    }
  },

  follow({ state, commit, dispatch }, idUserToFollow) {
    const userLoggedId = state.user.uid
    if (userLoggedId) {
      db.collection('follows').add({
        date: firestore.Timestamp.now(),
        dest: idUserToFollow,
        ori: userLoggedId,
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
    const userLoggedId = state.user.uid
    if (userLoggedId) {
      db.collection('follows')
        .where('ori', '==', userLoggedId)
        .where('dest', '==', idUserToUnfollow)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete().catch(function (error) {
              console.error('Error removing follow document: ', error)
            })
          })
        })
        .catch(function (error) {
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
  },
}
