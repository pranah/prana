<template>
<div>
    <v-list-item>
        <v-list-item-content>
          <v-list-item-title><b>Token ID: {{content.tokenId}}</b></v-list-item-title>
          <v-list-item-subtitle>ISBN: {{content.isbn}}</v-list-item-subtitle>
        </v-list-item-content>
    </v-list-item>
        <!-- https://cdn.vuetifyjs.com/images/cards/mountain.jpg -->
        <!-- <v-img
        src="https://images.unsplash.com/photo-1558677949-260173506bbf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1334&q=80"
        height="194"
        ></v-img> -->

    <v-card-text class="text-left">
      <b>Copy Number: {{ content.copyNumber }}</b><br><br>
      <b>Hash: </b>{{ content.hash }}<br><br>
    </v-card-text>
    <v-card-subtitle v-if="content.pathToFile.length> 1" class="text-left"><b>Path to file: </b>{{ "file://" + content.pathToFile }}</v-card-subtitle>
    <v-card-subtitle v-else class="text-left"><b>Path to file:</b> Please Download Content</v-card-subtitle>
</div>
  
</template>

<script>
import { mapActions } from 'vuex'

export default {
    props: ['content'],
    methods: {
        // ...mapActions('libp2p', [
        //     'subscribeToContent'
        // ])
    },
    created() {
        // this.subscribeToContent(this.content.bucket);
    },
}
</script>

<style>

</style>