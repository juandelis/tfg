<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm9 md8 lg7>
      <v-card>
        <h1 align="center">{{ userToShow.name }}</h1>
        <hr />
        <br />
        <v-layout row>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <v-flex grow>
            <h3 align="left">CORREO: &nbsp; {{ userToShow.email }}</h3>
            <br />
            <h3 align="left">FECHA NACIMIENTO: &nbsp;{{ userToShow.birth }}</h3>
            <br />
            <h3 align="left">GENERO: &nbsp; {{ userToShow.genre }}</h3>
            <br />
            <h3 align="left">BIOGRAFÍA / AFICIONES: &nbsp;</h3>
            <h4 align="left" style="max-width: 95%; font-weight: normal">
              {{ userToShow.info }}
            </h4>

            <br />

            <v-btn
              v-if="userToShow.followed"
              color="orange"
              outline
              round
              left
              @click="unfollow_aux(userToShow.uid)"
            >
              DEJAR DE SEGUIR
            </v-btn>
            <v-btn
              v-else
              color="green"
              outline
              round
              left
              @click="follow_aux(userToShow.uid)"
            >
              SEGUIR
            </v-btn>
          </v-flex>
        </v-layout>

        <br />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { db } from '~/services/fireinit'

export default {
  data() {
    return {
      userToShow: {
        uid: '',
        name: '',
        email: '',
        birth: '',
        genre: '',
        info: '',
        image: '',
        followed: false,
        followers: [],
        following: []
      },
      followers: [],
      following: [],
      showUsers: false
    }
  },

  middleware: 'autenticado',

  computed: {
    ...mapState('user', ['user'])
  },

  mounted: async function() {
    const idUserToShow = this.$route.params.id
    const docRef = await db.collection('accounts').doc(idUserToShow)
    const userDoc = await docRef.get()
    if (userDoc.exists) {
      const userData = userDoc.data()
      // Guardamos los datos de la publicacion
      this.userToShow.uid = userDoc.id
      this.userToShow.name = userData.name
      this.userToShow.email = userData.email
      this.userToShow.birth = userData.birth
      this.userToShow.genre = userData.genre
      this.userToShow.info = userData.info
      this.userToShow.image = userData.image
      this.userToShow.followed = this.user.following.includes(idUserToShow)
      this.userToShow.followers = userData.followers
      this.userToShow.following = userData.following
    }
  },

  methods: {
    ...mapActions('user', ['unfollow', 'follow', 'showUser']),
    ...mapMutations('user', ['updateUSerToShowFollowed']),

    follow_aux(idUserToFollow) {
      // follow method in user.js (store)
      this.follow(idUserToFollow)
      // Update userToShow info (here in default.data) to change the view
      this.userToShow.followed = true
    },

    unfollow_aux(idUserToUnfollow) {
      // unfollow method in user.js (store)
      this.unfollow(idUserToUnfollow)
      // Update userToShow info (here in default.data) to change the view
      this.userToShow.followed = false
    }
  }
}
</script>
