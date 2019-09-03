<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm9 md8 lg7>
      <v-card>
        <h1 align="center">NOMBRE: &nbsp; {{ userToShow.name }}</h1>
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
            <h3 align="left">
              DESCRIPCIÓN PERSONAL / AFICIONES: &nbsp;
            </h3>
            <h4 align="left" style="max-width: 400px">
              {{ userToShow.info }}
            </h4>
            <br />

            <v-btn
              v-if="userToShow.followed"
              color="orange"
              outline
              round
              left
              @click="unfollow_user(userToShow.uid)"
            >
              DEJAR DE SEGUIR
            </v-btn>
            <v-btn
              v-else
              color="green"
              outline
              round
              left
              @click="follow_user(userToShow.uid)"
            >
              SEGUIR
            </v-btn>
            <br /><br />

            <v-btn v-show="!showUsers" @click="show_users()">
              MOSTRAR SEGUIDORES/SEGUIDOS
            </v-btn>
            <v-btn v-show="showUsers" @click="unshow_users()">
              OCULTAR SEGUIDORES/SEGUIDOS
            </v-btn>
          </v-flex>
          <v-flex shrink>
            <v-card min-width="220px">
              <img
                :src="userToShow.image"
                alt="User profile photo"
                width="200px"
                height="240px"
              />
              <br />
            </v-card>
          </v-flex>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </v-layout>

        <br />
      </v-card>

      <br /><br />

      <v-layout v-show="showUsers" row justify-center>
        <v-flex grow>
          <v-card>
            <h1 align="center">SEGUIDORES ( {{ followers.length }} )</h1>
            <hr />
            <br />
            <div v-for="(follower, i) in followers" :key="i">
              <v-btn flat color="white" round @click="show_user(follower)">
                {{ i + 1 }} -&nbsp;{{ follower.name }}&nbsp; --- &nbsp;
                {{ follower.email }}
              </v-btn>
            </div>
            <br />
          </v-card>
        </v-flex>

        &nbsp;&nbsp;&nbsp;&nbsp;

        <v-flex grow>
          <v-card>
            <h1 align="center">SEGUIDOS ( {{ following.length }} )</h1>
            <hr />
            <br />
            <div v-for="(followed, j) in following" :key="j">
              <v-btn flat color="white" round @click="show_user(followed)">
                {{ j + 1 }} -&nbsp;{{ followed.name }}&nbsp; --- &nbsp;
                {{ followed.email }}
              </v-btn>
            </div>
            <br />
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { db } from '~/services/fireinit'

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
    ...mapState('user', ['userToShow', 'user'])
  },
  methods: {
    ...mapActions('user', ['unfollow', 'follow', 'showUser']),
    ...mapMutations('user', ['updateUSerToShowFollowed']),

    follow_user(idUserToFollow) {
      // follow method in user.js (store)
      this.follow(idUserToFollow)

      // Add user logged to followers array (of user visited)
      this.followers.push({
        uid: this.user.uid,
        name: this.user.name,
        email: this.user.email,
        followed: false
      })

      // Update userToShow.followed at the store (user.js) to change button follow/unfollow
      this.updateUSerToShowFollowed(true)
    },

    unfollow_user(idUserToUnfollow) {
      // unfollow method in user.js (store)
      this.unfollow(idUserToUnfollow)

      this.followers = this.followers.filter(item => item.uid !== this.user.uid)

      // Update userToShow.followed at the store (user.js) to change button follow/unfollow
      this.updateUSerToShowFollowed(false)
    },

    async getUsers() {
      this.followers = []
      this.following = []
      const usersSnapshot = await db.collection('accounts').get()
      const userLogged = this.user
      usersSnapshot.forEach(eachUserDoc => {
        const eachUserData = eachUserDoc.data()
        if (eachUserDoc.id !== this.userToShow.uid) {
          if (this.userToShow.following.includes(eachUserDoc.id)) {
            this.following.push({
              uid: eachUserDoc.id,
              name: eachUserData.name,
              email: eachUserData.email,
              followed: userLogged.following.includes(eachUserDoc.id)
            })
          }
          if (this.userToShow.followers.includes(eachUserDoc.id)) {
            this.followers.push({
              uid: eachUserDoc.id,
              name: eachUserData.name,
              email: eachUserData.email,
              followed: userLogged.following.includes(eachUserDoc.id)
            })
          }
        }
      })
    },

    show_user(idUserToShow) {
      this.followers = []
      this.following = []
      this.showUsers = false
      this.showUser(idUserToShow)
    },

    show_users() {
      this.getUsers()
      this.showUsers = true
    },

    unshow_users() {
      this.followers = []
      this.following = []
      this.showUsers = false
    }
  }
}
</script>
