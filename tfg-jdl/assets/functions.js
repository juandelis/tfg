import { db } from '~/services/fireinit'

const functions = {
  createUserDocument(user, name, birth, genre, info, image) {
    const docRef = db.collection('accounts').doc(user.uid)
    docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          // Ya existe el documento de este usuario
          console.log('Document already exists:', doc.data())
        } else {
          console.log('No such document!')
          // Creamos el documento
          docRef.set({
            birth: birth,
            email: user.email,
            following: [],
            followers: [],
            genre: genre,
            info: info || '', // info personal por defecto vacía, editable luego
            image: image || '/default-profile.png', // imagen por defecto, editable luego
            name: name
            // TODO CAMPOS QUE SEAN NECESARIOS
            // username: user.email.split('@')[0] // parte del email como username
          })
        }
      })
      .catch(function(error) {
        console.log('Error getting document:', error)
      })
  },
  createPostDocument(body, creatorId, creatorName, date, tittle) {
    db.collection('posts').add({
      body: body,
      creatorId: creatorId,
      creatorName: creatorName,
      date: date,
      dislikes: [],
      likes: [],
      score: 0,
      tittle: tittle
    })
  }
}

export default functions
