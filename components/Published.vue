<template>
<section class="container">
    <v-row>
        <v-col>       
            <h3>Published Works : {{ publishedContent.length }}</h3>
            <v-layout row wrap>
                <v-flex xs12 sm6 md4 lg4 v-for="content in publishedContent" :key="publishedContent.indexOf(content)">
                    <v-card max-width="344" class="ma-3" color = "">
                        <Content v-bind:content="content"/> 
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-row justify="center">
                            <nuxt-link to="/readPage">
                            <v-btn small outlined color="blue" @click="requestFile(content)" >Read</v-btn>
                            </nuxt-link>
                        </v-row>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-col>
    </v-row>    
</section>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
    data: () => ({
        fileRequested: false,
        dialog: false,
    }),
    computed: {
        ...mapState("web3",[
            'publishedContent'
        ]),
        ...mapState('ipfs', [
            'textFile'
        ])
    },
    methods: {
        ...mapActions({
            signMessage: 'web3/signMessage',
            putForResale: 'web3/putForResale',
            requestContent: 'ipfs/requestContent'
        }),
        ...mapMutations({
            getFile: 'ipfs/getFile'
        }),
        requestFile(content){
            console.log(content)
            // this.requestContent(content.bookHash)
            this.getFile(content)
        }
    }
}
</script>

<style>
a {  text-decoration: none}

</style>
                            <!-- <v-dialog v-model="dialog" scrollable max-width="600px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                    color="blue"
                                    dark
                                    small
                                    outlined
                                    v-bind="attrs"
                                    v-on="on"
                                    
                                    >
                                    Read
                                    </v-btn>
                                </template>
                                <v-card>
                                <File v-bind:textFile="content.bookContent" />
                                    
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn small outlined color="blue darken-1" text @click="dialog = false">Close</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog> -->