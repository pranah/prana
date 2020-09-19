<template>
    <div>
        <v-img
        :src= "`https://ipfs.io/ipfs/${content.imageHash}`"
        height="300px"
        ></v-img>
        <v-list-item>
        <v-list-item-content>
            <v-list-item-title><b>{{content.title}}</b></v-list-item-title>
        </v-list-item-content>
        </v-list-item>
        <!-- https://cdn.vuetifyjs.com/images/cards/mountain.jpg -->
        <!-- <v-img
        src="https://images.unsplash.com/photo-1558677949-260173506bbf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1334&q=80"
        height="194"
        ></v-img> -->
        <v-card-text class="text-left">
        <b>Copy Number: {{content.copyNumber}} </b><br>
        <!-- <b>ISBN: {{content.isbn}}</b><br><br> -->
        <b>Resale Price: </b>{{content.resalePrice}} ETH<br>
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