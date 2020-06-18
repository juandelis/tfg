import { db } from '~/services/fireinit'
import { firestore } from 'firebase'
// import functions from '~/assets/functions'

export const state = () => ({
  posts: [],
  creatorId: null,
  unsubscribePosts: null // guardará la funcion para dejar de escuchar (se invocará en beforeDestroy)
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
  updatePost(state, { uid, id, likes, dislikes }) {
    const index = state.posts.findIndex(item => item.id === id)
    if (state.posts[index]) {
      // Actualizamos sus likes
      state.posts[index].likes = likes
      state.posts[index].liked = likes.includes(uid)
      state.posts[index].num_likes = likes.length
      // Actualizamos sus dislikes
      state.posts[index].dislikes = dislikes
      state.posts[index].disliked = dislikes.includes(uid)
      state.posts[index].num_dislikes = dislikes.length
    }
  },
  removePost(state, id) {
    const index = state.posts.findIndex(item => item.id === id)
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
  setCreatorId(state, id) {
    state.creatorId = id
  },
  setUnsubscribePosts(state, unsubscribePostsFunction) {
    state.unsubscribePosts = unsubscribePostsFunction
  }
}

export const actions = {
  test() {
    console.log('test posts.js')
  },

  clearPosts({ state, commit, dispatch }) {
    commit('clearPosts')
  },

  async startListeningToPosts({ state, rootState, commit }, payload) {
    let postsCollection = null
    // Obtenemos todos los posts o los del usuario indicado
    if (payload.creatorId === undefined) {
      postsCollection = await db.collection('posts').orderBy('date', 'desc')
    } else {
      commit('setCreatorId', payload.creatorId)
      postsCollection = await db
        .collection('posts')
        .where('creatorId', '==', payload.creatorId)
        .orderBy('date', 'desc')
    }
    // Nos ponemos en escucha de la colleccion de posts
    commit(
      'setUnsubscribePosts',
      postsCollection.onSnapshot(postsSnapshot => {
        postsSnapshot.docChanges().forEach(change => {
          // Código que se ejecuta para cada cambio en postsCollection
          const postData = change.doc.data()
          const userLogged = rootState.user.user
          // Filtramos los posts obtenidos
          if (
            // Si no estamos en un usuario concreto, filtramos por usuarios seguidos
            (payload.creatorId === undefined
              ? userLogged.following.includes(postData.creatorId)
              : true) &&
            // Filtro de fecha (si la ha introducido)
            (payload.date === ''
              ? true
              : postData.date
                  .toDate()
                  .toISOString()
                  .split('T')[0] === payload.date) &&
            // Filtro de valoracion de los posts
            (payload.type === 'all' ||
              (payload.type === 'liked' &&
                postData.likes.includes(userLogged.uid)) ||
              (payload.type === 'disliked' &&
                postData.dislikes.includes(userLogged.uid)) ||
              (payload.type === 'notValued' &&
                !postData.likes.includes(userLogged.uid) &&
                !postData.dislikes.includes(userLogged.uid)))
          ) {
            // Posts añadidos
            if (change.type === 'added') {
              commit('pushPost', {
                id: change.doc.id,
                creatorName: postData.creatorName,
                creatorId: postData.creatorId,
                tittle: postData.tittle,
                body: postData.body,
                date: postData.date.toDate().toLocaleDateString('es-ES'),
                uid: rootState.user.user.uid,
                likes: postData.likes,
                dislikes: postData.dislikes
              })
            }
            // Posts modificados
            else if (change.type === 'modified') {
              commit('updatePost', {
                id: change.doc.id,
                uid: userLogged.uid,
                likes: postData.likes,
                dislikes: postData.dislikes
              })
            }
            // Posts borrados
            else if (change.type === 'removed') {
              commit('removePost', change.doc.id)
            }
          }
        })
      })
    )
  },

  stopListeningToPosts({ state, commit, dispatch }) {
    // Dejar de escuchar a cambios
    state.unsubscribePosts()
    // Limpiar store
    commit('clearPosts')
    commit('setCreatorId', null)
    commit('setUnsubscribePosts', null)
  },

  async searchPosts({ state, rootState, commit, dispatch }, payload) {
    // Limpiar array de posts
    commit('clearPosts')

    let postsCollection = null
    // Obtenemos todos los posts o los del usuario indicado
    if (state.creatorId === null) {
      postsCollection = await db
        .collection('posts')
        .orderBy('date', 'desc')
        .get()
    } else {
      postsCollection = await db
        .collection('posts')
        .where('creatorId', '==', state.creatorId)
        .orderBy('date', 'desc')
        .get()
    }

    postsCollection.forEach(postDoc => {
      const postData = postDoc.data()
      const userLogged = rootState.user.user
      // Filtramos los posts obtenidos
      if (
        // Si no estamos en un usuario concreto, filtramos por usuarios seguidos
        (state.creatorId === null
          ? userLogged.following.includes(postData.creatorId)
          : true) &&
        // Filtro de fecha (si la ha introducido)
        (payload.date === ''
          ? true
          : postData.date
              .toDate()
              .toISOString()
              .split('T')[0] === payload.date) &&
        // Filtro de valoracion de los posts
        (payload.type === 'all' ||
          (payload.type === 'liked' &&
            postData.likes.includes(userLogged.uid)) ||
          (payload.type === 'disliked' &&
            postData.dislikes.includes(userLogged.uid)) ||
          (payload.type === 'notValued' &&
            !postData.likes.includes(userLogged.uid) &&
            !postData.dislikes.includes(userLogged.uid)))
      ) {
        // Ignoramos posts del usuario loggeado
        commit('pushPost', {
          id: postDoc.id,
          creatorName: postData.creatorName,
          creatorId: postData.creatorId,
          tittle: postData.tittle,
          body: postData.body,
          date: postData.date.toDate().toLocaleDateString('es-ES'),
          uid: rootState.user.user.uid,
          likes: postData.likes,
          dislikes: postData.dislikes
        })
      }
    })
  },

  async like({ state, rootState, commit, dispatch }, payload) {
    const userLogged = rootState.user.user
    if (userLogged) {
      const docRef = await db.collection('posts').doc(payload.postId)
      if (payload.disliked) {
        // Remove user id from dislikes and add it to likes
        docRef.update({
          dislikes: firestore.FieldValue.arrayRemove(userLogged.uid),
          likes: firestore.FieldValue.arrayUnion(userLogged.uid)
        })
      } else {
        // Just add user id to likes of post
        docRef.update({
          likes: firestore.FieldValue.arrayUnion(userLogged.uid)
        })
      }
    }
  },

  async unlike({ state, rootState, commit, dispatch }, idPostToLike) {
    const userLogged = rootState.user.user
    if (userLogged) {
      const docRef = await db.collection('posts').doc(idPostToLike)
      // Remove user id from likes of post
      docRef.update({
        likes: firestore.FieldValue.arrayRemove(userLogged.uid)
      })
    }
  },

  async dislike({ state, rootState, commit, dispatch }, payload) {
    const userLogged = rootState.user.user
    if (userLogged) {
      const docRef = await db.collection('posts').doc(payload.postId)
      if (payload.liked) {
        // Remove user id from likes and add it to dislikes
        docRef.update({
          likes: firestore.FieldValue.arrayRemove(userLogged.uid),
          dislikes: firestore.FieldValue.arrayUnion(userLogged.uid)
        })
      } else {
        // Just add user id to dislikes of post
        docRef.update({
          dislikes: firestore.FieldValue.arrayUnion(userLogged.uid)
        })
      }
    }
  },

  async undislike({ state, rootState, commit, dispatch }, idPostToDislike) {
    const userLogged = rootState.user.user
    if (userLogged) {
      const docRef = await db.collection('posts').doc(idPostToDislike)
      // Remove user id from dislikes of post
      docRef.update({
        dislikes: firestore.FieldValue.arrayRemove(userLogged.uid)
      })
    }
  }
}
