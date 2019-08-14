<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm9 md7>
      <v-card>
        <br />
        <h1 align="center">BUSCADOR</h1>
        <br />

        <hr />
        <br />
      </v-card>

      <br /><br />

      <v-card ml-4>
        <br />
        <h1 align="center">USUARIOS</h1>
        <br />

        <!--
        <hr />
        <br />
        <h3 align="center">USERS: &nbsp; {{ users }}</h3>
        <br />
        -->

        <hr />
        <br />

        <div v-for="(user, i) in users" :key="i">
          {{ i + 1 }} -&nbsp; {{ user.name }} &nbsp; --- &nbsp; {{ user.email }}
          <v-btn
            v-if="user.followed"
            color="orange"
            outline
            round
            left
            @click="unfollowUser(user.id, i)"
          >
            DEJAR DE SEGUIR
          </v-btn>
          <v-btn
            v-else
            color="green"
            outline
            round
            left
            @click="followUser(user.id, i)"
          >
            SEGUIR
          </v-btn>
        </div>

        <br />
      </v-card>
      <br />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { db } from '~/services/fireinit'

export default {
  data() {
    return {
      users: []
    }
  },
  middleware: 'autenticado',
  computed: {
    ...mapState('user', ['user'])
  },
  mounted: function() {
    this.getUsers()
  },
  methods: {
    ...mapActions('user', ['follow', 'unfollow']),

    followUser(idUserToFollow, index) {
      // follow method in user.js (store)
      this.follow(idUserToFollow)

      // Update users array (here in default.data) to change the view
      this.users[index].followed = true
    },

    unfollowUser(idUserToUnfollow, index) {
      // unfollow method in user.js (store)
      this.unfollow(idUserToUnfollow)

      // Update users array (here in default.data) to see changes
      this.users[index].followed = false
    },

    async getUsers() {
      const usersSnapshot = await db.collection('accounts').get()
      const userLogged = this.user
      usersSnapshot.forEach(userDoc => {
        const userData = userDoc.data()
        if (userDoc.id !== userLogged.uid) {
          this.users.push({
            id: userDoc.id,
            name: userData.name,
            email: userData.email,
            followed: userLogged.following.includes(userDoc.id)
          })
          // console.log('Usuario: ' + user.email)
        }
      })
    }
  }
}
</script>
