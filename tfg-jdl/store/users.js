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
  pushUser(state, { id, name, email, followed }) {
    if (id) {
      state.users.push({
        id: id,
        name: name,
        email: email,
        followed: followed
      })
    }
  },
  updateUser(state, { index, id, name, email, followed }) {
    if (state.users[index]) {
      // Borramos el antiguo user e insertamos el nuevo en su lugar
      state.users.splice(index, 1, {
        id: id,
        name: name,
        email: email,
        followed: followed
      })
    }
  },
  deleteUser(state, { index }) {
    if (state.users[index]) {
      // Borramos el user
      state.users.splice(index, 1)
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

  clearUsers({ commit }) {
    commit('clearUsers')
  },

  async startListeningToUsers({ state, dispatch }, payload) {
    const usersCollection = await db.collection('accounts')
    // Nos ponemos en escucha de la colleccion de accounts
    state.unsubscribe = usersCollection.onSnapshot(usersSnapshot => {
      // funcion que se ejecutará cuando se detecten cambios en usersCollection
      dispatch('updateUsers', {
        usersSnapshot: usersSnapshot,
        name: payload.name,
        email: payload.email,
        relation: payload.relation
      })
    })
  },

  stopListeningToUsers({ state, commit }) {
    commit('clearUsers')
    // Dejar de escuchar a cambios
    state.unsubscribe()
  },

  updateUsers({ state, commit, rootState }, payload) {
    // Cargar los nuevos users, modificar los cambiados y quitar los borrados
    payload.usersSnapshot.docChanges().forEach(change => {
      const userData = change.doc.data()
      const userLogged = rootState.user.user
      // Users añadidos
      if (change.type === 'added') {
        if (payload.relation === 'all') {
          if (
            change.doc.id !== userLogged.uid &&
            userData.name.toLowerCase().includes(payload.name.toLowerCase()) &&
            userData.email.toLowerCase().includes(payload.email.toLowerCase()) // str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") to remove accents
          ) {
            commit('pushUser', {
              id: change.doc.id,
              name: userData.name,
              email: userData.email,
              followed: userLogged.following.includes(change.doc.id)
            })
          }
        } else {
          const followed = payload.relation === 'followed'
          if (
            change.doc.id !== userLogged.uid &&
            userLogged.following.includes(change.doc.id) === followed &&
            userData.name.toLowerCase().includes(payload.name.toLowerCase()) &&
            userData.email.toLowerCase().includes(payload.email.toLowerCase())
          ) {
            commit('pushUser', {
              id: change.doc.id,
              name: userData.name,
              email: userData.email,
              followed: userLogged.following.includes(change.doc.id)
            })
          }
        }
      }
      // Users modificados
      if (change.type === 'modified') {
        const index = state.users.findIndex(item => item.id === change.doc.id)
        commit('updateUser', {
          index: index,
          id: change.doc.id,
          name: userData.name,
          email: userData.email,
          followed: userLogged.following.includes(change.doc.id)
        })
      }
      // Users borrados
      if (change.type === 'removed') {
        const index = state.users.findIndex(item => item.id === change.doc.id)
        commit('deleteUser', { index: index })
      }
    })
  },

  async searchUsers({ commit, rootState }, payload) {
    // Limpiar array de users
    commit('clearUsers')

    const usersCollection = await db.collection('accounts').get()

    usersCollection.forEach(userDoc => {
      const userData = userDoc.data()
      const userLogged = rootState.user.user
      if (payload.relation === 'all') {
        if (
          userDoc.id !== userLogged.uid &&
          userData.name.toLowerCase().includes(payload.name.toLowerCase()) &&
          userData.email.toLowerCase().includes(payload.email.toLowerCase()) // str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") to remove accents
        ) {
          commit('pushUser', {
            id: userDoc.id,
            name: userData.name,
            email: userData.email,
            followed: userLogged.following.includes(userDoc.id)
          })
        }
      } else {
        const followed = payload.relation === 'followed'
        if (
          userDoc.id !== userLogged.uid &&
          userLogged.following.includes(userDoc.id) === followed &&
          userData.name.toLowerCase().includes(payload.name.toLowerCase()) &&
          userData.email.toLowerCase().includes(payload.email.toLowerCase())
        ) {
          commit('pushUser', {
            id: userDoc.id,
            name: userData.name,
            email: userData.email,
            followed: userLogged.following.includes(userDoc.id)
          })
        }
      }
    })
  }
}
