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
          <div v-if="user.followed">
            {{ i + 1 }} - NOMBRE: {{ user.name }} -- CORREO: {{ user.email }}
            <v-btn
              color="orange"
              outline
              round
              nuxt
              @click="unfollow1(user.id, i)"
            >
              DEJAR DE SEGUIR
            </v-btn>
          </div>
          <div v-else>
            {{ i + 1 }} - NOMBRE: {{ user.name }} -- CORREO: {{ user.email }}
            <v-btn
              color="green"
              outline
              round
              flat
              @click="follow1(user.id, i)"
            >
              SEGUIR
            </v-btn>
          </div>
        </div>
        <br />
      </v-card>
      <br />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { db, getCurrentUser } from '~/services/fireinit'

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
    follow1(id, index) {
      // follow method in user.js
      this.follow(id)
      // Update users array (here in default.data) to see changes
      this.users[index].followed = true
      const newUser = this.users[index]
      this.users.splice(index, 1, newUser)
    },
    unfollow1(id, index) {
      // unfollow method in user.js
      this.unfollow(id)
      // Update users array (here in default.data) to see changes
      this.users[index].followed = false
      const newUser = this.users[index]
      this.users.splice(index, 1, newUser)
    },
    async getUsers() {
      const usersSnapshot = await db.collection('accounts').get()
      const userLogged = await getCurrentUser()
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
