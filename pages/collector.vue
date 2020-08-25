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
              <v-btn small outlined color="blue" @click="collectorPageSwitchFlip(true)">Buy a new book</v-btn>
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
  /* .container {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 

  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 26px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
} */
</style>
