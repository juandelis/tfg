<template>
  <v-card>
    <h1 align="center">MI PERFIL</h1>
    <br />
    <h3 align="center">USUARIO: {{ user.email }}</h3>
    <h3 align="center">NOMBRE: {{ user.displayName }}</h3>
    <h3 align="center">FECHA NACIMIENTO: {{ user.birth }}</h3>
    <h3 align="center">GENERO: {{ user.genre }}</h3>
    <br />
  </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({}),
  middleware: 'autenticado',
  computed: {
    ...mapState('user', ['user'])
  }
}
</script>

<style scoped></style>
