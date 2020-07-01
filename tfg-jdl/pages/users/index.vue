<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm10 md8 lg7 xl6>
      <v-card>
        <br />
        <h1 align="center">USUARIOS ({{ numUsers }})</h1>

        <br />
        <hr />
        <br /><br />

        <p>
          <label for="name"> Nombre: </label> &nbsp;
          <input
            id="name"
            v-model="name"
            type="search"
            @input="searchUsers({ name: name, relation: relation })"
          />
        </p>

        <br />

        <p>
          <input
            v-model="relation"
            type="radio"
            value="all"
            @input="searchUsers({ name: name, relation: 'all' })"
          />
          Todos &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            v-model="relation"
            type="radio"
            value="followed"
            @input="searchUsers({ name: name, relation: 'followed' })"
          />
          Seguidos &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <br v-if="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm" />
          <input
            v-model="relation"
            type="radio"
            value="notFollowed"
            @input="searchUsers({ name: name, relation: 'notFollowed' })"
          />
          No seguidos &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            v-model="relation"
            type="radio"
            value="follower"
            @input="searchUsers({ name: name, relation: 'follower' })"
          />
          Seguidores
        </p>

        <br />
        <hr />
        <br />
        <div
          id="users"
          :style="{
            maxHeight:
              Math.max($vuetify.breakpoint.height - offsetTopUsers, 150) + 'px',
            overflowY: 'scroll',
            padding: '10px',
          }"
        >
          <div v-for="(useri, i) in users" :key="i">
            <v-card elevation="10" color="#484848">
              <v-layout justify-center>
                <v-spacer /><v-spacer /><v-spacer />
                <v-flex>
                  <v-avatar size="100">
                    <img :src="useri.image" alt="User profile photo" />
                  </v-avatar>
                </v-flex>
                <v-flex align-content-center>
                  <v-btn flat color="white" round @click="showUser(useri.id)">
                    <h2>{{ useri.name }}</h2>
                  </v-btn>
                  <br />
                  <v-btn
                    v-if="user.following.includes(useri.id)"
                    color="orange"
                    outline
                    round
                    small
                    @click="unfollow_aux(useri.id)"
                  >
                    DEJAR DE SEGUIR
                  </v-btn>
                  <v-btn
                    v-else
                    color="green"
                    outline
                    round
                    small
                    @click="follow_aux(useri.id)"
                  >
                    SEGUIR
                  </v-btn>
                </v-flex>
                <v-spacer /><v-spacer /><v-spacer />
              </v-layout>
            </v-card>
            <br />
          </div>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      name: '',
      relation: 'all',
      offsetTopUsers: 0,
    }
  },

  middleware: 'autenticado',

  computed: {
    ...mapGetters('users', ['numUsers']),
    ...mapState('user', ['user']),
    ...mapState('users', ['users']),
  },

  mounted() {
    // Recorremos todos los padres acumulando sus distancias hasta el top
    this.offsetTopUsers = 0
    let element = document.getElementById('users')
    while (element) {
      this.offsetTopUsers +=
        element.offsetTop - element.scrollTop + element.clientTop
      element = element.offsetParent
    }
    // Empezamos a escuchar cambios en los usuarios
    this.startListeningToUsers({
      name: this.name,
      relation: this.relation,
    })
  },

  beforeDestroy() {
    this.stopListeningToUsers()
  },

  methods: {
    ...mapActions('user', ['follow', 'unfollow', 'showUser']),
    ...mapActions('users', [
      'startListeningToUsers',
      'stopListeningToUsers',
      'searchUsers',
    ]),

    follow_aux(idUserToFollow) {
      this.follow(idUserToFollow)
      // Ejecutar de nuevo la busqueda de usuarios con algo de delay
      if (this.relation !== 'all') {
        setTimeout(() => {
          this.searchUsers({
            name: this.name,
            relation: this.relation,
          })
        }, 200)
      }
    },

    unfollow_aux(idUserToUnfollow) {
      this.unfollow(idUserToUnfollow)
      // Ejecutar de nuevo la busqueda de usuarios con algo de delay
      if (this.relation !== 'all') {
        setTimeout(() => {
          this.searchUsers({
            name: this.name,
            relation: this.relation,
          })
        }, 200)
      }
    },
  },
}
</script>
