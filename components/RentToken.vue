<template>
    <div>
        <v-img
        :src= "`https://ipfs.io/ipfs/${content.imageHash}`"
        height="400px"
        ></v-img>
        <v-card-text>
            <b>{{content.title}}</b><br>
            <b>Copy Number: </b>  {{content.copyNumber}} <br>
            <b> Renting Price: </b>{{content.rentingPrice}} ETH
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