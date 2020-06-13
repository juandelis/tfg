import { db } from '~/services/fireinit'

const functions = {
  createPost(creatorId, creatorName, body, date) {
    db.collection('posts')
      .add({
        creatorId: creatorId,
        creatorName: creatorName,
        body: body,
        date: date,
        dislikes: [],
        likes: []
      })
      .then(function() {
        console.log('Post document successfully created!')
      })
      .catch(function(error) {
        console.error('Error creating post document: ', error)
      })
  },

  deletePost(idPostToDelete) {
    db.doc('posts/' + idPostToDelete)
      .delete()
      .then(function() {
        console.log('Post document successfully deleted!')
      })
      .catch(function(error) {
        console.error('Error removing post document: ', error)
      })
  }
}

export default functions
