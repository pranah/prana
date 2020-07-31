<template>
  <v-layout
    justify-center
    align-center
    column
  >
    <v-flex>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title class="headline">
              Welcome!
            </v-card-title>
            <v-card-text>
              <Welcome v-if="currentAccount != null"/>
              <Login v-else />              
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
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