<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm9 md7>
      <v-card>
        <br />
        <h1 align="center">USUARIOS</h1>

        <br />
        <hr />
        <br /><br />

        <p>
          <label class="labelForm"> Nombre </label>
          <input
            v-model="name"
            type="search"
            @input="
              searchUsers({
                name: name,
                email: email,
                relation: relation
              })
            "
          />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <label class="labelForm"> Correo </label>
          <input
            v-model="email"
            type="email"
            size="30"
            @input="
              searchUsers({
                name: name,
                email: email,
                relation: relation
              })
            "
          />
        </p>

        <br />

        <p>
          <input
            v-model="relation"
            type="radio"
            value="all"
            @input="
              searchUsers({
                name: name,
                email: email,
                relation: 'all'
              })
            "
          />
          Todos &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            v-model="relation"
            type="radio"
            value="followed"
            @input="
              searchUsers({
                name: name,
                email: email,
                relation: 'followed'
              })
            "
          />
          Seguidos &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            v-model="relation"
            type="radio"
            value="notFollowed"
            @input="
              searchUsers({
                name: name,
                email: email,
                relation: 'notFollowed'
              })
            "
          />
          No seguidos
        </p>

        <br />
        <hr />

        <div v-for="(useri, i) in users" :key="i">
          <br />
          <v-card elevation="10" color="#444444">
            <v-layout justify-center>
              <v-spacer /><v-spacer /><v-spacer />
              <v-flex align-content-center>
                <v-img
                  :src="useri.image"
                  alt="User avatar"
                  width="82px"
                  height="96px"
                  style="border-radius:50%; border:5px solid #444444"
                />
                <!--<v-avatar size="80">
                <img :src="useri.image" alt="User profile photo" />
              </v-avatar>-->
              </v-flex>
              <v-flex align-content-center>
                <v-btn flat color="white" round @click="showUser(useri.id)">
                  {{ useri.name }}
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
        </div>
        <br />
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
      email: '',
      relation: 'all'
    }
  },

  middleware: 'autenticado',

  computed: {
    ...mapGetters('users', ['numUsers']),
    ...mapState('user', ['user']),
    ...mapState('users', ['users'])
  },

  mounted: function() {
    this.startListeningToUsers({
      name: this.name,
      email: this.email,
      relation: this.relation
    })
  },

  beforeDestroy: function() {
    this.stopListeningToUsers()
  },

  methods: {
    ...mapActions('user', ['follow', 'unfollow', 'showUser']),
    ...mapActions('users', [
      'startListeningToUsers',
      'stopListeningToUsers',
      'searchUsers'
    ]),

    follow_aux(idUserToFollow) {
      this.follow(idUserToFollow)
      // Ejecutar de nuevo la busqueda de usuarios con algo de delay
      if (this.relation !== 'all') {
        setTimeout(() => {
          this.searchUsers({
            name: this.name,
            email: this.email,
            relation: this.relation
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
            email: this.email,
            relation: this.relation
          })
        }, 200)
      }
    }
  }
}
</script>
