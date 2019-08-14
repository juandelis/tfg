<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm9 md7>
      <v-card>
        <h1 align="center">MI PERFIL</h1>

        <hr />
        <br />

        <v-layout row>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <v-flex grow>
            <h3 align="left">NOMBRE: &nbsp; {{ user.name }}</h3>
            <br />
            <h3 align="left">FECHA NACIMIENTO: &nbsp; {{ user.birth }}</h3>
            <br />
            <h3 align="left">GENERO: &nbsp; {{ user.genre }}</h3>
            <br />
            <h3 align="left">
              DESCRIPCIÓN PERSONAL / AFICIONES: &nbsp;
            </h3>
            <h4 align="left" style="max-width: 325px">
              {{ user.info }} &nbsp;
            </h4>
            <br />
            <v-btn nuxt to="/account/edit">
              EDITAR
            </v-btn>
            <v-btn nuxt to="/account/password">
              CAMBIAR CONTRASEÑA
            </v-btn>
          </v-flex>
          <v-flex shrink>
            <v-card min-width="220px">
              <img
                :src="user.image"
                alt="User profile photo"
                width="200px"
                height="240px"
              />
              <br />
              <v-btn nuxt @click="click_fileInput()">
                CAMBIAR IMAGEN PERFIL
              </v-btn>
              <input
                ref="fileInput"
                type="file"
                style="display:none"
                accept="image/*"
                @change="onFileChange"
              />
            </v-card>
          </v-flex>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </v-layout>

        <br />
      </v-card>

      <br /><br />

      <v-card>
        <br />
        <h1 align="center">SEGUIDORES ( {{ followers.length }} )</h1>
        <hr />
        <br />
        <div v-for="(follower, i) in followers" :key="i">
          {{ i + 1 }} -&nbsp; {{ follower.name }} &nbsp; --- &nbsp;
          {{ follower.email }}
        </div>
        <br />
      </v-card>

      <br /><br />

      <v-card>
        <br />
        <h1 align="center">SEGUIDOS ( {{ following.length }} )</h1>
        <hr />
        <br />
        <div v-for="(followed, j) in following" :key="j">
          {{ j + 1 }} -&nbsp; {{ followed.name }} &nbsp; --- &nbsp;
          {{ followed.email }}
          <v-btn
            color="orange"
            outline
            round
            left
            @click="unfollowUser(followed.id, j)"
          >
            DEJAR DE SEGUIR
          </v-btn>
        </div>
        <br />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { db, storage } from '~/services/fireinit'

export default {
  data() {
    return {
      followers: [],
      following: []
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
    ...mapActions('user', ['updateUserImage', 'unfollow']),

    async getUsers() {
      const usersSnapshot = await db.collection('accounts').get()
      usersSnapshot.forEach(eachUserDoc => {
        const eachUserData = eachUserDoc.data()
        if (eachUserDoc.id !== this.user.uid) {
          if (this.user.following.includes(eachUserDoc.id)) {
            this.following.push({
              id: eachUserDoc.id,
              name: eachUserData.name,
              email: eachUserData.email
            })
          }
          if (this.user.followers.includes(eachUserDoc.id)) {
            this.followers.push({
              id: eachUserDoc.id,
              name: eachUserData.name,
              email: eachUserData.email
            })
          }
        }
      })
    },

    unfollowUser(idUserToUnfollow, index) {
      // unfollow method in user.js (store)
      this.unfollow(idUserToUnfollow)

      // Remove user from following array (here in default.data) to see changes
      this.following.splice(index, 1)
    },

    click_fileInput() {
      this.$refs.fileInput.click()
    },

    updateImage(newImage) {
      this.updateUserImage(newImage)
    },

    async onFileChange(event) {
      const files = event.target.files
      const newImage = files[0]

      const filename = newImage.name
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Invalid type file! ')
      }

      const storageRef = storage.ref('profileImages/' + this.user.uid)
      const snapshot = await storageRef.put(newImage)

      const downloadURL = await snapshot.ref.getDownloadURL()
      console.log('File available at', downloadURL)
      this.updateUserImage(downloadURL)
    }
  }
}
</script>
