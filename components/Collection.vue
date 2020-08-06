<template>
    <v-col>
        <h3>Personal Collection</h3>
        <v-layout row wrap>
            <v-flex xs12 sm6 md4 lg4 v-for="content in collectedContent" :key="collectedContent.indexOf(content)">
                <v-card max-width="344" class="ma-3" color = "grey darken-3">
                    <MyCopy v-bind:content="content"/> 
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <p v-if="content.loadingContent==true">Loading</p>
                        <!-- <v-btn v-else small outlined color="green" @click="signMessage(content)">Download</v-btn> -->
                        <v-btn v-else small outlined color="green" @click="requestContent(content.hash)">Read</v-btn>
                        <v-btn 
                        v-if = "content.isUpForResale === false"
                        small 
                        outlined 
                        color="green" 
                        @click="putForResale({resalePrice: 2, tokenId: content.tokenId})">Put for Sale</v-btn>
                        
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-col>        
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    data: () => ({
        textFile: null,
        ipfsPath: null

    }),
    computed: {
        ...mapState('web3', [
            'collectedContent',
        ])
    },
    methods: {
        ...mapActions({
            signMessage: 'web3/signMessage',
            putForResale: 'web3/putForResale',
            requestContent: 'ipfs/requestContent'
        }),
        readFile(hash){
            this.ipfsPath = 'https://ipfs.io/ipfs/'+ hash
            var reader = new FileReader()
            reader.readAsArrayBuffer(ipfsPath);
            reader.onloadend = () => {
            this.textFile = Buffer(reader.result)
            console.log(this.textFile)
            }
        }
    }
}
</script>

<style>

</style>