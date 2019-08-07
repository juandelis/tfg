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
          <input ref="email_recovery" type="email" name="correo" required />
        </p>
        <p>
          <v-btn nuxt @click="recover_password()">
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
import { mapActions, mapState } from 'vuex'
import { auth } from '~/services/fireinit'

export default {
  data: () => ({}),
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    ...mapActions('user', ['updateAccount', 'updateUserImage']),
    async recover_password() {
      await auth
        .sendPasswordResetEmail(this.$refs.email_recovery.value)
        .then(function() {
          console.log('Email to reset password sent!')
        })
        .catch(function(error) {
          alert('Error: Usuario no existente', error)
        })

      this.$router.push('/login')
    }
  }
}
</script>
