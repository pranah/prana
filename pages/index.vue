<template>
  <v-layout
    justify-center
    align-center
    column
  >
    <v-flex xs12 sm12 md12 lg12>
      <!-- <v-row> -->
        <v-col>
          <v-card
          class="mx-auto"
          dark
          max-width="800"
          >
            <v-card-title class="text-center">
              Welcome!
            </v-card-title>
            <v-card-text>
              <Welcome v-if="currentAccount != null"/>
              <Login v-else />              
            </v-card-text>
            <v-card-text class="text-justify">

            eBook Publishing Using NFTs <br> <br>

            An eBook publishing platform where each copy of each title are represented by NFTs, thereby making them unique to enable new behaviors for the readers and giving them more freedom over the content they own.
           
            </v-card-text>
            
          </v-card>
        </v-col>
      <!-- </v-row> -->
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('web3', [
      'currentAccount'
    ])
  },
}
</script>

<style>

</style>