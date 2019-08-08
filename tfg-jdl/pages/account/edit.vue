<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm8 md6>
      <v-card>
        <br />
        <h1 align="center">EDITAR PERFIL</h1>
        <br />

        <hr />
        <br />

        <form
          id="editForm"
          method="post"
          target="_self"
          @submit.prevent="update_account()"
        >
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
            <input
              id="button_edit"
              ref="button_edit"
              type="submit"
              value=" ACEPTAR "
              style="display:none"
            />
            <v-btn nuxt @click="click_submit()">
              ACEPTAR
            </v-btn>
            <v-btn nuxt to="/account">
              VOLVER
            </v-btn>
          </p>
        </form>

        <br />
      </v-card>

      <br />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data: () => ({}),
  middleware: 'autenticado',
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    ...mapActions('user', ['updateAccount', 'updateUserImage']),
    click_submit() {
      this.$refs.button_edit.click()
    },
    update_account() {
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
