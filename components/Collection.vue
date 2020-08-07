<template>
    <v-col>
        <h3>Personal Collection</h3>
        <v-layout row wrap>
            <v-flex xs12 sm6 md4 lg4 v-for="content in collectedContent" :key="collectedContent.indexOf(content)">
                <v-card max-width="344" class="ma-3" color = "grey darken-3">
                    <MyCopy v-bind:content="content"/> 
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <!-- <p v-if="content.loadingContent==true">Loading</p> -->
                        <!-- <v-btn v-else small outlined color="blue" @click="signMessage(content)">Download</v-btn> -->
                        <!-- <v-btn v-else small outlined color="blue" @click="requestFile(content.hash)">Read</v-btn> -->
                        <v-row justify="center">
                            <v-dialog v-model="dialog" scrollable max-width="600px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                    color="blue"
                                    dark
                                    small
                                    outlined
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="requestFile(content.hash)"
                                    >
                                    Read
                                    </v-btn>
                                </template>
                                <v-card>
                                <File v-bind:textFile="textFile" />
                                    
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn small outlined color="blue darken-1" text @click="dialog = false">Close</v-btn>
                                        <v-btn small outlined color="blue darken-1" text @click="dialog = false">Save</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-row>
                        <!-- <v-btn 
                        v-if = "content.isUpForResale === false"
                        small 
                        outlined 
                        color="blue" 
                        @click="putForResale({resalePrice: 2, tokenId: content.tokenId})">Put for Sale</v-btn> -->
                        <ResaleDialog v-bind:content="content"/>
                        <Dialog v-bind:content="content"/>
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
        fileRequested: false,
        dialog: false,
    }),
    computed: {
        // ...mapState({
        //     collectedContent: 'web3/collectedContent',
        //     textFile: 'ipfs/textFile'
        // }),
        ...mapState('web3', [
            'collectedContent'
        ] ),
        ...mapState('ipfs', [
            'textFile'
        ])

        // ...mapState({
        //     collectedContent: state => state.web3.collectedContent,
        //     textFile: state => state.ipfs.textFile
        // })
    },
    methods: {
        ...mapActions({
            signMessage: 'web3/signMessage',
            putForResale: 'web3/putForResale',
            requestContent: 'ipfs/requestContent'
        }),
        requestFile(hash){
            this.fileRequested = true
            this.requestContent(hash)
            console.log(this.textFile)
        }
    }
}
</script>

<style>

</style>