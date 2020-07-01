<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm9 md7 lg8>
      <v-card>
        <h1 align="center">MI PERFIL</h1>
        <hr />
        <br />
        <v-layout row>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <v-flex grow>
            <h3 align="left">NOMBRE: &nbsp; {{ user.name }}</h3>
            <br />
            <h3 align="left">FECHA NACIMIENTO: &nbsp; {{ user.birth }}</h3>
            <br />
            <h3 align="left">GENERO: &nbsp; {{ user.genre }}</h3>
            <br />
            <h3 align="left">
              DESCRIPCIÓN PERSONAL / AFICIONES: &nbsp;
            </h3>
            <h4 align="left" style="max-width: 325px;">
              {{ user.info }} &nbsp;
            </h4>
            <br />
            <v-btn nuxt to="/account/edit">
              EDITAR
            </v-btn>
            <v-btn nuxt to="/account/password">
              CAMBIAR CONTRASEÑA
            </v-btn>
          </v-flex>
          <v-flex shrink>
            <v-card min-width="220px">
              <img
                :src="user.image"
                alt="User profile photo"
                width="200px"
                height="240px"
              />
              <br />
              <v-btn nuxt @click="click_fileInput()">
                CAMBIAR IMAGEN PERFIL
              </v-btn>
              <input
                ref="fileInput"
                type="file"
                style="display: none;"
                accept="image/*"
                @change="onFileChange"
              />
            </v-card>
          </v-flex>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </v-layout>

        <br />
      </v-card>

      <v-btn nuxt @click="follow()">
        FOLLOW
      </v-btn>
      <v-btn nuxt @click="unfollow()">
        UNFOLLOW
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { firestore } from 'firebase'
import { db, storage } from '~/services/fireinit'

export default {
  data() {
    return {
      followers: [],
      following: [],
    }
  },
  middleware: 'autenticado',
  computed: {
    ...mapState('user', ['user']),
  },
  mounted() {},
  methods: {
    ...mapActions('user', ['updateUserImage', 'showUser']),

    change_email() {
      console.log('Try to update email of ' + this.user.uid)
      const userLogged = this.user
      if (userLogged) {
        // Actualizamos el documento en firebase
        const docRef = db.collection('accounts').doc(userLogged.uid)
        docRef
          .get()
          .then(function (doc) {
            if (doc.exists) {
              console.log('Updating document')
              // Actualizamos los valores del documento
              docRef.update({
                email: 'test@hotmail.com',
                // email: 'juanlis96@hotmail.com'
              })
            } else {
              console.log('No such document!')
            }
          })
          .catch(function (error) {
            console.log('Error getting document:', error)
          })
      }
    },
    change_name() {
      console.log('Try to update email of ' + this.user.uid)
      const userLogged = this.user
      if (userLogged) {
        // Actualizamos el documento en firebase
        const docRef = db.collection('accounts').doc(userLogged.uid)
        docRef
          .get()
          .then(function (doc) {
            if (doc.exists) {
              console.log('Updating document')
              // Actualizamos los valores del documento
              docRef.update({
                name: 'Juuuuuuuan',
                // name: 'Juan de Lis'
              })
            } else {
              console.log('No such document!')
            }
          })
          .catch(function (error) {
            console.log('Error getting document:', error)
          })
      }
    },

    async follow() {
      console.log('Try to follow')
      const userLogged = this.user
      if (userLogged) {
        // Add userToFollow to following array of userLogged
        const docRef = await db.collection('accounts').doc(userLogged.uid)
        docRef.update({
          following: firestore.FieldValue.arrayUnion(
            'Hw3uHVdZ5sRuAB4xvrF6XNag9S82'
          ),
        })
        // Add userLogged to followers array of userToFollow
        const docRef2 = await db.doc('accounts/Hw3uHVdZ5sRuAB4xvrF6XNag9S82')
        docRef2.update({
          followers: firestore.FieldValue.arrayUnion(userLogged.uid),
        })
      }
    },

    async unfollow() {
      console.log('Try to unfollow')
      const userLogged = this.user
      if (userLogged) {
        // Add userToFollow to following array of userLogged
        const docRef = await db.collection('accounts').doc(userLogged.uid)
        docRef.update({
          following: firestore.FieldValue.arrayRemove(
            'Hw3uHVdZ5sRuAB4xvrF6XNag9S82'
          ),
        })
        // Add userLogged to followers array of userToFollow
        const docRef2 = await db.doc('accounts/Hw3uHVdZ5sRuAB4xvrF6XNag9S82')
        docRef2.update({
          followers: firestore.FieldValue.arrayRemove(userLogged.uid),
        })
      }
    },

    click_fileInput() {
      this.$refs.fileInput.click()
    },

    async onFileChange(event) {
      const files = event.target.files
      const newImage = files[0]

      const filename = newImage.name
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Invalid type file! ')
      }

      const storageRef = storage.ref('profileImages/' + this.user.uid)
      const snapshot = await storageRef.put(newImage)

      const downloadURL = await snapshot.ref.getDownloadURL()
      console.log('File available at', downloadURL)
      this.updateUserImage(downloadURL)
    },
  },
}
</script>
