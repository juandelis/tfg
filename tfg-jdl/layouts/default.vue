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

      <div v-if="logged">
        <v-btn color="red" flat nuxt @click="logout()">
          SALIR
        </v-btn>
        <router-link to="/account">
          <a style="color:white"> {{ user.email }} </a>
        </router-link>
        <v-btn icon flat nuxt to="/account">
          <v-icon>account_circle</v-icon>
        </v-btn>
      </div>
      <div v-else>
        <v-btn color="green" flat @click="log_in()">
          ACCESO / REGISTRO
        </v-btn>
      </div>

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
import { mapActions, mapGetters, mapState } from 'vuex'

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
          title: 'Inicio',
          to: '/'
        },
        {
          icon: 'bubble_chart',
          title: 'Inspire',
          to: '/inspire'
        },
        {
          icon: 'account_circle',
          title: 'Mi perfil',
          to: '/account'
        }
      ],
      fixed: false
    }
  },
  computed: {
    ...mapGetters('user', ['logged']),
    ...mapState('user', ['user'])
  },
  methods: {
    ...mapActions('user', ['logout']),
    log_in() {
      // Guardamos la ruta actual para volver a ella después del login
      this.$store.commit('user/setAfterLogin', this.$nuxt.$route.path)
      this.$router.push('/login')
    }
  }
}
</script>
