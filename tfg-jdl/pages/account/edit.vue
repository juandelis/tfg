<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm8 md6>
      <v-card>
        <br />
        <h1 align="center">EDITAR PERFIL</h1>
        <br />

        <hr />
        <form
          id="updateForm"
          action="/"
          method="post"
          target="_self"
          @submit.prevent="
            updateAccount({
              name: name,
              birth: birth,
              genre: genre,
              info: info
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
            <label class="labelForm" for="info">
              Descripción personal / aficiones:
            </label>
            <br />
            <textarea
              v-model="info"
              name="info"
              rows="3"
              cols="60"
              maxlength="400"
              style="background-color:white; color:black"
            >
            </textarea>
          </p>

          <p>
            <input id="button_edit" type="submit" value=" ACEPTAR " />
          </p>

          <br />
        </form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data: () => ({
    name: '',
    birth: '',
    genre: '',
    info: ''
  }),
  middleware: 'autenticado',
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    ...mapActions('user', ['updateAccount'])
  }
}
</script>

<style scoped></style>
