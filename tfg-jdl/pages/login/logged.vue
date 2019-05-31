<template>
  <v-card>
    <v-card-title>
      Login realizado correctamente...
    </v-card-title>
    <v-btn @click="back()">
      VOLVER
    </v-btn>
  </v-card>
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
