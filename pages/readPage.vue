<template>
<section class="container">
      <div>
        <nuxt-link to = "/collector">
        <v-btn small outlined color="blue" @click = "clearBookContent">Close</v-btn>
        </nuxt-link>
        <br>
        <!-- <nuxt-link to = "/publisher">
        <v-btn v-if="publisherPage == true" small outlined color="blue" @click = "clearBookContent">Close</v-btn>
        </nuxt-link> -->
        <v-card-title v-if = "content" class = "title">{{content.title}}</v-card-title>
        <!-- <v-btn small color="blue" class = "note">Add annotation</v-btn> -->
        <AnnotationDialog v-bind:content="content"/>
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
            'textFile', 'content'
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
a {
    text-decoration: none
}
.title {
    align-content: center;
}
.note{
    margin-right: 50;
    margin-left:auto;
    display:block;
}
.border {
  border: 2px blue dashed;
}


</style>