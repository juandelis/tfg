user.js
  funciones de follow y unfollow
      poner restricciones en las reglas para controlar que solo modificas tu array de seguidos
      comparar array anterior con nuevo, operador ==
      no se puede modificar tu array de seguidores
      El array del otro usuario se actualiza desde el servidor Firebase con funciones
  otra opcion seria
      Cambiar sistema de seguidores a una coleccion aparte con los pares origen destino
      seguir a alguien significa ponerte como origen y al usuario a seguir como destino
      por tanto, solo se puede añadir documento con tu id como origen y otro id como destino
  funciones de like y dislike
      añadir en el doc del user un array de ids de post que ha dado like y otro para dislikes
      estos serán los que pueda modificar el usuario y las funciones de firebase modificaran el documento del post
      esto evita que los usuarios puedan modificar directamente las publicaciones, solo pueden añadir posts a sus likes o dislikes
  poner date como Timestamp


posts/index.vue
  BOTON subir al comienzo
  Numero máximo de elementos a mostrar??
  missings ¿¿que es??
  onSnapShot para el user
      sincronizar también el nombre del usuario (si se cambia que se actualice tambien en el post)
      onSnapShot a users o Hacer con firebase functions (cambia o borra user, actualizar sus posts)?
      cuando cambia el name de un user actualizar sus posts, tambien cuando se borra un usuario, etc.

users/index.vue
  obtener users desde users.js igual que hacemos con posts.js

users/ _ id
  añadir seguidores y seguidos como en miperfil (aquí ambos tendrán boton de follow/unfollow)


account/index.vue
  onSnapShot en user.js al documento del user
  No guardar aqui followers y followed, hacer onSnapShot en user.js a los documentos de los followers y following
  o crear nuevo usersFollowed.js con esta info
  ¿como hacer la query para obtener solo los documentos de los usuarios followers y following?
