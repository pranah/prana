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
              <v-btn small outlined color="green"@click="publisherPageSwitchFlip(false)">Publish</v-btn>
              <v-btn small outlined color="green"@click="publisherPageSwitchFlip(true)">Published</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
        <Publish v-if="publisherPageSwitch == false"/>
        <Published v-else/>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('fleek',[
      'publisherPageSwitch'
    ])
  },
  methods: {
    ...mapMutations('fleek',[
      'publisherPageSwitchFlip'
    ])
  }
}
</script>
