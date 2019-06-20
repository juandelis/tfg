<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs10 sm7 md5>
      <v-card>
        <br />
        <h1 align="center">CAMBIAR CONTRASEÑA</h1>
        <br />

        <hr />
        <br />

        <form
          id="passwordform"
          method="post"
          target="_self"
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
              ref="submitForm"
              type="submit"
              value=" ACEPTAR "
              style="display:none"
            />
            <v-btn nuxt @click="click_submit()">
              ACEPTAR
            </v-btn>
            <v-btn nuxt to="/account">
              VOLVER
            </v-btn>
          </p>
        </form>

        <br />
      </v-card>

      <br />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import firebase, { getCurrentUser } from '~/services/fireinit'

export default {
  data: () => ({}),
  middleware: 'autenticado',
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    ...mapActions('user', ['updateAccount', 'updateUserImage']),
    click_submit() {
      this.$refs.submitForm.click()
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
                console.log('PASSWORD UPDATED CORRECTLY')
              })
              .catch(function(error) {
                return alert('Error updating passsword:', error)
              })
          })
          .catch(function(error) {
            return alert('Error reauthenticating:', error)
          })
      } else {
        return alert(' Repite correctamente la nueva contraseña ')
      }

      this.$router.push('/account')
    }
  }
}
</script>
