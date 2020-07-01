<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm8 md6>
      <v-card>
        <br />
        <h1 align="center">NUEVA PUBLICACIÓN</h1>
        <br />

        <hr />
        <br /><br />

        <form
          id="editForm"
          method="post"
          target="_self"
          @submit.prevent="createPost_aux()"
        >
          <p>
            <textarea
              v-model="body"
              rows="6"
              :cols="
                $vuetify.breakpoint.xs
                  ? '30'
                  : $vuetify.breakpoint.sm
                  ? '50'
                  : $vuetify.breakpoint.md
                  ? '60'
                  : $vuetify.breakpoint.lg
                  ? '70'
                  : $vuetify.breakpoint.xl
                  ? '80'
                  : '60'
              "
              maxlength="333"
              style="background-color:#505050; color:white; resize:none"
              required
            />
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
import { mapState } from 'vuex'
import { firestore } from 'firebase'
import functions from '~/assets/functions'

export default {
  data: () => ({
    body: ''
  }),
  middleware: 'autenticado',
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    click_submit() {
      this.$refs.button_post.click()
    },
    createPost_aux() {
      functions.createPost(
        this.user.uid,
        this.user.name,
        this.body,
        firestore.Timestamp.now()
      )
      this.$router.push('/posts/myposts')
    }
  }
}
</script>
