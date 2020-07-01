<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm9 md6>
      <div class="pb-2" color="#404540">
        <v-card>
          <br />
          <h1 align="center">MIS PUBLICACIONES</h1>
          <br />
          <hr />
          <br />
          <p>
            <label for="text"> Texto: </label> &nbsp;
            <input
              id="text"
              v-model="text"
              type="search"
              size="30"
              @input="searchPosts({ text: text, date: date })"
            />
            <br /><br />
            <label for="date"> Fecha: </label> &nbsp;
            <input
              id="date"
              v-model="date"
              type="date"
              @input="searchPosts({ text: text, date: date })"
            />
          </p>
          <br />
        </v-card>
      </div>

      <div
        id="myposts"
        :style="{
          maxHeight:
            Math.max($vuetify.breakpoint.height - offsetTopMyPosts, 250) + 'px',
          overflowY: 'scroll'
        }"
      >
        <div v-for="(post, i) in posts" :key="i" style="padding: 10px">
          <v-card color="#505050">
            <v-card-title>
              <v-btn flat round nuxt to="/account">
                <v-icon>account_circle</v-icon>&nbsp;
                <span class="headline font-weight-bold">
                  {{ user.name }}
                </span>
              </v-btn>
              <v-spacer />
              {{ post.date }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </v-card-title>
            <v-card-text>
              {{ post.body }}
            </v-card-text>
            <v-card-title>
              <v-spacer /><v-spacer /><v-spacer /><v-spacer /><v-spacer /><v-spacer /><v-spacer />
              <v-card>
                &nbsp;&nbsp;&nbsp;&nbsp; {{ post.num_likes }}
                <v-btn disabled icon>
                  <v-icon>thumb_up</v-icon>
                </v-btn>
              </v-card>
              <v-spacer />
              <v-card>
                &nbsp;&nbsp;&nbsp;&nbsp; {{ post.num_dislikes }}
                <v-btn disabled icon>
                  <v-icon>thumb_down</v-icon>
                </v-btn>
                <v-spacer />
              </v-card>
              <v-spacer /><v-spacer /><v-spacer /><v-spacer />
              <v-btn icon @click="deletePostAux(post.id)">
                <v-icon>delete_forever</v-icon>
              </v-btn>
            </v-card-title>
          </v-card>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import functions from '~/assets/functions'

export default {
  data: () => ({
    text: '',
    date: '',
    offsetTopMyPosts: 0
  }),

  middleware: 'autenticado',

  computed: {
    ...mapState('user', ['user']),
    ...mapState('myPosts', ['posts'])
  },

  mounted: function() {
    // Recorremos todos los padres acumulando sus distancias hasta el top
    this.offsetTopMyPosts = 0
    let element = document.getElementById('myposts')
    while (element) {
      this.offsetTopMyPosts +=
        element.offsetTop - element.scrollTop + element.clientTop
      element = element.offsetParent
    }
    // Empezamos a escuchar cambios en mis publicaciones
    this.startListeningToPosts({ text: this.text, date: this.date })
  },

  beforeDestroy: function() {
    this.stopListeningToPosts()
  },

  methods: {
    ...mapActions('myPosts', [
      'startListeningToPosts',
      'stopListeningToPosts',
      'searchPosts'
    ]),

    deletePostAux(idPostToDelete) {
      functions.deletePost(idPostToDelete)
    }
  }
}
</script>
