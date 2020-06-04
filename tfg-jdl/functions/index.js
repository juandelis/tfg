// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions')

// The Firebase Admin SDK to access the Firebase Firestore Database.
const admin = require('firebase-admin')
//admin.initializeApp(FirebaseConfig);
admin.initializeApp()
const db = admin.firestore()
const firestore = admin.firestore

exports.updateUserFollows = functions.firestore
  .document('accounts/{userId}')
  .onUpdate((change, context) => {
    const user = context.params.userId
    const newData = change.after.data()
    const oldData = change.before.data()

    // TEST
    // Changes in Following array
    /*if (newData.following !== oldData.following) {
      console.log('CUCU')
      const docRef = db.doc('accounts/' + user).update({
        //info: 'Me gusta Marta, es la mejor!!'
        info: 'TEST 4'
      })
    }*/

    // Changes in Following array
    if (newData.following !== oldData.following) {
      // Follows (In newData but not in oldData)
      newData.following.forEach(userToFollow => {
        if (!oldData.following.includes(userToFollow)) {
          // Add user to followers array of userToFollow
          db.collection('accounts')
            .doc(userToFollow)
            .update({
              followers: firestore.FieldValue.arrayUnion(user)
            })
        }
      })
      // Unfollows (In oldData but not in newData)
      oldData.following.forEach(userToUnfollow => {
        if (!newData.following.includes(userToUnfollow)) {
          // Remove user from followers array of userToUnfollow
          db.collection('accounts')
            .doc(userToUnfollow)
            .update({
              followers: firestore.FieldValue.arrayRemove(user)
            })
        }
      })
    }

    return null
  })
