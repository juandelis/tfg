<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm8 md6>
      <v-card>
        <br />
        <h1 align="center">RECUPERAR CONTRASEÑA</h1>
        <br />

        <hr />
        <br />

        <p>
          <label class="labelForm" for="name">Correo electrónico</label>
          <input v-model="email_recovery" type="email" name="correo" required />
        </p>
        <p>
          <v-btn @click="recover_password()">
            ENVIAR
          </v-btn>
          <v-btn nuxt to="/login">
            VOLVER
          </v-btn>
        </p>

        <br />
      </v-card>

      <br />
    </v-flex>
  </v-layout>
</template>

<script>
import { auth } from '~/services/fireinit'

export default {
  data: () => ({
    email_recovery: ''
  }),
  methods: {
    async recover_password() {
      const router = this.$router
      await auth
        .sendPasswordResetEmail(this.email_recovery)
        .then(function() {
          console.log('Email to reset password sent!')
          router.push('/login')
        })
        .catch(function(error) {
          alert('Error: Usuario no existente', error)
        })
    }
  }
}
</script>
