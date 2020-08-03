<template>
<div>
  <v-container>
      <v-row dense>
        <v-col
          v-for="(item, i) in items"
          :key="i"
          cols="12"
        >
            <v-flex xs12 sm12 md12 lg12 >

                <v-card color = '#1F7087'>
                    <div class="d-flex flex-no-wrap justify-space-between">
                        <v-avatar
                        class="ma-3"
                        size="125"
                        tile
                        >
                            <v-img :src="item.src"></v-img>
                        </v-avatar>
                        <div class="text-left">
                            <v-card-title
                            class="headline"
                            >ISBN: {{content.isbn}}</v-card-title>

                            <v-card-subtitle>Token ID: {{content.tokenId}}</v-card-subtitle>
                            <v-card-subtitle>Bucket: {{ content.bucket }}</v-card-subtitle>
                            <v-card-subtitle>Metadata: {{ content.metadata }}</v-card-subtitle>
                            <v-card-subtitle>Copy Number: {{ content.copyNumber }}</v-card-subtitle>
                        </div>
                    </div>
                </v-card>
            </v-flex>
        </v-col>
      </v-row>
    </v-container>


</div>
  
</template>

<script>
import { mapActions } from 'vuex'

export default {
    props: ['content'],
    methods: {
        ...mapActions('libp2p', [
            'subscribeToContent'
        ])
    },
    created() {
        this.subscribeToContent(this.content.bucket);
    },
    data: () => ({
      items: [
        {
          color: '#1F7087',
          src: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          title: 'Supermodel',
          artist: 'Foster the People',
        },
      ],
    }),
}
</script>

<style>

</style>