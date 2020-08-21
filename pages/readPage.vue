<template>

      <div>
        <nuxt-link to = "/collector">
        <v-btn small outlined color="blue" @click = "clearBookContent">Close</v-btn>
        </nuxt-link>
        <!-- <nuxt-link to = "/publisher">
        <v-btn v-if="publisherPage == true" small outlined color="blue" @click = "clearBookContent">Close</v-btn>
        </nuxt-link> -->
        <v-card-title>Book Content</v-card-title>
        <v-divider></v-divider>
        <!-- <File v-bind:textFile="textFile" /> -->
        <File/>
        <v-divider></v-divider>
    </div>


</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
    computed: {
        ...mapState('web3', [
            'currentAccount'
        ]),
        ...mapState('ipfs', [
            'textFile'
        ])    
    },
    methods: {
        ...mapMutations({
            clearBookContent: 'ipfs/clearBookContent',
        }),
       
    }
   
}
</script>

<style>
a {  text-decoration: none}
</style>