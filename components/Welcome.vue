<template>
  <v-row>
    <v-col><v-btn color="success" to="/publisher">Publisher</v-btn></v-col>
    <v-spacer/>
    <v-col><v-btn color="success" to="/collector">Collector</v-btn></v-col>
  </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
    computed: {
      ...mapState([
          'libp2pId',
          'isMetaMask'
      ])
    },
}
</script>

<style>

</style>