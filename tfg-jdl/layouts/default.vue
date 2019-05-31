<template>
  <v-app :dark="dark">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <!-- TODO COMPROBAR SI ESTA LOGGED O NO (PARA MOSTRAR O NO LOGIN,REGISTER,etc)  -->
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar :clipped-left="clipped" fixed app>
      <v-btn icon flat nuxt to="/">
        <v-icon>home</v-icon>
      </v-btn>
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>{{ `chevron_${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>

      <v-spacer />

      <!--
      <p id="demo2"></p>

      <script>
        import firebase from '~/services/fireinit'

        function user() {
          document.getElementById('demo2').innerHTML = 'Hello World'
          var user = firebase.auth().currentUser
          if (user) {
            // User is signed in.
            document.getElementById('demo2').innerHTML = 'USER'
          } else {
            // No user is signed in.
            document.getElementById('demo2').innerHTML = 'NO USER'
          }

          document.getElementById('demo2').innerHTML = '2'
          //firebase.auth().signOut()
          //firebase.auth().signInWithEmailAndPassword('juanlis96@hotmail.com', 'pepito')
        }
      </script>

      <v-btn v-if="!userLogged()" color="red" flat nuxt @click="logout()">
        LOGOUT
      </v-btn>

      <v-btn color="green" flat nuxt to="/login" @click="log_in">
        LOGIN
      </v-btn>
      -->

      <v-btn v-if="logged" color="red" flat nuxt @click="logout()">
        LOGOUT
      </v-btn>
      <v-btn v-else color="green" flat nuxt to="/login">
        LOGIN / REGISTER
      </v-btn>

      <!--
      <v-btn v-if="!logged" color="orange" flat nuxt to="/register">
        REGISTER
      </v-btn>
       TODO USUARIO Y LOGIN/REGISTRO -->
    </v-toolbar>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

    <v-footer :fixed="fixed" app>
      <span>
        &copy; 2019 GAMER CREW
        <v-btn color="white" flat nuxt to="/contacto">
          Contacto
        </v-btn>
      </span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
// import firebase from '~/services/fireinit'

export default {
  data() {
    return {
      dark: true,
      drawer: false,
      clipped: true,
      miniVariant: false,
      items: [
        {
          icon: 'home',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'bubble_chart',
          title: 'Inspire',
          to: '/inspire'
        },
        {
          icon: 'bubble_chart',
          title: 'Login',
          to: '/login'
        },
        {
          icon: 'bubble_chart',
          title: 'Register',
          to: '/register'
        }
      ],
      fixed: false
    }
  },
  computed: {
    ...mapGetters('user', ['logged'])
  },
  methods: {
    ...mapActions('user', ['logout'])
    /*,
    log_in() {
      // this.$store.commit('user/setAfterLogin', this.$nuxt.$route.path)
      // this.$router.push('/login')
      // this.$nuxt.$router.replace({ path: 'login' })
      // this.$nuxt.$router.go('/login')
    } */
  }
}
</script>
