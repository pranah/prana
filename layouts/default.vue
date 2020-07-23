<template>
  <v-app dark>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-btn color="success" to="/">Prana</v-btn>
      <!-- <v-toolbar-title v-text="title"/> -->
      <v-spacer/>
      <Hud/>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt/>
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span><a href="https://mit-license.org/">MIT License {{ new Date().getFullYear() }}</a></span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {

  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      title: 'Prana',
      peerCount: 'LibP2P Peers: ' + this
    }
  },
  methods: {
      ...mapActions([
        'initLibP2P',
        'fleekUserId',
        'fetchProvider'
      ])
  },
  created() {
    this.initLibP2P();
    this.fetchProvider();
    this.fleekUserId();
  } 
}
</script>
