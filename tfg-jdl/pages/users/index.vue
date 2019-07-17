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

        <hr />
        <br />

        <h3 align="center">USERS: &nbsp; {{ users }}</h3>

        <br />
        <hr />
        <br />

        <v-list v-for="(user, i) in users" :key="i">
          <div v-if="user.followed">
            {{ i + 1 }} - NOMBRE: {{ user.name }} -- CORREO: {{ user.email }}
            <v-btn color="red" flat nuxt @click="unfollow()">
              DEJAR DE SEGUIR
            </v-btn>
          </div>
          <div v-else>
            {{ i + 1 }} - NOMBRE: {{ user.name }} -- CORREO: {{ user.email }}
            <v-btn color="green" flat @click="follow()">
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
import { mapState } from 'vuex'
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
    async getUsers() {
      const usersSnapshot = await db.collection('accounts').get()
      usersSnapshot.forEach(userDoc => {
        const user = userDoc.data()
        console.log('userDoc: ' + userDoc.id)
        // TODO mirar si le sigue o no -> followed: true/false
        this.users.push({ name: user.name, email: user.email, followed: true })
        // console.log('Usuario: ' + user.email)
      })
    }
  }
}
</script>
