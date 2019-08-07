<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm9 md7>
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
            <h3 align="left">{{ user.info }} &nbsp;</h3>
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
                style="display:none"
                accept="image/*"
                @change="onFileChange"
              />
            </v-card>
          </v-flex>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </v-layout>

        <br />
      </v-card>

      <br /><br />

      <v-card>
        <br />
        <h1 align="center">SEGUIDORES ( {{ followers.length }} )</h1>
        <hr />
        <br />
        <div v-for="(user, i) in followers" :key="i">
          {{ i + 1 }} -&nbsp; {{ user.name }} &nbsp; --- &nbsp; {{ user.email }}
        </div>
        <br />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { db, getCurrentUser, storage } from '~/services/fireinit'

export default {
  /* data: () => ({
    imageURL: '',
    imageDownloadURL:
      'https://firebasestorage.googleapis.com/v0/b/tfg-jdl.appspot.com/o/profileImages%2Fjuan.jpg?alt=media&token=5d5e7241-a753-46ed-9fc3-848627e727d1',
    image: null
  }), */
  data() {
    return {
      followers: []
    }
  },
  middleware: 'autenticado',
  computed: {
    ...mapState('user', ['user'])
  },
  mounted: function() {
    this.getUsers()
  },
  methods: {
    ...mapActions('user', ['updateUserImage', 'test']),
    async getUsers() {
      const usersSnapshot = await db.collection('accounts').get()
      const userLogged = await getCurrentUser()
      const userFollowers = this.user.followers
      usersSnapshot.forEach(eachUserDoc => {
        const eachUserData = eachUserDoc.data()
        if (
          eachUserDoc.id !== userLogged.uid &&
          userFollowers.includes(eachUserDoc.id)
        ) {
          this.followers.push({
            id: eachUserDoc.id,
            name: eachUserData.name,
            email: eachUserData.email
          })
        }
      })
    },
    click_fileInput() {
      this.$refs.fileInput.click()
    },
    updateImage(newImage) {
      this.updateUserImage(newImage)
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

      /* storageRef.put(newImage).then(function(uploadTask) {
        console.log(
          'File available att' + uploadTask.snapshot.ref.getDownloadURL()
        )
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log('File available at', downloadURL)
          // updateImage(downloadURL)
        })
      })

            const uploadTask = storageRef.put(newImage)

      uploadTask.on(
        'state_changed',
        function(snapshot) {},
        function(error) {
          console.error(error)
        },
        function() {
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL)
            // updateImage(downloadURL)
          })
          this.imageURL = 'v.png'
          console.log('image ' + this.imageURL)
          // this.updateUserImage('v.png')
        }
      ) */

      /* const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageURL = fileReader.result
        // this.updateImage('images/GamersCrew.png')
        console.log('Imagen: ' + this.$store.state.user.image)
        // this.$router.push('/')
        // this.$store.commit('updateImage', fileReader.result)
        // console.log('imageURL: ' + this.imageURL)
      })

      fileReader.readAsDataURL(files[0])
      this.image = files[0] */
    }
  }
}
</script>
