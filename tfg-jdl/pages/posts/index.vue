<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm9 md7>
      <v-card>
        <br />
        <h1 align="center">BUSCADOR</h1>
        <br />

        <hr />
        <br />
      </v-card>

      <br /><br />

      <v-card>
        <br />
        <h1 align="center">PUBLICACIONES</h1>
        <br />

        <hr />
        <br />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
// import { storage } from '~/services/fireinit'

export default {
  data: () => ({}),
  middleware: 'autenticado',
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    // ...mapActions('user', ['updateUserImage', 'test']),
  }
}
</script>
