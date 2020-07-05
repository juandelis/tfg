import { db } from '~/services/fireinit'

export const state = () => ({
  posts: [],
  unsubscribeMyPosts: null, // guardará la funcion para dejar de escuchar (se invocará en beforeDestroy)
})

export const getters = {
  numPosts: (state, getters, rootState) => state.posts.length,
}

export const mutations = {
  pushPost(state, { id, body, date, likes, dislikes }) {
    // const userLogged = rootState.user.user
    if (id) {
      state.posts.push({
        id,
        body,
        date,
        likes,
        num_likes: likes.length,
        dislikes,
        num_dislikes: dislikes.length,
      })
    }
  },
  updatePost(state, { id, body, date, likes, dislikes }) {
    const index = state.posts.findIndex((item) => item.id === id)
    if (state.posts[index]) {
      // Borramos el antiguo post e insertamos el nuevo en su lugar
      state.posts.splice(index, 1, {
        id,
        body,
        date,
        likes,
        num_likes: likes.length,
        dislikes,
        num_dislikes: dislikes.length,
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
  },
  setUnsubscribeMyPosts(state, unsubscribeMyPosts) {
    state.unsubscribeMyPosts = unsubscribeMyPosts
  },
}

export const actions = {
  test() {
    console.log('test posts.js')
  },

  clearPosts({ state, commit, dispatch }) {
    commit('clearPosts')
  },

  startListeningToPosts({ state, rootState, commit }, payload) {
    // Nos ponemos en escucha de la colleccion de posts
    commit(
      'setUnsubscribeMyPosts',
      db
        .collection('posts')
        .where('creatorId', '==', rootState.user.user.uid)
        .orderBy('date', 'desc')
        .onSnapshot((postsSnapshot) => {
          // Cargar los nuevos posts, modificar los cambiados y quitar los borrados
          postsSnapshot.docChanges().forEach((change) => {
            const postData = change.doc.data()
            // Posts añadidos
            if (change.type === 'added') {
              if (
                postData.body
                  .toUpperCase()
                  .includes(payload.text.toUpperCase()) &&
                (payload.date === ''
                  ? true
                  : postData.date.toDate().toISOString().split('T')[0] ===
                    payload.date)
              ) {
                commit('pushPost', {
                  id: change.doc.id,
                  body: postData.body,
                  date: postData.date.toDate().toLocaleDateString('es-ES'),
                  likes: postData.likes,
                  dislikes: postData.dislikes,
                })
              }
            }
            // Posts modificados
            if (change.type === 'modified') {
              commit('updatePost', {
                id: change.doc.id,
                body: postData.body,
                date: postData.date.toDate().toLocaleDateString('es-ES'),
                likes: postData.likes,
                dislikes: postData.dislikes,
              })
            }
            // Posts borrados
            if (change.type === 'removed') {
              const index = state.posts.findIndex(
                (item) => item.id === change.doc.id
              )
              commit('removePost', { index })
            }
          })
        })
    )
  },

  stopListeningToPosts({ state, commit, dispatch }) {
    commit('clearPosts')
    // Dejar de escuchar a cambios
    state.unsubscribeMyPosts()
  },

  searchPosts({ state, rootState, commit, dispatch }, payload) {
    // Limpiar array de posts
    commit('clearPosts')

    db.collection('posts')
      .where('creatorId', '==', rootState.user.user.uid)
      .orderBy('date', 'desc')
      .get()
      .forEach((postDoc) => {
        const postData = postDoc.data()
        if (
          postData.body.toUpperCase().includes(payload.text.toUpperCase()) &&
          (payload.date === ''
            ? true
            : postData.date.toDate().toISOString().split('T')[0] ===
              payload.date)
        ) {
          commit('pushPost', {
            id: postDoc.id,
            body: postData.body,
            date: postData.date.toDate().toLocaleDateString('es-ES'),
            likes: postData.likes,
            dislikes: postData.dislikes,
          })
        }
      })
  },
}
