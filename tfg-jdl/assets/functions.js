import { db, getCurrentUser } from '~/services/fireinit'

const functions = {
  createPost(creatorId, creatorName, body, date) {
    db.collection('posts')
      .add({
        creatorId,
        creatorName,
        body,
        date,
        dislikes: [],
        likes: [],
      })
      .then(function () {
        console.log('Post document successfully created!')
      })
      .catch(function (error) {
        console.error('Error creating post document: ', error)
      })
  },

  deletePost(idPostToDelete) {
    db.doc('posts/' + idPostToDelete)
      .delete()
      .then(function () {
        console.log('Post document successfully deleted!')
      })
      .catch(function (error) {
        console.error('Error removing post document: ', error)
      })
  },

  async deleteUser() {
    const user = await getCurrentUser()
    db.doc('accounts/' + user.uid)
      .delete()
      .then(function () {
        console.log('USER DOCUMENT SUCCESSFULLY DELETED!')
      })
      .catch(function (error) {
        console.error('Error deleting user document: ', error)
      })
  },
}

export default functions
