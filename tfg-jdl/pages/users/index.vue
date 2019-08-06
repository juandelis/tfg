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
            @click="unfollow(user.id, i)"
          >
            DEJAR DE SEGUIR
          </v-btn>
          <v-btn
            v-else
            color="green"
            outline
            round
            left
            @click="follow(user.id, i)"
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
import { mapState } from 'vuex'
import { db, getCurrentUser } from '~/services/fireinit'
import { firestore } from 'firebase'

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
    async follow(idUserToFollow, index) {
      // UserLogged starts following UserToFollow
      const userLogged = this.user // Get actual user
      if (userLogged) {
        // Add userToFollow to followed array of userLogged
        const docRef = await db.collection('accounts').doc(userLogged.uid)
        docRef.update({
          followed: firestore.FieldValue.arrayUnion(idUserToFollow)
        })
        // Add userLogged to followers array of userToFollow
        const docRef2 = await db.collection('accounts').doc(idUserToFollow)
        docRef2.update({
          followers: firestore.FieldValue.arrayUnion(userLogged.uid)
        })
      }
      // Update users array (here in default.data) to change the view
      this.users[index].followed = true
      const newUser = this.users[index]
      this.users.splice(index, 1, newUser)
    },
    async unfollow(idUserToUnfollow, index) {
      // const admin = require('firebase-admin')
      const userLogged = await getCurrentUser() // Obtiene el usuario actual
      if (userLogged) {
        // Remove idUserToUnfollow from followed array of userLogged
        const docRef = await db.collection('accounts').doc(userLogged.uid)
        docRef.update({
          followed: firestore.FieldValue.arrayRemove(idUserToUnfollow)
        })
        // Remove userLogged from followers array of idUserToUnfollow
        const docRef2 = await db.collection('accounts').doc(idUserToUnfollow)
        docRef2.update({
          followers: firestore.FieldValue.arrayRemove(userLogged.uid)
        })
      }
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
