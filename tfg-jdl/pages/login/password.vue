<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm8 md6>
      <v-card>
        <br />
        <h1 align="center">RECUPERAR CONTRASEÑA</h1>
        <br />

        <hr />
        <br />

        <form
          id="recover_passwordForm"
          method="post"
          target="_self"
          @submit.prevent="recover_password()"
        >
          <p>
            <label class="labelForm" for="name">Correo electrónico</label>
            <input ref="email_recovery" type="email" name="correo" required />
          </p>
          <p>
            <input
              id="button_recover_password"
              ref="submit_recover_passwordForm"
              type="submit"
              value=" ACEPTAR "
              style="display:none"
            />
            <v-btn nuxt @click="click_submit()">
              ENVIAR
            </v-btn>
            <v-btn nuxt to="/login">
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
import { auth } from '~/services/fireinit'

export default {
  data: () => ({}),
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    ...mapActions('user', ['updateAccount', 'updateUserImage']),
    click_submit() {
      this.$refs.submit_recover_passwordForm.click()
    },
    async recover_password() {
      await auth
        .sendPasswordResetEmail(this.$refs.email_recovery.value)
        .then(function() {
          console.log('Email to reset password sent!')
        })
        .catch(function(error) {
          alert('Error enviando correo de recuperación de contraseña:', error)
        })

      this.$router.push('/login')
    }
  }
}
</script>
