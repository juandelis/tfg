<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm9 md7>
      <v-card>
        <br />
        <h1 align="center">USUARIOS</h1>

        <br />
        <hr />
        <br />

        <p>
          <label class="labelForm" for="name"> Nombre</label>
          <input v-model="name" type="search" name="nombre" />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <label class="labelForm" for="correo"> Correo</label>
          <input v-model="email" type="email" name="correo" size="30" />
        </p>

        <p>
          <input v-model="followed" type="radio" value="all" checked />
          Todos &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input v-model="followed" type="radio" value="followed" />
          Seguidos &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input v-model="followed" type="radio" value="notFollowed" />
          No seguidos
        </p>

        <v-btn @click="search()">
          BUSCAR
        </v-btn>

        <br />
        <br />

        <!--
        <hr />
        <br />
        <h3 align="center">USERS: &nbsp; {{ users }}</h3>
        <br />
        -->

        <hr />
        <br /><br />

        <div v-for="(user, i) in users" :key="i">
          <v-btn flat color="white" left round @click="showUser(user)">
            {{ i + 1 }} -&nbsp;{{ user.name }}&nbsp; --- &nbsp;{{ user.email }}
          </v-btn>
          <v-btn
            v-if="user.followed"
            color="orange"
            outline
            round
            left
            @click="unfollow_user(user.uid, i)"
          >
            DEJAR DE SEGUIR
          </v-btn>
          <v-btn
            v-else
            color="green"
            outline
            round
            left
            @click="follow_user(user.uid, i)"
          >
            SEGUIR
          </v-btn>
          <br /><br />
        </div>

        <br />
      </v-card>
      <br />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { db } from '~/services/fireinit'

export default {
  data() {
    return {
      name: '',
      email: '',
      followed: 'all',
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
    ...mapActions('user', ['follow', 'unfollow', 'showUser']),
    ...mapMutations('user', ['updateUserToShow']),

    async search() {
      this.users = []
      const usersSnapshot = await db.collection('accounts').get()
      const userLogged = this.user

      if (this.followed === 'all') {
        usersSnapshot.forEach(userDoc => {
          const userData = userDoc.data()
          if (
            userDoc.id !== userLogged.uid &&
            userData.name.includes(this.name) &&
            userData.email.includes(this.email)
          ) {
            this.users.push({
              uid: userDoc.id,
              name: userData.name,
              email: userData.email,
              followed: userLogged.following.includes(userDoc.id)
            })
          }
        })
      } else {
        const followedFilter = this.followed === 'followed'
        usersSnapshot.forEach(userDoc => {
          const userData = userDoc.data()
          if (
            userDoc.id !== userLogged.uid &&
            userData.name.includes(this.name) &&
            userData.email.includes(this.email) &&
            userLogged.following.includes(userDoc.id) === followedFilter
          ) {
            this.users.push({
              uid: userDoc.id,
              name: userData.name,
              email: userData.email,
              followed: followedFilter
            })
          }
        })
      }
      /* this.getUsers()
      console.log('Users: ' + this.users)
      this.users = this.users.filter(item => item.name === this.name)
      console.log('Users: ' + this.users) */
    },

    follow_user(idUserToFollow, index) {
      // follow method in user.js (store)
      this.follow(idUserToFollow)

      // Update users array (here in default.data) to change the view
      this.users[index].followed = true
    },

    unfollow_user(idUserToUnfollow, index) {
      // unfollow method in user.js (store)
      this.unfollow(idUserToUnfollow)

      // Update users array (here in default.data) to see changes
      this.users[index].followed = false
    },

    async getUsers() {
      this.users = []
      const usersSnapshot = await db.collection('accounts').get()
      const userLogged = this.user
      usersSnapshot.forEach(userDoc => {
        const userData = userDoc.data()
        if (userDoc.id !== userLogged.uid) {
          this.users.push({
            uid: userDoc.id,
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
