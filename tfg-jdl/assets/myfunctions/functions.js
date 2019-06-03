import { getCurrentUser, db } from '~/services/fireinit'

const functions = {
  async createCurrentUserDocument() {
    const user = await getCurrentUser() // Obtiene el usuario actual
    if (user) {
      const docRef = db.collection('accounts').doc(user.uid)
      docRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            // Ya existe el documento de este usuario
            console.log('Document data:', doc.data())
          } else {
            console.log('No such document!')
            // Creamos el documento
            docRef.set({
              username: user.displayName || user.email.split('@')[0], // use part of the email as a username
              email: user.email,
              image: user.newImage || '/images/default-profile.png' // supply a default profile image for all users
            })
            // this.userCreateDocument({ user })
            // this.$store.dispatch('userCreateDocument', { user })
          }
        })
        .catch(function(error) {
          console.log('Error getting document:', error)
        })
    }
  },
  createUserDocument(user) {
    const docRef = db.collection('accounts').doc(user.uid)
    docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          // Ya existe el documento de este usuario
          console.log('Document data:', doc.data())
        } else {
          console.log('No such document!')
          // Creamos el documento
          docRef.set({
            username: user.displayName || user.email.split('@')[0], // use part of the email as a username
            email: user.email,
            image: user.newImage || '/images/default-profile.png' // supply a default profile image for all users
          })
          // this.userCreateDocument({ user })
          // this.$store.dispatch('userCreateDocument', { user })
        }
      })
      .catch(function(error) {
        console.log('Error getting document:', error)
      })
  }
}

export default functions
