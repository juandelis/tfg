
GENERAL
  Intentar meter los filtros de radioButton en los queries y revisar metodos de busqueda/filtro
  Posibilidad de cuentas privadas que no muestran su info/posts/follows hasta que haces follow y acepta
  Documento de usuarios con email/username como id (nombre del documento), hacer email algo único al registrarse, no emails repetidos
  Cambiar nombre de coleccion "accounts" a "users"


Follows
  --Cambiar array de followers y following por collecion de follows con un documento por cada Follower-Followed (origen-destino)
  En los follows añadir un campo status que sea solicitado (?), aceptado (OK) y rechazado (KO o borrar documento)
  Modificar las reglas de firestore para crear follow con estado ? si eres ori, y pasar de ? a OK/KO si eres dest



user.js
  --onSnapshot en user.js al documento del user cuando se inicia sesion
  --funciones de follow y unfollow
      --poner restricciones en las reglas de firestore: solo puedes crear un documento follow con tu id como origen y otro como destino
  borrar usuario
      Cloud Functions para borrar sus follows y sus publicaciones
  Cloud Functions para actualizar el nombre del creador en publicaciones cuando se actualiza el nombre del usuario,
  poner birth como Timestamp (convertir html date to Timestamp)


users/ _ id
  añadir sus publicaciones
  añadir seguidores y seguidos como en account (aquí ambos tendrán boton de follow/unfollow)


account/index.vue
  No guardar aqui followers y followed, usar users.js o crear nuevo usersFromFollows.js con esta info
  ¿como hacer la query para obtener solo los documentos de los usuarios followers y following? array-contains


posts/index.vue
  Mostrar solo las publicaciones de los usuarios a los que sigues (query?filtro?)
  --No poder like y dislike a tus publicaciones pero poder borrarlas
  --funciones de like y dislike
    --solo puedes añadir/quitar tu uid de la lista de likes/dislikes del post
  --Restricciones en posts para creacion (estar loggeado) y edicion (ser el creador)
  --Publicaciones propio usuario separadas de las demás
  BOTON subir al comienzo
  Numero máximo de elementos a mostrar??
  missings ¿?
  transaciones ¿?


pagina contacto o poner en la pagina de inicio
