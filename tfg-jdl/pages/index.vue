<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-xs-center">
        <img
          src="/images/GamersCrew.png"
          alt="GAMER/CREW"
          class="mb-5"
          height="600"
          width="800"
        />
      </div>

      <v-card>
        <v-card-title class="headline">
          GAMER/CREW
        </v-card-title>
      </v-card>
      <br />

      <v-card>
        <v-card-title class="headline">
          GAMER/CREW
        </v-card-title>

        <v-card-text>
          <p>
            Vuetify is a progressive Material Design component framework for
            Vue.js. It was designed to empower developers to create amazing
            applications.
          </p>
          <p>
            For more information on Vuetify, check out the
            <a href="https://vuetifyjs.com" target="_blank">documentation</a>.
          </p>
          <p>
            If you have questions, please join the official
            <a href="https://chat.vuetifyjs.com/" target="_blank" title="chat"
              >discord</a
            >.
          </p>
          <p>
            Find a bug? Report it on the github
            <a
              href="https://github.com/vuetifyjs/vuetify/issues"
              target="_blank"
              title="contribute"
              >issue board</a
            >.
          </p>
          <p>
            Thank you for developing with Vuetify and I look forward to bringing
            more exciting features in the future.
          </p>
        </v-card-text>

        <hr class="my-3" />
        <v-card-actions>
          <v-spacer />
          <v-btn color="green" flat nuxt to="/login">
            LOGIN
          </v-btn>
          <v-btn color="orange" flat nuxt to="/login/register">
            REGISTER
          </v-btn>
          <v-spacer />
        </v-card-actions>
        <br />
      </v-card>
    </v-flex>
  </v-layout>
</template>
