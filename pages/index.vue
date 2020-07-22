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
              <Login v-if="metaMaskConnected == false" />
              <Welcome v-else/>
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
    ...mapState([
      'metaMaskConnected'
    ])
  },
}
</script>

<style>

</style>