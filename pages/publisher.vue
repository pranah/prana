<template>
  <v-layout
    justify-center
    align-center
  >
    <v-flex class="text-center">
      <v-card>
        <v-row>
          <v-col>
            <v-btn color="success" @click="publisherPageSwitchFlip()">Publish/Published</v-btn>
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
    ...mapState([
      'publisherPageSwitch'
    ])
  },
  methods: {
    ...mapMutations([
      'publisherPageSwitchFlip'
    ])
  }
}
</script>
