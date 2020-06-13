import { db } from '~/services/fireinit'
// import firebase from 'firebase'
// import functions from '~/assets/functions'
// import { firestore } from 'firebase'

export const state = () => ({
  users: [],
  unsubscribeUsers: null // guardará la funcion para dejar de escuchar (se invocará en beforeDestroy)
})

export const getters = {
  numUsers: (state, getters) => state.users.length
}

export const mutations = {
  pushUser(state, { id, name, image }) {
    if (id) {
      state.users.push({
        id: id,
        name: name,
        image: image
      })
    }
  },
  updateUser(state, { id, name, image }) {
    const index = state.users.findIndex(item => item.id === id)
    if (state.users[index]) {
      state.users[index].name = name
      state.users[index].image = image
    }
  },
  deleteUser(state, id) {
    const index = state.users.findIndex(item => item.id === id)
    if (state.users[index]) {
      state.users.splice(index, 1)
    }
  },
  clearUsers(state) {
    if (state.users) {
      state.users.splice(0, state.users.length)
      // state.users.length = 0
    }
  },
  setUnsubscribeUsers(state, unsubscribeUsers) {
    state.unsubscribeUsers = unsubscribeUsers
  },
  clearUnsubscribeUsers(state) {
    state.unsubscribeUsers = null
  }
}

export const actions = {
  test() {
    console.log('test users.js')
  },

  clearUsers({ commit }) {
    commit('clearUsers')
  },

  startListeningToUsers({ dispatch, commit }, payload) {
    // Nos ponemos en escucha de la colleccion de accounts
    commit(
      'setUnsubscribeUsers',
      db.collection('accounts').onSnapshot(usersSnapshot => {
        // Funcion que se ejecutará cuando se detecten cambios en usersCollection
        dispatch('updateUsers', {
          usersSnapshot: usersSnapshot,
          name: payload.name,
          relation: payload.relation
        })
      })
    )
  },

  stopListeningToUsers({ state, commit }) {
    // Limpiar el array de users
    commit('clearUsers')
    // Dejar de escuchar a cambios
    state.unsubscribeUsers()
    commit('clearUnsubscribeUsers')
  },

  updateUsers({ state, commit, rootState }, payload) {
    // Cargar los nuevos users, modificar los cambiados y quitar los borrados
    payload.usersSnapshot.docChanges().forEach(change => {
      const userLogged = rootState.user.user
      // Ignoramos cambios en el usuario loggeado (estos estarán en user.js)
      if (change.doc.id !== userLogged.uid) {
        const userData = change.doc.data()
        if (
          // Filtro nombre de usuario
          userData.name.toLowerCase().includes(payload.name.toLowerCase()) &&
          // Filtros relacion Follow
          (payload.relation === 'all' ||
            (payload.relation === 'followed' &&
              userLogged.following.includes(change.doc.id)) ||
            (payload.relation === 'notFollowed' &&
              !userLogged.following.includes(change.doc.id)))
        ) {
          // Users añadidos
          if (change.type === 'added') {
            commit('pushUser', {
              id: change.doc.id,
              name: userData.name,
              image: userData.image
            })
          }
          // Users modificados
          if (change.type === 'modified') {
            commit('updateUser', {
              id: change.doc.id,
              name: userData.name,
              image: userData.image
            })
          }
          // Users borrados
          if (change.type === 'removed') {
            commit('deleteUser', change.doc.id)
          }
        }
      }
    })
  },

  searchUsers({ commit, rootState }, payload) {
    // Limpiar array de users
    commit('clearUsers')
    // Obtener users filtrados
    db.collection('accounts')
      .get()
      .then(usersCollection => {
        usersCollection.forEach(userDoc => {
          const userLogged = rootState.user.user
          // Ignoramos al usuario logueado
          if (userDoc.id !== userLogged.uid) {
            const userData = userDoc.data()
            if (
              // Filtro nombre de usuario
              userData.name
                .toLowerCase()
                .includes(payload.name.toLowerCase()) &&
              // Filtros relacion Follow
              (payload.relation === 'all' ||
                (payload.relation === 'followed' &&
                  userLogged.following.includes(userDoc.id)) ||
                (payload.relation === 'notFollowed' &&
                  !userLogged.following.includes(userDoc.id)))
            ) {
              commit('pushUser', {
                id: userDoc.id,
                name: userData.name,
                image: userData.image
              })
            }
          }
        })
      })
  }
}
