<template>
    <v-row>
        <v-col>       
            <h3>Published Works : {{ publishedContent.length }}</h3>
            <v-layout row wrap>
                <v-flex xs12 sm6 md4 lg4 v-for="content in publishedContent" :key="publishedContent.indexOf(content)">
                    <v-card max-width="344" class="ma-3" color = "grey darken-3">
                        <Content v-bind:content="content"/> 
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                            outlined
                            small
                            color="green"
                            >
                            Download
                            </v-btn> 
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-col>
    </v-row>    
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    computed: {
        ...mapState("fleek",[
            'publishedContent'
        ])
    },
    methods: {
        ...mapActions('web3', [
            'myPublished'
        ])
    }
}
</script>

<style>

</style>