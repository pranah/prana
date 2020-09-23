<template>
<section class="container">
      <div>
        <nuxt-link to = "/collector">
        <v-btn small outlined color="blue" @click = "clearBookContent">Close</v-btn>
        </nuxt-link>
        <br>
        <v-card-title v-if = "content" class = "title">{{content.title}}</v-card-title>

        <Progressbar :progress="progress" />
        <v-divider></v-divider>
        <div v-if = "content" class="app-layout">
            <div v-if = "!(typeof content.annotations === 'undefined')" class="annotations">
                <v-card-title v-if = "content" class = "title">ANNOTATIONS</v-card-title>
                 <AnnotationDialog/>
                 <div v-if = "content">
                     <ul v-for="i in content.annotations" :key="content.annotations.indexOf(i)">
                     <li>{{i.annotation}}</li>
                    </ul>

                 </div>
                 

            </div>
            <div v-else>
            </div>
            <div class="read-space">
                <File @progressUpdate="setProgress" />
            </div>
        </div>
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
    computed: {
        ...mapState('web3', [
            'currentAccount'
        ]),
        ...mapState('ipfs', [
            'textFile', 'content', 'index'
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
/* .note{
    margin-right: 50;
    margin-left:auto;
    display:block;
} */
.border {
  border: 2px blue dashed;
}
/* Grid Code */
.app-layout {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 100vh;
}
.annotations { background-color: honeydew; }
</style>
