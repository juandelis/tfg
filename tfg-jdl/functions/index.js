const functions = require('firebase-functions');

exports.updateUser = functions.firestore
    .document('accounts/{userId}')
    .onUpdate((change, context) => {
      const newData = change.after.data();
      const oldData = change.before.data();

      // Cambio en usuarios seguidos (array Following)
      if(newData.following != oldData.following){

      }


      // access a particular field as you would any JS property
      const name = newValue.name;

      // perform desired operations ...
    });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
