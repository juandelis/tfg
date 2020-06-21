import { db } from '~/services/fireinit'

export const state = () => ({
  posts: [],
  unsuscribe: null // guardará la funcion para dejar de escuchar (se invocará en beforeDestroy)
})

export const getters = {
  numPosts: (state, getters, rootState) => state.posts.length
}

export const mutations = {
  pushPost(state, { id, creatorName, body, date, likes, dislikes }) {
    // const userLogged = rootState.user.user
    if (id) {
      state.posts.push({
        id: id,
        creatorName: creatorName,
        body: body,
        date: date,
        likes: likes,
        num_likes: likes.length,
        dislikes: dislikes,
        num_dislikes: dislikes.length
      })
    }
  },
  updatePost(state, { id, creatorName, body, date, likes, dislikes }) {
    const index = state.posts.findIndex(item => item.id === id)
    if (state.posts[index]) {
      // Borramos el antiguo post e insertamos el nuevo en su lugar
      state.posts.splice(index, 1, {
        id: id,
        creatorName: creatorName,
        body: body,
        date: date,
        likes: likes,
        num_likes: likes.length,
        dislikes: dislikes,
        num_dislikes: dislikes.length
      })
    }
  },
  removePost(state, { index }) {
    if (state.posts[index]) {
      // Borramos el post
      state.posts.splice(index, 1)
    }
  },
  clearPosts(state) {
    if (state.posts) {
      // Borramos todos los posts
      state.posts.splice(0, state.posts.length)
    }
  }
}

export const actions = {
  test() {
    console.log('test posts.js')
  },

  clearPosts({ state, commit, dispatch }) {
    commit('clearPosts')
  },

  async startListeningToPosts({ state, rootState, dispatch }, payload) {
    // TODO: aplicar filtro en la query
    const postsCollection = await db
      .collection('posts')
      .where('creatorId', '==', rootState.user.user.uid)
      .orderBy('date', 'desc')
    // Nos ponemos en escucha de la colleccion de posts
    state.unsubscribe = postsCollection.onSnapshot(postsSnapshot => {
      // funcion que se ejecutará cuando se detecten cambios en postsCollection
      dispatch('updatePosts', {
        postsSnapshot: postsSnapshot,
        text: payload.text,
        date: payload.date
      })
    })
  },

  stopListeningToPosts({ state, commit, dispatch }) {
    commit('clearPosts')
    // Dejar de escuchar a cambios
    state.unsubscribe()
  },

  updatePosts({ state, commit, dispatch }, payload) {
    // Cargar los nuevos posts, modificar los cambiados y quitar los borrados
    payload.postsSnapshot.docChanges().forEach(change => {
      const postData = change.doc.data()
      // Posts añadidos
      if (change.type === 'added') {
        if (
          postData.body.toUpperCase().includes(payload.text.toUpperCase()) &&
          (payload.date === ''
            ? true
            : postData.date
                .toDate()
                .toISOString()
                .split('T')[0] === payload.date)
        ) {
          commit('pushPost', {
            id: change.doc.id,
            creatorName: postData.creatorName,
            body: postData.body,
            date: postData.date.toDate().toLocaleDateString('es-ES'),
            likes: postData.likes,
            dislikes: postData.dislikes
          })
        }
      }
      // Posts modificados
      if (change.type === 'modified') {
        commit('updatePost', {
          id: change.doc.id,
          creatorName: postData.creatorName,
          body: postData.body,
          date: postData.date.toDate().toLocaleDateString('es-ES'),
          likes: postData.likes,
          dislikes: postData.dislikes
        })
      }
      // Posts borrados
      if (change.type === 'removed') {
        const index = state.posts.findIndex(item => item.id === change.doc.id)
        commit('removePost', { index: index })
      }
    })
  },

  async searchPosts({ state, rootState, commit, dispatch }, payload) {
    // Limpiar array de posts
    commit('clearPosts')

    const postsCollection = await db
      .collection('posts')
      .where('creatorId', '==', rootState.user.user.uid)
      .orderBy('date', 'desc')
      .get()

    postsCollection.forEach(postDoc => {
      const postData = postDoc.data()
      if (
        postData.body.toUpperCase().includes(payload.text.toUpperCase()) &&
        (payload.date === ''
          ? true
          : postData.date
              .toDate()
              .toISOString()
              .split('T')[0] === payload.date)
      ) {
        commit('pushPost', {
          id: postDoc.id,
          creatorName: postData.creatorName,
          body: postData.body,
          date: postData.date.toDate().toLocaleDateString('es-ES'),
          likes: postData.likes,
          dislikes: postData.dislikes
        })
      }
    })
  }
}
