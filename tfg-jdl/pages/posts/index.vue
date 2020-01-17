<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm9 md7>
      <v-card>
        <br />
        <h1 align="center">PUBLICACIONES</h1>

        <br />
        <hr />
        <br />

        <p>
          <label class="labelForm" for="tittle"> Titulo</label>
          <input v-model="tittle" type="search" name="titulo" />
        </p>

        <p>
          <v-btn @click="search()">
            BUSCAR
          </v-btn>
        </p>

        <hr />
        <br />

        <div v-for="(post, i) in posts" :key="i">
          <!-- TODO: metodo showPost() en user.js igual que el showUser-->
          <v-btn
            flat
            color="white"
            left
            round
            @click="showPost(post.uid, post.creator)"
          >
            {{ i + 1 }} - &nbsp; {{ post.tittle }} &nbsp; ---&nbsp;
            {{ post.date.toDate().toLocaleDateString('es-ES') }}
          </v-btn>
          <br /><br />
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { db } from '~/services/fireinit'
// import { storage } from '~/services/fireinit'

export default {
  data: () => ({
    posts: []
  }),
  middleware: 'autenticado',
  computed: {
    ...mapState('user', ['user'])
  },
  mounted: function() {
    this.getPosts()
  },
  methods: {
    // ...mapActions('user', ['updateUserImage', 'test']),
    async getPosts() {
      this.posts = []
      const postsSnapshot = await db.collection('posts').get()
      // const userLogged = this.user
      postsSnapshot.forEach(postDoc => {
        const postData = postDoc.data()
        this.posts.push({
          uid: postDoc.id,
          tittle: postData.tittle,
          date: postData.date,
          creator: postData.creator,
          body: postData.body
        })
      })
    },

    showPost(idPostToShow, creator) {
      if (creator === this.user.uid) {
        this.$router.push('/myposts/' + idPostToShow) // TODO MYPOSTS
      } else {
        this.$router.push('/posts/' + idPostToShow)
      }
    }
    /*,
    getDateWithFormat(date) {
     var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('es-ES')
    } */
  }
}
</script>
