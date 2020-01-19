<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm9 md8 lg7>
      <v-card>
        <h1 align="center">{{ postToShow.tittle }} - {{ postToShow.date }}</h1>
        <hr />
        <br />
        <v-layout row>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <v-flex grow>
            <h3 align="left">AUTOR: &nbsp; {{ postToShow.creator }}</h3>
            <br />
            <h3 align="left">
              CONTENIDO: &nbsp;
            </h3>
            <h4 align="left" style="max-width: 90%">
              {{ postToShow.body }}
            </h4>
            <br />
          </v-flex>
        </v-layout>

        <br />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
import { db } from '~/services/fireinit'

export default {
  data() {
    return {
      postToShow: {
        tittle: '',
        date: '',
        body: '',
        creator: ''
      }
    }
  },

  middleware: 'autenticado',

  computed: {
    ...mapState('user', ['user'])
  },

  mounted: async function() {
    const idPostToShow = this.$route.params.id
    const docRef = await db.collection('posts').doc(idPostToShow)
    console.log(idPostToShow)
    const postDoc = await docRef.get()
    if (postDoc.exists) {
      const postData = postDoc.data()
      // Guardamos los datos de la publicacion
      this.postToShow.tittle = postData.tittle
      this.postToShow.creator = postData.creator
      this.postToShow.date = postData.date.toDate().toLocaleDateString('es-ES')
      this.postToShow.body = postData.body
    }
  },

  methods: {}
}
</script>
