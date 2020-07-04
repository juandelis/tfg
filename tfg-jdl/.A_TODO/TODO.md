
GENERAL
  --Cambiar array de followers y following por collecion de follows con un documento por cada Follower-Followed (origen-destino)
  --Revisar metodos de busqueda/filtro
  --Cloud Functions para si se borra doc de user borrar follows, publicaciones e imagen en el storage (si tiene)
  --Storage rules para modificar solo tu imagen de perfil
  --Version móvil - PWA Nuxt
  *Normas memoria*
  *numeracion figuras*
  *usar vuetify para img, forms, etc.*
  *Verificar email al registrarse*
  --Idioma del Authentication FirebaseUI
  --Cambiar icono, nombre y page de inicio
  --Tamaño img y card en %, no en px
  Hacer nombre de usuario unico o sin espacios
  Posibilidad de cuentas privadas que no muestran sus posts hasta que haces follow y acepta
  Documento de usuarios con email/username como id (nombre del documento), hacer email algo único al registrarse, no emails repetidos


account/index.vue
  --Boton/ventana borrar usuario
  --Mensaje pagina delete
  --Cambiar contraseña debe comprobar si user es de Google para no dejarte

user.js
  --onSnapshot en user.js al documento del user cuando se inicia sesion
  --funciones de follow y unfollow
      --poner restricciones en las reglas de firestore: solo puedes crear un documento follow con tu id como origen y otro como destino
  --en el onSnapshot hacer logout si se borra el documento del user logged
  Cloud Functions para actualizar el nombre del creador en publicaciones cuando se actualiza el nombre del usuario,
  poner birth como Timestamp (convertir html date to Timestamp)

myposts.js
  --No poder like y dislike
  --Funcion de borrar post (borrar documento) y crear en assets/functions.js


users/ _ id
  --añadir sus publicaciones

userToShow.js
  --En el onSnapshot si se borra el documento redirigir al inicio


posts/index.vue
  --Mostrar solo las publicaciones de los usuarios a los que sigues (query?filtro?)
  -- Firestore rules
    --like y dislike solo puedes añadir/quitar tu uid de la lista de likes/dislikes del post
    --creacion (estar loggeado) y edicion (ser el creador)
  --Publicaciones propio usuario separadas de las demás
  BOTON subir al comienzo
  Numero máximo de elementos a mostrar??
  missings ¿?
  transaciones ¿?


pagina contacto o poner en la pagina de inicio
