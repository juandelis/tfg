<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm8 md6>
      <v-card color="#4A4E57">
        <br />
        <h1 align="center">ACCESO</h1>
        <br />

        <hr />

        <form
          id="loginform"
          action="/"
          method="post"
          target="_self"
          @submit.prevent="login"
        >
          <br />
          <p>
            <label class="labelForm" for="email"> Correo electrónico </label>
            <input v-model="email" type="email" name="email" required />
          </p>

          <p>
            <label class="labelForm" for="password"> Contraseña </label>
            <input
              v-model="password"
              type="password"
              name="password"
              minlength="8"
              required
            />
          </p>

          <p>
            <input id="button" type="submit" value=" INICIAR SESION " />
          </p>
        </form>
        <div id="firebaseui-auth-container" />
        <br />
      </v-card>

      <br /><br /><br /><br />

      <v-card color="#413E35">
        <br />
        <h1 align="center">REGISTRO</h1>
        <br />

        <hr />
        <form
          id="registerForm"
          action="/"
          method="post"
          target="_self"
          @submit.prevent="signup"
        >
          <br />

          <p>
            <label class="labelForm" for="name">Nombre y apellidos</label>
            <input
              id="name"
              v-model="name"
              type="text"
              name="name"
              size="40"
              maxlength="40"
              required
            />
          </p>

          <p>
            <label class="labelForm" for="birth">Fecha de nacimiento</label>
            <input id="birth" v-model="birth" type="date" name="birth" />

            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;

            <label class="labelForm" for="genre">Género</label>
            <select id="genre" v-model="genre" name="genre">
              <option>Masculino</option>
              <option>Femenino</option>
              <option>Otro</option>
            </select>
          </p>

          <p>
            <label class="labelForm" for="email"> Correo electrónico </label>
            <input v-model="email" type="email" name="email" required />

            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;

            <label class="labelForm" for="password"> Contraseña </label>
            <input
              v-model="password"
              type="password"
              name="password"
              minlength="8"
              required
            />
          </p>

          <p>
            <input id="button" type="submit" value=" ACEPTAR " />
          </p>

          <br />
        </form>
      </v-card>
    </v-flex>
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
          // firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.GoogleAuthProvider.PROVIDER_ID
          // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          // firebase.auth.TwitterAuthProvider.PROVIDER_ID
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

<style>
#registerForm,
#loginform {
  margin: 0 auto;
  width: 600px;
}

input,
select {
  color: black;
  background-color: white;
  margin: 4px 4px 4px 3px;
  border-radius: 5px;
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
