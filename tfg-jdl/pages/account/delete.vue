<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs10 sm7 md5>
      <v-card>
        <br />
        <h1 align="center">ELIMINAR USUARIO</h1>
        <br />
        <hr />
        <br />
        <label>
          Se borrarán todos los datos del usuario: <br />
          ·Información de acceso <br />
          ·Publicaciones creadas <br />
          ·Valoraciones de otras publicaciones<br />
          ·Relaciones con otros usuarios<br /><br />
          El proceso puede tardar varios minutos
        </label>
        <br /><br />
        <v-btn nuxt @click="delete_user()">
          ELIMINAR
        </v-btn>
        <br /><br />
      </v-card>

      <br />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
// import { db, getCurrentUser } from '~/services/fireinit'
import { db } from '~/services/fireinit'

export default {
  data: () => ({
    password: ''
  }),
  middleware: 'autenticado',
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    ...mapActions('user', ['updateAccount', 'updateUserImage']),

    delete_user(password) {
      console.log('password: ' + password)

      // TODO: Comprobar si es cuenta de Google y ver como obtener credential
      /* const user = await getCurrentUser()
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
      ) */

      // TODO: Eliminar documento del user en Firestore
      db.doc('accounts/' + this.user.uid)
        .delete()
        .then(function() {
          console.log('USER DOCUMENT SUCCESSFULLY DELETED!')
          // Reauthenticate para poder eliminar el user de Firebase Authentication
          /* user
            .reauthenticateAndRetrieveDataWithCredential(credential)
            .then(function() {
              console.log('reauthenticating SUCCESSFULLY COMPLETED!')
              // Eliminar usuario de Firebase Authentication
              user
                .delete()
                .then(function() {
                  console.log('USER DELETED CORRECTLY')
                  this.$router.push('/')
                })
                .catch(function(error) {
                  return alert('Error deleting user:', error)
                })
            })
            .catch(function(error) {
              return alert('Error reauthenticating:', error)
            }) */
        })
        .catch(function(error) {
          console.error('Error deleting user document: ', error)
        })
    }
  }
}
</script>
