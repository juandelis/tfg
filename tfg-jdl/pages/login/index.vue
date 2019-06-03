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
          @submit.prevent="login(correo, contraseña)"
        >
          <br />
          <p>
            <label class="labelForm" for="correo"> Correo electrónico </label>
            <input v-model="correo" type="email" name="correo" required />
          </p>

          <p>
            <label class="labelForm" for="contraseña"> Contraseña </label>
            <input
              v-model="contraseña"
              type="contraseña"
              name="contraseña"
              minlength="6"
              required
            />
          </p>

          <p>
            <input id="button_login" type="submit" value=" INICIAR SESION " />
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

            &nbsp; &nbsp; &nbsp; &nbsp;

            <label class="labelForm" for="password"> Contraseña </label>
            <input
              v-model="password"
              type="password"
              name="password"
              minlength="6"
              required
            />
          </p>

          <p>
            <input id="button_register" type="submit" value=" ACEPTAR " />
          </p>

          <br />
        </form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import firebase, { auth, getCurrentUser } from '~/services/fireinit'
import * as firebaseui from 'firebaseui'
import functions from '~/assets/myfunctions/functions'

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
            console.log('Usuario logueado con Google')
            const user = await getCurrentUser() // Obtiene el usuario actual
            if (user) {
              functions.createUserDocument(user, null)
            }
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
    },
    login(correo, contraseña) {
      auth
        .signInWithEmailAndPassword(correo, contraseña)
        .catch(function(error) {
          // Handle Errors here.
          if (error.code === 'auth/wrong-password') {
            alert('CONTRASEÑA INCORRECTA')
          } else if (error.code === 'auth/user-not-found') {
            alert('NO EXISTE EL USUARIO')
          }
          // ...
        })
    },
    signup() {
      const username = this.name
      // const birthdate = this.birth
      auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(async function() {
          const user = await getCurrentUser() // Obtiene el usuario actual
          if (user) {
            console.log('1')
            // TODO AÑADIR RESTO DE CAMPOS DEL FORMULARIO
            functions.createUserDocument(user, username)
            console.log('2')
          }
        })
        .catch(function(error) {
          // Handle Errors here.
          if (error.code === 'auth/weak-password') {
            alert('CONTRASEÑA DEMASIADO DÉBIL')
          } else if (error.code === 'auth/email-already-in-use') {
            console.log('EL USUARIO YA EXISTE')
          }
          // ...
        })

      return 0
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
