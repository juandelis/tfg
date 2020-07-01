<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs11 sm9 md7>
      <v-card>
        <v-layout>
          <v-spacer />
          <h1>{{ user.name }}</h1>
          <v-spacer />
          <v-btn icon nuxt to="/account/delete">
            <v-icon>delete_forever</v-icon>
          </v-btn>
        </v-layout>
        <hr />
        <br />
        <v-layout align-center :column="$vuetify.breakpoint.xs">
          <v-spacer />&nbsp;
          <v-flex shrink>
            <v-card max-width="200px">
              <img :src="user.image" alt="User profile photo" width="90%" />
              <br />
              <input
                ref="fileInput"
                type="file"
                style="display:none"
                accept="image/*"
                @change="onFileChange"
              />
              <v-btn nuxt @click="click_fileInput()">
                CAMBIAR AVATAR
              </v-btn>
              <br />
              <v-btn nuxt @click="deleteUserImage()">
                QUITAR AVATAR
              </v-btn>
            </v-card>
          </v-flex>
          <v-spacer />
          <br /><br />
          <v-flex v-if="provider == 'password'" shrink>
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
          <v-flex v-else-if="provider == 'google.com'" shrink>
            <br /><br />
            No puede cambiar la contraseña pues ha iniciado sesión con Google
            <br /><br />
            Acceda a su cuenta de Google para cambiar su contraseña ahí
            <br /><br />
            <v-btn nuxt disabled>
              CAMBIAR CONTRASEÑA
            </v-btn>
          </v-flex>
          <v-flex v-else shrink>
            <br /><br />
            Proveedor de autenticación no detectado
            <br /><br />
          </v-flex>
          <v-spacer />
        </v-layout>

        <br />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import firebase, { getCurrentUser } from '~/services/fireinit'
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
  },
  methods: {
    ...mapActions('user', ['updateUserImage', 'deleteUserImage']),

    async getProvider() {
      const user = await getCurrentUser()
      if (user != null) this.provider = user.providerData[0].providerId
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
    onFileChange(event) {
      const files = event.target.files
      const newFile = files[0]
      if (newFile) {
        const fileType = newFile.type
        if (
          fileType.localeCompare('image/png') === 0 ||
          fileType.localeCompare('image/jpg') === 0 ||
          fileType.localeCompare('image/jpeg') === 0
        )
          return this.updateUserImage(newFile)
        else alert('Invalid type file! ')
      }
    }
  }
}
</script>
