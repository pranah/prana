<template>
    <div>
        <v-list-item>
        <v-list-item-content>
            <v-list-item-title><b>ISBN: {{content.isbn}}</b></v-list-item-title>
        </v-list-item-content>
        </v-list-item>
        <!-- https://cdn.vuetifyjs.com/images/cards/mountain.jpg -->
        <!-- <v-img
        src="https://images.unsplash.com/photo-1558677949-260173506bbf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1334&q=80"
        height="194"
        ></v-img> -->

        <v-card-text class="text-left">
        <b>Price: </b>{{content.price}} ETH<br><br>
        <b>Publisher: </b>{{content.publisher}}<br>
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
        ]),
        
    },
   
}
</script>

<style>

</style>