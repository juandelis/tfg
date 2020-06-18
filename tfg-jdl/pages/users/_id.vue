<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm9 md8 lg7>
      <v-card>
        <br />
        <v-layout row>
          <v-spacer />
          <v-flex>
            <img
              :src="userToShow.image"
              alt="User avatar"
              width="120px"
              height="144px"
              style="border-radius:30%"
            />
          </v-flex>
          <v-spacer />
          <v-flex>
            <br />
            <h1>{{ userToShow.name }}</h1>
            <br />
            <v-btn
              v-if="user.following.includes(userToShow.id)"
              color="orange"
              outline
              round
              large
              @click="unfollow(userToShow.id)"
            >
              DEJAR DE SEGUIR
            </v-btn>
            <v-btn
              v-else
              color="green"
              outline
              round
              large
              @click="follow(userToShow.id)"
            >
              SEGUIR
            </v-btn>
          </v-flex>
          <v-spacer />
        </v-layout>
        <br />
      </v-card>

      <br />

      <v-card>
        <br />
        <h1 align="center">SUS PUBLICACIONES</h1>
        <br />
        <hr />
        <br />
        <p>
          <input
            v-model="type"
            type="radio"
            value="all"
            @input="searchPosts({ date: date, type: 'all' })"
          />
          Todas &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            v-model="type"
            type="radio"
            value="liked"
            @input="searchPosts({ date: date, type: 'liked' })"
          />
          Me gustan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            v-model="type"
            type="radio"
            value="disliked"
            @input="searchPosts({ date: date, type: 'disliked' })"
          />
          No me gustan &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            v-model="type"
            type="radio"
            value="notValued"
            @input="searchPosts({ date: date, type: 'notValued' })"
          />
          Sin valorar
        </p>
        <p>
          <label for="date"> Fecha: </label> &nbsp;
          <input
            v-model="date"
            type="date"
            name="date"
            @input="searchPosts({ date: date, type: type })"
          />
          <br />
        </p>
        <hr />
        <div v-for="(post, i) in posts" :key="i">
          <br />
          <v-card elevation="10" color="#444444">
            <v-card-title>
              <v-btn flat round>
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
                <v-btn
                  v-if="!post.liked"
                  icon
                  @click="like({ postId: post.id, disliked: post.disliked })"
                >
                  <v-icon>thumb_up</v-icon>
                </v-btn>
                <v-btn v-else color="#878787" icon @click="unlike(post.id)">
                  <v-icon>thumb_up</v-icon>
                </v-btn>
              </v-card>
              <v-spacer />
              <v-card>
                &nbsp;&nbsp;&nbsp;&nbsp; {{ post.num_dislikes }}
                <v-btn
                  v-if="!post.disliked"
                  icon
                  @click="dislike({ postId: post.id, liked: post.liked })"
                >
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
        </div>
        <br />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      // TODO: dejar fecha de hoy
      // date: new Date().toISOString().substr(0, 10),
      date: '',
      type: 'all'
    }
  },

  middleware: 'autenticado',

  computed: {
    ...mapState('user', ['user']),
    ...mapState('userToShow', ['userToShow']),
    ...mapState('posts', ['posts'])
  },

  mounted: function() {
    this.startListeningToUserToShow(this.$route.params.id)
    this.startListeningToPosts({
      creatorId: this.$route.params.id,
      date: this.date,
      type: this.type
    })
  },

  beforeDestroy: function() {
    this.stopListeningToUserToShow()
    this.stopListeningToPosts()
  },

  methods: {
    ...mapActions('user', ['unfollow', 'follow', 'showUser']),
    ...mapActions('userToShow', [
      'startListeningToUserToShow',
      'stopListeningToUserToShow'
    ]),
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
