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

            Digital Content Distribution using NFTs <br> <br>

            We humans have a unique way of adding value to entities just by interacting with it: a particular DVD of Star Wars once owned by Mark Hamill fetches more than its MRP (Maximum Retail Price), you attach sentimental value to the watch that your dad gave you (so much so that you’re not willing to part with it for any sum of money). This level of interaction and sentiment-attachment is only possible in the physical realm, precisely because there is no uniqueness attached with digital copies. Until the advent of blockchain and Non-Fungible Tokens.

            With NFTs, suddenly we’re able to hold unique digital collectibles, attach sentimental value to it, and have a history associated with it. But they don’t just have to be collectibles. They can be utilitarian entities, just like the watch that you wear to tell time. Here we propose such a platform for utilitarian non-fungible tokens: for digital content.

            All forms of digital content (movies, e-books, tv series, comics, music, games, etc.) can be distributed on the platform, but we’ll concentrate on e-books for simplicity and scope of this project.
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