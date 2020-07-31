<template>
  <v-layout row wrap>
    <v-flex >
      <v-row v-if="p2pNode != null">
        <v-col>Peer ID: {{ p2pNode.peerId.toB58String() }}</v-col>
        <v-col>Peers: {{ p2pNode.registrar.connectionManager.connections.size }}</v-col>
      </v-row>
      <v-row v-else>Loading</v-row>
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
      ...mapState('libp2p', [
        'p2pNode'
      ]),
      ...mapState('web3', [
        'web3'
      ])
    },
    created() {
    }      
    
}
</script>

<style>

</style>