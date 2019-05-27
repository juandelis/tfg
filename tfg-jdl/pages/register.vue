<template>
  <v-layout>
    <v-flex text-xs-center>
      <img src="/v.png" alt="Vuetify.js" class="mb-5" />

      <blockquote class="blockquote">
        &#8220;REGISTRO&#8221;
      </blockquote>

      <form id="registerForm" action="/" method="post" target="_self">
        <!--
        <p v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </p>
        -->

        <br />

        <p>
          <label class="labelForm" for="nombre">Nombre</label>
          <input id="nombre" v-model="nombre" type="text" name="nombre" />
        </p>

        <p>
          <label class="labelForm" for="edad">Edad</label>
          <input id="edad" v-model="edad" type="number" name="edad" min="0" />
        </p>

        <p>
          <label class="labelForm" for="movie">Favorite Movie</label>
          <select id="movie" v-model="movie" name="movie">
            <option>Star Wars</option>
            <option>Vanilla Sky</option>
            <option>Atomic Blonde</option>
          </select>
        </p>

        <p>
          <input id="button" type="submit" value=" ENVIAR " />
        </p>

        <br />
      </form>
    </v-flex>
  </v-layout>
</template>

<style>
#registerForm {
  background-color: #88a6ff;
  color: black;
}

input,
select {
  background-color: #e6e6fa;
  margin: 5px 5px 5px 5px;
}

.labelForm {
  font-weight: bold;
}
</style>

<!--
<script>
const registerForm = new Vue({
  el: '#registerForm',
  data: {
    errors: [],
    nombre: null,
    edad: null,
    movie: null
  },
  methods: {
    checkForm: function(e) {
      if (this.nombre && this.edad) {
        return true
      }

      this.errors = []

      if (!this.nombre) {
        this.errors.push('Name required.')
      }
      if (!this.edad) {
        this.errors.push('edad required.')
      }

      e.preventDefault()
    }
  }
})
</script>
-->
