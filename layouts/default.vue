<template>
  <v-app light>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      color="blue"
      fixed
      app
    >
      <v-layout
        justify-center
        align-center
        column
      >
        <v-flex>
          <v-row>
            <v-col>
              <v-btn outlined color="white" to="/">Prana</v-btn>
            </v-col>            
          </v-row>
          <v-row>
            <v-col>
              <v-btn outlined color="white" to="/publisher">As an author </v-btn>
            </v-col>            
          </v-row>
          <v-row>
            <v-col>
              <v-btn outlined color="white" to="/collector">As a reader</v-btn>
            </v-col>            
          </v-row>
        </v-flex>
      </v-layout>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
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
      <!-- <span><a href="https://mit-license.org/">MIT License {{ new Date().getFullYear() }}</a></span> -->
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
      right: true,
      rightDrawer: false,
      miniVariant: false,
      title: 'Prana',
      peerCount: 'LibP2P Peers: ' + this
    }
  },
  methods: {
      ...mapActions({
        fetchProvider: 'web3/fetchProvider',
        getAccount: 'web3/getAccount',
      })
  },
  created() {
    this.fetchProvider();
    this.getAccount();
  },
  async fetch() {
  }
}
</script>
