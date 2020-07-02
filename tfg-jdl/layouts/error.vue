<template>
  <div class="container">
    <h1 v-if="error.statusCode === 404">
      Ups... No hemos podido encontrar la página. <br />
      (El típico error 404, vamos.)
    </h1>
    <h1 v-else>Ha ocurrido un error inesperado. Perdón.</h1>
    <br /><br />

    <v-btn nuxt to="/">Volver al inicio</v-btn>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  layout: 'error', // you can set a custom layout for the error page
}
</script>
