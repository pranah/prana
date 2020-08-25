<template>
<section class="container">
  <v-layout
    justify-center
    align-center
  >
    <v-flex class="text-center">
      <v-card>
        <v-row>
          <v-col>
            <v-btn-toggle mandatory >
              <v-btn small outlined color="blue" @click="publisherPageSwitchFlip(false)">Publish a new work</v-btn>
              <v-btn small outlined color="blue" @click="publisherPageSwitchFlip(true)">My Published works</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
        <Publish v-if="publisherPageSwitch == false"/>
        <Published v-else/>
      </v-card>
    </v-flex>
  </v-layout>
  </section>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('web3',[
      'publisherPageSwitch'
    ])
  },
  methods: {
    ...mapMutations('web3',[
      'publisherPageSwitchFlip'
    ])
  }
}
</script>
