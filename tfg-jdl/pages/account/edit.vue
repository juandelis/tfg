<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm8 md6>
      <v-card>
        <br />
        <h1 align="center">EDITAR PERFIL</h1>
        <br />

        <hr />
        <br />

        <p>
          <label class="labelForm" for="name">Nombre y apellidos</label>
          <input
            id="name"
            ref="name"
            type="text"
            name="name"
            size="40"
            maxlength="40"
            required
            :value="user.name"
          />
        </p>

        <p>
          <label class="labelForm" for="birth">Fecha de nacimiento</label>
          <input
            id="birth"
            ref="birth"
            type="date"
            name="birth"
            :value="user.birth"
          />

          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;

          <label class="labelForm" for="genre">Género</label>
          <select id="genre" ref="genre" name="genre" :value="user.genre">
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
            ref="info"
            name="info"
            rows="3"
            cols="60"
            maxlength="400"
            style="background-color:white; color:black"
            :value="user.info"
          >
          </textarea>
        </p>

        <p>
          <v-btn nuxt @click="send_inputs()">
            ACEPTAR
          </v-btn>
          <v-btn nuxt to="/account">
            VOLVER
          </v-btn>
        </p>

        <br />
      </v-card>

      <br />
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
    ...mapActions('user', ['updateAccount', 'updateUserImage']),
    send_inputs() {
      this.updateAccount({
        name: this.$refs.name.value,
        birth: this.$refs.birth.value,
        genre: this.$refs.genre.value,
        info: this.$refs.info.value
      })
      this.$router.push('/account')
    }
  }
}
</script>
