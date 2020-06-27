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
import { auth, emailProvider, googleProvider } from '~/services/fireinit'
import * as firebaseui from 'firebaseui'

export default {
  // middleware: 'autenticado', // poner en todas las páginas que requieran autenticacion, menos esta!
  data: () => ({
    email_log: '',
    password_log: '',
    email: '',
    password: '',
    name: ''
  }),
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
    ...mapActions('user', ['initAuth', 'login', 'signup']),

    click_submit() {
      this.$refs.button_register.click()
    },

    change_password() {
      this.$router.push('/login/password')
    },

    showLogin() {
      this.initAuth()

      const uiConfig = {
        signInFlow: 'popup',
        // signInSuccessUrl: '<url-to-redirect-to-on-success>', //En Nuxt esto sería un problema, ya que firebase-ui no usa vue-route
        signInOptions: [
          // Declare in fireinit.js the providers you want to offer your users.
          emailProvider,
          googleProvider
        ],
        callbacks: {
          signInSuccessWithAuthResult() {
            return false
          }
        }
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

<style>
input,
select {
  color: black;
  background-color: white;
  margin: 4px 4px 4px 3px;
  border-radius: 5px;
  padding: 2px;
  padding-left: 5px;
}

input[type='submit'] {
  background-color: #cacaca;
  color: black;
  padding: 7px 10px;
}

.labelForm {
  font-weight: bold;
}
</style>

<!--
<script>
const registerForm = new Vue({
  el: '#registerForm',
  data: {
    errors: [],
    nombre: null,
    edad: null,
    movie: null
  },
  methods: {
    checkForm: function(e) {
      if (this.nombre && this.edad) {
        return true
      }

      this.errors = []

      if (!this.nombre) {
        this.errors.push('Nombre requerido.')
      }
      if (!this.edad) {
        this.errors.push('Edad requerida.')
      }

      e.preventDefault()
    }
  }
})
</script>
-->
