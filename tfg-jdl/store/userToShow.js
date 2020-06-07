import { db } from '~/services/fireinit'
// import firebase from 'firebase'
// import functions from '~/assets/functions'
// import { firestore } from 'firebase'

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
  userToShow: {
    id: null, // no null si está logueado
    name: '',
    email: '',
    birth: '',
    genre: '',
    info: '',
    image: '',
    followed: false,
    followers: [],
    following: []
  },
  unsubscribeUserToShow: null // guardará la funcion para dejar de escuchar (se invocará en beforeDestroy)
})

export const getters = {}

export const mutations = {
  setUserToShow(
    state,
    {
      id,
      name,
      email,
      birth,
      genre,
      info,
      image,
      followed,
      following,
      followers
    }
  ) {
    state.userToShow.id = id
    state.userToShow.name = name
    state.userToShow.email = email
    state.userToShow.birth = birth
    state.userToShow.genre = genre
    state.userToShow.info = info
    state.userToShow.image = image
    state.userToShow.followed = followed
    state.userToShow.followers = followers
    state.userToShow.following = following
  },

  clearUserToShow(state) {
    state.userToShow.id = null
    state.userToShow.name = ''
    state.userToShow.email = ''
    state.userToShow.birth = ''
    state.userToShow.genre = ''
    state.userToShow.info = ''
    state.userToShow.image = ''
    state.userToShow.followed = false
    state.userToShow.followers = []
    state.userToShow.following = []
  },

  updateUserToShowFollowed(state, followed) {
    state.userToShow.followed = followed
  },

  setUnsubscribeUserToShow(state, unsubscribeUserToShow) {
    state.unsubscribeUserToShow = unsubscribeUserToShow
  },

  clearUnsubscribeUserToShow(state) {
    state.unsubscribeUserToShow = null
  }
}

export const actions = {
  test() {
    console.log('test userToShow.js')
  },

  clearUserToShow({ commit }) {
    commit('clearUserToShow')
  },

  async startListeningToUserToShow({ state, commit, rootState }, idUserToShow) {
    const userToShowDoc = await db.collection('accounts').doc(idUserToShow)
    // Nos ponemos en escucha del documento del usuario
    commit(
      'setUnsubscribeUserToShow',
      userToShowDoc.onSnapshot(userToShowDocSnapshot => {
        // Borrar el viejo userToShow
        commit('clearUserToShow')
        // Guardar el nuevo userToShow
        const userToShowId = userToShowDocSnapshot.id
        const userToShowData = userToShowDocSnapshot.data()
        if (userToShowData) {
          commit('setUserToShow', {
            id: userToShowId,
            name: userToShowData.name,
            email: userToShowData.email,
            birth: userToShowData.birth,
            genre: userToShowData.genre,
            info: userToShowData.info,
            image: userToShowData.image,
            followed: rootState.user.user.following.includes(userToShowId),
            following: userToShowData.following,
            followers: userToShowData.followers
          })
        } else {
          console.log('No data found for user ' + userToShowId)
        }
      })
    )
  },

  stopListeningToUserToShow({ state, commit }) {
    // Limpiar el userToShow
    commit('clearUserToShow')
    // Dejar de escuchar a cambios
    state.unsubscribeUserToShow()
    commit('clearUnsubscribeUserToShow')
  }
}
