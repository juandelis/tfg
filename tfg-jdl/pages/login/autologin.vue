<template>
  <v-layout column justify-center align-center>
    <v-card>
      <br />
      <h1 align="center">ACCESO</h1>
      <v-card-text>
        <p>
          Puedes iniciar sesión en la aplicación mediante una cuenta de correo
          electrónico o a través de tu cuenta de Google. Tan sólo debes
          introducir tu correo y contraseña
        </p>

        <br />
        <h1 align="center">REGISTRO</h1>
        <p>
          Si el correo electrónico introducido todavía no está registrado, el
          sistema lo detectará automáticamente y te permitirá crear tu nueva
          cuenta.
        </p>
      </v-card-text>
    </v-card>

    <br />

    <v-card>
      <div id="firebaseui-auth-container" />
    </v-card>
  </v-layout>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import firebase, { auth, getCurrentUser, db } from '~/services/fireinit'
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
        if (logged) this.$router.push(this.afterLogin)
      }
    }
  },
  mounted: function() {
    this.showLogin()
  },
  methods: {
    ...mapActions('user', ['initAuth', 'userCreateDocument']),
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
          async signInSuccessWithAuthResult() {
            const user = await getCurrentUser() // Obtiene el usuario actual

            const docRef = db.collection('accounts').doc(user.uid)
            docRef
              .get()
              .then(function(doc) {
                if (doc.exists) {
                  console.log('Document data:', doc.data())
                } else {
                  console.log('No such document!')
                  // Creamos el documento
                  docRef.set({
                    username: user.displayName || user.email.split('@')[0], // use part of the email as a username
                    email: user.email,
                    image: user.newImage || '/images/default-profile.png' // supply a default profile image for all users
                  })
                  // this.userCreateDocument({ user })
                  // this.$store.dispatch('userCreateDocument', { user })
                }
              })
              .catch(function(error) {
                console.log('Error getting document:', error)
              })

            console.log('user uid:' + user.uid)
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
