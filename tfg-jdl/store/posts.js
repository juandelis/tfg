import { db } from '~/services/fireinit'
import { firestore } from 'firebase'
// import functions from '~/assets/functions'

export const state = () => ({
  posts: [],
  unsuscribe: null // guardará la funcion para dejar de escuchar (se invocará en beforeDestroy)
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
    { uid, id, creatorName, creatorId, tittle, body, date, likes, dislikes }
  ) {
    // const userLogged = rootState.user.user
    if (id) {
      state.posts.push({
        id: id,
        creatorName: creatorName,
        creatorId: creatorId,
        tittle: tittle,
        body: body,
        date: date,
        likes: likes,
        liked: likes.includes(uid),
        num_likes: likes.length,
        dislikes: dislikes,
        disliked: dislikes.includes(uid),
        num_dislikes: dislikes.length
      })
    }
  },
  updatePost(
    state,
    { uid, id, creatorName, creatorId, tittle, body, date, likes, dislikes }
  ) {
    const index = state.posts.findIndex(item => item.id === id)
    if (state.posts[index]) {
      // Borramos el antiguo post e insertamos el nuevo en su lugar
      state.posts.splice(index, 1, {
        id: id,
        creatorName: creatorName,
        creatorId: creatorId,
        tittle: tittle,
        body: body,
        date: date,
        likes: likes,
        liked: likes.includes(uid),
        num_likes: likes.length,
        dislikes: dislikes,
        disliked: dislikes.includes(uid),
        num_dislikes: dislikes.length
      })
    }
  },
  deletePost(state, { index }) {
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

  async startListeningToPosts({ state, commit, dispatch }, payload) {
    // TODO: aplicar filtro en la query
    const postsCollection = await db.collection('posts').orderBy('date', 'desc')
    // Nos ponemos en escucha de la colleccion de posts
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
  },

  updatePosts({ state, rootState, commit, dispatch }, payload) {
    // Cargar los nuevos posts, modificar los cambiados y quitar los borrados
    payload.postsSnapshot.docChanges().forEach(change => {
      const postData = change.doc.data()
      // Posts añadidos
      if (change.type === 'added') {
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
            uid: rootState.user.user.uid,
            id: change.doc.id,
            creatorName: postData.creatorName,
            creatorId: postData.creatorId,
            tittle: postData.tittle,
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
          uid: rootState.user.user.uid,
          id: change.doc.id,
          creatorName: postData.creatorName,
          creatorId: postData.creatorId,
          tittle: postData.tittle,
          body: postData.body,
          date: postData.date.toDate().toLocaleDateString('es-ES'),
          likes: postData.likes,
          dislikes: postData.dislikes
        })
      }
      // Posts borrados
      if (change.type === 'removed') {
        const index = state.posts.findIndex(item => item.id === change.doc.id)
        commit('deletePost', { index: index })
      }
    })
  },

  async searchPosts({ state, rootState, commit, dispatch }, payload) {
    // TODO: No limpiar y volver a meter todo, aplicar filtro al array posts,
    // pero habría que guardarlo en otro array postsToShow que será el que se muestre

    // Limpiar array de posts
    commit('clearPosts')

    const postsCollection = await db
      .collection('posts')
      .orderBy('date', 'desc')
      .get()

    postsCollection.forEach(postDoc => {
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
          uid: rootState.user.user.uid,
          id: postDoc.id,
          creatorName: postData.creatorName,
          creatorId: postData.creatorId,
          tittle: postData.tittle,
          body: postData.body,
          date: postData.date.toDate().toLocaleDateString('es-ES'),
          likes: postData.likes,
          dislikes: postData.dislikes
        })
      }
    })
  },

  async like({ state, rootState, commit, dispatch }, idPostToLike) {
    const userLogged = rootState.user.user
    if (userLogged) {
      // Remove user id from dislikes of post
      const docRef = await db.collection('posts').doc(idPostToLike)
      docRef.update({
        dislikes: firestore.FieldValue.arrayRemove(userLogged.uid)
      })
      // Add user id to likes of post
      docRef.update({
        likes: firestore.FieldValue.arrayUnion(userLogged.uid)
      })
    }
  },

  async unlike({ state, rootState, commit, dispatch }, idPostToLike) {
    const userLogged = rootState.user.user
    if (userLogged) {
      // Remove user id from likes of post
      const docRef = await db.collection('posts').doc(idPostToLike)
      docRef.update({
        likes: firestore.FieldValue.arrayRemove(userLogged.uid)
      })
    }
  },

  async dislike({ state, rootState, commit, dispatch }, idPostToDislike) {
    const userLogged = rootState.user.user
    if (userLogged) {
      // Remove user id from likes of post
      const docRef = await db.collection('posts').doc(idPostToDislike)
      docRef.update({
        likes: firestore.FieldValue.arrayRemove(userLogged.uid)
      })
      // Add user id to dislikes of post
      docRef.update({
        dislikes: firestore.FieldValue.arrayUnion(userLogged.uid)
      })
    }
  },

  async undislike({ state, rootState, commit, dispatch }, idPostToDislike) {
    const userLogged = rootState.user.user
    if (userLogged) {
      // Remove user id from dislikes of post
      const docRef = await db.collection('posts').doc(idPostToDislike)
      docRef.update({
        dislikes: firestore.FieldValue.arrayRemove(userLogged.uid)
      })
    }
  }
}
