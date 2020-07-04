import { db } from '~/services/fireinit'
// import firebase from 'firebase'
// import functions from '~/assets/functions'
// import { firestore } from 'firebase'

export const state = () => ({
  userToShow: {
    id: null, // no null si está logueado
    name: '',
    image: '',
  },
  unsubscribeUserToShow: null, // guardará la funcion para dejar de escuchar (se invocará en beforeDestroy)
})

export const getters = {}

export const mutations = {
  setUserToShow(state, { id, name, image }) {
    state.userToShow.id = id
    state.userToShow.name = name
    state.userToShow.image = image
  },

  clearUserToShow(state) {
    state.userToShow.id = null
    state.userToShow.name = ''
    state.userToShow.image = ''
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

  startListeningToUserToShow({ state, commit }, idUserToShow) {
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
              image: userToShowData.image,
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

  showUser({ state, rootState }, idUserToShow) {
    if (idUserToShow === rootState.user.user.uid) {
      this.$router.push('/account')
    } else {
      this.$router.push('/users/' + idUserToShow)
    }
  },
}
