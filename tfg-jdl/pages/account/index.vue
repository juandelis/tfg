<template>
  <v-layout justify-center>
    <v-flex text-xs-center xs12 sm8 md6>
      <v-card>
        <h1 align="center">MI PERFIL</h1>

        <hr />
        <br />

        <v-layout row>
          <v-flex>
            <h3 align="left">&nbsp; NOMBRE: &nbsp; {{ user.name }}</h3>
            <br />
            <h3 align="left">
              &nbsp; FECHA NACIMIENTO: &nbsp; {{ user.birth }}
            </h3>
            <br />
            <h3 align="left">&nbsp; GENERO: &nbsp; {{ user.genre }}</h3>
            <br />
            <h3 align="left">
              &nbsp; DESCRIPCIÓN PERSONAL / AFICIONES: &nbsp;
            </h3>
            <h3 align="left">&nbsp; {{ user.info }} &nbsp;</h3>
            <br />
            <v-btn nuxt to="/account/edit">
              EDITAR
            </v-btn>
            <v-btn nuxt @click="change_password()">
              CAMBIAR CONTRASEÑA
            </v-btn>
          </v-flex>
          <v-flex>
            <v-card>
              <img
                :src="user.image"
                alt="User profile photo"
                width="190px"
                height="240px"
              />
              <br />
              <v-btn nuxt @click="change_image()">
                CAMBIAR IMAGEN PERFIL
              </v-btn>
            </v-card>
          </v-flex>
          &nbsp;&nbsp;&nbsp;&nbsp;
        </v-layout>

        <br /><br />
      </v-card>

      <br />

      <v-card>
        <br />
        <h1 align="center">SEGUIDORES / OTRA SECCION</h1>
        <br />

        <hr />
        <br />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({}),
  middleware: 'autenticado',
  computed: {
    ...mapState('user', ['user'])
  }
}
</script>

<style scoped></style>
