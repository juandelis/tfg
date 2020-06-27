<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs10 sm7 md5>
      <v-card>
        <br />
        <h1 align="center">ELIMINAR USUARIO</h1>
        <br />
        <hr />
        <br />
        <label>
          Se borrarán todos los datos del usuario: <br />
          ·Información de acceso <br />
          ·Publicaciones creadas <br />
          ·Valoraciones de otras publicaciones<br />
          ·Relaciones con otros usuarios<br /><br />
          El proceso puede tardar varios minutos
        </label>
        <br /><br />
        <v-btn nuxt @click="delete_user()">
          ELIMINAR
        </v-btn>
        <br /><br />
      </v-card>

      <br />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import functions from '~/assets/functions'

export default {
  data: () => ({
    password: ''
  }),
  middleware: 'autenticado',
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    ...mapActions('user', ['updateAccount', 'updateUserImage']),

    delete_user() {
      functions.deleteUser(this.user.uid)
    }
  }
}
</script>
