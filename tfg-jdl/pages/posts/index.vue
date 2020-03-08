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
          <input
            v-model="creator"
            type="search"
            name="creator"
            size="40"
            @input="searchPosts({ creatorName: creator, date: date })"
          />
          <br /><br />
          <label class="labelForm" for="date"> Fecha: </label> &nbsp;
          <input
            v-model="date"
            type="date"
            name="date"
            @input="searchPosts({ creatorName: creator, date: date })"
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
        <v-card dark>
          <v-card-title>
            <v-btn flat round @click="showUser(post.creatorId)">
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
            <v-spacer /><v-spacer /><v-spacer /><v-spacer /><v-spacer /><v-spacer /><v-spacer />
            <v-card color="">
              &nbsp;&nbsp;&nbsp;&nbsp; {{ post.num_dislikes }}
              <v-btn icon flat @click="like(post.creatorId)">
                <v-icon>thumb_down</v-icon>
              </v-btn>
            </v-card>
            <v-spacer />
            <v-card color="">
              &nbsp;&nbsp;&nbsp;&nbsp; {{ post.num_dislikes }}
              <v-btn icon flat @click="dislike(post.creatorId)">
                <v-icon>thumb_up</v-icon>
              </v-btn>
              <v-spacer />
            </v-card>
            <v-spacer /><v-spacer /><v-spacer /><v-spacer /><v-spacer /><v-spacer /><v-spacer />
          </v-card-title>
        </v-card>
        <br />
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data: () => ({
    creator: '',
    date: '',
    unsubscribe: null
  }),

  middleware: 'autenticado',

  computed: {
    ...mapState('user', ['user']),
    ...mapState('posts', ['posts'])
  },

  mounted: function() {
    this.startListeningToPosts({ creator: this.creator, date: this.date })
  },

  beforeDestroy: function() {
    this.stopListeningToPosts()
  },

  methods: {
    ...mapActions('user', ['showUser']),
    ...mapActions('posts', ['startListeningToPosts', 'stopListeningToPosts'])
    /*,
    getDateWithFormat(date) {
     var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('es-ES')
    } */
  }
}
</script>
