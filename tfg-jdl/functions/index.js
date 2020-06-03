// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions')

// The Firebase Admin SDK to access the Firebase Firestore Database.
const admin = require('firebase-admin')
//admin.initializeApp(FirebaseConfig);
admin.initializeApp()
const db = admin.firestore()

exports.updateUserFollows = functions.firestore
  .document('accounts/{userId}')
  .onUpdate((change, context) => {
    const user = context.params.userId
    const newData = change.after.data()
    const oldData = change.before.data()

    // TEST
    const docRef = db.doc('accounts/' + user).update({
      //info: 'Me gusta Marta, es la mejor!!'
      info: 'TEST'
    })

    // Changes in Following array
    /*if(newData.following != oldData.following){
        // Follows (In newData but not in oldData)
        for (String userToFollow : newData.following){
          if(!oldData.following.includes(userToFollow)){
              // Add user to followers array of userToFollow
              const docRef = await db.collection('accounts').doc(userToFollow)
              docRef.update({
                followers: firestore.FieldValue.arrayUnion(user)
              })
              console.log("CUCU");
          }
        }
        // Unfollows (In oldData but not in newData)
        for (String userToUnfollow : oldData.following){
          if(!newData.following.includes(item)){
              // Remove user from followers array of userToUnfollow
              const docRef2 = await db.collection('accounts').doc(userToUnfollow)
              docRef2.update({
                followers: firestore.FieldValue.arrayRemove(user)
              })
              console.log("CHIQUITÍN");
          }
        }
      }*/

    return null
  })
