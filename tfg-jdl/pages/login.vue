<template>
  <div id="firebaseui-auth-container" />
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import firebase, { auth } from '~/services/fireinit'
import * as firebaseui from 'firebaseui'

export default {
  // middleware: 'autenticado', // poner en todas las páginas que requieran autenticacion, menos esta!
  data: () => ({}),
  computed: {
    ...mapGetters('user', ['logged']),
    ...mapState('user', ['afterLogin'])
  },
  watch: {
    logged: {
      immediate: true,
      handler(logged) {
        if (logged) this.next()
      }
    }
  },
  mounted: function() {
    this.showLogin()
  },
  methods: {
    ...mapActions('user', ['initAuth']),
    next() {
      this.$router.push(this.afterLogin)
    },
    showLogin() {
      this.initAuth()
      const uiConfig = {
        // signInSuccessUrl: '<url-to-redirect-to-on-success>', //En Nuxt esto sería un problema, ya que firebase-ui no usa vue-route
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.GoogleAuthProvider.PROVIDER_ID
          // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          // firebase.auth.GithubAuthProvider.PROVIDER_ID,
          // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        callbacks: {
          signInSuccessWithAuthResult() {
            return 0
          }
        }
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        // tosUrl: '<your-tos-url>',
        // Privacy policy url/callback.
        // privacyPolicyUrl: function() {
        //  window.location.assign('<your-privacy-policy-url>')
        // }
      }
      const ui =
        firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth)
      // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig)
    }
  }
}
</script>

<style src="~/node_modules/firebaseui/dist/firebaseui.css"></style>
