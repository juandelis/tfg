<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm10 md8 lg8 xl7>
      <v-card>
        <v-card-title class="headline justify-center">
          <v-avatar
            tile
            :size="
              $vuetify.breakpoint.xs
                ? 30
                : $vuetify.breakpoint.sm
                ? 40
                : $vuetify.breakpoint.md
                ? 50
                : $vuetify.breakpoint.lg
                ? 60
                : $vuetify.breakpoint.xl
                ? 70
                : 50
            "
          >
            <img src="icon.png" alt="app icon" />
          </v-avatar>
          &nbsp;&nbsp;&nbsp;
          <h3 v-if="$vuetify.breakpoint.xs">
            GamersTalk
          </h3>
          <h2 v-else-if="$vuetify.breakpoint.md || $vuetify.breakpoint.sm">
            GamersTalk
          </h2>
          <h1 v-else-if="$vuetify.breakpoint.lg || $vuetify.breakpoint.xl">
            GamersTalk
          </h1>
          <h1 v-else>GamersTalk</h1>
          &nbsp;&nbsp;&nbsp;
          <v-avatar
            tile
            :size="
              $vuetify.breakpoint.xs
                ? 30
                : $vuetify.breakpoint.sm
                ? 40
                : $vuetify.breakpoint.md
                ? 50
                : $vuetify.breakpoint.lg
                ? 60
                : $vuetify.breakpoint.xl
                ? 70
                : 50
            "
          >
            <img src="icon.png" alt="app icon" />
          </v-avatar>
        </v-card-title>
        <hr />
        <v-card-text>
          <h3>
            Bienvenido a la nueva red social para aficionados a los videojuegos,
            dónde podrás crear publicaciones breves de texto para tus seguidores
            y valorar las publicaciones del resto de usuarios.
          </h3>
          <br />
          <h3>
            Tan sólo debes rellenar un sencillo registro (email, contraseña y
            nombre de usuario) o acceder con tu cuenta de Google y ya podrás
            disfrutar por completo de la aplicación: buscar usuarios a los que
            seguir, empezar a escribir publicaciones, añadir un avatar a tu
            perfil y mucho más...
          </h3>
        </v-card-text>
      </v-card>
      <br />
      <v-card>
        <v-card-text>
          La aplicación ha sido desarrollada por Juan de Lis como TFG de
          ingeniería informática para la Universidad Autónoma de Madrid.
          Cualquier duda o consulta contactar con:<br />
          · &nbsp;juanlis96@gmail.com<br />
          · &nbsp;juan.lis@estudiante.uam.es
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
