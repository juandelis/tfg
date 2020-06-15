<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm9 md7 lg8>
      <v-card>
        <h1 align="center">MI PERFIL - {{ user.name }}</h1>
        <hr />
        <br />
        <v-layout>
          <v-spacer />
          <v-flex shrink>
            <v-card min-width="160px">
              <img
                :src="user.image"
                alt="User profile photo"
                width="150px"
                height="180px"
              />
              <br />
              <v-btn nuxt @click="click_fileInput()">
                CAMBIAR AVATAR
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
          <v-spacer />
          <v-flex v-if="provider == 'password'" shrink>
            <br />
            <form
              id="passwordForm"
              method="post"
              @submit.prevent="update_password()"
            >
              <p>
                <label class="labelForm" for="name">Antigua contraseña</label>
                <input
                  id="oldPassword"
                  ref="oldPassword"
                  type="password"
                  name="oldPassword"
                  size="25"
                  minlength="6"
                  required
                />
              </p>

              <p>
                <label class="labelForm" for="name">Nueva contraseña</label>
                <input
                  id="password"
                  ref="password"
                  type="password"
                  name="password"
                  size="25"
                  minlength="6"
                  required
                />
              </p>

              <p>
                <label class="labelForm" for="name">Repetir contraseña</label>
                <input
                  id="password2"
                  ref="password2"
                  type="password"
                  name="password2"
                  size="25"
                  minlength="6"
                  required
                />
              </p>

              <p>
                <input
                  id="button_password"
                  ref="submit_passwordForm"
                  type="submit"
                  value=" ACEPTAR "
                  style="display:none"
                />
                <v-btn nuxt @click="click_submit()">
                  CAMBIAR CONTRASEÑA
                </v-btn>
              </p>
            </form>
          </v-flex>
          <v-flex v-if="provider == 'google.com'" shrink>
            <br /><br />
            No puede cambiar la contraseña pues ha iniciado sesión con Google
            <br /><br />
            Acceda a su cuenta de Google para cambiar su contraseña ahí
            <br /><br />
            <v-btn nuxt disabled>
              CAMBIAR CONTRASEÑA
            </v-btn>
          </v-flex>
          <v-spacer />
        </v-layout>

        <br />
      </v-card>

      <br /><br />

      <v-layout row justify-center>
        <v-flex grow>
          <v-card>
            <h1 align="center">SEGUIDORES ( {{ followers.length }} )</h1>
            <hr />
            <br />
            <div v-for="(follower, i) in followers" :key="i">
              <v-btn flat color="white" round @click="showUser(follower.uid)">
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
              <v-btn flat color="white" round @click="showUser(followed.uid)">
                {{ j + 1 }} -&nbsp;{{ followed.name }}&nbsp; --- &nbsp;
                {{ followed.email }}
              </v-btn>
              <v-btn
                color="orange"
                outline
                round
                @click="unfollowUser(followed.uid, j)"
              >
                DEJAR DE SEGUIR
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
import firebase, { db, storage, getCurrentUser } from '~/services/fireinit'
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      followers: [],
      following: [],
      provider: ''
    }
  },
  middleware: 'autenticado',
  computed: {
    ...mapState('user', ['user'])
  },
  mounted: function() {
    this.getProvider()
    this.getUsers()
  },
  methods: {
    ...mapActions('user', ['updateUserImage', 'unfollow', 'showUser']),

    async getProvider() {
      const user = await getCurrentUser()
      let providerAux = ''
      if (user != null) {
        user.providerData.forEach(function(profile) {
          console.log('Sign-in provider: ' + profile.providerId)
          console.log('  Provider-specific UID: ' + profile.uid)
          console.log('  Name: ' + profile.displayName)
          console.log('  Email: ' + profile.email)
          console.log('  Photo URL: ' + profile.photoURL)
          providerAux = profile.providerId
        })
        this.provider = providerAux
      }
    },

    async getUsers() {
      this.following = []
      for (const item of this.user.following) {
        console.log('User: ', item)
        const docUserFollowed = await db.doc('accounts/' + item).get()
        if (docUserFollowed.exists) {
          this.following.push({
            uid: docUserFollowed.id,
            name: docUserFollowed.data().name,
            email: docUserFollowed.data().email
          })
        }
      }
      this.followers = []
      for (const item of this.user.followers) {
        console.log('User: ', item)
        const docUserFollower = await db.doc('accounts/' + item).get()
        if (docUserFollower.exists) {
          this.followers.push({
            uid: docUserFollower.id,
            name: docUserFollower.data().name,
            email: docUserFollower.data().email
          })
        }
      }
    },

    unfollowUser(idUserToUnfollow, index) {
      // unfollow method in user.js (store)
      this.unfollow(idUserToUnfollow)

      // Remove user from following array (here in default.data) to see changes
      this.following.splice(index, 1)
    },

    click_submit() {
      this.$refs.submit_passwordForm.click()
    },

    async update_password() {
      const newPassword = this.$refs.password.value
      const newPassword2 = this.$refs.password2.value
      const oldPassword = this.$refs.oldPassword.value

      if (newPassword === newPassword2) {
        const user = await getCurrentUser()
        const email = user.email
        const credential = firebase.auth.EmailAuthProvider.credential(
          email,
          oldPassword
        )

        user
          .reauthenticateAndRetrieveDataWithCredential(credential)
          .then(function() {
            // User re-authenticated.
            user
              .updatePassword(newPassword)
              .then(function() {
                this.$router.push('/account')
                return alert(' Contraseña actualizada correctamente ')
              })
              .catch(function(error) {
                return alert('Error updating passsword:', error)
              })
          })
          .catch(function(error) {
            return alert('Antigua contraseña incorrecta. ', error)
          })
      } else {
        return alert(' Repite correctamente la nueva contraseña ')
      }
    },

    click_fileInput() {
      this.$refs.fileInput.click()
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
