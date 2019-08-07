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
      {{ this.user.followed }}
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
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
    ...mapMutations('user', ['addFollowed', 'removeFollowed']),
    ...mapActions('user', ['follow', 'unfollow']),

    followUser(idUserToFollow, index) {
      // follow method in user.js (store)
      this.follow(idUserToFollow)
      // Update store
      this.addFollowed(idUserToFollow)

      // Update users array (here in default.data) to change the view
      this.users[index].followed = true
      const newUser = this.users[index]
      this.users.splice(index, 1, newUser)
    },

    unfollowUser(idUserToUnfollow, index) {
      // follow method in user.js (store)
      this.unfollow(idUserToUnfollow)
      // Update store
      this.removeFollowed(idUserToUnfollow)

      // Update users array (here in default.data) to see changes
      this.users[index].followed = false
      const newUser = this.users[index]
      this.users.splice(index, 1, newUser)
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
            followed: userData.followers.includes(userLogged.uid)
          })
          // console.log('Usuario: ' + user.email)
        }
      })
    }
  }
}
</script>
