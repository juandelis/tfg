import { db } from '~/services/fireinit'
// import firebase from 'firebase'
// import functions from '~/assets/functions'
// import { firestore } from 'firebase'

export const state = () => ({
  posts: [],
  unsuscribe: null
  /* posts: {
    id: null, // no null si está logueado
    creatorName: '',
    creatorId: '',
    tittle: '',
    body: '',
    date: '',
    likes: [],
    dislikes: [],
    date: 0
  } */
})

export const getters = {
  numPosts: (state, getters, rootState) => state.posts.length
}

export const mutations = {
  pushPost(
    state,
    {
      postId,
      creatorName,
      creatorId,
      tittle,
      body,
      date,
      likes,
      dislikes,
      score
    }
  ) {
    if (postId) {
      state.posts.push({
        id: postId,
        creatorName: creatorName,
        creatorId: creatorId,
        tittle: tittle,
        body: body,
        date: date,
        likes: likes,
        dislikes: dislikes,
        score: score
      })
    }
  },
  clearPosts(state) {
    if (state.posts) {
      state.posts.splice(0, state.posts.length)
      // state.posts.length = 0
    }
  }
}

export const actions = {
  test() {
    console.log('test')
  },

  clearPosts({ state, commit, dispatch }) {
    commit('clearPosts')
  },

  updatePosts({ state, commit, dispatch }, payload) {
    // Limpiar array de posts
    commit('clearPosts')

    // Cargar los posts en el array
    payload.postsSnapshot.forEach(postDoc => {
      const postData = postDoc.data()
      if (
        postData.creatorName
          .toUpperCase()
          .includes(payload.creatorName.toUpperCase()) &&
        (payload.date === ''
          ? true
          : postData.date
              .toDate()
              .toISOString()
              .split('T')[0] === payload.date)
      ) {
        commit('pushPost', {
          postId: postDoc.id,
          creatorName: postData.creatorName,
          creatorId: postData.creatorId,
          tittle: postData.tittle,
          body: postData.body,
          date: postData.date.toDate().toLocaleDateString('es-ES'),
          likes: postData.likes,
          dislikes: postData.dislikes,
          score: postData.score
        })
      }
    })
  },

  async startListeningToPosts({ state, commit, dispatch }, payload) {
    const postsCollection = await db.collection('posts').orderBy('date', 'desc')

    // Nos ponemos en escucha de la colleccion de posts
    // this.unsubscribe guarda la funcion para dejar de escuchar (se invocará en beforeDestroy)
    state.unsubscribe = postsCollection.onSnapshot(postsSnapshot => {
      // funcion que se ejecutará cuando se detecten cambios en postsCollection
      dispatch('updatePosts', {
        postsSnapshot: postsSnapshot,
        creatorName: payload.creator,
        date: payload.date
      })
    })
  },

  stopListeningToPosts({ state, commit, dispatch }) {
    commit('clearPosts')
    // Dejar de escuchar a cambios
    state.unsubscribe()
  }
}
