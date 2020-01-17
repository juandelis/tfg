<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm9 md8 lg7>
      <v-card>
        <h1 align="center">{{ postToShow.tittle }}</h1>
        <hr />
        <br />
        <v-layout row>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <v-flex grow>
            <h3 align="left">AUTOR: &nbsp; {{ postToShow.creator }}</h3>
            <h3 align="right">
              FECHA PUBLICACIÓN: &nbsp;{{ postToShow.date }}&nbsp;&nbsp;
            </h3>
            <br />
            <h3 align="left">
              CONTENIDO: &nbsp;
            </h3>
            <h4 align="left" style="max-width: 400px">
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
    const doc = await docRef.get()
    if (doc.exists) {
      // Hacemos el setUser con los datos obtenidos
      console.log('Document readed:', doc.data())
      this.postToShow.tittle = doc.data().tittle
      this.postToShow.creator = doc.data().creator
      this.postToShow.date = doc.data().date
      this.postToShow.body = doc.data().body
    }
  },

  methods: {}
}
</script>
