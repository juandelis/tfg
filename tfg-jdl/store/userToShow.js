import { db } from '~/services/fireinit'
// import firebase from 'firebase'
// import functions from '~/assets/functions'
// import { firestore } from 'firebase'

export const state = () => ({
  userToShow: {
    id: null, // no null si está logueado
    name: '',
    email: '',
    image: '',
    followers: [],
    following: [],
  },
  unsubscribeUserToShow: null, // guardará la funcion para dejar de escuchar (se invocará en beforeDestroy)
})

export const getters = {}

export const mutations = {
  setUserToShow(state, { id, name, email, image, following, followers }) {
    state.userToShow.id = id
    state.userToShow.name = name
    state.userToShow.email = email
    state.userToShow.image = image
    state.userToShow.followers = followers
    state.userToShow.following = following
  },

  clearUserToShow(state) {
    state.userToShow.id = null
    state.userToShow.name = ''
    state.userToShow.email = ''
    state.userToShow.image = ''
    state.userToShow.followers = []
    state.userToShow.following = []
  },

  setUnsubscribeUserToShow(state, unsubscribeUserToShow) {
    state.unsubscribeUserToShow = unsubscribeUserToShow
  },

  clearUnsubscribeUserToShow(state) {
    state.unsubscribeUserToShow = null
  },
}

export const actions = {
  test() {
    console.log('test userToShow.js')
  },

  clearUserToShow({ commit }) {
    commit('clearUserToShow')
  },

  startListeningToUserToShow({ state, commit, rootState }, idUserToShow) {
    // Nos ponemos en escucha del documento del usuario
    commit(
      'setUnsubscribeUserToShow',
      db.doc('accounts/' + idUserToShow).onSnapshot((userToShowDocSnapshot) => {
        if (!userToShowDocSnapshot.exists) {
          // El usuario no existe o ha sido borrado
          this.$router.push('/users')
        } else {
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
              image: userToShowData.image,
              following: userToShowData.following,
              followers: userToShowData.followers,
            })
          } else {
            console.log('No data found for user ' + userToShowId)
          }
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
  },
}
