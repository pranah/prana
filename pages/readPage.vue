<template>
    
      <div>
        <v-btn small outlined color="blue"  to="/collector">Close</v-btn>
        <v-card-title>Book Content</v-card-title>
        <v-divider></v-divider>
        <File v-bind:textFile="textFile" />
        <v-divider></v-divider>
    </div>
        

</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    computed: {
        ...mapState('web3', [
            'currentAccount'
        ]),
        ...mapState('ipfs', [
            'textFile'
        ])

        
    },
   
}
</script>

<style>

</style>