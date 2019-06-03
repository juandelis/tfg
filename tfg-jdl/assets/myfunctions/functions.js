import { db } from '~/services/fireinit'

const functions = {
  createUserDocument(user, username) {
    console.log('11')
    const docRef = db.collection('accounts').doc(user.uid)
    docRef
      .get()
      .then(function(doc) {
        console.log('12')
        if (doc.exists) {
          // Ya existe el documento de este usuario
          console.log('Document data:', doc.data())
        } else {
          console.log('No such document!')
          // Creamos el documento
          docRef.set({
            username: username || user.email.split('@')[0], // use part of the email as a username
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
