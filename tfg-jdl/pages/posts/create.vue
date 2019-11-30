<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm8 md6>
      <v-card>
        <br />
        <h1 align="center">NUEVA PUBLICACIÓN</h1>
        <br />

        <hr />
        <br />

        <form
          id="editForm"
          method="post"
          target="_self"
          @submit.prevent="createPost()"
        >
          <p>
            <label class="labelForm" for="tittle">Titulo: </label>
            <input
              id="tittle"
              ref="tittle"
              type="text"
              name="tittle"
              size="50"
              maxlength="45"
              required
            />
          </p>

          <p>
            <label class="labelForm" for="body">
              Contenido:
            </label>
            <br />
            <textarea
              ref="body"
              name="body"
              rows="6"
              cols="60"
              maxlength="400"
              style="background-color:white; color:black"
              required
            >
            </textarea>
          </p>

          <p>
            <label class="labelForm" for="genre">Campo:</label>
            <select id="genre" ref="genre" name="genre">
              <option style="display:none"></option>
              <option>Masculino</option>
              <option>Femenino</option>
              <option>Otro</option>
            </select>
          </p>

          <p>
            <input
              id="button_post"
              ref="button_post"
              type="submit"
              style="display:none"
            />
            <v-btn nuxt @click="click_submit()">
              PUBLICAR
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
import { mapActions } from 'vuex'
import { firestore } from 'firebase'

export default {
  data: () => ({}),
  middleware: 'autenticado',
  computed: {},
  methods: {
    ...mapActions('user', ['create_post']),
    click_submit() {
      this.$refs.button_post.click()
    },
    createPost() {
      this.create_post({
        tittle: this.$refs.tittle.value,
        body: this.$refs.body.value,
        date: firestore.Timestamp.now()
        // firestore.Timestamp.now().toDate()
      })
      this.$router.push('/') // TODO redirigir a mis publicaciones
    }
  }
}
</script>
