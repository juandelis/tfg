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
            @input="searchPosts({ creator: creator, date: date, type: type })"
          />
          <br /><br />
          <label class="labelForm" for="date"> Fecha: </label> &nbsp;
          <input
            v-model="date"
            type="date"
            name="date"
            @input="searchPosts({ creator: creator, date: date, type: type })"
          />
          <br /><br />
        </p>
        <p>
          <input
            v-model="type"
            type="radio"
            value="all"
            @input="searchPosts({ creator: creator, date: date, type: 'all' })"
          />
          Todas &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            v-model="type"
            type="radio"
            value="liked"
            @input="
              searchPosts({ creator: creator, date: date, type: 'liked' })
            "
          />
          Me gustan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            v-model="type"
            type="radio"
            value="disliked"
            @input="
              searchPosts({
                creator: creator,
                date: date,
                type: 'disliked'
              })
            "
          />
          No me gustan
        </p>
        <!--<br /><br />
          <v-btn @click="searchPosts({ creator: creator, date: date })">
            BUSCAR
          </v-btn>-->
        <br />
      </v-card>

      <br />

      <div v-for="(post, i) in posts" :key="i">
        <v-card>
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
          <v-card-text>
            {{ post.body }}
          </v-card-text>
          <v-card-title>
            <v-spacer /><v-spacer /><v-spacer /><v-spacer /><v-spacer /><v-spacer /><v-spacer />
            <v-card>
              &nbsp;&nbsp;&nbsp;&nbsp; {{ post.num_likes }}
              <v-btn v-if="!post.liked" icon @click="like(post.id)">
                <v-icon>thumb_up</v-icon>
              </v-btn>
              <v-btn v-else color="#878787" icon @click="unlike(post.id)">
                <v-icon>thumb_up</v-icon>
              </v-btn>
            </v-card>
            <v-spacer />
            <v-card>
              &nbsp;&nbsp;&nbsp;&nbsp; {{ post.num_dislikes }}
              <v-btn v-if="!post.disliked" icon @click="dislike(post.id)">
                <v-icon>thumb_down</v-icon>
              </v-btn>
              <v-btn v-else color="#878787" icon @click="undislike(post.id)">
                <v-icon>thumb_down</v-icon>
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
    type: 'all'
  }),

  middleware: 'autenticado',

  computed: {
    ...mapState('user', ['user']),
    ...mapState('posts', ['posts'])
  },

  mounted: function() {
    this.startListeningToPosts({
      creator: this.creator,
      date: this.date,
      type: this.type
    })
  },

  beforeDestroy: function() {
    this.stopListeningToPosts()
  },

  methods: {
    ...mapActions('user', ['showUser']),
    ...mapActions('posts', [
      'startListeningToPosts',
      'stopListeningToPosts',
      'searchPosts',
      'like',
      'dislike',
      'unlike',
      'undislike'
    ])
  }
}
</script>
