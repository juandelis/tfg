<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm8 md6>
      <v-card color="#444B3A">
        <br />
        <h1 align="center">ACCESO / REGISTRO</h1>
        <br />
        <hr />
        <br />
        <div id="firebaseui-auth-container" />
        <br />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import firebaseui from 'firebaseui/dist/npm__es' // FirebaseUI en español
import firebase, { auth } from '~/services/fireinit'

export default {
  // middleware: 'autenticado', // poner en todas las páginas que requieran autenticacion, menos esta!
  data: () => ({}),
  computed: {
    ...mapGetters('user', ['logged']),
    ...mapState('user', ['afterLogin']),
  },
  watch: {
    logged: {
      immediate: true,
      handler(logged) {
        if (logged) this.$router.push(this.afterLogin)
      },
    },
  },
  mounted() {
    this.initAuth()

    const uiConfig = {
      signInFlow: 'popup',
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      // signInSuccessUrl: '<url-to-redirect-to-on-success>', //En Nuxt esto sería un problema, ya que firebase-ui no usa vue-route
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInSuccessWithAuthResult() {
          return false
        },
      },
    }
    const ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth)
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig)
  },
  methods: {
    ...mapActions('user', ['initAuth']),
  },
}
</script>

<style src="~/node_modules/firebaseui/dist/firebaseui.css"></style>
