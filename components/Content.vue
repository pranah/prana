<template>
    <div>
        
        <!-- https://images.unsplash.com/photo-1558677949-260173506bbf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1334&q=80 -->
        <v-img
        :src= "`https://ipfs.io/ipfs/${content.imageHash}`"
        height="400px"
        ></v-img>
        <v-card-text>
            <b>{{content.title}}</b><br>
            <b>Price: </b>{{content.price}} ETH
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