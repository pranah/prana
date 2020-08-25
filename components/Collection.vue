<template>
<section class="container">
    <v-col>
        <h3>Personal Collection</h3>
        <v-layout row wrap>
            <v-flex xs12 sm6 md4 lg4 v-for="content in collectedContent" :key="collectedContent.indexOf(content)">
                <v-card max-width="344" class="ma-3" color = "">
                    <MyCopy v-bind:content="content"/> 
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-row justify="space-between">
                        <v-col>
                        <v-row justify="center">
                            <nuxt-link to="/readPage">
                            <v-btn small outlined color="blue" @click="requestFile(content.bookHash)" >Read</v-btn>
                            </nuxt-link>
                        </v-row>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col>
                        <ResaleDialog v-bind:content="content"/>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col>
                        <Dialog v-bind:content="content"/>
                        </v-col>
                        </v-row>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-col>  
</section>      
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    data: () => ({
        dialog: false,
    }),
    computed: {
        ...mapState('web3', [
            'collectedContent'
        ] ),
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
        requestFile(hash){
            console.log(hash)
            this.requestContent(hash)
            console.log(this.textFile)
        }
    }
}
</script>

<style>
a {  text-decoration: none}

.container{
    background-color: #ECEFF1;
}

</style>

<!-- <v-dialog v-model="dialog" fullscreen scrollable max-width="600px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                    color="blue"
                                    dark
                                    small
                                    outlined
                                    v-bind="attrs"
                                    v-on="on"
                                    @click = 'requestFile(content.bookHash)'
                                    >
                                    Read
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn small outlined color="blue darken-1" text @click="dialog = false">Close</v-btn>
                                    </v-card-actions>
                                <File v-bind:textFile="textFile" />    
                                <File v-bind:textFile="content.bookContent" />    
                                </v-card>
                            </v-dialog> -->
                            <!-- <v-btn small outlined color="blue" @click="requestFile(content.bookHash)" to="/readPage">Read</v-btn> -->