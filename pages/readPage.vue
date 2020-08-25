<template>
<section class="container">
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
        <Progressbar :progress="progress" />
        <File @progressUpdate="setProgress" />
        <v-divider></v-divider>
    </div>

</section>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
    data () {
    return {
      progress: 0
    }
    },
    // components: {
    //             File,
    //             Progressbar
    // },
    computed: {
        ...mapState('web3', [
            'currentAccount'
        ]),
        ...mapState('ipfs', [
            'textFile'
        ])    
    },
    methods: {
        setProgress (progress) {
        this.progress = progress;
    },
        ...mapMutations({
            clearBookContent: 'ipfs/clearBookContent',
        }),
       
    }
   
}
</script>

<style>
.container {
    background-color: white;
}
a {  text-decoration: none}
</style>