<template>
  <!-- <v-layout
    justify-center
    align-center
  > -->
  <section class="container">
    <v-flex class="text-center">
        <v-row>
          <v-col>
            <v-btn-toggle mandatory >
              <v-btn small outlined color="blue" @click="collectorPageSwitchFlip(false)">My Library</v-btn>
              <v-btn small outlined color="blue" @click="collectorPageSwitchFlip(true)">Grab a book</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
        <v-row>
          <Collect v-if="collectorPageSwitch == true"/>
          <Collection v-else/>
        </v-row>
    </v-flex>
  </section>
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
.container{
    background-color: #ECEFF1;
}

</style>
