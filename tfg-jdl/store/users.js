import { db } from '~/services/fireinit'
// import firebase from 'firebase'
// import functions from '~/assets/functions'
// import { firestore } from 'firebase'

export const state = () => ({
  users: [],
  unsuscribe: null // guardará la funcion para dejar de escuchar (se invocará en beforeDestroy)
  /* users: {
    uid: null,
    name: '',
    email: '',
    followed: false
  } */
})

export const getters = {
  numUsers: (state, getters, rootState) => state.users.length
}

export const mutations = {
  pushUser(state, { userId, name, email, followed }) {
    if (userId) {
      state.users.push({
        id: userId,
        name: name,
        email: email,
        followed: followed
      })
    }
  },
  clearUsers(state) {
    if (state.users) {
      state.users.splice(0, state.users.length)
      // state.users.length = 0
    }
  }
}

export const actions = {
  test() {
    console.log('test users.js')
  },

  clearUsers({ state, commit, dispatch }) {
    commit('clearUsers')
  },

  async startListeningToUsers({ state, commit, dispatch }, payload) {
    const usersCollection = await db.collection('accounts')
    // Nos ponemos en escucha de la colleccion de accounts
    state.unsubscribe = usersCollection.onSnapshot(usersSnapshot => {
      // funcion que se ejecutará cuando se detecten cambios en usersCollection
      dispatch('updateUsers', {
        usersSnapshot: usersSnapshot,
        followed: false
      })
    })
  },

  stopListeningToUsers({ state, commit, dispatch }) {
    commit('clearUsers')
    // Dejar de escuchar a cambios
    state.unsubscribe()
  },

  updateUsers({ state, commit, dispatch }, payload) {
    // TODO: No limpiar y volver a meter todo, buscar en el array el que tenga cambios y actualizarlo

    // Limpiar array de users
    commit('clearUsers')

    // Cargar los users en el array
    payload.usersSnapshot.forEach(userDoc => {
      const userData = userDoc.data()
      commit('pushUser', {
        id: userDoc.id,
        name: userData.name,
        email: userData.email,
        followed: payload.followed
      })
    })
  }
}
