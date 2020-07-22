<template>
  <v-layout row wrap>
    <v-flex >
      <v-row>
        <v-col>ETH Block Height: (WIP)</v-col>
        <v-col>LibP2Peers: {{ peerConnections }}</v-col>
      </v-row>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {

    methods: {
      ...mapActions([
      ])
    },
    computed: {
      ...mapState([
          'peerConnections'
      ])
    },
    created() {
    }      
    
}
</script>

<style>

</style>