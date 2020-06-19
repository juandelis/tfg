// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions')

// Just 1 function so the following code is inside it to improve latency
/*// The Firebase Admin SDK to access the Firebase Firestore Database.
  const admin = require('firebase-admin')
  //admin.initializeApp(FirebaseConfig);
  admin.initializeApp()
  const db = admin.firestore()
  const firestore = admin.firestore*/

exports.deletedUser = functions.firestore
  .document('accounts/{userId}')
  .onDelete((snap, context) => {
    // The Firebase Admin SDK to access the Firebase Firestore Database.
    const admin = require('firebase-admin')
    //admin.initializeApp(FirebaseConfig);
    admin.initializeApp()
    const db = admin.firestore()
    const firestore = admin.firestore

    const userId = context.params.userId
    //const deletedData = snap.data()

    // Borrar usuario de Firebase Authentication
    admin
      .auth()
      .deleteUser(userId)
      .catch(error => {
        console.log('Error deleting user. ', error)
      })

    // Borrar imagen del storage
    admin
      .storage()
      .bucket()
      .file('profileImages/' + userId)
      .delete()
      .catch(error => {
        console.log('Error deleting profile image. ', error)
      })

    // Borrar Publicaciones suyas y borrar uid de likes/dislikes en el resto
    db.collection('posts')
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const postData = doc.data()
          // Si el post es del user, lo borramos
          if (postData.creatorId === userId) {
            db.collection('posts')
              .doc(doc.id)
              .delete()
              .catch(error => {
                console.error('Error removing post document. ', error)
              })
          }
          // Si el post no es suyo, buscamos y borramos su uid en los likes y dislikes
          else {
            if (postData.likes.includes(userId)) {
              db.collection('posts')
                .doc(doc.id)
                .update({
                  likes: firestore.FieldValue.arrayRemove(userId)
                })
            }
            if (postData.dislikes.includes(userId)) {
              db.collection('posts')
                .doc(doc.id)
                .update({
                  dislikes: firestore.FieldValue.arrayRemove(userId)
                })
            }
          }
        })
        return null
      })
      .catch(err => {
        console.log('Error getting posts documents. ', err)
      })

    // Borrar relaciones Follows del user
    db.collection('follows')
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const followData = doc.data()
          // Borramos toda relacion que tenga al user como origen o destino
          if (followData.ori === userId || followData.dest === userId) {
            db.collection('follows')
              .doc(doc.id)
              .delete()
              .catch(error => {
                console.error('Error removing follow document. ', error)
              })
          }
        })
        return null
      })
      .catch(error => {
        console.log('Error getting follows documents. ', error)
      })

    return null
  })
