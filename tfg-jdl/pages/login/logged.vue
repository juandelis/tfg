<template>
  <v-layout column justify-center align-center>
    <v-card>
      <v-card-title class="headline">
        Login realizado correctamente...
      </v-card-title>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="back()">
          VOLVER
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  data: () => ({}),
  methods: {
    back() {
      // this.$router.push(this.afterLogin)
      this.$router.go(-2) // Vuelve a la página donde estabas antes del login
    }
  }
}
</script>

<style scoped></style>
