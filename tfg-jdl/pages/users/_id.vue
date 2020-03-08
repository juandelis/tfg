<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm9 md8 lg7>
      <v-card>
        <h1 align="center">{{ userToShow.name }}</h1>
        <hr />
        <br />
        <v-layout row>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <v-flex>
            <h3 align="left">CORREO: &nbsp; {{ userToShow.email }}</h3>
            <br />
            <h3 align="left">FECHA NACIMIENTO: &nbsp;{{ userToShow.birth }}</h3>
            <br />
            <h3 align="left">GENERO: &nbsp; {{ userToShow.genre }}</h3>
            <br />
            <h3 align="left">BIOGRAFÍA / AFICIONES: &nbsp;</h3>
            <h4 align="left" style="max-width: 90%; font-weight: normal">
              {{ userToShow.info }}
            </h4>

            <br />
          </v-flex>
          <v-flex>
            <img
              :src="userToShow.image"
              alt="User profile photo"
              width="200px"
              height="240px"
            />
          </v-flex>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </v-layout>

        <v-btn
          v-if="userToShow.followed"
          color="orange"
          outline
          round
          left
          @click="unfollow_aux(userToShow.id)"
        >
          DEJAR DE SEGUIR
        </v-btn>
        <v-btn
          v-else
          color="green"
          outline
          round
          left
          @click="follow_aux(userToShow.id)"
        >
          SEGUIR
        </v-btn>

        <br /><br />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      followers: [],
      following: [],
      showUsers: false
    }
  },

  middleware: 'autenticado',

  computed: {
    ...mapState('user', ['user']),
    ...mapState('userToShow', ['userToShow'])
  },

  mounted: function() {
    this.startListeningToUserToShow(this.$route.params.id)
  },

  beforeDestroy: function() {
    this.stopListeningToUserToShow()
  },

  methods: {
    ...mapActions('user', ['unfollow', 'follow', 'showUser']),
    ...mapActions('userToShow', [
      'startListeningToUserToShow',
      'stopListeningToUserToShow'
    ]),

    follow_aux(idUserToFollow) {
      // follow method in user.js (store)
      this.follow(idUserToFollow)
    },

    unfollow_aux(idUserToUnfollow) {
      // unfollow method in user.js (store)
      this.unfollow(idUserToUnfollow)
    }
  }
}
</script>
