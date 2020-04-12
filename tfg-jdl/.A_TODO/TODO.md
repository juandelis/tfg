
user.js
  --onSnapShot en user.js al documento del user cuando se inicia sesion
  --funciones de follow y unfollow
      --poner restricciones en las reglas para controlar que solo modificas tu array de seguidos
      --comparar array anterior con nuevo, operador ==
      --no se puede modificar tu array de seguidores, solo el de seguidos
      --El array del otro usuario puedes modificarlo pero solo para añadir/quitar tu id
      --quitar commit del store cuando esté sincronizado con onSnapShot
  borrar usuario
      quitarle de followers followed
      borrar sus publicaciones
  poner birth como Timestamp


posts/index.vue
  funciones de like y dislike
    solo puedes añadir/quitar tu uid de la lista de likes/dislikes del post
  Restricciones en posts para creacion (estar loggeado) y edicion (ser el creador)
  BOTON subir al comienzo
  Numero máximo de elementos a mostrar??
  missings ¿¿que es??
  onSnapShot para el user
      sincronizar también el nombre del usuario (si se cambia que se actualice tambien en el post)
      onSnapShot a users o Hacer con firebase functions (cambia o borra user, actualizar sus posts)?
      cuando cambia el name de un user actualizar sus posts, tambien cuando se borra un usuario, etc.

users/ _ id
  añadir seguidores y seguidos como en miperfil (aquí ambos tendrán boton de follow/unfollow)


account/index.vue
  No guardar aqui followers y followed, hacer onSnapShot en user.js a los documentos de los followers y following
  o crear nuevo usersFollowed.js con esta info
  ¿como hacer la query para obtener solo los documentos de los usuarios followers y following? array-contains


pagina contacto
