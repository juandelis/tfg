<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm8 md6>
      <v-card>
        <h1 align="center">MI PERFIL</h1>
        <br />
        <h3 align="center">NOMBRE: {{ user.displayName }}</h3>
        <h3 align="center">FECHA NACIMIENTO: {{ user.birth }}</h3>
        <h3 align="center">GENERO: {{ user.genre }}</h3>
        <br />
      </v-card>

      <br />

      <v-card>
        <br />
        <h1 align="center">MI PERFIL</h1>
        <br />

        <hr />
        <form
          id="registerForm"
          action="/"
          method="post"
          target="_self"
          @submit.prevent="
            signup({
              email: email,
              password: password,
              name: name,
              birth: birth,
              genre: genre
            })
          "
        >
          <br />

          <p>
            <label class="labelForm" for="name">Nombre y apellidos</label>
            <input
              id="name"
              v-model="name"
              type="text"
              name="name"
              size="40"
              maxlength="40"
              required
            />
          </p>

          <p>
            <label class="labelForm" for="birth">Fecha de nacimiento</label>
            <input id="birth" v-model="birth" type="date" name="birth" />

            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;

            <label class="labelForm" for="genre">Género</label>
            <select id="genre" v-model="genre" name="genre">
              <option>Masculino</option>
              <option>Femenino</option>
              <option>Otro</option>
            </select>
          </p>

          <p>
            <label class="labelForm" for="email"> Correo electrónico </label>
            <input v-model="email" type="email" name="email" required />

            &nbsp; &nbsp; &nbsp; &nbsp;

            <label class="labelForm" for="password"> Contraseña </label>
            <input
              v-model="password"
              type="password"
              name="password"
              minlength="6"
              required
            />
          </p>

          <p>
            <input id="button_register" type="submit" value=" ACEPTAR " />
          </p>

          <br />
        </form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({
    email_log: '',
    password_log: '',
    email: '',
    password: '',
    name: '',
    birth: '',
    genre: ''
  }),
  middleware: 'autenticado',
  computed: {
    ...mapState('user', ['user'])
  }
}
</script>

<style scoped></style>
