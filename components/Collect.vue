<template>
    <v-col>
        <h3>Collectable Works</h3>
        <v-card>
        <v-tabs
          v-model="tabs"
          centered
          grow
        >
          <v-tab
            v-for="title in titles"
            :key="titles.indexOf(title)"
          >
            {{title}}
          </v-tab>
        </v-tabs>

    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <v-layout row wrap>
            <v-flex xs12 sm6 md4 lg4 v-for="content in collectableContent" :key="collectableContent.indexOf(content)">
                <v-card max-width="344" class="ma-3" color = "grey darken-3">
                    <Content v-bind:content="content"/>  
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                        outlined
                        small
                        color="green"
                        @click="purchase(content)"
                        >
                        Collect
                        </v-btn> 
                    </v-card-actions> 
                </v-card>
            </v-flex>
        </v-layout>
      </v-tab-item>
      <v-tab-item>
        <v-layout row wrap>
            <v-flex xs12 sm6 md4 lg4 v-for="content in resaleTokens" :key="resaleTokens.indexOf(content)">
                <v-card max-width="344" class="ma-3" color = "grey darken-3">
                    <ResaleToken v-bind:content="content"/>  
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                        outlined
                        small
                        color="green"
                        @click="purchase(content)"
                        >
                        Collect
                        </v-btn> 
                    </v-card-actions> 
                </v-card>
            </v-flex>
        </v-layout>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
        <!-- <v-layout row wrap>
            <v-flex xs12 sm6 md4 lg4 v-for="content in collectableContent" :key="collectableContent.indexOf(content)">
                <v-card max-width="344" class="ma-3" color = "grey darken-3">
                    <Content v-bind:content="content"/>  
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                        outlined
                        small
                        color="green"
                        @click="purchase(content)"
                        >
                        Collect
                        </v-btn> 
                    </v-card-actions> 
                </v-card>
            </v-flex>
        </v-layout> -->
    </v-col>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    computed: {
        ...mapState('web3', [
            'collectableContent',
            'resaleTokens'
        ])
    },
    methods: {
        ...mapActions('web3', [
            'getCollectables',
            'purchase'
        ]),
    },
    data () {
      return {
        tabs: null,
        titles: ['DIRECT PURCHASE', 'FOR RESALE']
      }
    },
}
</script>

<style>

</style>