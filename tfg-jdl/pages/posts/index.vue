<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm9 md6>
      <v-card>
        <br />
        <h1 align="center">PUBLICACIONES</h1>
        <br />
        <hr />
        <br />
        <p>
          <label class="labelForm" for="creator"> Autor: </label> &nbsp;
          <input v-model="creator" type="search" name="creator" size="40" />
          <br /><br />
          <label class="labelForm" for="date"> Fecha: </label> &nbsp;
          <input v-model="date" type="date" name="date" />
          <br /><br />
          <v-btn @click="search()">
            BUSCAR
          </v-btn>
        </p>
        <br />
      </v-card>

      <br />

      <div v-for="(post, i) in posts" :key="i">
        <v-card dark>
          <v-card-title>
            <v-btn flat round @click="showUser(post.creatorUid)">
              <v-icon>account_circle</v-icon>&nbsp;
              <span class="headline font-weight-bold">
                {{ post.creatorName }}
              </span>
            </v-btn>
            <v-spacer />
            {{ post.date }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </v-card-title>
          {{ post.body }}
          <br />
          <v-card-title>
            <v-spacer />
            <v-card color="">
              <v-btn icon flat @click="showUser(post.creatorUid)">
                <v-icon>thumb_down</v-icon>
              </v-btn>
              <span>256</span>
              <v-btn icon flat @click="showUser(post.creatorUid)">
                <v-icon>thumb_up</v-icon>
              </v-btn>
            </v-card>
            <v-spacer />
          </v-card-title>
        </v-card>
        <br />
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { db } from '~/services/fireinit'

export default {
  data: () => ({
    posts: [],
    creator: '',
    date: '',
    unsubscribe: null
  }),
  middleware: 'autenticado',
  computed: {
    ...mapState('user', ['user'])
  },
  mounted: async function() {
    // TODO missings

    // TODO onSnapShot para el user
    // Se puede también escuchar a un documento concreto

    const postsCollection = await db.collection('posts').orderBy('date', 'desc')

    console.log('Start listening for changes')
    // this.unsubscribe guarda la funcion para dejar de escuchar (se invocará en beforeDestroy)
    this.unsubscribe = postsCollection.onSnapshot(postsSnapshot => {
      // TODO Actualizar solo los cambios, no quitar todo y añadir todo de nuevo
      this.getPosts(postsSnapshot)
    })
  },
  beforeDestroy: function() {
    // Limpiar posts
    this.posts = []
    // Dejar de escuchar
    this.unsubscribe()
    console.log('Stop listening for changes')
  },
  methods: {
    // TODO funciones de like y dislike (añadir id de usuario a lista de likes o dislikes)
    ...mapActions('user', ['showUser']),

    async search() {
      this.posts = []
      const postsColllection = await db
        .collection('posts')
        .orderBy('date', 'desc')
        .get()

      postsColllection.forEach(postDoc => {
        const postData = postDoc.data()
        if (
          postData.creatorName
            .toLowerCase()
            .includes(this.creator.toLowerCase()) &&
          (this.date === ''
            ? true
            : postData.date
                .toDate()
                .toISOString()
                .split('T')[0] === this.date)
        ) {
          this.posts.push({
            uid: postDoc.id,
            tittle: postData.tittle,
            date: postData.date.toDate().toLocaleDateString('es-ES'),
            creatorUid: postData.creatorUid,
            creatorName: postData.creatorName,
            body: postData.body
          })
        }
      })
    },

    getPosts(postsSnapshot) {
      // TODO Actualizar solo los cambios, no quitar todo y añadir todo de nuevo
      this.posts = []
      postsSnapshot.forEach(postDoc => {
        const postData = postDoc.data()
        this.posts.push({
          uid: postDoc.id,
          tittle: postData.tittle,
          date: postData.date.toDate().toLocaleDateString('es-ES'),
          creatorUid: postData.creatorUid,
          creatorName: postData.creatorName,
          body: postData.body
        })
      })
    }
    /*,
    getDateWithFormat(date) {
     var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('es-ES')
    } */
  }
}
</script>
