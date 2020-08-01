<template>
<div>
    <!-- <v-col>
        {{content.returnValues.isbn}}
    </v-col> -->
  
            <!-- <v-card
                max-width="344"
                class="ma-3"
            > -->
                <v-list-item>
                <v-list-item-content>
                    <v-list-item-title><b>ISBN: {{content.returnValues.isbn}}</b></v-list-item-title>
                    <v-list-item-subtitle>by {{content.returnValues.publisher}}</v-list-item-subtitle>
                </v-list-item-content>
                </v-list-item>

                <v-img
                src="https://cdn.vuetifyjs.com/images/cards/mountain.jpg"
                height="194"
                ></v-img>

                <v-card-text class="text-left">
                <!-- Visit ten places on our planet that are undergoing the biggest changes today.<br> -->
                Price: {{content.returnValues.price}}<br>
                Publisher: {{content.returnValues.publisher}}<br>
                </v-card-text>

                <!-- <v-card-actions> -->
                <!-- <v-btn
                    outlined
                    small
                    color="green"
                >
                    Download
                </v-btn> -->
                <!-- <v-spacer></v-spacer> -->

                <!-- <v-btn
                    outlined
                    small
                    color="green"
                >
                    Collect
                </v-btn>
                </v-card-actions> -->
            <!-- </v-card> -->
  


  
</div>
    
    
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    props: ['content'],
    computed: {
        ...mapState('web3', [
            'currentAccount'
        ])
    },
   
}
</script>

<style>

</style>