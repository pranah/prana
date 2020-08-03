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
              <v-btn small outlined color="green" @click="collectorPageSwitchFlip(false)">Collect</v-btn>
              <v-btn small outlined color="green" @click="collectorPageSwitchFlip(true)">Collection</v-btn>
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
    ...mapState('fleek',[
      'collectorPageSwitch'
    ])
  },
  methods: {
    ...mapMutations('fleek',[
      'collectorPageSwitchFlip'
    ])
  }
}
</script>

<style>

</style>