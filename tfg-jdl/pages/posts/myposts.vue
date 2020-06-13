<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm9 md6>
      <v-card>
        <br />
        <h1 align="center">MIS PUBLICACIONES</h1>
        <br />
        <hr />
        <br />
        <p>
          <label class="labelForm"> Buscar: </label> &nbsp;
          <input
            v-model="text"
            type="search"
            size="40"
            @input="searchPosts({ text: text, date: date })"
          />
          <br /><br />
          <label class="labelForm"> Fecha: </label> &nbsp;
          <input
            v-model="date"
            type="date"
            @input="searchPosts({ text: text, date: date })"
          />
          <!--<br /><br />
          <v-btn @click="searchPosts({ creatorName: creator, date: date })">
            BUSCAR
          </v-btn>-->
        </p>
        <br />
      </v-card>

      <br />

      <div v-for="(post, i) in posts" :key="i">
        <v-card>
          <v-card-title>
            <v-btn flat round nuxt to="/account">
              <v-icon>account_circle</v-icon>&nbsp;
              <span class="headline font-weight-bold">
                {{ post.creatorName }}
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
            <v-btn icon @click="deletePost_aux(post.id)">
              <v-icon>delete_forever</v-icon>
            </v-btn>
          </v-card-title>
        </v-card>
        <br />
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
    date: ''
  }),

  middleware: 'autenticado',

  computed: {
    ...mapState('user', ['user']),
    ...mapState('myPosts', ['posts'])
  },

  mounted: function() {
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

    deletePost_aux(idPostToDelete) {
      functions.deletePost(idPostToDelete)
    }
  }
}
</script>
