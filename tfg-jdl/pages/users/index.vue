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

        <v-list v-for="(user, i) in users" :key="i">
          <div v-if="user.followed">
            {{ i + 1 }} - NOMBRE: {{ user.name }} -- CORREO: {{ user.email }}
            <v-btn color="orange" outline round nuxt @click="unfollow()">
              DEJAR DE SEGUIR
            </v-btn>
          </div>
          <div v-else>
            {{ i + 1 }} - NOMBRE: {{ user.name }} -- CORREO: {{ user.email }}
            <v-btn color="green" flat @click="follow(user.id)">
              SEGUIR
            </v-btn>
          </div>
        </v-list>
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
    ...mapActions('user', ['follow']),
    async getUsers() {
      const usersSnapshot = await db.collection('accounts').get()
      const userLogged = await getCurrentUser()
      usersSnapshot.forEach(userDoc => {
        const user = userDoc.data()
        console.log('user: ' + userDoc.id)
        console.log('user logged: ' + userLogged.uid)
        // TODO mirar si le sigue o no -> followed: true/false
        if (userDoc.id !== userLogged.uid) {
          this.users.push({
            id: userDoc.id,
            name: user.name,
            email: user.email,
            followed: false
          })
          // console.log('Usuario: ' + user.email)
        }
      })
    }
  }
}
</script>
