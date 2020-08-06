<template>
  <v-layout
    justify-center
    align-center
  >
    <v-flex class="text-center">
      <v-card>
        <v-row>
          <v-col>
            <v-btn-toggle mandatory >
              <v-btn small outlined color="blue" @click="collectorPageSwitchFlip(false)">Buy a new book</v-btn>
              <v-btn small outlined color="blue" @click="collectorPageSwitchFlip(true)">My Library</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
        <v-row>
          <Collect v-if="collectorPageSwitch == false"/>
          <Collection v-else/>
        </v-row>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('web3',[
      'collectorPageSwitch'
    ])
  },
  methods: {
    ...mapMutations('web3',[
      'collectorPageSwitchFlip'
    ])
  }
}
</script>

<style>

</style>