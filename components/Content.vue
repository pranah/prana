<template>
    <div>
        <v-list-item>
        <v-list-item-content>
            <v-list-item-title><b>ISBN: {{content.isbn}}</b></v-list-item-title>
            <v-list-item-subtitle>by {{content.publisher}}</v-list-item-subtitle>
        </v-list-item-content>
        </v-list-item>

        <v-img
        src="https://cdn.vuetifyjs.com/images/cards/mountain.jpg"
        height="194"
        ></v-img>

        <v-card-text class="text-left">
        <!-- Visit ten places on our planet that are undergoing the biggest changes today.<br> -->
        Price: {{content.price}}<br>
        Publisher: {{content.publisher}}<br>
        </v-card-text>  
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